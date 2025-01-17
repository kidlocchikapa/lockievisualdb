// auth.service.ts
import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { EmailService } from '../email.service';
import { addHours } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new UnauthorizedException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const verificationToken = uuidv4();
      const verificationTokenExpiry = addHours(new Date(), 24);

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiry,
        isEmailVerified: false,
      });

      await this.userRepository.save(user);
      await this.emailService.sendVerificationEmail(user.email, verificationToken);

      return {
        message: 'Registration successful. Please check your email to verify your account.',
      };
    } catch (error) {
      this.logger.error(`Signup failed: ${error.message}`, error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email before logging in');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { 
        sub: user.id, 
        email: user.email,
        isEmailVerified: user.isEmailVerified
      };
      
      const access_token = await this.jwtService.sign(payload);

      return {
        access_token: `Bearer ${access_token}`,
        user: {
          id: user.id,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed. Please try again.');
    }
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { verificationToken: token }
      });

      if (!user) {
        throw new NotFoundException('Invalid verification token');
      }

      if (new Date() > user.verificationTokenExpiry) {
        throw new BadRequestException('Verification token has expired');
      }

      user.isEmailVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpiry = null;

      await this.userRepository.save(user);

      return {
        message: 'Email verified successfully',
      };
    } catch (error) {
      this.logger.error(`Email verification failed: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Email verification failed. Please try again.');
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isEmailVerified) {
        throw new BadRequestException('Email is already verified');
      }

      const verificationToken = uuidv4();
      const verificationTokenExpiry = addHours(new Date(), 24);

      user.verificationToken = verificationToken;
      user.verificationTokenExpiry = verificationTokenExpiry;

      await this.userRepository.save(user);
      await this.emailService.sendVerificationEmail(user.email, verificationToken);

      return {
        message: 'Verification email has been resent',
      };
    } catch (error) {
      this.logger.error(`Resend verification email failed: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to resend verification email. Please try again.');
    }
  }
}
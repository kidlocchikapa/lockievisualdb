// dto/create-user.dto.ts
import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'Full name must contain only letters and spaces'
  })
  @MinLength(2, {
    message: 'Full name must be at least 2 characters long'
  })
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\+?[\d\s-]+$/, {
    message: 'Invalid phone number format'
  })
  phoneNumber: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  })
  password: string;
}
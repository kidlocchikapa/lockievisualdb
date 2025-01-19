import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Feedback } from './feedback.entity';
import { Booking } from './bookings.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ select: false }) // This ensures password isn't loaded by default
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ type: 'timestamp', nullable: true })
  verificationTokenExpiry: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Feedback, feedback => feedback.user, { 
    eager: false,
    cascade: true 
  })
  feedbacks: Feedback[];

  @OneToMany(() => Booking, booking => booking.user, { 
    eager: false,
    cascade: true
  })
  bookings: Booking[];

  // Method to remove sensitive data when converting to JSON
  toJSON() {
    const { 
      password, 
      verificationToken, 
      verificationTokenExpiry, 
      ...userWithoutSensitiveData 
    } = this;
    return userWithoutSensitiveData;
  }
}
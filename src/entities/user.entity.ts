import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true })
  verificationTokenExpiry: Date;

  @OneToMany(() => Feedback, feedback => feedback.user, { eager: false })
  feedbacks: Feedback[];

  @OneToMany(() => Booking, booking => booking.user, { eager: false })
  bookings: Booking[];

  toJSON() {
    const { password, verificationToken, verificationTokenExpiry, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
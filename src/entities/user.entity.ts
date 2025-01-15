import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Feedback } from './feedback.entity';
import { Booking } from './bookings.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ default: 'user' })  // Added role column with default value
  role: string;

  @OneToMany(() => Feedback, feedback => feedback.user, { eager: false })
  feedbacks: Feedback[];

  @OneToMany(() => Booking, booking => booking.user, { eager: false })
  bookings: Booking[];

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
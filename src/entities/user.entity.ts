// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { Feedback } from './feedback.entity';
import { Booking } from './bookings.entity';

@Entity('users') // Specify table name
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
  @Exclude({ toPlainOnly: true }) // Better way to exclude password
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  verificationToken: string;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude({ toPlainOnly: true })
  verificationTokenExpiry: Date;

  @CreateDateColumn()
  @Transform(({ value }) => value.toISOString())
  createdAt: Date;

  @UpdateDateColumn()
  @Transform(({ value }) => value.toISOString())
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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
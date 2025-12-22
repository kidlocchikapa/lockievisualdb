import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL', // 50% deposit paid
  PAID = 'PAID',
  FAILED = 'FAILED'
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  serviceName: string;

  @Column()
  userEmail: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @Column({ type: 'jsonb', nullable: true })
  additionalDetails: Record<string, any>;

  @Column({ default: false })
  isRead: boolean;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number; // To calculate the 50%

  @Column({ nullable: true })
  transactionReference: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.bookings, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  user: User;

  toJSON() {
    const booking = { ...this };
    return booking;
  }
}
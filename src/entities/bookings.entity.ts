import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column()
  userEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'Pending' })
  status: string;
}

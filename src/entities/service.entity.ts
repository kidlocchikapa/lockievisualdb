import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Service {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    icon: string; // Used to store the Lucide icon name (e.g., 'Code', 'Palette')

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number; // Service price

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

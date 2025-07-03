import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from 'src/account/entities/account.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  propertyName: string;

  @Column({ type: 'varchar' }) // PropertyType as string
  propertyType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: false })
  isForRent: boolean;

  @Column({ default: false })
  isForSale: boolean;

  @Column({ type: 'int', default: 0 })
  bedrooms: number;

  @Column({ type: 'int', default: 0 })
  bathrooms: number;

  @Column({ type: 'int', default: 0 })
  kitchen: number;

  @Column({ type: 'int', default: 0 })
  floor: number;

  @Column({ nullable: true })
  furnishing: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  area: number;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  landmark: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', default: 'available' }) // PropertyStatus as string
  status: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToOne(() => Account, (account) => account.properties)
  agent: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

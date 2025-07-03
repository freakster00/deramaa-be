import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from 'src/account/entities/account.entity'; // assuming agent is an Account
// import { PropertyImage } from './property-image.entity'; // you can define this separately

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  ROOM = 'room',
  CONDO = 'condo',
  VILLA = 'villa',
  STUDIO = 'studio',
  DUPLEX = 'duplex',
  LAND = 'land',
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented',
  PENDING = 'pending',
}

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  propertyName: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  propertyType: PropertyType;

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
  furnishing: string; // e.g., Furnished, Semi-furnished, Unfurnished

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  area: number; // in square feet or meters

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

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToOne(() => Account, (account) => account.properties)
  agent: Account;

//   @OneToMany(() => PropertyImage, (image) => image.property, { cascade: true })
//   images: PropertyImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

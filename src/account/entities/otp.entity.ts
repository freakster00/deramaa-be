import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MobileOTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  otp: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: false })
  revoked: boolean;
}

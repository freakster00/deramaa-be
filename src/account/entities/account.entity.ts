import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  phone: string;

  @Column({ type: 'varchar', unique: true ,nullable:true})
  email: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ type: 'varchar',nullable:false })
  password: string;

  @Column({ type: 'varchar', length: 255,nullable:true })
  firstname: string;

  @Column({ type: 'varchar', length: 255,nullable:true })
  lastname: string;
  
  @Column({ default: true })
  is_customer: boolean;

  @Column({ default: false })
  is_superdmin: boolean;

  @Column({ default: false })
  is_agent: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  account_created: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AgentVerification {
  @PrimaryGeneratedColumn()
  requestId: number;

  @Column({ type: 'varchar', length: 15,unique: true,nullable:false })
  phone: string;

  @Column({ type: 'varchar', unique: true ,nullable:false})
  email: string;

  @Column({ type: 'varchar', length: 255,unique: false,nullable:false })
  firstname: string;

  @Column({ type: 'varchar', length: 255,unique: false,nullable:false })
  lastname: string;

  @Column({ length: 555,unique: true,nullable:false})
  citizenshipimagefront: string;

  @Column({ length: 555 ,unique: true,nullable:false})
  citizenshipimageback: string;

  @CreateDateColumn({ type: 'timestamp' })
  request_created: Date;
}

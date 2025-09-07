import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type AuthzOperation = 'insert' | 'delete';

@Entity('authz_outbox')
export class AuthzOutbox {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  object!: string; // e.g., 'device:123'

  @Column()
  relation!: string;

  @Column()
  subject!: string; // e.g., 'user:456'

  @Column({ default: 'insert' })
  operation!: AuthzOperation;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt!: Date | null;

  @Column({ default: 0 })
  retryCount!: number;
}

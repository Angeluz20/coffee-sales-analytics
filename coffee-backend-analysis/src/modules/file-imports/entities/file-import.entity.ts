import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CoffeeSale } from '../../coffee-sales/entities/coffee-sale.entity';

@Entity('file_imports')
export class FileImport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'original_name', type: 'varchar', length: 255 })
  originalName: string;

  @Column({ name: 'stored_name', type: 'varchar', length: 255 })
  storedName: string;

  @Column({ name: 'file_hash', type: 'varchar', length: 64 })
  fileHash: string;

  @Column({ name: 'status', type: 'varchar', length: 30 })
  status: string;

  @Column({ name: 'total_records', type: 'int', nullable: true })
  totalRecords?: number;

  @Column({ name: 'processed_records', type: 'int', nullable: true })
  processedRecords?: number;

  @Column({ name: 'error_message', type: 'varchar', length: 500, nullable: true })
  errorMessage?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime2',
    default: () => 'GETDATE()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime2',
    default: () => 'GETDATE()',
  })
  updatedAt: Date;

  @Column({
    name: 'finished_at',
    type: 'datetime2',
    nullable: true,
  })
  finishedAt?: Date;

  @ManyToOne(() => User, (user) => user.fileImports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CoffeeSale, (sale) => sale.fileImport)
  coffeeSales: CoffeeSale[];
}

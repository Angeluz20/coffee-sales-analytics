import { FileImport } from "../../file-imports/entities/file-import.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Index(
  ['userId', 'coffeeName', 'datetime'],
  { unique: true }
)
@Entity('coffee_sales')
export class CoffeeSale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'date',
    type: 'date',
    default: () => 'CAST(GETDATE() AS date)',
  })
  date: Date;

  @Column({
    name: 'datetime',
    type: 'datetime2',
    default: () => 'GETDATE()',
  })
  datetime: Date;

  @Column({
    name: 'hour_or_day', 
    type: 'int' 
  })
  hourOrDay: number;

  @Column({ 
    name: 'coffee_name', 
    type: 'varchar', 
    length: 255
  })
  coffeeName: string;

  @Column({ 
    name: 'time_of_day', 
    type: 'varchar', 
    length: 255
  })
  timeOfDay: string;

  @Column({ 
    name: 'weekday', 
    type: 'varchar', 
    length: 50 
  })
  weekday: string;

  @Column({ 
    name:'month_name', 
    type: 'varchar', 
    length: 50 
  })
  monthName: string;

  @Column({ 
    name:'card', 
    type: 'varchar', 
    length: 50 
  })
  card: string;

    @Column({ 
    name:'cash_type', 
    type: 'varchar', 
    length: 50 
  })
  cashType: string;

  @Column({ name: 'week_day_sort', type: 'int', nullable: false, default: 0 })
  weekDaySort: number;

  @Column({ 
    name:'month_sort', 
    type: 'int' 
  })
  monthSort: number;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

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

  @Column({ name: 'user_id'})
  userId: number;

  @Column({ name: 'file_id'})
  fileId: number;

  @ManyToOne(() => User, user => user.coffees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => FileImport, (file) => file.coffeeSales)
  @JoinColumn({ name: 'file_id' })
  fileImport: FileImport
}

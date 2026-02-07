import { FileImport } from "../../file-imports/entities/file-import.entity";
import { CoffeeSale } from "../../coffee-sales/entities/coffee-sale.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name: 'username', length: 100 })
    username: string;

    @Column({name: 'email', length: 150, unique: true })
    email: string;

    @Column({name: 'password', length: 255 })
    password: string;

    @CreateDateColumn({ type: 'datetime2' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime2' })
    updated_at: Date;

    @OneToMany(() => (CoffeeSale), coffeSale => coffeSale.user)
    coffees: CoffeeSale[]

    @OneToMany(() => (FileImport), file => file.user)
    fileImports: FileImport[]
}

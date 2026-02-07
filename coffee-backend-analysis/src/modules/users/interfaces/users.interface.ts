import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";

export interface UserInterface {
    create(data: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByName(name: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    update(id: number, data: User): Promise<User | null>
    remove(id: number): Promise<User | null>
}
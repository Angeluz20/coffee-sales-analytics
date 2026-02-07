import { Injectable } from "@nestjs/common";
import { UserInterface } from "../interfaces/users.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class UserRepository implements UserInterface {
    constructor (
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) {}
    
    create(data: CreateUserDto): Promise<User> {
        const user = this.repository.create(data)
        return this.repository.save(user)
    }

    findAll(): Promise<User[]> {
        const users = this.repository.find()
        return users
    }

    findById(id: number): Promise<User | null> {
        const getUser = this.repository.findOne({
            where: { id: id },
            select: { password: false }
    })
        return getUser
    }

    findByName(name: string): Promise<User | null> {
        const getUser = this.repository.findOneBy({ username: name })
        return getUser
    }
    
    findByEmail(email: string): Promise<User | null> {
        const getUser = this.repository.findOne({
            where: { email: email}, 
            select: {password: false}  
        })
        return getUser
    }

    async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
        return null;
    }

    const updatedUser = this.repository.merge(user, data);
    return this.repository.save(updatedUser);
    }

    async remove(id: number): Promise<User | null> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
        return null;
    }

    await this.repository.remove(user);
    return user;
    }
}
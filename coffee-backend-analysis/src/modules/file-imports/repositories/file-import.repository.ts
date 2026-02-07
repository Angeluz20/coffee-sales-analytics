import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileImport } from "../entities/file-import.entity";
import { CreateFileImportDto } from "../dto/create-file-import.dto";
import { FileImportInterface } from "../interfaces/file-import.interface";


@Injectable()
export class FileImportRepository implements FileImportInterface {
    constructor (
        @InjectRepository(FileImport)
        private readonly repository: Repository<FileImport>
    ) {}
    
    create(userId: number, data: CreateFileImportDto): Promise<FileImport> {
        const file = this.repository.create({user: {id: userId}, ...data})
        return this.repository.save(file)
    }

    findAll(): Promise<FileImport[]> {
        const file = this.repository.find()
        return file
    }

    findAllByUserAuthenticated(userId: number): Promise<FileImport[]> {
        const file = this.repository.findBy({user: {id: userId}})
        return file
    }

    findById(id: number): Promise<FileImport | null> {
        const file = this.repository.findOne({
            where: { id: id },
    })
        return file
    }

    findByName(name: string): Promise<FileImport | null> {
        const file = this.repository.findOneBy({ originalName: name })
        return file
    }

    async findOneByHash(fileHash: string): Promise<FileImport | null> {
    return this.repository.findOne({
        where: { fileHash }
    });
    }

    async findByOriginalNameAndUser(originalName: string, userId: number): Promise<FileImport | null> {
    return this.repository.findOne({
        where: { 
        originalName,
        user: { id: userId }
        },
        order: { createdAt: 'DESC' } 
    });
    }
    
    async update(id: number, data: Partial<FileImport>): Promise<FileImport | null> {
    const file = await this.repository.findOneBy({ id });

    if (!file) {
        return null;
    }

    const updatedUser = this.repository.merge(file, data);
    return this.repository.save(updatedUser);
    }

    async remove(id: number): Promise<FileImport | null> {
    const file = await this.repository.findOneBy({ id });

    if (!file) {
        return null;
    }

    await this.repository.remove(file);
    return file;
    }
}
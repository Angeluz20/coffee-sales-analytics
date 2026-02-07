import { CreateFileImportDto } from "../dto/create-file-import.dto";
import { FileImport } from "../entities/file-import.entity";


export interface FileImportInterface {
    create(userId: number, data: CreateFileImportDto): Promise<FileImport>;
    findAll(): Promise<FileImport[]>;
    findById(id: number): Promise<FileImport | null>;
    findByName(name: string): Promise<FileImport | null>
    update(id: number, data: FileImport): Promise<FileImport | null>
    remove(id: number): Promise<FileImport | null>
}
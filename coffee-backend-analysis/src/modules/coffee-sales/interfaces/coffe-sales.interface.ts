import { CreateCoffeeSaleDto } from "../dto/create-coffee-sale.dto";
import { CoffeeSale } from "../entities/coffee-sale.entity";

export interface CoffeeSalesInterface {
    create(data: CreateCoffeeSaleDto): Promise<CoffeeSale>;
    findAll(): Promise<CoffeeSale[]>;
    findById(id: number): Promise<CoffeeSale | null>;
    findByName(name: string): Promise<CoffeeSale | null>
    update(id: number, data: CoffeeSale): Promise<CoffeeSale | null>
    delete(id: number): Promise<CoffeeSale | null>
}
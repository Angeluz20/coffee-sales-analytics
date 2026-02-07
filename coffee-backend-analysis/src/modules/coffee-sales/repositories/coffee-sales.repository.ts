import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CoffeeSale } from "../entities/coffee-sale.entity";
import { CreateCoffeeSaleDto } from "../dto/create-coffee-sale.dto";
import { CoffeeSalesInterface } from "../interfaces/coffe-sales.interface";

@Injectable()
export class CoffeeSalesRepository implements CoffeeSalesInterface {
    constructor (
        @InjectRepository(CoffeeSale)
        private readonly repository: Repository<CoffeeSale>
    ) {}
    
    create(data: CreateCoffeeSaleDto): Promise<CoffeeSale> {
        const saveData = this.repository.create(data)
        return this.repository.save(saveData)
    }


    async bulkUpsert(data: CreateCoffeeSaleDto[]): Promise<number> {
        if (data.length === 0) return 0;

        const CHUNK_SIZE = 50; 
        for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            const chunk = data.slice(i, i + CHUNK_SIZE);
            
            await this.repository.upsert(
                chunk,
                {
                    conflictPaths: ['userId', 'coffeeName', 'datetime'], 
                    skipUpdateIfNoValuesChanged: true,
                }
            );
        }

        return data.length;
    }
    
    findAll(): Promise<CoffeeSale[]> {
        const result = this.repository.find()
        return result
    }

    findById(id: number): Promise<CoffeeSale | null> {
        const getRecords = this.repository.findOne({ where: { id: id } })
        return getRecords
    }

    findByName(name: string): Promise<CoffeeSale | null> {
        const result = this.repository.findOneBy({ coffeeName: name })
        return result
    }
    
    async getTopSellingCoffees(userId: number, limit: number) {
    return this.repository
        .createQueryBuilder('sc')
        .select('sc.coffeeName', 'coffeeName')
        .addSelect('SUM(sc.amount)', 'totalAmount')
        .where('sc.userId = :userId', { userId }) 
        .groupBy('sc.coffeeName')
        .orderBy('totalAmount', 'DESC')
        .limit(limit)
        .getRawMany();
    }

    async getMostProfitableMonths(userId: number, limit = 5) {
    return this.repository
        .createQueryBuilder('sc')
        .select('sc.monthName', 'month')
        .addSelect('sc.monthSort', 'monthSort')
        .addSelect('SUM(sc.amount)', 'totalAmount')
        .where('sc.userId = :userId', { userId }) 
        .groupBy('sc.monthName')
        .addGroupBy('sc.monthSort')
        .orderBy('totalAmount', 'DESC')
        .limit(limit)
        .getRawMany();
    }

    async update(id: number, data: Partial<CoffeeSale>): Promise<CoffeeSale | null> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
        return null;
    }

    const updatedItem = this.repository.merge(result, data);
    return this.repository.save(updatedItem);
    }

    async delete(id: number): Promise<CoffeeSale | null> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
        return null;
    }

    await this.repository.remove(result);
    return result;
    }
}
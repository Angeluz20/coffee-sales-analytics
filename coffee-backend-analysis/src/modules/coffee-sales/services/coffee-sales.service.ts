import { Inject, Injectable } from '@nestjs/common';
import { CreateCoffeeSaleDto } from '../dto/create-coffee-sale.dto';
import { UpdateCoffeeSaleDto } from '../dto/update-coffee-sale.dto';
import { CoffeeSalesRepository } from '../repositories/coffee-sales.repository';
import { CoffeeSale } from '../entities/coffee-sale.entity';
import { CoffeeSaleNotFoundException } from '../exceptions/coffee-salles.exception';

@Injectable()
export class CoffeeSalesService {
  constructor(
    @Inject(CoffeeSalesRepository)
    private readonly coffeeSalesRepository: CoffeeSalesRepository,
  ) {}

  async createCoffeeSale(dto: CreateCoffeeSaleDto): Promise<CoffeeSale> {
    return this.coffeeSalesRepository.create(dto);
  }

  async upsertManyCoffeeSales(
    dtos: CreateCoffeeSaleDto[],
  ) {
    return this.coffeeSalesRepository.bulkUpsert(dtos);
  }

  async findTopSellingCoffees(userId: number, limit = 3) {
    return this.coffeeSalesRepository.getTopSellingCoffees(userId, limit);
  }

  async findMostProfitableMonths(userId: number, limit = 3) {
    return this.coffeeSalesRepository.getMostProfitableMonths(userId, limit);
  }

  async findAllCoffeeSales(): Promise<CoffeeSale[]> {
    return this.coffeeSalesRepository.findAll();
  }

  async findCoffeeSaleById(id: number): Promise<CoffeeSale> {
    const sale = await this.coffeeSalesRepository.findById(id);

    if (!sale) {
      throw new CoffeeSaleNotFoundException(id);
    }

    return sale;
  }

  async updateCoffeeSale(
    id: number,
    dto: UpdateCoffeeSaleDto,
  ): Promise<CoffeeSale> {
    const payload: Partial<CoffeeSale> = {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
      datetime: dto.datetime ? new Date(dto.datetime) : undefined,
    };

    const updated = await this.coffeeSalesRepository.update(id, payload);

    if (!updated) {
      throw new CoffeeSaleNotFoundException(id);
    }

    return updated;
  }

  async deleteCoffeeSale(id: number): Promise<void> {
    const deleted = await this.coffeeSalesRepository.delete(id);

    if (!deleted) {
      throw new CoffeeSaleNotFoundException(id);
    }
  }
}
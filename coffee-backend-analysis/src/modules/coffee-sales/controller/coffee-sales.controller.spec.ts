import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeSalesController } from './coffee-sales.controller';
import { CoffeeSalesService } from '../services/coffee-sales.service';

describe('CoffeeSalesController', () => {
  let controller: CoffeeSalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoffeeSalesController],
      providers: [
        {
          provide: CoffeeSalesService,
          useValue: {
            processImport: jest.fn().mockResolvedValue({ data: 0 }),
            findAll: jest.fn().mockResolvedValue([]),
            bulkUpsert: jest.fn().mockResolvedValue({ data: 0 }),
          },
        },
      ],
    }).compile();

    controller = module.get<CoffeeSalesController>(CoffeeSalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
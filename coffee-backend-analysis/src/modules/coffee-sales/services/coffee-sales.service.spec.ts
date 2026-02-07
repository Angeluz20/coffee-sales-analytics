import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeSalesService } from './coffee-sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FileImport } from '../../file-imports/entities/file-import.entity'; // Verifique o caminho
import { CoffeeSale } from '../entities/coffee-sale.entity';

describe('CoffeeSalesService', () => {
  let service: CoffeeSalesService;

  const mockRepository = {
    upsert: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeeSalesService,
        {
          provide: getRepositoryToken(CoffeeSale),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(FileImport),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CoffeeSalesService>(CoffeeSalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
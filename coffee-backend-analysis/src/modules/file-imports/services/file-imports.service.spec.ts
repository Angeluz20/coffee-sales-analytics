import { Test, TestingModule } from '@nestjs/testing';
import { FileImportsService } from './file-imports.service';

describe('FileImportsService', () => {
  let service: FileImportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileImportsService],
    }).compile();

    service = module.get<FileImportsService>(FileImportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

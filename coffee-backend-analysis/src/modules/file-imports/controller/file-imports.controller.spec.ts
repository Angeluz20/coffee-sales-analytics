import { Test, TestingModule } from '@nestjs/testing';
import { FileImportsController } from './file-imports.controller';
import { FileImportsService } from '../services/file-imports.service';

describe('FileImportsController', () => {
  let controller: FileImportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileImportsController],
      providers: [FileImportsService],
    }).compile();

    controller = module.get<FileImportsController>(FileImportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

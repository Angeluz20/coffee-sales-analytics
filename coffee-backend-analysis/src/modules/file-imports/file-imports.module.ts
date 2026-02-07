import { forwardRef, Module } from '@nestjs/common';
import { FileImportsService } from './services/file-imports.service';
import { FileImportsController } from './controller/file-imports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { CoffeeSalesModule } from '../coffee-sales/coffee-sales.module';
import { FileImportRepository } from './repositories/file-import.repository';
import { FileImport } from './entities/file-import.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileImport]),
    forwardRef(() => UsersModule),
    forwardRef(() => CoffeeSalesModule)
],
  controllers: [FileImportsController],
  providers: [FileImportsService, FileImportRepository],
  exports: [FileImportRepository, FileImportsService]
})
export class FileImportsModule {}

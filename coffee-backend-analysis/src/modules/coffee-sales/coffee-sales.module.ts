import { forwardRef, Module } from '@nestjs/common';
import { CoffeeSalesService } from './services/coffee-sales.service';
import { CoffeeSalesController } from './controller/coffee-sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { FileImportsModule } from '../file-imports/file-imports.module';
import { CoffeeSalesRepository } from './repositories/coffee-sales.repository';
import { CoffeeSale } from './entities/coffee-sale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoffeeSale]),
    forwardRef(() => UsersModule),
    forwardRef(() => FileImportsModule)
],
  controllers: [CoffeeSalesController],
  providers: [CoffeeSalesService, CoffeeSalesRepository],
  exports: [CoffeeSalesService, CoffeeSalesRepository]
})
export class CoffeeSalesModule {}

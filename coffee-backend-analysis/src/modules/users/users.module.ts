import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/users.repository';
import { UsersController } from './controllers/users.controller';
import { CoffeeSalesModule } from '../coffee-sales/coffee-sales.module';
import { FileImportsModule } from '../file-imports/file-imports.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CoffeeSalesModule),
    forwardRef(() => FileImportsModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository], 
})
export class UsersModule {}

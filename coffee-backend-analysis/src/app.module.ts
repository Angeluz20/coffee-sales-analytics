import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { CoffeeSalesModule } from './modules/coffee-sales/coffee-sales.module';
import { FileImportsModule } from './modules/file-imports/file-imports.module';

@Module({
  imports: [ 
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env.local',
    }),
    UsersModule, 
    AuthModule, CoffeeSalesModule, FileImportsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

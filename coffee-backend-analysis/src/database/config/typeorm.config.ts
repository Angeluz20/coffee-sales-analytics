import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mssql',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  autoLoadEntities: true,

  synchronize: false,
  logging: true,

  options: {
    trustServerCertificate: true,
  },
};

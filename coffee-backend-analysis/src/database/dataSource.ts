import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mssql',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/database/migrations/*.{ts,js}'],

  synchronize: false,
  logging: true,

  options: {
    trustServerCertificate: true,
  },
});

import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFileImportDto {
  @ApiProperty({
    example: 'arquivo.xlsx',
    description: 'Nome original do arquivo enviado pelo usuário',
  })
  @IsString()
  @MaxLength(255)
  originalName: string;

  @ApiProperty({
    example: 'file_1707142332.csv',
    description: 'Nome do arquivo salvo no servidor ou storage',
  })
  @IsString()
  @MaxLength(255)
  storedName: string;

  @ApiProperty({
    example: 'PENDING',
    description: 'Status inicial da importação',
  })
  @IsString()
  @MaxLength(30)
  status: string;

  @ApiProperty({
    example: 120,
    description: 'Total de registros encontrados no arquivo',
    required: false,
  })
  @IsOptional()
  @IsInt()
  totalRecords?: number;

  @ApiProperty({
    example: 'ABCH$SD',
    description: 'hash para controle',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  fileHash: string
}

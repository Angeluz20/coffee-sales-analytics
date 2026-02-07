import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateCoffeeSaleDto {
  @ApiProperty({
    example: '2026-02-05',
    description: 'Data da venda (YYYY-MM-DD)',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: '2026-02-05T14:30:00',
    description: 'Data e hora completas da venda',
  })
  @IsDateString()
  datetime: string;

  @ApiProperty({
    example: 14,
    description: 'Hora do dia ou dia do período (dependendo da regra de negócio)',
  })
  @IsInt()
  hourOrDay: number;

  @ApiProperty({
    example: 'Cappuccino',
    description: 'Nome do café vendido',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  coffeeName: string;

  @ApiProperty({
    example: 'Manhã',
    description: 'Período do dia (manhã, tarde, noite)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  timeOfDay: string;

  @ApiProperty({
    example: 'sunday',
    description: 'Dia da semana por extenso',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  weekday: string;

  @ApiProperty({
    example: 'Card',
    description: 'Itau',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  card: string;

  
  @ApiProperty({
    example: 'Cash Type',
    description: 'Itau',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  cashType: string;

  @ApiProperty({
    example: 'Fevereiro',
    description: 'Nome do mês',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  monthName: string;

  @ApiProperty({
    example: 1,
    description: 'Ordenação do dia da semana (1 = segunda, 7 = domingo)',
  })
  @IsNumber()
  weekDaySort: number;

  @ApiProperty({
    example: 2,
    description: 'Ordenação do mês (1 = janeiro, 12 = dezembro)',
  })
  @IsInt()
  monthSort: number;

  @ApiProperty({
    example: 9.90,
    description: 'Valor da venda',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty({
    example: 1,
    description: 'ID do usuário dono da venda',
  })
  @IsInt()
  userId: number;

    @ApiProperty({
    example: 1,
    description: 'ID do usuário dono da venda',
  })
  @IsInt()
  fileId: number;
}

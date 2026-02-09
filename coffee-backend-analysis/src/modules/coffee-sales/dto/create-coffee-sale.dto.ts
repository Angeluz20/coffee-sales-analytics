import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  MaxLength,
  IsOptional,
  IsDate,
  Min,
  Max,
} from 'class-validator';

export class CreateCoffeeSaleDto {

  @ApiPropertyOptional({
    example: '2026-02-05',
    description: 'Data da venda (YYYY-MM-DD). Opcional se datetime existir.',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    example: '2026-02-05T14:30:00',
    description: 'Data e hora completas da venda',
  })
  @IsDate()
  datetime: Date;

  @ApiPropertyOptional({
    example: 14,
    description: 'Hora do dia (0–23). Pode ser derivada do datetime.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  hourOfDay?: number;

  @ApiProperty({
    example: 'Cappuccino',
    description: 'Nome do café vendido',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  coffeeName: string;

  @ApiPropertyOptional({
    example: 'Manhã',
    description: 'Período do dia (manhã, tarde, noite)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  timeOfDay?: string;

  @ApiPropertyOptional({
    example: 'Sunday',
    description: 'Dia da semana por extenso',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  weekday?: string;

  @ApiPropertyOptional({
    example: 'Visa',
    description: 'Bandeira do cartão',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  card?: string;

  @ApiPropertyOptional({
    example: 'Credit',
    description: 'Tipo de pagamento (Cash, Credit, Debit)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cashType?: string;

  @ApiPropertyOptional({
    example: 'Fevereiro',
    description: 'Nome do mês',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  monthName?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Ordenação do dia da semana (1 = segunda)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  weekDaySort?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Ordenação do mês (1 = janeiro)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  monthSort?: number;

  @ApiProperty({
    example: 9.9,
    description: 'Valor da venda',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({
    example: 1,
    description: 'ID do usuário dono da venda',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 10,
    description: 'ID do arquivo importado',
  })
  @IsInt()
  fileId: number;
}

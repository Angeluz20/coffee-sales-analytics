import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeSaleDto } from './create-coffee-sale.dto';

export class UpdateCoffeeSaleDto extends PartialType(CreateCoffeeSaleDto) {}

import { NotFoundException } from '@nestjs/common';

export class CoffeeSaleNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Coffee sale with id ${id} not found`);
  }
}

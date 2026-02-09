import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CoffeeSalesService } from '../services/coffee-sales.service';
import { CreateCoffeeSaleDto } from '../dto/create-coffee-sale.dto';
import { UpdateCoffeeSaleDto } from '../dto/update-coffee-sale.dto';
import { CoffeeSalesMessages } from 'src/common/messages/coffee-sales.messages';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('coffee-sales')
export class CoffeeSalesController {
  constructor(
    private readonly coffeeSalesService: CoffeeSalesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCoffeeSaleDto) {
    const data =
      await this.coffeeSalesService.createCoffeeSale(dto);

    return {
      message: CoffeeSalesMessages.CREATED,
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const data =
      await this.coffeeSalesService.findAllCoffeeSales();

    return {
      message: CoffeeSalesMessages.FIND_SUCCESS,
      data,
    };
  }

  @Get('get-sellings-coffees/:limit')
  @UseGuards(JwtAuthGuard)
  async getTopSellingCoffees(
    @Req() req,
    @Param('limit') limit: string,
    @Query('fileId') fileId: string,
  ) {
    const userId = req.user.sub;

    const data = await this.coffeeSalesService.findTopSellingCoffees(
      userId,
      Number(fileId),
      Number(limit),
    );

    return {
      message: CoffeeSalesMessages.FIND_SUCCESS_TOP_SELLING_COFFEES(Number(limit)),
      data,
    };
  }

  @Get('get-most-profitable-months/:limit')
  @UseGuards(JwtAuthGuard)
  async getMostProfitableMonths(
    @Req() req,
    @Param('limit') limit: string,
    @Query('fileId') fileId: string,
  ) {
    const userId = req.user.sub;

    const data = await this.coffeeSalesService.findMostProfitableMonths(
      userId,
      Number(fileId),
      Number(limit),
    );

    return {
      message: CoffeeSalesMessages.FIND_SUCCESS_MOST_PROFITABLE_MONTHS(
        Number(limit),
      ),
      data,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const data =
      await this.coffeeSalesService.findCoffeeSaleById(+id);

    return {
      message: CoffeeSalesMessages.FIND_ONE_SUCCESS,
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCoffeeSaleDto,
  ) {
    const data =
      await this.coffeeSalesService.updateCoffeeSale(+id, dto);

    return {
      message: CoffeeSalesMessages.UPDATED,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.coffeeSalesService.deleteCoffeeSale(+id);

    return {
      message: CoffeeSalesMessages.DELETED,
    };
  }
}

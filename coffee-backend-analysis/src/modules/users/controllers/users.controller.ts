import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersMessages } from 'src/common/messages/users.messages';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiBody({ type: CreateUserDto })
  async create(
    @Body() createUserDto: CreateUserDto,
  ) {
    const user =
      await this.usersService.create(
        createUserDto,
      );

    return {
      message: UsersMessages.CREATED,
      data: user,
    };
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    const user = await this.usersService.findById(req.user.sub);

    const { password, ...userWithoutPassword } = user;

    return {
      message: UsersMessages.FOUND,
      data: userWithoutPassword,
    };
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Retrieve a user by name' })
  async findByName(
    @Param('name') name: string,
  ) {
    const user =
      await this.usersService.findByName(name);

    return {
      message: UsersMessages.FOUND,
      data: user,
    };
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user =
      await this.usersService.findById(id);

    return {
      message: UsersMessages.FOUND,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  async findAll() {
    const users =
      await this.usersService.findAll();

    return {
      message:
        users.length > 0
          ? UsersMessages.FOUND_ALL
          : UsersMessages.FOUND_NONE,
      data: users,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updated =
      await this.usersService.update(
        id,
        updateUserDto,
      );

    return {
      message: UsersMessages.UPDATED,
      data: updated,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const removed =
      await this.usersService.remove(id);

    return {
      message: UsersMessages.DELETED,
      data: removed,
    };
  }
}

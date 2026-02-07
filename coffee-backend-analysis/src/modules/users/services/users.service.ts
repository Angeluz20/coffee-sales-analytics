import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/users.repository';

import {
  UserEmailAlreadyExistsException,
  UserNotFoundException,
} from 'src/modules/coffee-sales/exceptions/user.exception';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const alreadyExists =
      await this.userRepository.findByEmail(
        createUserDto.email,
      );

    if (alreadyExists) {
      throw new UserEmailAlreadyExistsException();
    }

    createUserDto.password = await this.hashPassword(
      createUserDto.password,
    );

    const { password, ...savedUser } =
      await this.userRepository.create(createUserDto);

    if (!savedUser) {
      throw new BadRequestException();
    }

    return savedUser;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userRepository.findAll();
  }

  async findById(
    id: number,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findByName(
    name: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findByName(name);

    if (!user) {
      throw new UserNotFoundException();
    }

    const { password, ...userDetails } = user;
    return userDetails;
  }

  async findByEmail(email: string): Promise<User> {
    const user =
      await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser =
      await this.userRepository.update(
        id,
        updateUserDto,
      );

    if (!updatedUser) {
      throw new UserNotFoundException();
    }

    return updatedUser;
  }

  async remove(
    id: number,
  ): Promise<Omit<User, 'password'>> {
    const user =
      await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    await this.userRepository.remove(id);

    const { password, ...userData } = user;
    return userData;
  }

  private async hashPassword(
    password: string,
  ): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}

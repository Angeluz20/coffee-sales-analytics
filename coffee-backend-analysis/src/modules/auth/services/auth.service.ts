import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if(!user) return null;

    const passwordValid = await compare(password, user.password.toString());
    if(!passwordValid) return null;

    const {password:_, ...result} = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  getProfile(user: any) {
    const {password:_, ...result} = user;
    return result;
  }

}

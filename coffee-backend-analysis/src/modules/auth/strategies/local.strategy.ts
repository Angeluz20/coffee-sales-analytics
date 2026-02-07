import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { InvalidCredentialsException } from 'src/modules/coffee-sales/exceptions/auth.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(
      email,
      password,
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
}

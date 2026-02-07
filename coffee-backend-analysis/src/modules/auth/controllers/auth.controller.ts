import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guad';
import { CreateAuthDto } from '../dto/create-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: CreateAuthDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }
}

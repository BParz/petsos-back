import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Options,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Options('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  handleRegisterOptions() {
    // Maneja las peticiones OPTIONS preflight para /auth/register
    return;
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Options('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  handleLoginOptions() {
    // Maneja las peticiones OPTIONS preflight para /auth/login
    return;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}

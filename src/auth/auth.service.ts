import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/user.entity';

interface JwtPayload {
  email: string;
  sub: number;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.usersService.findByEmail(
        registerUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Crear el nuevo usuario
      const user = await this.usersService.create(registerUserDto);

      // Generar token JWT
      const payload = { email: user.email, sub: user.id, role: user.role };
      const token = this.jwtService.sign(payload);

      return {
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new UnauthorizedException('Error al registrar el usuario');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      console.log('Attempting login for email:', loginUserDto.email);

      // Buscar usuario por email
      const user = await this.usersService.findByEmail(loginUserDto.email);
      if (!user) {
        console.log('User not found for email:', loginUserDto.email);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      console.log('User found, validating password...');

      // Verificar contraseña
      const isPasswordValid = await user.validatePassword(
        loginUserDto.password,
      );

      console.log('Password validation result:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Invalid password for user:', loginUserDto.email);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Generar token JWT
      const payload = { email: user.email, sub: user.id, role: user.role };
      const token = this.jwtService.sign(payload);

      console.log('Login successful for user:', user.email);

      return {
        message: 'Login exitoso',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error al iniciar sesión');
    }
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.usersService.findByEmail(payload.email);
      return user;
    } catch {
      return null;
    }
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

interface RequestWithUser {
  headers: {
    authorization?: string;
  };
  user: any;
}

interface JwtPayload {
  email: string;
  sub: number;
  role: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.substring(7);

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}

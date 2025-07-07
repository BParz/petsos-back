import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
export class SimpleJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.substring(7);

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      // Asignar solo la información básica del usuario del token
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}

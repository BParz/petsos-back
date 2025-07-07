import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { Pet } from './pet.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet]),
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tu-secreto-super-seguro',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}

import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { NotificationsService, ContactInfo } from './notifications.service';
import { SimpleJwtAuthGuard } from '../auth/guards/simple-jwt-auth.guard';

export class ReportPetLostDto {
  petId: number;
}

export class ReportPetFoundDto {
  petId: number;
  contactInfo: ContactInfo;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('pet-lost')
  @UseGuards(SimpleJwtAuthGuard)
  async reportPetLost(@Body() reportPetLostDto: ReportPetLostDto) {
    try {
      await this.notificationsService.sendPetLostNotification(
        reportPetLostDto.petId,
      );
      return {
        message: 'Email de mascota perdida enviado exitosamente',
        petId: reportPetLostDto.petId,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error enviando email de mascota perdida: ${error.message}`,
      );
    }
  }

  @Post('pet-found')
  @UseGuards(SimpleJwtAuthGuard)
  async reportPetFound(@Body() reportPetFoundDto: ReportPetFoundDto) {
    try {
      await this.notificationsService.sendPetFoundNotification(
        reportPetFoundDto.petId,
        reportPetFoundDto.contactInfo,
      );
      return {
        message: 'Email de mascota encontrada enviado exitosamente',
        petId: reportPetFoundDto.petId,
        contactInfo: reportPetFoundDto.contactInfo,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error enviando email de mascota encontrada: ${error.message}`,
      );
    }
  }
}

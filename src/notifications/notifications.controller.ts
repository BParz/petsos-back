import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ReportPetLostDto } from './dto/report-pet-lost.dto';
import { ReportPetFoundDto } from './dto/report-pet-found.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('pet-lost')
  async reportPetLost(@Body() reportPetLostDto: ReportPetLostDto) {
    try {
      await this.notificationsService.sendPetLostNotification(
        reportPetLostDto.petId,
        reportPetLostDto.latitude,
        reportPetLostDto.longitude,
      );
      return {
        message: 'Email de mascota perdida enviado exitosamente',
        petId: reportPetLostDto.petId,
        location: reportPetLostDto.latitude && reportPetLostDto.longitude
          ? { latitude: reportPetLostDto.latitude, longitude: reportPetLostDto.longitude }
          : null,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error enviando email de mascota perdida: ${error.message}`,
      );
    }
  }

  @Post('pet-found')
  async reportPetFound(@Body() reportPetFoundDto: ReportPetFoundDto) {
    try {
      await this.notificationsService.sendPetFoundNotification(
        reportPetFoundDto.petId,
        reportPetFoundDto.contactInfo,
        reportPetFoundDto.latitude,
        reportPetFoundDto.longitude,
      );
      return {
        message: 'Email de mascota encontrada enviado exitosamente',
        petId: reportPetFoundDto.petId,
        contactInfo: reportPetFoundDto.contactInfo,
        location: reportPetFoundDto.latitude && reportPetFoundDto.longitude
          ? { latitude: reportPetFoundDto.latitude, longitude: reportPetFoundDto.longitude }
          : null,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error enviando email de mascota encontrada: ${error.message}`,
      );
    }
  }
}

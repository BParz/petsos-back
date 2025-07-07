import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { SimpleJwtAuthGuard } from '../auth/guards/simple-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseGuards(SimpleJwtAuthGuard)
  create(@Body() createPetDto: CreatePetDto, @CurrentUser() user: User) {
    // Asegurar que la mascota se asigne al usuario autenticado
    createPetDto.userId = user.id;
    return this.petsService.create(createPetDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.petsService.findByUserId(Number(userId));
    }
    return this.petsService.findAll();
  }

  @Get('my-pets')
  @UseGuards(SimpleJwtAuthGuard)
  findMyPets(@CurrentUser() user: User) {
    return this.petsService.findMyPets(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(SimpleJwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
    @CurrentUser() user: User,
  ) {
    // Verificar que la mascota pertenece al usuario autenticado
    const pet = await this.petsService.findOne(Number(id));
    if (pet.userId !== user.id) {
      throw new BadRequestException(
        'No tienes permisos para actualizar esta mascota',
      );
    }

    // Asegurar que la mascota siga perteneciendo al usuario autenticado
    updatePetDto.userId = user.id;
    return this.petsService.update(Number(id), updatePetDto);
  }

  @Delete(':id')
  @UseGuards(SimpleJwtAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    // Verificar que la mascota pertenece al usuario autenticado
    const pet = await this.petsService.findOne(Number(id));
    if (pet.userId !== user.id) {
      throw new BadRequestException(
        'No tienes permisos para eliminar esta mascota',
      );
    }
    return this.petsService.remove(Number(id));
  }
}

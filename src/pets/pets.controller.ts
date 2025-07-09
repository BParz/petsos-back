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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { SimpleJwtAuthGuard } from '../auth/guards/simple-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ImageFileValidator } from '../common/validators/image-file.validator';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseGuards(SimpleJwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/pets',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Solo se permiten archivos de imagen'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createPetDto: CreatePetDto,
    @CurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
        fileIsRequired: false,
      }),
      new ImageFileValidator(),
    )
    image?: Express.Multer.File,
  ) {
    // Asegurar que la mascota se asigne al usuario autenticado
    createPetDto.userId = user.id;

    // Si se subió una imagen, guardar la URL
    if (image) {
      createPetDto.imageUrl = `/uploads/pets/${image.filename}`;
    }

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

  @Get(':id/image')
  async getPetImage(@Param('id') id: string) {
    const pet = await this.petsService.findOne(Number(id));
    if (!pet.imageUrl) {
      throw new BadRequestException('Esta mascota no tiene imagen');
    }
    return { imageUrl: pet.imageUrl };
  }

  @Put(':id')
  @UseGuards(SimpleJwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/pets',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Solo se permiten archivos de imagen'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
    @CurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
        fileIsRequired: false,
      }),
      new ImageFileValidator(),
    )
    image?: Express.Multer.File,
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

    // Si se subió una imagen, guardar la URL
    if (image) {
      updatePetDto.imageUrl = `/uploads/pets/${image.filename}`;
    }

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

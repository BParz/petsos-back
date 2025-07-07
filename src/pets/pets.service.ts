import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
    private usersService: UsersService,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    try {
      // Verificar que el userId se proporciona
      if (!createPetDto.userId) {
        throw new BadRequestException('El userId es requerido');
      }

      // Verificar que el usuario existe y está activo
      const user = await this.usersService.findOne(createPetDto.userId);
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      // Crear la mascota y asignarla al usuario
      const pet = this.petsRepository.create({
        ...createPetDto,
        owner: user,
        userId: user.id,
      });

      const savedPet = await this.petsRepository.save(pet);

      // Cargar la relación con el owner para la respuesta
      return await this.petsRepository.findOne({
        where: { id: savedPet.id },
        relations: ['owner'],
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la mascota');
    }
  }

  async findAll(): Promise<Pet[]> {
    try {
      return await this.petsRepository.find({
        relations: ['owner'],
        where: { isActive: true },
      });
    } catch {
      throw new InternalServerErrorException('Error al obtener las mascotas');
    }
  }

  async findOne(id: number): Promise<Pet> {
    try {
      const pet = await this.petsRepository.findOne({
        where: { id, isActive: true },
        relations: ['owner'],
      });

      if (!pet) {
        throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
      }

      return pet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la mascota');
    }
  }

  async findByUserId(userId: number): Promise<Pet[]> {
    try {
      // Verificar que el usuario existe
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      return await this.petsRepository.find({
        where: { userId, isActive: true },
        relations: ['owner'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al obtener las mascotas del usuario',
      );
    }
  }

  async findMyPets(userId: number): Promise<Pet[]> {
    try {
      return await this.petsRepository.find({
        where: { userId, isActive: true },
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        select: {
          id: true,
          name: true,
          species: true,
          breed: true,
          age: true,
          weight: true,
          color: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      });
    } catch {
      throw new InternalServerErrorException('Error al obtener tus mascotas');
    }
  }

  async update(id: number, updatePetDto: UpdatePetDto): Promise<Pet> {
    try {
      const pet = await this.findOne(id);

      // Si se está actualizando el userId, verificar que el nuevo usuario existe
      if (updatePetDto.userId) {
        const user = await this.usersService.findOne(updatePetDto.userId);
        if (!user) {
          throw new BadRequestException('Usuario no encontrado');
        }
        // Actualizar la relación con el owner
        pet.owner = user;
      }

      Object.assign(pet, updatePetDto);
      const updatedPet = await this.petsRepository.save(pet);

      // Cargar la relación con el owner para la respuesta
      return await this.petsRepository.findOne({
        where: { id: updatedPet.id },
        relations: ['owner'],
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la mascota');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const pet = await this.findOne(id);
      pet.isActive = false; // Soft delete
      await this.petsRepository.save(pet);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar la mascota');
    }
  }
}

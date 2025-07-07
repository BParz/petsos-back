import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { FieldValidator } from '../common/validators/field-validator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // Validar campos requeridos usando el validador genérico
    FieldValidator.validateUserFields(userData);

    try {
      const user = this.usersRepository.create(userData);
      return await this.usersRepository.save(user);
    } catch {
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el usuario');
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    try {
      const user = await this.findOne(id);
      Object.assign(user, userData);
      return await this.usersRepository.save(user);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    try {
      const user = await this.findOne(id);

      // Solo actualizar los campos que se proporcionan
      if (updateProfileDto.firstName !== undefined) {
        user.firstName = updateProfileDto.firstName;
      }
      if (updateProfileDto.lastName !== undefined) {
        user.lastName = updateProfileDto.lastName;
      }
      if (updateProfileDto.email !== undefined) {
        user.email = updateProfileDto.email;
      }
      if (updateProfileDto.phoneNumber !== undefined) {
        user.phoneNumber = updateProfileDto.phoneNumber;
      }
      if (updateProfileDto.address !== undefined) {
        user.address = updateProfileDto.address;
      }
      if (updateProfileDto.city !== undefined) {
        user.city = updateProfileDto.city;
      }
      if (updateProfileDto.region !== undefined) {
        user.region = updateProfileDto.region;
      }

      return await this.usersRepository.save(user);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el perfil');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.usersRepository.remove(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOneBy({ email });
    } catch {
      throw new InternalServerErrorException(
        'Error al buscar el usuario por email',
      );
    }
  }
}

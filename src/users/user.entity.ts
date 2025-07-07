import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Pet } from '../pets/pet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  region: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  // Relación con las mascotas del usuario
  @OneToMany(() => Pet, (pet) => pet.owner)
  pets: Pet[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password && !this.isPasswordHashed()) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
        console.log('Password hashed successfully');
      } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
      }
    }
  }

  private isPasswordHashed(): boolean {
    // Verificar si la contraseña ya está hasheada (bcrypt genera hashes de 60 caracteres)
    return (
      this.password &&
      this.password.length === 60 &&
      this.password.startsWith('$2')
    );
  }

  async validatePassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }
}

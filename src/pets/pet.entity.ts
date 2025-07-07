import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string; // perro, gato, ave, etc.

  @Column()
  breed: string; // raza específica

  @Column()
  age: number; // edad en años

  @Column()
  weight: number; // peso en kg

  @Column()
  color: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relación con el usuario propietario (obligatoria)
  @ManyToOne(() => User, (user) => user.pets, { nullable: false })
  @JoinColumn({ name: 'userId' })
  owner: User;

  @Column({ nullable: false })
  userId: number;
}

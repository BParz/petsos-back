import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  species: string;

  @IsString()
  @IsNotEmpty()
  breed: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(30)
  age: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(200)
  weight: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  userId?: number;
}

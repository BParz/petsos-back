import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

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

  @IsNumber()
  @Min(0)
  @Max(30)
  age: number;

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

  @IsNumber()
  @IsOptional()
  @Min(1)
  userId?: number;
}

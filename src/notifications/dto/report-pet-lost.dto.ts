import { IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportPetLostDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  petId: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

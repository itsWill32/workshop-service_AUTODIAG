// autodiag-workshop-service/src/application/dto/input/search-nearby.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNumber, IsOptional, IsString, Max, Min, IsInt } from 'class-validator';


export class SearchNearbyDto {
  @ApiProperty({ example: 16.7516, description: 'Latitud del punto de búsqueda' })
  @Type(() => Number)
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: -93.1134, description: 'Longitud del punto de búsqueda' })
  @Type(() => Number)
  @IsLongitude()
  longitude: number;

  @ApiPropertyOptional({ default: 10, minimum: 0.5, maximum: 50, description: 'Radio en KM' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(50)
  radiusKm?: number = 10;

  @ApiPropertyOptional({ description: 'Filtrar por especialidad' })
  @IsOptional()
  @IsString()
  specialtyType?: string;

  @ApiPropertyOptional({ description: 'Calificación mínima (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  // Agregamos paginación opcional
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
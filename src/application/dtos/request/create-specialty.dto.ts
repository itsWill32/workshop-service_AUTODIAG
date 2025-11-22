import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateSpecialtyDto {
  @ApiProperty({
    description: 'Tipo de especialidad',
    example: 'TRANSMISSION',
    enum: [
      'ENGINE',
      'TRANSMISSION',
      'BRAKES',
      'ELECTRICAL',
      'AIR_CONDITIONING',
      'SUSPENSION',
      'BODYWORK',
      'PAINTING',
      'ALIGNMENT',
      'DIAGNOSTICS',
      'TIRE_SERVICE',
      'OIL_CHANGE',
      'GENERAL_MAINTENANCE',
    ],
  })
  @IsString()
  @IsNotEmpty()
  specialtyType: string;

  @ApiPropertyOptional({
    description: 'Descripción de la especialidad',
    example: 'Especialistas en cajas automáticas y manuales',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Años de experiencia',
    example: 15,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  yearsOfExperience?: number;
}
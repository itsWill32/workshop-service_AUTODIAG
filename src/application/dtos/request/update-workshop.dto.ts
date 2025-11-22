import { IsString, IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateWorkshopDto {
  @ApiPropertyOptional({
    description: 'Nombre del negocio',
    example: 'Taller Mecánico El Rayo',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Descripción del taller',
    example: 'Especialistas en transmisiones automáticas',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de contacto',
    example: '+52 961 234 5678',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email de contacto',
    example: 'contacto@elrayo.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Sitio web',
    example: 'https://www.elrayo.com',
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({
    description: 'Rango de precios',
    example: 'MEDIUM',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
  })
  @IsString()
  @IsOptional()
  priceRange?: string;
}
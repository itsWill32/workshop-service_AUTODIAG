import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, Min, Max, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateWorkshopDto {
  @ApiProperty({
    description: 'Nombre del negocio',
    example: 'Taller Mecánico El Rayo',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  businessName: string;

  @ApiPropertyOptional({
    description: 'Descripción del taller',
    example: 'Especialistas en transmisiones automáticas',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+52 961 234 5678',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

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

  @ApiProperty({
    description: 'Calle y número',
    example: 'Av. Central Poniente 1234',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  street: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Tuxtla Gutiérrez',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'Estado',
    example: 'Chiapas',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @ApiProperty({
    description: 'Código postal (5 dígitos)',
    example: '29000',
    pattern: '^\\d{5}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}$/, { message: 'Zip code must be 5 digits' })
  zipCode: string;

  @ApiProperty({
    description: 'Latitud',
    example: 16.7516,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitud',
    example: -93.1134,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({
    description: 'Rango de precios',
    example: 'MEDIUM',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
  })
  @IsString()
  @IsNotEmpty()
  priceRange: string;
}
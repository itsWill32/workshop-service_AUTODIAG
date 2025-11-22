import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class WorkshopDto {
  @ApiProperty({
    description: 'ID del taller',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del propietario',
    example: '987e6543-e21b-12d3-a456-426614174999',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Nombre del negocio',
    example: 'Taller Mecánico El Rayo',
  })
  businessName: string;

  @ApiPropertyOptional({
    description: 'Descripción del taller',
    example: 'Especialistas en transmisiones automáticas',
  })
  description: string | null;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+52 961 234 5678',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Email de contacto',
    example: 'contacto@elrayo.com',
  })
  email: string | null;

  @ApiPropertyOptional({
    description: 'Sitio web',
    example: 'https://www.elrayo.com',
  })
  website: string | null;

  @ApiProperty({
    description: 'Calle y número',
    example: 'Av. Central Poniente 1234',
  })
  street: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Tuxtla Gutiérrez',
  })
  city: string;

  @ApiProperty({
    description: 'Estado',
    example: 'Chiapas',
  })
  state: string;

  @ApiProperty({
    description: 'Código postal',
    example: '29000',
  })
  zipCode: string;

  @ApiProperty({
    description: 'País',
    example: 'Mexico',
  })
  country: string;

  @ApiProperty({
    description: 'Latitud',
    example: 16.7516,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitud',
    example: -93.1134,
  })
  longitude: number;

  @ApiProperty({
    description: 'Rango de precios',
    example: 'MEDIUM',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
  })
  priceRange: string;

  @ApiProperty({
    description: 'Calificación promedio (0-5)',
    example: 4.5,
  })
  overallRating: number;

  @ApiProperty({
    description: 'Total de reseñas',
    example: 25,
  })
  totalReviews: number;

  @ApiProperty({
    description: 'URLs de fotos del taller',
    example: [
      'https://cdn.autodiag.com/workshops/photo1.jpg',
      'https://cdn.autodiag.com/workshops/photo2.jpg',
    ],
    type: [String],
  })
  photoUrls: string[];

  @ApiProperty({
    description: 'Si el taller está aprobado por admin',
    example: true,
  })
  isApproved: boolean;

  @ApiProperty({
    description: 'Si el taller está activo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-11-19T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-11-19T10:00:00.000Z',
  })
  updatedAt: Date;
}
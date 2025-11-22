import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class WorkshopSpecialtyDto {
  @ApiProperty({
    description: 'ID de la especialidad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del taller',
    example: '987e6543-e21b-12d3-a456-426614174999',
  })
  workshopId: string;

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
  specialtyType: string;

  @ApiPropertyOptional({
    description: 'Descripción de la especialidad',
    example: 'Especialistas en cajas automáticas y manuales',
  })
  description: string | null;

  @ApiPropertyOptional({
    description: 'Años de experiencia',
    example: 15,
  })
  yearsOfExperience: number | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-11-19T10:00:00.000Z',
  })
  createdAt: Date;
}
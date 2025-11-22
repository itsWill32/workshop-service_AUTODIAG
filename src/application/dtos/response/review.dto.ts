import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class SentimentDto {
  @ApiProperty({
    description: 'Clasificación del sentimiento',
    example: 'POSITIVE',
    enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'],
  })
  label: string;

  @ApiProperty({
    description: 'Nivel de confianza del análisis (0-1)',
    example: 0.95,
  })
  score: number;
}


export class RatingBreakdownResponseDto {
  @ApiProperty({
    description: 'Calificación general',
    example: 5,
  })
  overall: number;

  @ApiPropertyOptional({
    description: 'Calificación de calidad',
    example: 5,
  })
  quality: number | null;

  @ApiPropertyOptional({
    description: 'Calificación de precio',
    example: 4,
  })
  price: number | null;

  @ApiPropertyOptional({
    description: 'Calificación de cumplimiento de tiempos',
    example: 5,
  })
  timeCompliance: number | null;

  @ApiPropertyOptional({
    description: 'Calificación de atención al cliente',
    example: 5,
  })
  customerService: number | null;
}


export class ReviewDto {
  @ApiProperty({
    description: 'ID de la reseña',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del taller',
    example: '987e6543-e21b-12d3-a456-426614174999',
  })
  workshopId: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: '456e7890-e12b-34c5-d678-426614174111',
  })
  userId: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  userName: string;

  @ApiPropertyOptional({
    description: 'Avatar del usuario',
    example: 'https://cdn.autodiag.com/avatars/user123.jpg',
  })
  userAvatar: string | null;

  @ApiPropertyOptional({
    description: 'ID de la cita',
    example: '789e0123-e45b-67c8-d901-426614174222',
  })
  appointmentId: string | null;

  @ApiProperty({
    description: 'Calificaciones del servicio',
    type: RatingBreakdownResponseDto,
  })
  rating: RatingBreakdownResponseDto;

  @ApiPropertyOptional({
    description: 'Comentario de la reseña',
    example: 'Excelente servicio, muy profesionales y rápidos',
  })
  comment: string | null;

  @ApiPropertyOptional({
    description: 'Análisis de sentimiento del comentario',
    type: SentimentDto,
  })
  sentiment: SentimentDto | null;

  @ApiPropertyOptional({
    description: 'Respuesta del taller',
    example: 'Muchas gracias por tu confianza. Nos alegra haberte ayudado.',
  })
  workshopResponse: string | null;

  @ApiPropertyOptional({
    description: 'Fecha de respuesta del taller',
    example: '2024-11-20T10:00:00.000Z',
  })
  respondedAt: Date | null;

  @ApiProperty({
    description: 'Si la reseña proviene de una cita verificada',
    example: true,
  })
  isVerified: boolean;

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
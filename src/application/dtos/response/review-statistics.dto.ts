import { ApiProperty } from '@nestjs/swagger';

export class RatingDistributionDto {
  @ApiProperty({
    description: 'Cantidad de reseñas con 5 estrellas',
    example: 15,
  })
  fiveStars: number;

  @ApiProperty({
    description: 'Cantidad de reseñas con 4 estrellas',
    example: 8,
  })
  fourStars: number;

  @ApiProperty({
    description: 'Cantidad de reseñas con 3 estrellas',
    example: 2,
  })
  threeStars: number;

  @ApiProperty({
    description: 'Cantidad de reseñas con 2 estrellas',
    example: 0,
  })
  twoStars: number;

  @ApiProperty({
    description: 'Cantidad de reseñas con 1 estrella',
    example: 0,
  })
  oneStar: number;
}


export class SentimentDistributionDto {
  @ApiProperty({
    description: 'Cantidad de reseñas positivas',
    example: 20,
  })
  positive: number;

  @ApiProperty({
    description: 'Cantidad de reseñas neutrales',
    example: 5,
  })
  neutral: number;

  @ApiProperty({
    description: 'Cantidad de reseñas negativas',
    example: 0,
  })
  negative: number;
}


export class ReviewStatisticsDto {
  @ApiProperty({
    description: 'Total de reseñas',
    example: 25,
  })
  totalReviews: number;

  @ApiProperty({
    description: 'Calificación promedio general',
    example: 4.5,
  })
  averageOverall: number;

  @ApiProperty({
    description: 'Calificación promedio de calidad',
    example: 4.6,
  })
  averageQuality: number;

  @ApiProperty({
    description: 'Calificación promedio de precio',
    example: 4.2,
  })
  averagePrice: number;

  @ApiProperty({
    description: 'Calificación promedio de cumplimiento de tiempos',
    example: 4.7,
  })
  averageTimeCompliance: number;

  @ApiProperty({
    description: 'Calificación promedio de atención al cliente',
    example: 4.8,
  })
  averageCustomerService: number;

  @ApiProperty({
    description: 'Distribución de calificaciones por estrellas',
    type: RatingDistributionDto,
  })
  ratingDistribution: RatingDistributionDto;

  @ApiProperty({
    description: 'Distribución de sentimientos',
    type: SentimentDistributionDto,
  })
  sentimentDistribution: SentimentDistributionDto;
}
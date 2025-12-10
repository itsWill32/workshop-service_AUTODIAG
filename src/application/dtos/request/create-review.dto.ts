import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional, MaxLength, MinLength, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RatingBreakdownDto {
  @ApiProperty({
    description: 'Calificación general (1-5 estrellas)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  overall: number;

  @ApiPropertyOptional({
    description: 'Calificación de calidad del trabajo',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(5)
  quality?: number;

  @ApiPropertyOptional({
    description: 'Calificación de relación calidad-precio',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(5)
  price?: number;

  @ApiPropertyOptional({
    description: 'Calificación de cumplimiento de tiempos',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(5)
  timeCompliance?: number;

  @ApiPropertyOptional({
    description: 'Calificación de atención al cliente',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(5)
  customerService?: number;
}


export class CreateReviewDto {
  @ApiPropertyOptional({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario (opcional, se puede enviar desde el cliente)',
  })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({
    description: 'ID de la cita completada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  appointmentId: string;

  @ApiProperty({
    description: 'Calificaciones del servicio',
    type: RatingBreakdownDto,
  })
  @ValidateNested()
  @Type(() => RatingBreakdownDto)
  @IsNotEmpty()
  rating: RatingBreakdownDto;

  @ApiPropertyOptional({
    description: 'Comentario de la reseña',
    example: 'Excelente servicio, muy profesionales y rápidos',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(1000)
  comment?: string;
}
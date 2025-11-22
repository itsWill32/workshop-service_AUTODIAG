import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RatingBreakdownDto } from './create-review.dto';


export class UpdateReviewDto {
  @ApiPropertyOptional({
    description: 'Calificaciones del servicio',
    type: RatingBreakdownDto,
  })
  @Type(() => RatingBreakdownDto)
  @IsOptional()
  rating?: RatingBreakdownDto;

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
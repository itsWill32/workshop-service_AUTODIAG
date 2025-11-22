import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RespondToReviewDto {
  @ApiProperty({
    description: 'Respuesta del taller a la reseña',
    example: 'Muchas gracias por tu confianza. Nos alegra haberte ayudado.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  response: string;
}
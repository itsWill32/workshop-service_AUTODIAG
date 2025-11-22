import { ApiProperty } from '@nestjs/swagger';
import { ReviewDto } from './review.dto';
import { PaginationMetaDto } from './paginated-workshops.dto';


export class PaginatedReviewsDto {
  @ApiProperty({
    description: 'Lista de reseñas',
    type: [ReviewDto],
  })
  reviews: ReviewDto[];

  @ApiProperty({
    description: 'Metadata de paginación',
    type: PaginationMetaDto,
  })
  pagination: PaginationMetaDto;
}
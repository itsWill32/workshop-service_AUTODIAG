import { ApiProperty } from '@nestjs/swagger';
import { WorkshopDto } from './workshop.dto';


export class PaginationMetaDto {
  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 5,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Total de elementos',
    example: 100,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 20,
  })
  itemsPerPage: number;
}


export class PaginatedWorkshopsDto {
  @ApiProperty({
    description: 'Lista de talleres',
    type: [WorkshopDto],
  })
  workshops: WorkshopDto[];

  @ApiProperty({
    description: 'Metadata de paginación',
    type: PaginationMetaDto,
  })
  pagination: PaginationMetaDto;
}
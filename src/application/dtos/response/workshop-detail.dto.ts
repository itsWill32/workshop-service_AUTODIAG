import { ApiProperty } from '@nestjs/swagger';
import { WorkshopDto } from './workshop.dto';
import { WorkshopSpecialtyDto } from './workshop-specialty.dto';
import { WorkshopScheduleDto } from './workshop-schedule.dto';
import { ReviewStatisticsDto } from './review-statistics.dto';


export class WorkshopDetailDto extends WorkshopDto {
  @ApiProperty({
    description: 'Especialidades del taller',
    type: [WorkshopSpecialtyDto],
  })
  specialties: WorkshopSpecialtyDto[];

  @ApiProperty({
    description: 'Horarios de atención',
    type: [WorkshopScheduleDto],
  })
  schedule: WorkshopScheduleDto[];

  @ApiProperty({
    description: 'Estadísticas de reseñas',
    type: ReviewStatisticsDto,
  })
  reviewsBreakdown: ReviewStatisticsDto;
}
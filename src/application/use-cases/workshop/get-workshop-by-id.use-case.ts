import { Injectable } from '@nestjs/common';
import { IWorkshopRepository, IReviewRepository } from '../../../domain/repositories';
import { WorkshopNotFoundException } from '../../../domain/exceptions';
import { WorkshopDetailDto } from '../../dtos/response';
import { WorkshopMapper } from '../../mappers';


@Injectable()
export class GetWorkshopByIdUseCase {
  constructor(
    private readonly workshopRepository: IWorkshopRepository,
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(workshopId: string): Promise<WorkshopDetailDto> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    const specialties = await this.workshopRepository.findSpecialtiesByWorkshopId(workshopId);

    const schedule = await this.workshopRepository.findSchedulesByWorkshopId(workshopId);

    const reviewStats = await this.reviewRepository.getReviewStatistics(workshopId);

    return WorkshopMapper.toDetailDto(workshop, specialties, schedule, reviewStats);
  }
}
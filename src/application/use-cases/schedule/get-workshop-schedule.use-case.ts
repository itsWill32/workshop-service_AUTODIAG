import { Injectable, Inject } from '@nestjs/common';
import { IWorkshopRepository } from '../../../domain/repositories';
import { WorkshopNotFoundException } from '../../../domain/exceptions';
import { WorkshopScheduleDto } from '../../dtos/response';
import { ScheduleMapper } from '../../mappers';

@Injectable()
export class GetWorkshopScheduleUseCase {
  constructor(
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
  ) {}

  async execute(workshopId: string): Promise<WorkshopScheduleDto[]> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    const schedules = await this.workshopRepository.findSchedulesByWorkshopId(workshopId);

    return schedules.map((s) => ScheduleMapper.toDto(s));
  }
}
import { Injectable } from '@nestjs/common';
import { IWorkshopRepository } from '../../../domain/repositories';
import {
  WorkshopNotFoundException,
  WorkshopNotOwnedByUserException,
} from '../../../domain/exceptions';
import { WorkshopSchedule } from '../../../domain/entities';
import { DayOfWeek, TimeRange } from '../../../domain/value-objects';
import { CreateScheduleDto } from '../../dtos/request';
import { WorkshopScheduleDto } from '../../dtos/response';
import { ScheduleMapper } from '../../mappers';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class SetWorkshopScheduleUseCase {
  constructor(private readonly workshopRepository: IWorkshopRepository) {}

  async execute(
    workshopId: string,
    ownerId: string,
    dtos: CreateScheduleDto[],
  ): Promise<WorkshopScheduleDto[]> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    if (workshop.getOwnerId() !== ownerId) {
      throw new WorkshopNotOwnedByUserException(workshopId, ownerId);
    }

    const schedules: WorkshopSchedule[] = dtos.map((dto) => {
      const dayOfWeek = DayOfWeek.create(dto.dayOfWeek);

      let timeRange: TimeRange | null = null;
      if (!dto.isClosed && dto.openTime && dto.closeTime) {
        timeRange = TimeRange.create(dto.openTime, dto.closeTime);
      }

      return WorkshopSchedule.create(
        uuidv4(),
        workshopId,
        dayOfWeek,
        timeRange,
        dto.isClosed || false,
      );
    });

    const savedSchedules = await this.workshopRepository.saveSchedules(
      workshopId,
      schedules,
    );

    return savedSchedules.map((s) => ScheduleMapper.toDto(s));
  }
}
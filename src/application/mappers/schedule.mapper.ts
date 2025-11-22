import { WorkshopSchedule } from '../../domain/entities';
import { WorkshopScheduleDto } from '../dtos/response';


export class ScheduleMapper {

  static toDto(schedule: WorkshopSchedule): WorkshopScheduleDto {
    return {
      id: schedule.getId(),
      workshopId: schedule.getWorkshopId(),
      dayOfWeek: schedule.getDayOfWeek(),
      openTime: schedule.getOpenTime(),
      closeTime: schedule.getCloseTime(),
      isClosed: schedule.getIsClosed(),
    };
  }


  static toDtoArray(schedules: WorkshopSchedule[]): WorkshopScheduleDto[] {
    return schedules.map((s) => this.toDto(s));
  }
}
import { DayOfWeek, TimeRange } from '../value-objects';
import { InvalidClosedScheduleException } from '../exceptions/schedule.exceptions';


export class WorkshopSchedule {
  private constructor(
    private readonly id: string,
    private readonly workshopId: string,
    private readonly dayOfWeek: DayOfWeek,
    private timeRange: TimeRange | null,
    private isClosed: boolean,
  ) {}


  static create(
    id: string,
    workshopId: string,
    dayOfWeek: DayOfWeek,
    timeRange: TimeRange | null,
    isClosed: boolean,
  ): WorkshopSchedule {
    WorkshopSchedule.validateSchedule(timeRange, isClosed);

    return new WorkshopSchedule(id, workshopId, dayOfWeek, timeRange, isClosed);
  }

  static fromPrimitives(
    id: string,
    workshopId: string,
    dayOfWeek: string,
    openTime: string | null,
    closeTime: string | null,
    isClosed: boolean,
  ): WorkshopSchedule {
    let timeRange: TimeRange | null = null;

    if (openTime && closeTime && !isClosed) {
      timeRange = TimeRange.create(openTime, closeTime);
    }

    return new WorkshopSchedule(
      id,
      workshopId,
      DayOfWeek.create(dayOfWeek),
      timeRange,
      isClosed,
    );
  }



  private static validateSchedule(
    timeRange: TimeRange | null,
    isClosed: boolean,
  ): void {
    if (isClosed && timeRange !== null) {
      throw new InvalidClosedScheduleException(
        'No debe haber un rango de tiempo cuando el día está marcado como cerrado',
      );
    }

    if (!isClosed && timeRange === null) {
      throw new InvalidClosedScheduleException(
        'Debe proporcionar un rango de tiempo cuando no está cerrado',
      );
    }
  }




  markAsClosed(): void {
    this.isClosed = true;
    this.timeRange = null;
  }


  setOpenHours(timeRange: TimeRange): void {
    this.isClosed = false;
    this.timeRange = timeRange;
  }


  isOpenAtTime(time: string): boolean {
    if (this.isClosed || !this.timeRange) {
      return false;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;

    const [openHours, openMinutes] = this.timeRange.getOpenTime().split(':').map(Number);
    const openInMinutes = openHours * 60 + openMinutes;

    const [closeHours, closeMinutes] = this.timeRange.getCloseTime().split(':').map(Number);
    const closeInMinutes = closeHours * 60 + closeMinutes;

    return timeInMinutes >= openInMinutes && timeInMinutes < closeInMinutes;
  }



  getId(): string {
    return this.id;
  }

  getWorkshopId(): string {
    return this.workshopId;
  }

  getDayOfWeek(): string {
    return this.dayOfWeek.getValue();
  }

  getDayDisplayName(): string {
    return this.dayOfWeek.getDisplayName();
  }

  getOpenTime(): string | null {
    return this.timeRange ? this.timeRange.getOpenTime() : null;
  }

  getCloseTime(): string | null {
    return this.timeRange ? this.timeRange.getCloseTime() : null;
  }

  getIsClosed(): boolean {
    return this.isClosed;
  }

  isWeekend(): boolean {
    return this.dayOfWeek.isWeekend();
  }
}
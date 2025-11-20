import { InvalidTimeRangeException } from '../exceptions/schedule.exceptions';


export class TimeRange {
  private constructor(
    private readonly openTime: string,
    private readonly closeTime: string,
  ) {}

  static create(openTime: string, closeTime: string): TimeRange {
    this.validateTimeFormat(openTime, 'Open time');
    this.validateTimeFormat(closeTime, 'Close time');
    this.validateTimeRange(openTime, closeTime);

    return new TimeRange(openTime, closeTime);
  }

  private static validateTimeFormat(time: string, label: string): void {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(time)) {
      throw new InvalidTimeRangeException(
        `${label} debe estar en formato HH:MM (00:00 a 23:59), se recibió: ${time}`,
      );
    }
  }

  private static validateTimeRange(openTime: string, closeTime: string): void {
    const openMinutes = this.timeToMinutes(openTime);
    const closeMinutes = this.timeToMinutes(closeTime);

    if (openMinutes >= closeMinutes) {
      throw new InvalidTimeRangeException(
        `La hora de cierre (${closeTime}) debe ser después de la hora de apertura (${openTime})`,
      );
    }

    const duration = closeMinutes - openMinutes;
    if (duration < 60) {
      throw new InvalidTimeRangeException(
        'El taller debe estar abierto al menos 1 hora',
      );
    }
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getOpenTime(): string {
    return this.openTime;
  }

  getCloseTime(): string {
    return this.closeTime;
  }

  getDurationInHours(): number {
    const openMinutes = TimeRange.timeToMinutes(this.openTime);
    const closeMinutes = TimeRange.timeToMinutes(this.closeTime);
    return (closeMinutes - openMinutes) / 60;
  }

  equals(other: TimeRange): boolean {
    return this.openTime === other.openTime && this.closeTime === other.closeTime;
  }

  toString(): string {
    return `${this.openTime} - ${this.closeTime}`;
  }
}
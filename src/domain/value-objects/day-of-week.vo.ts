import { InvalidDayOfWeekException } from '../exceptions/schedule.exceptions';

export enum DayOfWeekEnum {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}


export class DayOfWeek {
  private constructor(private readonly value: DayOfWeekEnum) {}

  static create(value: string): DayOfWeek {
    const upperValue = value.toUpperCase();

    if (!Object.values(DayOfWeekEnum).includes(upperValue as DayOfWeekEnum)) {
      throw new InvalidDayOfWeekException(
        `Día de la semana inválido: ${value}. Debe ser uno de: ${Object.values(DayOfWeekEnum).join(', ')}`,
      );
    }

    return new DayOfWeek(upperValue as DayOfWeekEnum);
  }

  getValue(): string {
    return this.value;
  }

  getDisplayName(): string {
    const names: Record<DayOfWeekEnum, string> = {
      [DayOfWeekEnum.MONDAY]: 'Lunes',
      [DayOfWeekEnum.TUESDAY]: 'Martes',
      [DayOfWeekEnum.WEDNESDAY]: 'Miércoles',
      [DayOfWeekEnum.THURSDAY]: 'Jueves',
      [DayOfWeekEnum.FRIDAY]: 'Viernes',
      [DayOfWeekEnum.SATURDAY]: 'Sábado',
      [DayOfWeekEnum.SUNDAY]: 'Domingo',
    };
    return names[this.value];
  }

  isWeekend(): boolean {
    return this.value === DayOfWeekEnum.SATURDAY || this.value === DayOfWeekEnum.SUNDAY;
  }

  equals(other: DayOfWeek): boolean {
    return this.value === other.value;
  }
}
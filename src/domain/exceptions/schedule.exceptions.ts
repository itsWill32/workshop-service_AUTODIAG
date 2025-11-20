
export class ScheduleDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}


export class ScheduleNotFoundException extends ScheduleDomainException {
  constructor(scheduleId: string) {
    super(`Horario con ID ${scheduleId} no encontrado`);
  }
}



export class InvalidDayOfWeekException extends ScheduleDomainException {
  constructor(message: string) {
    super(`Día de la semana inválido: ${message}`);
  }
}


export class InvalidTimeRangeException extends ScheduleDomainException {
  constructor(message: string) {
    super(`Rango de tiempo inválido: ${message}`);
  }
}



export class DuplicateScheduleException extends ScheduleDomainException {
  constructor(dayOfWeek: string) {
    super(`El horario para ${dayOfWeek} ya existe para este taller`);
  }
}


export class ScheduleNotOwnedByWorkshopException extends ScheduleDomainException {
  constructor(scheduleId: string, workshopId: string) {
    super(`El horario ${scheduleId} no pertenece al taller ${workshopId}`);
  }
}



export class InvalidClosedScheduleException extends ScheduleDomainException {
  constructor(message: string) {
    super(`Horario cerrado inválido: ${message}`);
  }
}
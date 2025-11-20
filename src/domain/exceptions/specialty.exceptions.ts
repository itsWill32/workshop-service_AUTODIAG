
export class SpecialtyDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}



export class SpecialtyNotFoundException extends SpecialtyDomainException {
  constructor(specialtyId: string) {
    super(`Especialidad con ID ${specialtyId} no encontrada`);
  }
}



export class InvalidSpecialtyTypeException extends SpecialtyDomainException {
  constructor(message: string) {
    super(`Tipo de especialidad inválido: ${message}`);
  }
}

export class InvalidSpecialtyDescriptionException extends SpecialtyDomainException {
  constructor(message: string) {
    super(`Descripción de especialidad inválida: ${message}`);
  }
}



export class InvalidYearsOfExperienceException extends SpecialtyDomainException {
  constructor(message: string) {
    super(`Años de experiencia inválidos: ${message}`);
  }
}


export class DuplicateSpecialtyException extends SpecialtyDomainException {
  constructor(specialtyType: string) {
    super(`La especialidad ${specialtyType} ya existe para este taller`);
  }
}



export class SpecialtyNotOwnedByWorkshopException extends SpecialtyDomainException {
  constructor(specialtyId: string, workshopId: string) {
    super(`La especialidad ${specialtyId} no pertenece al taller ${workshopId}`);
  }
}
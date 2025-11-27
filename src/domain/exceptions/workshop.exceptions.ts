
export class WorkshopDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}


export class WorkshopNotFoundException extends WorkshopDomainException {
  constructor(workshopId: string) {
    super(`El taller con ID ${workshopId} no encontrado`);
  }
}

export class WorkshopNotOwnedByUserException extends WorkshopDomainException {
  constructor(workshopId: string, userId: string) {
    super(`El taller ${workshopId} no es propiedad del usuario ${userId}`);
  }
}



export class InvalidBusinessNameException extends WorkshopDomainException {
  constructor(message: string) {
    super(`Nombre comercial inválido: ${message}`);
  }
}



export class InvalidLocationException extends WorkshopDomainException {
  constructor(message: string) {
    super(`Ubicación inválida: ${message}`);
  }
}



export class InvalidCoordinatesException extends WorkshopDomainException {
  constructor(message: string) {
    super(`Coordenadas inválidas: ${message}`);
  }
}


export class InvalidPriceRangeException extends WorkshopDomainException {
  constructor(message: string) {
    super(`Rango de precios inválido: ${message}`);
  }
}



export class InvalidPhoneException extends WorkshopDomainException {
  constructor(message: string) {
    super(`Teléfono inválido: ${message}`);
  }
}

export class InvalidEmailException extends WorkshopDomainException {
  constructor(message: string) {
    super(`Correo electrónico inválido: ${message}`);
  }
}


export class WorkshopNotApprovedException extends WorkshopDomainException {
  constructor(workshopId: string) {
    super(`El taller ${workshopId} aún no está aprobado`);
  }
}

export class WorkshopAlreadyApprovedException extends WorkshopDomainException {
  constructor(workshopId: string) {
    super(`El taller ${workshopId} ya está aprobado`);
  }
}

export class WorkshopInactiveException extends WorkshopDomainException {
  constructor(workshopId: string) {
    super(`El taller ${workshopId} está inactivo`);
  }
}

export class WorkshopAlreadyRejectedException extends WorkshopDomainException {
  constructor(workshopId: string) {
    super(`El taller ${workshopId} ya está rechazado/desaprobado`);
  }
}
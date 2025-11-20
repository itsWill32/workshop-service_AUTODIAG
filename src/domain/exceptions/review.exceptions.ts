
export class ReviewDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}



export class ReviewNotFoundException extends ReviewDomainException {
  constructor(reviewId: string) {
    super(`Reseña con ID ${reviewId} no encontrada`);
  }
}


export class ReviewNotOwnedByUserException extends ReviewDomainException {
  constructor(reviewId: string, userId: string) {
    super(`La reseña ${reviewId} no pertenece al usuario ${userId}`);
  }
}


export class ReviewNotForWorkshopException extends ReviewDomainException {
  constructor(reviewId: string, workshopId: string) {
    super(`La reseña ${reviewId} no pertenece al taller ${workshopId}`);
  }
}


export class InvalidRatingException extends ReviewDomainException {
  constructor(message: string) {
    super(`Calificación inválida: ${message}`);
  }
}



export class InvalidCommentException extends ReviewDomainException {
  constructor(message: string) {
    super(`Comentario inválido: ${message}`);
  }
}


export class DuplicateReviewException extends ReviewDomainException {
  constructor(userId: string, appointmentId: string) {
    super(`El usuario ${userId} ya ha reseñado la cita ${appointmentId}`);
  }
}


export class ReviewAlreadyRespondedException extends ReviewDomainException {
  constructor(reviewId: string) {
    super(`La reseña ${reviewId} ya tiene una respuesta del taller`);
  }
}


export class UnauthorizedReviewResponseException extends ReviewDomainException {
  constructor(reviewId: string, userId: string) {
    super(`El usuario ${userId} no está autorizado para responder a la reseña ${reviewId}`);
  }
}

export class InvalidSentimentException extends ReviewDomainException {
  constructor(message: string) {
    super(`Invalid sentiment: ${message}`);
  }
}
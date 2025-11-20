import { InvalidCommentException } from '../exceptions/review.exceptions';


export class Comment {
  private constructor(private readonly value: string) {}

  static create(value: string): Comment {
    this.validate(value);
    return new Comment(value.trim());
  }

  private static validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new InvalidCommentException('El comentario no puede estar vacío');
    }

    if (value.length < 10) {
      throw new InvalidCommentException('El comentario debe tener al menos 10 caracteres');
    }

    if (value.length > 1000) {
      throw new InvalidCommentException('El comentario no puede exceder los 1000 caracteres');
    }

    if (!/[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]/.test(value)) {
      throw new InvalidCommentException('El comentario debe contener caracteres alfanuméricos');
    }
  }

  getValue(): string {
    return this.value;
  }

  getWordCount(): number {
    return this.value.split(/\s+/).length;
  }

  equals(other: Comment): boolean {
    return this.value === other.value;
  }
}
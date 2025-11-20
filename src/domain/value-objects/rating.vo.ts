import { InvalidRatingException } from '../exceptions/review.exceptions';


export class Rating {
  private constructor(private readonly value: number) {}

  static create(value: number): Rating {
    this.validate(value);
    return new Rating(value);
  }

  private static validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new InvalidRatingException('La calificación debe ser un número entero');
    }

    if (value < 1 || value > 5) {
      throw new InvalidRatingException('La calificación debe estar entre 1 y 5 estrellas');
    }
  }

  getValue(): number {
    return this.value;
  }

  isExcellent(): boolean {
    return this.value === 5;
  }

  isGood(): boolean {
    return this.value === 4;
  }

  isAverage(): boolean {
    return this.value === 3;
  }

  isPoor(): boolean {
    return this.value <= 2;
  }

  equals(other: Rating): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return `${this.value}/5`;
  }
}
import { InvalidPriceRangeException } from '../exceptions/workshop.exceptions';

export enum PriceRangeEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class PriceRange {
  private constructor(private readonly value: PriceRangeEnum) {}

  static create(value: string): PriceRange {
    const upperValue = value.toUpperCase();

    if (!Object.values(PriceRangeEnum).includes(upperValue as PriceRangeEnum)) {
      throw new InvalidPriceRangeException(
        `Rango de precio inválido: ${value}. Debe ser LOW, MEDIUM, o HIGH`,
      );
    }

    return new PriceRange(upperValue as PriceRangeEnum);
  }

  static LOW(): PriceRange {
    return new PriceRange(PriceRangeEnum.LOW);
  }

  static MEDIUM(): PriceRange {
    return new PriceRange(PriceRangeEnum.MEDIUM);
  }

  static HIGH(): PriceRange {
    return new PriceRange(PriceRangeEnum.HIGH);
  }

  getValue(): string {
    return this.value;
  }

  isLow(): boolean {
    return this.value === PriceRangeEnum.LOW;
  }

  isMedium(): boolean {
    return this.value === PriceRangeEnum.MEDIUM;
  }

  isHigh(): boolean {
    return this.value === PriceRangeEnum.HIGH;
  }

  getDisplayName(): string {
    const names = {
      [PriceRangeEnum.LOW]: 'Económico',
      [PriceRangeEnum.MEDIUM]: 'Medio',
      [PriceRangeEnum.HIGH]: 'Premium',
    };
    return names[this.value];
  }

  equals(other: PriceRange): boolean {
    return this.value === other.value;
  }
}
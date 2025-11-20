import { InvalidLocationException } from '../exceptions/workshop.exceptions';


export class Location {
  private constructor(
    private readonly street: string,
    private readonly city: string,
    private readonly state: string,
    private readonly zipCode: string,
    private readonly country: string,
  ) {}

  static create(
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string = 'Mexico',
  ): Location {
    this.validateStreet(street);
    this.validateCity(city);
    this.validateState(state);
    this.validateZipCode(zipCode);

    return new Location(street, city, state, zipCode, country);
  }

  private static validateStreet(street: string): void {
    if (!street || street.trim().length === 0) {
      throw new InvalidLocationException('La calle no puede estar vacía');
    }

    if (street.length < 5) {
      throw new InvalidLocationException('La calle debe tener al menos 5 caracteres');
    }

    if (street.length > 200) {
      throw new InvalidLocationException('La calle no puede exceder los 200 caracteres');
    }
  }

  private static validateCity(city: string): void {
    if (!city || city.trim().length === 0) {
      throw new InvalidLocationException('La ciudad no puede estar vacía');
    }

    if (city.length > 100) {
      throw new InvalidLocationException('La ciudad no puede exceder los 100 caracteres');
    }
  }

  private static validateState(state: string): void {
    if (!state || state.trim().length === 0) {
      throw new InvalidLocationException('El estado no puede estar vacío');
    }

    if (state.length > 100) {
      throw new InvalidLocationException('El estado no puede exceder los 100 caracteres');
    }
  }

  private static validateZipCode(zipCode: string): void {
    if (!zipCode || zipCode.trim().length === 0) {
      throw new InvalidLocationException('El código postal no puede estar vacío');
    }

    if (!/^\d{5}$/.test(zipCode)) {
      throw new InvalidLocationException('El código postal debe tener 5 dígitos');
    }
  }

  getStreet(): string {
    return this.street;
  }

  getCity(): string {
    return this.city;
  }

  getState(): string {
    return this.state;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  getCountry(): string {
    return this.country;
  }

  getFullAddress(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }

  equals(other: Location): boolean {
    return (
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.zipCode === other.zipCode &&
      this.country === other.country
    );
  }
}
import { InvalidCoordinatesException } from '../exceptions/workshop.exceptions';


export class Coordinates {
  private constructor(
    private readonly latitude: number,
    private readonly longitude: number,
  ) {}

  static create(latitude: number, longitude: number): Coordinates {
    this.validateLatitude(latitude);
    this.validateLongitude(longitude);

    return new Coordinates(latitude, longitude);
  }

  private static validateLatitude(latitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new InvalidCoordinatesException(
        `La latitud debe estar entre -90 y 90, se recibió: ${latitude}`,
      );
    }
  }

  private static validateLongitude(longitude: number): void {
    if (longitude < -180 || longitude > 180) {
      throw new InvalidCoordinatesException(
        `a longitud debe estar entre -180 y 180, se recibió: ${longitude}`,
      );
    }
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }


  distanceTo(other: Coordinates): number {
    const R = 6371;
    const dLat = this.toRad(other.latitude - this.latitude);
    const dLon = this.toRad(other.longitude - this.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(this.latitude)) *
        Math.cos(this.toRad(other.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  equals(other: Coordinates): boolean {
    return this.latitude === other.latitude && this.longitude === other.longitude;
  }

  toString(): string {
    return `(${this.latitude}, ${this.longitude})`;
  }
}
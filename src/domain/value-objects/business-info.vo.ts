import { InvalidBusinessNameException } from '../exceptions/workshop.exceptions';


export class BusinessInfo {
  private constructor(
    private readonly businessName: string,
    private readonly description: string | null,
  ) {}

  static create(businessName: string, description?: string): BusinessInfo {
    this.validateBusinessName(businessName);
    
    if (description) {
      this.validateDescription(description);
    }

    return new BusinessInfo(businessName, description || null);
  }

  private static validateBusinessName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidBusinessNameException('El nombre no puede estar vacío');
    }

    if (name.length < 3) {
      throw new InvalidBusinessNameException('El nombre debe tener al menos 3 caracteres');
    }

    if (name.length > 100) {
      throw new InvalidBusinessNameException('El nombre no puede exceder los 100 caracteres');
    }

    // No debe contener solo números
    if (/^\d+$/.test(name)) {
      throw new InvalidBusinessNameException('El nombre no puede contener solo números');
    }
  }

  private static validateDescription(description: string): void {
    if (description.length > 500) {
      throw new InvalidBusinessNameException('La descripción no puede exceder los 500 caracteres');
    }
  }

  getBusinessName(): string {
    return this.businessName;
  }

  getDescription(): string | null {
    return this.description;
  }

  equals(other: BusinessInfo): boolean {
    return (
      this.businessName === other.businessName &&
      this.description === other.description
    );
  }
}
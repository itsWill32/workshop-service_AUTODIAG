import { SpecialtyType } from '../value-objects';
import {
  InvalidSpecialtyDescriptionException,
  InvalidYearsOfExperienceException,
} from '../exceptions/specialty.exceptions';


export class WorkshopSpecialty {
  private constructor(
    private readonly id: string,
    private readonly workshopId: string,
    private specialtyType: SpecialtyType,
    private description: string | null,
    private yearsOfExperience: number | null,
    private readonly createdAt: Date,
  ) {}



  static create(
    id: string,
    workshopId: string,
    specialtyType: SpecialtyType,
    description: string | null,
    yearsOfExperience: number | null,
  ): WorkshopSpecialty {
    if (description) {
      WorkshopSpecialty.validateDescription(description);
    }

    if (yearsOfExperience !== null) {
      WorkshopSpecialty.validateYearsOfExperience(yearsOfExperience);
    }

    return new WorkshopSpecialty(
      id,
      workshopId,
      specialtyType,
      description,
      yearsOfExperience,
      new Date(),
    );
  }

  static fromPrimitives(
    id: string,
    workshopId: string,
    specialtyType: string,
    description: string | null,
    yearsOfExperience: number | null,
    createdAt: Date,
  ): WorkshopSpecialty {
    return new WorkshopSpecialty(
      id,
      workshopId,
      SpecialtyType.create(specialtyType),
      description,
      yearsOfExperience,
      createdAt,
    );
  }



  private static validateDescription(description: string): void {
    if (description.trim().length === 0) {
      throw new InvalidSpecialtyDescriptionException('La descripción no puede estar vacía');
    }

    if (description.length > 500) {
      throw new InvalidSpecialtyDescriptionException(
        'La descripción no puede exceder los 500 caracteres',
      );
    }
  }

  private static validateYearsOfExperience(years: number): void {
    if (!Number.isInteger(years)) {
      throw new InvalidYearsOfExperienceException('Years must be an integer');
    }

    if (years < 0) {
      throw new InvalidYearsOfExperienceException('Years cannot be negative');
    }

    if (years > 100) {
      throw new InvalidYearsOfExperienceException('Years cannot exceed 100');
    }
  }


  updateDescription(description: string): void {
    WorkshopSpecialty.validateDescription(description);
    this.description = description;
  }


  updateYearsOfExperience(years: number): void {
    WorkshopSpecialty.validateYearsOfExperience(years);
    this.yearsOfExperience = years;
  }



  getId(): string {
    return this.id;
  }

  getWorkshopId(): string {
    return this.workshopId;
  }

  getSpecialtyType(): string {
    return this.specialtyType.getValue();
  }

  getSpecialtyDisplayName(): string {
    return this.specialtyType.getDisplayName();
  }

  getDescription(): string | null {
    return this.description;
  }

  getYearsOfExperience(): number | null {
    return this.yearsOfExperience;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
import { WorkshopSpecialty } from '../../domain/entities';
import { WorkshopSpecialtyDto } from '../dtos/response';


export class SpecialtyMapper {

  static toDto(specialty: WorkshopSpecialty): WorkshopSpecialtyDto {
    return {
      id: specialty.getId(),
      workshopId: specialty.getWorkshopId(),
      specialtyType: specialty.getSpecialtyType(),
      description: specialty.getDescription(),
      yearsOfExperience: specialty.getYearsOfExperience(),
      createdAt: specialty.getCreatedAt(),
    };
  }


  static toDtoArray(specialties: WorkshopSpecialty[]): WorkshopSpecialtyDto[] {
    return specialties.map((s) => this.toDto(s));
  }
}
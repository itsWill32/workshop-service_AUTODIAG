import { Injectable } from '@nestjs/common';
import { IWorkshopRepository } from '../../../domain/repositories';
import { WorkshopNotFoundException } from '../../../domain/exceptions';
import { WorkshopSpecialtyDto } from '../../dtos/response';
import { SpecialtyMapper } from '../../mappers';


@Injectable()
export class GetSpecialtiesUseCase {
  constructor(private readonly workshopRepository: IWorkshopRepository) {}

  async execute(workshopId: string): Promise<WorkshopSpecialtyDto[]> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    const specialties = await this.workshopRepository.findSpecialtiesByWorkshopId(workshopId);

    return specialties.map((s) => SpecialtyMapper.toDto(s));
  }
}
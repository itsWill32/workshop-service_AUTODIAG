import { Injectable, Inject } from '@nestjs/common';
import { IWorkshopRepository } from '../../../domain/repositories';
import {
  WorkshopNotFoundException,
  WorkshopNotOwnedByUserException,
} from '../../../domain/exceptions/workshop.exceptions';
import { DuplicateSpecialtyException } from '../../../domain/exceptions/specialty.exceptions';
import { WorkshopSpecialty } from '../../../domain/entities';
import { SpecialtyType } from '../../../domain/value-objects';
import { CreateSpecialtyDto } from '../../dtos/request';
import { WorkshopSpecialtyDto } from '../../dtos/response';
import { SpecialtyMapper } from '../../mappers';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AddSpecialtyUseCase {
  constructor(
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
  ) {}

  async execute(
    workshopId: string,
    ownerId: string,
    dto: CreateSpecialtyDto,
  ): Promise<WorkshopSpecialtyDto> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    if (workshop.getOwnerId() !== ownerId) {
      throw new WorkshopNotOwnedByUserException(workshopId, ownerId);
    }

    const exists = await this.workshopRepository.existsSpecialty(
      workshopId,
      dto.specialtyType,
    );
    if (exists) {
      throw new DuplicateSpecialtyException(dto.specialtyType);
    }

    const specialtyType = SpecialtyType.create(dto.specialtyType);

    const specialty = WorkshopSpecialty.create(
      uuidv4(),
      workshopId,
      specialtyType,
      dto.description || null,
      dto.yearsOfExperience || null,
    );

    const savedSpecialty = await this.workshopRepository.addSpecialty(specialty);

    return SpecialtyMapper.toDto(savedSpecialty);
  }
}
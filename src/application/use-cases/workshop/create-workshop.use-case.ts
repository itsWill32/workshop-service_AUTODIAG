import { Injectable, Inject } from '@nestjs/common';
import { IWorkshopRepository } from '../../../domain/repositories';
import { Workshop } from '../../../domain/entities';
import {
  BusinessInfo,
  Location,
  Coordinates,
  PriceRange,
} from '../../../domain/value-objects';
import { CreateWorkshopDto } from '../../dtos/request';
import { WorkshopDto } from '../../dtos/response';
import { WorkshopMapper } from '../../mappers';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateWorkshopUseCase {
  constructor(
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
  ) {}

  async execute(ownerId: string, dto: CreateWorkshopDto): Promise<WorkshopDto> {
    const existingCount = await this.workshopRepository.countByOwnerId(ownerId);
    if (existingCount >= 5) {
      throw new Error('No puede tener más de 5 talleres');
    }

    const businessInfo = BusinessInfo.create(dto.businessName, dto.description);
    const location = Location.create(
      dto.street,
      dto.city,
      dto.state,
      dto.zipCode,
      'Mexico',
    );
    const coordinates = Coordinates.create(dto.latitude, dto.longitude);
    const priceRange = PriceRange.create(dto.priceRange);

    const workshop = Workshop.create(
      uuidv4(),
      ownerId,
      businessInfo,
      location,
      coordinates,
      dto.phone,
      dto.email || null,
      priceRange,
    );

    if (dto.website) {
      workshop.updateInfo(undefined, undefined, undefined, dto.website);
    }

    const savedWorkshop = await this.workshopRepository.save(workshop);

    return WorkshopMapper.toDto(savedWorkshop);
  }
}
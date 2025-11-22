import { Injectable } from '@nestjs/common';
import { IWorkshopRepository } from '../../../domain/repositories';
import {
  WorkshopNotFoundException,
  WorkshopNotOwnedByUserException,
} from '../../../domain/exceptions';
import { BusinessInfo, PriceRange } from '../../../domain/value-objects';
import { UpdateWorkshopDto } from '../../dtos/request';
import { WorkshopDto } from '../../dtos/response';
import { WorkshopMapper } from '../../mappers';


@Injectable()
export class UpdateWorkshopUseCase {
  constructor(private readonly workshopRepository: IWorkshopRepository) {}

  async execute(
    workshopId: string,
    ownerId: string,
    dto: UpdateWorkshopDto,
  ): Promise<WorkshopDto> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    if (workshop.getOwnerId() !== ownerId) {
      throw new WorkshopNotOwnedByUserException(workshopId, ownerId);
    }

    if (dto.businessName || dto.description !== undefined) {
      const businessInfo = BusinessInfo.create(
        dto.businessName || workshop.getBusinessName(),
        dto.description !== undefined ? dto.description : workshop.getDescription() || undefined,
      );
      workshop.updateInfo(businessInfo);
    }

    if (dto.phone) {
      workshop.updateInfo(undefined, dto.phone);
    }

    if (dto.email !== undefined) {
      workshop.updateInfo(undefined, undefined, dto.email);
    }

    if (dto.website !== undefined) {
      workshop.updateInfo(undefined, undefined, undefined, dto.website);
    }

    if (dto.priceRange) {
      const priceRange = PriceRange.create(dto.priceRange);
      workshop.updatePriceRange(priceRange);
    }

    const updatedWorkshop = await this.workshopRepository.save(workshop);

    return WorkshopMapper.toDto(updatedWorkshop);
  }
}
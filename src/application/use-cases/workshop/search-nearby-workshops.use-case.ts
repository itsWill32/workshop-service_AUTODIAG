import { Injectable } from '@nestjs/common';
import { IWorkshopRepository, WorkshopFilters } from '../../../domain/repositories';
import { Coordinates } from '../../../domain/value-objects';
import { WorkshopDto } from '../../dtos/response';
import { WorkshopMapper } from '../../mappers';


@Injectable()
export class SearchNearbyWorkshopsUseCase {
  constructor(private readonly workshopRepository: IWorkshopRepository) {}

  async execute(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    minRating?: number,
    priceRange?: string,
    specialtyType?: string,
  ): Promise<WorkshopDto[]> {
    if (radiusKm < 0.5) radiusKm = 0.5;
    if (radiusKm > 50) radiusKm = 50;

    const coordinates = Coordinates.create(latitude, longitude);

    const filters: WorkshopFilters = {
      isApproved: true,
      isActive: true,
    };

    if (minRating !== undefined) {
      filters.minRating = minRating;
    }

    if (priceRange) {
      filters.priceRange = priceRange;
    }

    if (specialtyType) {
      filters.specialtyType = specialtyType;
    }

    const workshops = await this.workshopRepository.findNearby(
      coordinates,
      radiusKm,
      filters,
    );

    return workshops.map((w) => WorkshopMapper.toDto(w));
  }
}
import { Injectable, Inject } from '@nestjs/common';
import { IWorkshopRepository, WorkshopFilters } from '../../../domain/repositories';
import { PaginatedWorkshopsDto } from '../../dtos/response';
import { WorkshopMapper } from '../../mappers';

@Injectable()
export class GetWorkshopsUseCase {
  constructor(
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
  ) {}

  async execute(
    page: number = 1,
    limit: number = 20,
    minRating?: number,
    priceRange?: string,
    specialtyType?: string,
    city?: string,
    state?: string,
  ): Promise<PaginatedWorkshopsDto> {
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;
    if (limit > 100) limit = 100;

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

    if (city) {
      filters.city = city;
    }

    if (state) {
      filters.state = state;
    }

    const result = await this.workshopRepository.findAll(page, limit, filters);

    return {
      workshops: result.workshops.map((w) => WorkshopMapper.toDto(w)),
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: limit,
      },
    };
  }
}
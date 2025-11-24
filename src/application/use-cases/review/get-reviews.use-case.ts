import { Injectable, Inject } from '@nestjs/common';
import { IWorkshopRepository, IReviewRepository, ReviewSortBy } from '../../../domain/repositories';
import { WorkshopNotFoundException } from '../../../domain/exceptions';
import { PaginatedReviewsDto } from '../../dtos/response';
import { ReviewMapper } from '../../mappers';

@Injectable()
export class GetReviewsUseCase {
  constructor(
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(
    workshopId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'recent',
  ): Promise<PaginatedReviewsDto> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    if (page < 1) page = 1;
    if (limit < 1) limit = 1;
    if (limit > 50) limit = 50;

    let sortByEnum: ReviewSortBy;
    switch (sortBy) {
      case 'rating_high':
        sortByEnum = ReviewSortBy.RATING_HIGH;
        break;
      case 'rating_low':
        sortByEnum = ReviewSortBy.RATING_LOW;
        break;
      case 'helpful':
        sortByEnum = ReviewSortBy.HELPFUL;
        break;
      default:
        sortByEnum = ReviewSortBy.RECENT;
    }

    const result = await this.reviewRepository.findByWorkshopId(
      workshopId,
      page,
      limit,
      sortByEnum,
    );

    return {
      reviews: result.reviews.map((r) => ReviewMapper.toDto(r)),
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: limit,
      },
    };
  }
}
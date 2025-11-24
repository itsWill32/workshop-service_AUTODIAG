import { Injectable, Inject } from '@nestjs/common';
import { IWorkshopRepository, IReviewRepository } from '../../../domain/repositories';
import {
  WorkshopNotFoundException,
  WorkshopNotOwnedByUserException,
} from '../../../domain/exceptions/workshop.exceptions';
import {
  ReviewNotFoundException,
  ReviewNotForWorkshopException,
} from '../../../domain/exceptions/review.exceptions';
import { RespondToReviewDto } from '../../dtos/request';
import { ReviewDto } from '../../dtos/response';
import { ReviewMapper } from '../../mappers';

@Injectable()
export class RespondToReviewUseCase {
  constructor(
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(
    workshopId: string,
    reviewId: string,
    ownerId: string,
    dto: RespondToReviewDto,
  ): Promise<ReviewDto> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    if (workshop.getOwnerId() !== ownerId) {
      throw new WorkshopNotOwnedByUserException(workshopId, ownerId);
    }

    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new ReviewNotFoundException(reviewId);
    }

    if (review.getWorkshopId() !== workshopId) {
      throw new ReviewNotForWorkshopException(reviewId, workshopId);
    }

    review.addWorkshopResponse(dto.response);

    const updatedReview = await this.reviewRepository.save(review);

    return ReviewMapper.toDto(updatedReview);
  }
}
import { Injectable, Inject } from '@nestjs/common';
import { IWorkshopRepository, IReviewRepository } from '../../../domain/repositories';
import {
  ReviewNotFoundException,
  ReviewNotOwnedByUserException,
} from '../../../domain/exceptions/review.exceptions';
import { WorkshopNotFoundException } from '../../../domain/exceptions/workshop.exceptions';

@Injectable()
export class DeleteReviewUseCase {
  constructor(
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(
    workshopId: string,
    reviewId: string,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new ReviewNotFoundException(reviewId);
    }

    if (!isAdmin && review.getUserId() !== userId) {
      throw new ReviewNotOwnedByUserException(reviewId, userId);
    }

    if (review.getWorkshopId() !== workshopId) {
      throw new Error('La reseña no pertenece a este taller');
    }

    const removedRating = review.getOverallRating();

    await this.reviewRepository.delete(reviewId);

    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop) {
      throw new WorkshopNotFoundException(workshopId);
    }

    workshop.recalculateRating(removedRating);
    await this.workshopRepository.save(workshop);
  }
}
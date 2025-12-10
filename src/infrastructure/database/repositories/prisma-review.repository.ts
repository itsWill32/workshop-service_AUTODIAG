import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IReviewRepository,
  ReviewSortBy,
  ReviewStatistics,
} from '../../../domain/repositories/review.repository.interface';
import { Review } from '../../../domain/entities';

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(review: Review): Promise<Review> {
    // Campos que pueden actualizarse
    const updateData = {
      overallRating: review.getOverallRating(),
      qualityRating: review.getQualityRating(),
      priceRating: review.getPriceRating(),
      timeComplianceRating: review.getTimeComplianceRating(),
      customerServiceRating: review.getCustomerServiceRating(),
      comment: review.getComment(),
      sentimentLabel: review.getSentimentLabel(),
      sentimentScore: review.getSentimentScore(),
      workshopResponse: review.getWorkshopResponse(),
      respondedAt: review.getRespondedAt(),
      isVerified: review.getIsVerified(),
      updatedAt: new Date(),
    };

    // Campos inmutables que solo se setean al crear
    const createData = {
      id: review.getId(),
      workshopId: review.getWorkshopId(),
      userId: review.getUserId(),
      userName: review.getUserName(),
      userAvatar: review.getUserAvatar(),
      appointmentId: review.getAppointmentId(),
      createdAt: review.getCreatedAt(),
      ...updateData,
    };

    const savedReview = await this.prisma.review.upsert({
      where: { id: review.getId() },
      create: createData,
      update: updateData,
    });

    return Review.fromPrimitives(
      savedReview.id,
      savedReview.workshopId,
      savedReview.userId,
      savedReview.userName,
      savedReview.userAvatar,
      savedReview.appointmentId,
      savedReview.overallRating,
      savedReview.qualityRating,
      savedReview.priceRating,
      savedReview.timeComplianceRating,
      savedReview.customerServiceRating,
      savedReview.comment,
      savedReview.sentimentLabel,
      savedReview.sentimentScore,
      savedReview.workshopResponse,
      savedReview.respondedAt,
      savedReview.isVerified,
      savedReview.createdAt,
      savedReview.updatedAt,
    );
  }

  async findById(id: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return null;
    }

    return Review.fromPrimitives(
      review.id,
      review.workshopId,
      review.userId,
      review.userName,
      review.userAvatar,
      review.appointmentId,
      review.overallRating,
      review.qualityRating,
      review.priceRating,
      review.timeComplianceRating,
      review.customerServiceRating,
      review.comment,
      review.sentimentLabel,
      review.sentimentScore,
      review.workshopResponse,
      review.respondedAt,
      review.isVerified,
      review.createdAt,
      review.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.review.delete({
      where: { id },
    });
  }

  async findByWorkshopId(
    workshopId: string,
    page: number,
    limit: number,
    sortBy?: ReviewSortBy,
  ): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    let orderBy: any = { createdAt: 'desc' };

    if (sortBy === ReviewSortBy.RATING_HIGH) {
      orderBy = { overallRating: 'desc' };
    } else if (sortBy === ReviewSortBy.RATING_LOW) {
      orderBy = { overallRating: 'asc' };
    } else if (sortBy === ReviewSortBy.HELPFUL) {
      orderBy = { createdAt: 'desc' };
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { workshopId },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.review.count({
        where: { workshopId },
      }),
    ]);

    return {
      reviews: reviews.map((r) =>
        Review.fromPrimitives(
          r.id,
          r.workshopId,
          r.userId,
          r.userName,
          r.userAvatar,
          r.appointmentId,
          r.overallRating,
          r.qualityRating,
          r.priceRating,
          r.timeComplianceRating,
          r.customerServiceRating,
          r.comment,
          r.sentimentLabel,
          r.sentimentScore,
          r.workshopResponse,
          r.respondedAt,
          r.isVerified,
          r.createdAt,
          r.updatedAt,
        ),
      ),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) =>
      Review.fromPrimitives(
        r.id,
        r.workshopId,
        r.userId,
        r.userName,
        r.userAvatar,
        r.appointmentId,
        r.overallRating,
        r.qualityRating,
        r.priceRating,
        r.timeComplianceRating,
        r.customerServiceRating,
        r.comment,
        r.sentimentLabel,
        r.sentimentScore,
        r.workshopResponse,
        r.respondedAt,
        r.isVerified,
        r.createdAt,
        r.updatedAt,
      ),
    );
  }

  async findByAppointmentId(appointmentId: string): Promise<Review | null> {
    const review = await this.prisma.review.findFirst({
      where: { appointmentId },
    });

    if (!review) {
      return null;
    }

    return Review.fromPrimitives(
      review.id,
      review.workshopId,
      review.userId,
      review.userName,
      review.userAvatar,
      review.appointmentId,
      review.overallRating,
      review.qualityRating,
      review.priceRating,
      review.timeComplianceRating,
      review.customerServiceRating,
      review.comment,
      review.sentimentLabel,
      review.sentimentScore,
      review.workshopResponse,
      review.respondedAt,
      review.isVerified,
      review.createdAt,
      review.updatedAt,
    );
  }

  async existsForAppointment(appointmentId: string): Promise<boolean> {
    const count = await this.prisma.review.count({
      where: { appointmentId },
    });

    return count > 0;
  }

  async countByWorkshopId(workshopId: string): Promise<number> {
    return this.prisma.review.count({
      where: { workshopId },
    });
  }

  async getReviewStatistics(workshopId: string): Promise<ReviewStatistics> {
    const reviews = await this.prisma.review.findMany({
      where: { workshopId },
    });

    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageOverall: 0,
        averageQuality: 0,
        averagePrice: 0,
        averageTimeCompliance: 0,
        averageCustomerService: 0,
        ratingDistribution: {
          fiveStars: 0,
          fourStars: 0,
          threeStars: 0,
          twoStars: 0,
          oneStar: 0,
        },
        sentimentDistribution: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
      };
    }

    const sumOverall = reviews.reduce((sum, r) => sum + r.overallRating, 0);
    const averageOverall = sumOverall / totalReviews;

    const qualityRatings = reviews.filter((r) => r.qualityRating !== null);
    const averageQuality =
      qualityRatings.length > 0
        ? qualityRatings.reduce((sum, r) => sum + r.qualityRating!, 0) /
          qualityRatings.length
        : 0;

    const priceRatings = reviews.filter((r) => r.priceRating !== null);
    const averagePrice =
      priceRatings.length > 0
        ? priceRatings.reduce((sum, r) => sum + r.priceRating!, 0) /
          priceRatings.length
        : 0;

    const timeRatings = reviews.filter((r) => r.timeComplianceRating !== null);
    const averageTimeCompliance =
      timeRatings.length > 0
        ? timeRatings.reduce((sum, r) => sum + r.timeComplianceRating!, 0) /
          timeRatings.length
        : 0;

    const serviceRatings = reviews.filter(
      (r) => r.customerServiceRating !== null,
    );
    const averageCustomerService =
      serviceRatings.length > 0
        ? serviceRatings.reduce((sum, r) => sum + r.customerServiceRating!, 0) /
          serviceRatings.length
        : 0;

    const ratingDistribution = {
      fiveStars: reviews.filter((r) => r.overallRating === 5).length,
      fourStars: reviews.filter((r) => r.overallRating === 4).length,
      threeStars: reviews.filter((r) => r.overallRating === 3).length,
      twoStars: reviews.filter((r) => r.overallRating === 2).length,
      oneStar: reviews.filter((r) => r.overallRating === 1).length,
    };

    const sentimentDistribution = {
      positive: reviews.filter((r) => r.sentimentLabel === 'POSITIVE').length,
      neutral: reviews.filter((r) => r.sentimentLabel === 'NEUTRAL').length,
      negative: reviews.filter((r) => r.sentimentLabel === 'NEGATIVE').length,
    };

    return {
      totalReviews,
      averageOverall: Math.round(averageOverall * 10) / 10,
      averageQuality: Math.round(averageQuality * 10) / 10,
      averagePrice: Math.round(averagePrice * 10) / 10,
      averageTimeCompliance: Math.round(averageTimeCompliance * 10) / 10,
      averageCustomerService: Math.round(averageCustomerService * 10) / 10,
      ratingDistribution,
      sentimentDistribution,
    };
  }

  async findPendingSentimentAnalysis(limit: number): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        comment: { not: null },
        sentimentLabel: null,
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    return reviews.map((r) =>
      Review.fromPrimitives(
        r.id,
        r.workshopId,
        r.userId,
        r.userName,
        r.userAvatar,
        r.appointmentId,
        r.overallRating,
        r.qualityRating,
        r.priceRating,
        r.timeComplianceRating,
        r.customerServiceRating,
        r.comment,
        r.sentimentLabel,
        r.sentimentScore,
        r.workshopResponse,
        r.respondedAt,
        r.isVerified,
        r.createdAt,
        r.updatedAt,
      ),
    );
  }
}
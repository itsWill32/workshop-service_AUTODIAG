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
    const data = {
      workshop_id: review.getWorkshopId(),
      user_id: review.getUserId(),
      user_name: review.getUserName(),
      user_avatar: review.getUserAvatar(),
      appointment_id: review.getAppointmentId(),
      overall_rating: review.getOverallRating(),
      quality_rating: review.getQualityRating(),
      price_rating: review.getPriceRating(),
      time_compliance_rating: review.getTimeComplianceRating(),
      customer_service_rating: review.getCustomerServiceRating(),
      comment: review.getComment(),
      sentiment_label: review.getSentimentLabel(),
      sentiment_score: review.getSentimentScore(),
      workshop_response: review.getWorkshopResponse(),
      responded_at: review.getRespondedAt(),
      is_verified: review.getIsVerified(),
      updated_at: new Date(),
    };

    const savedReview = await this.prisma.review.upsert({
      where: { id: review.getId() },
      create: {
        id: review.getId(),
        ...data,
        created_at: review.getCreatedAt(),
      },
      update: data,
    });

    return Review.fromPrimitives(
      savedReview.id,
      savedReview.workshop_id,
      savedReview.user_id,
      savedReview.user_name,
      savedReview.user_avatar,
      savedReview.appointment_id,
      savedReview.overall_rating,
      savedReview.quality_rating,
      savedReview.price_rating,
      savedReview.time_compliance_rating,
      savedReview.customer_service_rating,
      savedReview.comment,
      savedReview.sentiment_label,
      savedReview.sentiment_score,
      savedReview.workshop_response,
      savedReview.responded_at,
      savedReview.is_verified,
      savedReview.created_at,
      savedReview.updated_at,
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
      review.workshop_id,
      review.user_id,
      review.user_name,
      review.user_avatar,
      review.appointment_id,
      review.overall_rating,
      review.quality_rating,
      review.price_rating,
      review.time_compliance_rating,
      review.customer_service_rating,
      review.comment,
      review.sentiment_label,
      review.sentiment_score,
      review.workshop_response,
      review.responded_at,
      review.is_verified,
      review.created_at,
      review.updated_at,
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

    let orderBy: any = { created_at: 'desc' }; 

    if (sortBy === ReviewSortBy.RATING_HIGH) {
      orderBy = { overall_rating: 'desc' };
    } else if (sortBy === ReviewSortBy.RATING_LOW) {
      orderBy = { overall_rating: 'asc' };
    } else if (sortBy === ReviewSortBy.HELPFUL) {
      orderBy = { created_at: 'desc' };
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { workshop_id: workshopId },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.review.count({
        where: { workshop_id: workshopId },
      }),
    ]);

    return {
      reviews: reviews.map((r) =>
        Review.fromPrimitives(
          r.id,
          r.workshop_id,
          r.user_id,
          r.user_name,
          r.user_avatar,
          r.appointment_id,
          r.overall_rating,
          r.quality_rating,
          r.price_rating,
          r.time_compliance_rating,
          r.customer_service_rating,
          r.comment,
          r.sentiment_label,
          r.sentiment_score,
          r.workshop_response,
          r.responded_at,
          r.is_verified,
          r.created_at,
          r.updated_at,
        ),
      ),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }


  async findByUserId(userId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return reviews.map((r) =>
      Review.fromPrimitives(
        r.id,
        r.workshop_id,
        r.user_id,
        r.user_name,
        r.user_avatar,
        r.appointment_id,
        r.overall_rating,
        r.quality_rating,
        r.price_rating,
        r.time_compliance_rating,
        r.customer_service_rating,
        r.comment,
        r.sentiment_label,
        r.sentiment_score,
        r.workshop_response,
        r.responded_at,
        r.is_verified,
        r.created_at,
        r.updated_at,
      ),
    );
  }

  async findByAppointmentId(appointmentId: string): Promise<Review | null> {
    const review = await this.prisma.review.findFirst({
      where: { appointment_id: appointmentId },
    });

    if (!review) {
      return null;
    }

    return Review.fromPrimitives(
      review.id,
      review.workshop_id,
      review.user_id,
      review.user_name,
      review.user_avatar,
      review.appointment_id,
      review.overall_rating,
      review.quality_rating,
      review.price_rating,
      review.time_compliance_rating,
      review.customer_service_rating,
      review.comment,
      review.sentiment_label,
      review.sentiment_score,
      review.workshop_response,
      review.responded_at,
      review.is_verified,
      review.created_at,
      review.updated_at,
    );
  }


  async existsForAppointment(appointmentId: string): Promise<boolean> {
    const count = await this.prisma.review.count({
      where: { appointment_id: appointmentId },
    });

    return count > 0;
  }


  async countByWorkshopId(workshopId: string): Promise<number> {
    return this.prisma.review.count({
      where: { workshop_id: workshopId },
    });
  }




  async getReviewStatistics(workshopId: string): Promise<ReviewStatistics> {
    const reviews = await this.prisma.review.findMany({
      where: { workshop_id: workshopId },
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

    const sumOverall = reviews.reduce((sum, r) => sum + r.overall_rating, 0);
    const averageOverall = sumOverall / totalReviews;

    const qualityRatings = reviews.filter((r) => r.quality_rating !== null);
    const averageQuality =
      qualityRatings.length > 0
        ? qualityRatings.reduce((sum, r) => sum + r.quality_rating!, 0) / qualityRatings.length
        : 0;

    const priceRatings = reviews.filter((r) => r.price_rating !== null);
    const averagePrice =
      priceRatings.length > 0
        ? priceRatings.reduce((sum, r) => sum + r.price_rating!, 0) / priceRatings.length
        : 0;

    const timeRatings = reviews.filter((r) => r.time_compliance_rating !== null);
    const averageTimeCompliance =
      timeRatings.length > 0
        ? timeRatings.reduce((sum, r) => sum + r.time_compliance_rating!, 0) /
          timeRatings.length
        : 0;

    const serviceRatings = reviews.filter((r) => r.customer_service_rating !== null);
    const averageCustomerService =
      serviceRatings.length > 0
        ? serviceRatings.reduce((sum, r) => sum + r.customer_service_rating!, 0) /
          serviceRatings.length
        : 0;

    const ratingDistribution = {
      fiveStars: reviews.filter((r) => r.overall_rating === 5).length,
      fourStars: reviews.filter((r) => r.overall_rating === 4).length,
      threeStars: reviews.filter((r) => r.overall_rating === 3).length,
      twoStars: reviews.filter((r) => r.overall_rating === 2).length,
      oneStar: reviews.filter((r) => r.overall_rating === 1).length,
    };

    const sentimentDistribution = {
      positive: reviews.filter((r) => r.sentiment_label === 'POSITIVE').length,
      neutral: reviews.filter((r) => r.sentiment_label === 'NEUTRAL').length,
      negative: reviews.filter((r) => r.sentiment_label === 'NEGATIVE').length,
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
        sentiment_label: null,
      },
      take: limit,
      orderBy: { created_at: 'asc' },
    });

    return reviews.map((r) =>
      Review.fromPrimitives(
        r.id,
        r.workshop_id,
        r.user_id,
        r.user_name,
        r.user_avatar,
        r.appointment_id,
        r.overall_rating,
        r.quality_rating,
        r.price_rating,
        r.time_compliance_rating,
        r.customer_service_rating,
        r.comment,
        r.sentiment_label,
        r.sentiment_score,
        r.workshop_response,
        r.responded_at,
        r.is_verified,
        r.created_at,
        r.updated_at,
      ),
    );
  }
}
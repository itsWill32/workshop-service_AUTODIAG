import { Workshop, WorkshopSpecialty, WorkshopSchedule } from '../../domain/entities';
import { ReviewStatistics } from '../../domain/repositories';
import { WorkshopDto, WorkshopDetailDto } from '../dtos/response';
import { SpecialtyMapper } from './specialty.mapper';
import { ScheduleMapper } from './schedule.mapper';


export class WorkshopMapper {

  static toDto(workshop: Workshop): WorkshopDto {
    return {
      id: workshop.getId(),
      ownerId: workshop.getOwnerId(),
      businessName: workshop.getBusinessName(),
      description: workshop.getDescription(),
      phone: workshop.getPhone(),
      email: workshop.getEmail(),
      website: workshop.getWebsite(),
      street: workshop.getStreet(),
      city: workshop.getCity(),
      state: workshop.getState(),
      zipCode: workshop.getZipCode(),
      country: workshop.getCountry(),
      latitude: workshop.getLatitude(),
      longitude: workshop.getLongitude(),
      priceRange: workshop.getPriceRange(),
      overallRating: workshop.getOverallRating(),
      totalReviews: workshop.getTotalReviews(),
      photoUrls: workshop.getPhotoUrls(),
      isApproved: workshop.getIsApproved(),
      isActive: workshop.getIsActive(),
      createdAt: workshop.getCreatedAt(),
      updatedAt: workshop.getUpdatedAt(),
    };
  }


  static toDetailDto(
    workshop: Workshop,
    specialties: WorkshopSpecialty[],
    schedule: WorkshopSchedule[],
    reviewStats: ReviewStatistics,
  ): WorkshopDetailDto {
    const baseDto = this.toDto(workshop);

    return {
      ...baseDto,
      specialties: specialties.map((s) => SpecialtyMapper.toDto(s)),
      schedule: schedule.map((s) => ScheduleMapper.toDto(s)),
      reviewsBreakdown: {
        totalReviews: reviewStats.totalReviews,
        averageOverall: reviewStats.averageOverall,
        averageQuality: reviewStats.averageQuality,
        averagePrice: reviewStats.averagePrice,
        averageTimeCompliance: reviewStats.averageTimeCompliance,
        averageCustomerService: reviewStats.averageCustomerService,
        ratingDistribution: {
          fiveStars: reviewStats.ratingDistribution.fiveStars,
          fourStars: reviewStats.ratingDistribution.fourStars,
          threeStars: reviewStats.ratingDistribution.threeStars,
          twoStars: reviewStats.ratingDistribution.twoStars,
          oneStar: reviewStats.ratingDistribution.oneStar,
        },
        sentimentDistribution: {
          positive: reviewStats.sentimentDistribution.positive,
          neutral: reviewStats.sentimentDistribution.neutral,
          negative: reviewStats.sentimentDistribution.negative,
        },
      },
    };
  }


  static toDtoArray(workshops: Workshop[]): WorkshopDto[] {
    return workshops.map((w) => this.toDto(w));
  }
}
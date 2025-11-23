import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  IWorkshopRepository,
  WorkshopFilters,
} from '../../../domain/repositories/workshop.repository.interface';
import {
  Workshop,
  WorkshopSpecialty,
  WorkshopSchedule,
} from '../../../domain/entities';


@Injectable()
export class PrismaWorkshopRepository implements IWorkshopRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(workshop: Workshop): Promise<Workshop> {
    const data = {
      owner_id: workshop.getOwnerId(),
      business_name: workshop.getBusinessName(),
      description: workshop.getDescription(),
      phone: workshop.getPhone(),
      email: workshop.getEmail(),
      website: workshop.getWebsite(),
      street: workshop.getStreet(),
      city: workshop.getCity(),
      state: workshop.getState(),
      zip_code: workshop.getZipCode(),
      country: workshop.getCountry(),
      latitude: workshop.getLatitude(),
      longitude: workshop.getLongitude(),
      price_range: workshop.getPriceRange(),
      overall_rating: workshop.getOverallRating(),
      total_reviews: workshop.getTotalReviews(),
      photo_urls: workshop.getPhotoUrls(),
      is_approved: workshop.getIsApproved(),
      is_active: workshop.getIsActive(),
      updated_at: new Date(),
    };

    const savedWorkshop = await this.prisma.workshop.upsert({
      where: { id: workshop.getId() },
      create: {
        id: workshop.getId(),
        ...data,
        created_at: workshop.getCreatedAt(),
      },
      update: data,
    });

    return Workshop.fromPrimitives(
      savedWorkshop.id,
      savedWorkshop.ownerId,
      savedWorkshop.businessName,
      savedWorkshop.description,
      savedWorkshop.phone,
      savedWorkshop.email,
      savedWorkshop.website,
      savedWorkshop.street,
      savedWorkshop.city,
      savedWorkshop.state,
      savedWorkshop.zipCode,
      savedWorkshop.country,
      savedWorkshop.latitude,
      savedWorkshop.longitude,
      savedWorkshop.priceRange,
      savedWorkshop.overallRating,
      savedWorkshop.totalReviews,
      savedWorkshop.photoUrls,
      savedWorkshop.isApproved,
      savedWorkshop.isActive,
      savedWorkshop.createdAt,
      savedWorkshop.updatedAt,
    );
  }


  async findById(id: string): Promise<Workshop | null> {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id },
    });

    if (!workshop) {
      return null;
    }

    return Workshop.fromPrimitives(
      workshop.id,
      workshop.ownerId,
      workshop.businessName,
      workshop.description,
      workshop.phone,
      workshop.email,
      workshop.website,
      workshop.street,
      workshop.city,
      workshop.state,
      workshop.zipCode,
      workshop.country,
      workshop.latitude,
      workshop.longitude,
      workshop.priceRange,
      workshop.overallRating,
      workshop.totalReviews,
      workshop.photoUrls,
      workshop.isApproved,
      workshop.isActive,
      workshop.createdAt,
      workshop.updatedAt,
    );
  }


  async findByOwnerId(ownerId: string): Promise<Workshop[]> {
    const workshops = await this.prisma.workshop.findMany({
      where: { owner_id: ownerId },
      orderBy: { created_at: 'desc' },
    });

    return workshops.map((w) =>
      Workshop.fromPrimitives(
        w.id,
        w.ownerId,
        w.businessName,
        w.description,
        w.phone,
        w.email,
        w.website,
        w.street,
        w.city,
        w.state,
        w.zipCode,
        w.country,
        w.latitude,
        w.longitude,
        w.priceRange,
        w.overallRating,
        w.totalReviews,
        w.photoUrls,
        w.isApproved,
        w.isActive,
        w.createdAt,
        w.updatedAt,
      ),
    );
  }


  async findAll(
    page: number,
    limit: number,
    filters?: WorkshopFilters,
  ): Promise<{
    workshops: Workshop[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters) {
      if (filters.isApproved !== undefined) {
        where.is_approved = filters.isApproved;
      }

      if (filters.isActive !== undefined) {
        where.is_active = filters.isActive;
      }

      if (filters.minRating !== undefined) {
        where.overall_rating = { gte: filters.minRating };
      }

      if (filters.priceRange) {
        where.price_range = filters.priceRange;
      }

      if (filters.city) {
        where.city = { contains: filters.city, mode: 'insensitive' };
      }

      if (filters.state) {
        where.state = { contains: filters.state, mode: 'insensitive' };
      }

      if (filters.specialtyType) {
        where.specialties = {
          some: {
            specialty_type: filters.specialtyType,
          },
        };
      }
    }

    const [workshops, total] = await Promise.all([
      this.prisma.workshop.findMany({
        where,
        skip,
        take: limit,
        orderBy: { overall_rating: 'desc' },
      }),
      this.prisma.workshop.count({ where }),
    ]);

    return {
      workshops: workshops.map((w) =>
        Workshop.fromPrimitives(
          w.id,
          w.ownerId,
          w.businessName,
          w.description,
          w.phone,
          w.email,
          w.website,
          w.street,
          w.city,
          w.state,
          w.zipCode,
          w.country,
          w.latitude,
          w.longitude,
          w.priceRange,
          w.overallRating,
          w.totalReviews,
          w.photoUrls,
          w.isApproved,
          w.isActive,
          w.createdAt,
          w.updatedAt,
        ),
      ),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }


  async findNearby(
    coordinates: any,
    radiusKm: number,
    filters?: WorkshopFilters,
  ): Promise<Workshop[]> {
    const lat = coordinates.getLatitude();
    const lng = coordinates.getLongitude();

    const where: any = {};

    if (filters) {
      if (filters.isApproved !== undefined) {
        where.is_approved = filters.isApproved;
      }

      if (filters.isActive !== undefined) {
        where.is_active = filters.isActive;
      }

      if (filters.minRating !== undefined) {
        where.overall_rating = { gte: filters.minRating };
      }

      if (filters.priceRange) {
        where.price_range = filters.priceRange;
      }

      if (filters.specialtyType) {
        where.specialties = {
          some: {
            specialty_type: filters.specialtyType,
          },
        };
      }
    }

    const workshops = await this.prisma.workshop.findMany({
      where,
      orderBy: { overall_rating: 'desc' },
    });

    const nearbyWorkshops = workshops.filter((w) => {
      const distance = this.calculateDistance(lat, lng, w.latitude, w.longitude);
      return distance <= radiusKm;
    });

    return nearbyWorkshops.map((w) =>
      Workshop.fromPrimitives(
        w.id,
        w.ownerId,
        w.businessName,
        w.description,
        w.phone,
        w.email,
        w.website,
        w.street,
        w.city,
        w.state,
        w.zipCode,
        w.country,
        w.latitude,
        w.longitude,
        w.priceRange,
        w.overallRating,
        w.totalReviews,
        w.photoUrls,
        w.isApproved,
        w.isActive,
        w.createdAt,
        w.updatedAt,
      ),
    );
  }


  async delete(id: string): Promise<void> {
    await this.prisma.workshop.delete({
      where: { id },
    });
  }


  async countByOwnerId(ownerId: string): Promise<number> {
    return this.prisma.workshop.count({
      where: { owner_id: ownerId },
    });
  }

  async addSpecialty(specialty: WorkshopSpecialty): Promise<WorkshopSpecialty> {
    const savedSpecialty = await this.prisma.workshopSpecialty.create({
      data: {
        id: specialty.getId(),
        workshop_id: specialty.getWorkshopId(),
        specialty_type: specialty.getSpecialtyType(),
        description: specialty.getDescription(),
        years_of_experience: specialty.getYearsOfExperience(),
        created_at: specialty.getCreatedAt(),
      },
    });

    return WorkshopSpecialty.fromPrimitives(
      savedSpecialty.id,
      savedSpecialty.workshopId,
      savedSpecialty.specialtyType,
      savedSpecialty.description,
      savedSpecialty.yearsOfExperience,
      savedSpecialty.createdAt,
    );
  }

  async findSpecialtiesByWorkshopId(workshopId: string): Promise<WorkshopSpecialty[]> {
    const specialties = await this.prisma.workshopSpecialty.findMany({
      where: { workshop_id: workshopId },
      orderBy: { created_at: 'desc' },
    });

    return specialties.map((s) =>
      WorkshopSpecialty.fromPrimitives(
        s.id,
        s.workshopId,
        s.specialtyType,
        s.description,
        s.yearsOfExperience,
        s.createdAt,
      ),
    );
  }


  async findSpecialtyById(specialtyId: string): Promise<WorkshopSpecialty | null> {
    const specialty = await this.prisma.workshopSpecialty.findUnique({
      where: { id: specialtyId },
    });

    if (!specialty) {
      return null;
    }

    return WorkshopSpecialty.fromPrimitives(
      specialty.id,
      specialty.workshopId,
      specialty.specialtyType,
      specialty.description,
      specialty.yearsOfExperience,
      specialty.createdAt,
    );
  }


  async existsSpecialty(workshopId: string, specialtyType: string): Promise<boolean> {
    const count = await this.prisma.workshopSpecialty.count({
      where: {
        workshop_id: workshopId,
        specialty_type: specialtyType,
      },
    });

    return count > 0;
  }

  async deleteSpecialty(specialtyId: string): Promise<void> {
    await this.prisma.workshopSpecialty.delete({
      where: { id: specialtyId },
    });
  }


  async saveSchedules(
    workshopId: string,
    schedules: WorkshopSchedule[],
  ): Promise<WorkshopSchedule[]> {
    const savedSchedules = await this.prisma.$transaction(async (prisma) => {
      await prisma.workshopSchedule.deleteMany({
        where: { workshopId },
      });

      const createPromises = schedules.map((schedule) =>
        prisma.workshopSchedule.create({
          data: {
            id: schedule.getId(),
            workshopId: schedule.getWorkshopId(),      
            dayOfWeek: schedule.getDayOfWeek(),        
            openTime: schedule.getOpenTime(),          
            closeTime: schedule.getCloseTime(),        
            isClosed: schedule.getIsClosed(),          
          },
        }),
      );

      return Promise.all(createPromises);
    });

    return savedSchedules.map((s) =>
      WorkshopSchedule.fromPrimitives(
        s.id,
        s.workshopId,
        s.dayOfWeek,
        s.openTime,
        s.closeTime,
        s.isClosed,
      ),
    );
  }

  async findSchedulesByWorkshopId(workshopId: string): Promise<WorkshopSchedule[]> {
    const schedules = await this.prisma.workshopSchedule.findMany({
      where: { workshop_id: workshopId },
    });

    return schedules.map((s) =>
      WorkshopSchedule.fromPrimitives(
        s.id,
        s.workshopId,
        s.dayOfWeek,
        s.openTime,
        s.closeTime,
        s.isClosed,
      ),
    );
  }

  async findScheduleByDay(
    workshopId: string,
    dayOfWeek: string,
  ): Promise<WorkshopSchedule | null> {
    const schedule = await this.prisma.workshopSchedule.findUnique({
      where: {
        workshopId_dayOfWeek: {
          workshopId: workshopId,
          dayOfWeek: dayOfWeek,
        },
      },
    });

    if (!schedule) {
      return null;
    }

    return WorkshopSchedule.fromPrimitives(
      schedule.id,
      schedule.workshopId,
      schedule.dayOfWeek,
      schedule.openTime,
      schedule.closeTime,
      schedule.isClosed,
    );
  }

  async deleteSchedulesByWorkshopId(workshopId: string): Promise<void> {
    await this.prisma.workshopSchedule.deleteMany({
      where: { workshopId }, 
    });
  }


  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; 
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
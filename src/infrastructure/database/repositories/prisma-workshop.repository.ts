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
      savedWorkshop.owner_id,
      savedWorkshop.business_name,
      savedWorkshop.description,
      savedWorkshop.phone,
      savedWorkshop.email,
      savedWorkshop.website,
      savedWorkshop.street,
      savedWorkshop.city,
      savedWorkshop.state,
      savedWorkshop.zip_code,
      savedWorkshop.country,
      savedWorkshop.latitude,
      savedWorkshop.longitude,
      savedWorkshop.price_range,
      savedWorkshop.overall_rating,
      savedWorkshop.total_reviews,
      savedWorkshop.photo_urls,
      savedWorkshop.is_approved,
      savedWorkshop.is_active,
      savedWorkshop.created_at,
      savedWorkshop.updated_at,
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
      workshop.owner_id,
      workshop.business_name,
      workshop.description,
      workshop.phone,
      workshop.email,
      workshop.website,
      workshop.street,
      workshop.city,
      workshop.state,
      workshop.zip_code,
      workshop.country,
      workshop.latitude,
      workshop.longitude,
      workshop.price_range,
      workshop.overall_rating,
      workshop.total_reviews,
      workshop.photo_urls,
      workshop.is_approved,
      workshop.is_active,
      workshop.created_at,
      workshop.updated_at,
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
        w.owner_id,
        w.business_name,
        w.description,
        w.phone,
        w.email,
        w.website,
        w.street,
        w.city,
        w.state,
        w.zip_code,
        w.country,
        w.latitude,
        w.longitude,
        w.price_range,
        w.overall_rating,
        w.total_reviews,
        w.photo_urls,
        w.is_approved,
        w.is_active,
        w.created_at,
        w.updated_at,
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
          w.owner_id,
          w.business_name,
          w.description,
          w.phone,
          w.email,
          w.website,
          w.street,
          w.city,
          w.state,
          w.zip_code,
          w.country,
          w.latitude,
          w.longitude,
          w.price_range,
          w.overall_rating,
          w.total_reviews,
          w.photo_urls,
          w.is_approved,
          w.is_active,
          w.created_at,
          w.updated_at,
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
        w.owner_id,
        w.business_name,
        w.description,
        w.phone,
        w.email,
        w.website,
        w.street,
        w.city,
        w.state,
        w.zip_code,
        w.country,
        w.latitude,
        w.longitude,
        w.price_range,
        w.overall_rating,
        w.total_reviews,
        w.photo_urls,
        w.is_approved,
        w.is_active,
        w.created_at,
        w.updated_at,
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
      savedSpecialty.workshop_id,
      savedSpecialty.specialty_type,
      savedSpecialty.description,
      savedSpecialty.years_of_experience,
      savedSpecialty.created_at,
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
        s.workshop_id,
        s.specialty_type,
        s.description,
        s.years_of_experience,
        s.created_at,
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
      specialty.workshop_id,
      specialty.specialty_type,
      specialty.description,
      specialty.years_of_experience,
      specialty.created_at,
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
        where: { workshop_id: workshopId },
      });

      const createPromises = schedules.map((schedule) =>
        prisma.workshopSchedule.create({
          data: {
            id: schedule.getId(),
            workshop_id: schedule.getWorkshopId(),
            day_of_week: schedule.getDayOfWeek(),
            open_time: schedule.getOpenTime(),
            close_time: schedule.getCloseTime(),
            is_closed: schedule.getIsClosed(),
          },
        }),
      );

      return Promise.all(createPromises);
    });

    return savedSchedules.map((s) =>
      WorkshopSchedule.fromPrimitives(
        s.id,
        s.workshop_id,
        s.day_of_week,
        s.open_time,
        s.close_time,
        s.is_closed,
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
        s.workshop_id,
        s.day_of_week,
        s.open_time,
        s.close_time,
        s.is_closed,
      ),
    );
  }

  async findScheduleByDay(
    workshopId: string,
    dayOfWeek: string,
  ): Promise<WorkshopSchedule | null> {
    const schedule = await this.prisma.workshopSchedule.findUnique({
      where: {
        workshop_id_day_of_week: {
          workshop_id: workshopId,
          day_of_week: dayOfWeek,
        },
      },
    });

    if (!schedule) {
      return null;
    }

    return WorkshopSchedule.fromPrimitives(
      schedule.id,
      schedule.workshop_id,
      schedule.day_of_week,
      schedule.open_time,
      schedule.close_time,
      schedule.is_closed,
    );
  }

  async deleteSchedulesByWorkshopId(workshopId: string): Promise<void> {
    await this.prisma.workshopSchedule.deleteMany({
      where: { workshop_id: workshopId },
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

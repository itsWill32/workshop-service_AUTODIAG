import { Workshop, WorkshopSpecialty, WorkshopSchedule } from '../entities';
import { Coordinates } from '../value-objects';

export interface IWorkshopRepository {

  save(workshop: Workshop): Promise<Workshop>;


  findById(id: string): Promise<Workshop | null>;


  findByOwnerId(ownerId: string): Promise<Workshop[]>;


  findAll(page: number, limit: number, filters?: WorkshopFilters): Promise<{
    workshops: Workshop[];
    total: number;
    page: number;
    totalPages: number;
  }>;


  findNearby(
    coordinates: Coordinates,
    radiusKm: number,
    filters?: WorkshopFilters,
  ): Promise<Workshop[]>;


  delete(id: string): Promise<void>;

  countByOwnerId(ownerId: string): Promise<number>;

  addSpecialty(specialty: WorkshopSpecialty): Promise<WorkshopSpecialty>;


  findSpecialtiesByWorkshopId(workshopId: string): Promise<WorkshopSpecialty[]>;


  findSpecialtyById(specialtyId: string): Promise<WorkshopSpecialty | null>;

  existsSpecialty(workshopId: string, specialtyType: string): Promise<boolean>;


  deleteSpecialty(specialtyId: string): Promise<void>;



  saveSchedules(workshopId: string, schedules: WorkshopSchedule[]): Promise<WorkshopSchedule[]>;

  findSchedulesByWorkshopId(workshopId: string): Promise<WorkshopSchedule[]>;


  findScheduleByDay(workshopId: string, dayOfWeek: string): Promise<WorkshopSchedule | null>;


  deleteSchedulesByWorkshopId(workshopId: string): Promise<void>;
}


export interface WorkshopFilters {
  minRating?: number;
  priceRange?: string;
  specialtyType?: string;
  city?: string;
  state?: string;
  isApproved?: boolean;
  isActive?: boolean;
}
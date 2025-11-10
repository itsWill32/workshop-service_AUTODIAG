// autodiag-workshop-service/src/application/use-cases/workshop.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Workshop } from '../../domain/entities/workshop.entity';
import { 
  IWorkshopRepository, 
  WORKSHOP_REPOSITORY, 
  WorkshopQueryFilters 
} from '../../domain/interfaces/workshop.repository.interface';
import { SearchNearbyDto } from '../dto/input/search-nearby.dto';

@Injectable()
export class WorkshopService {
  constructor(
    @Inject(WORKSHOP_REPOSITORY)
    private readonly workshopRepository: IWorkshopRepository,
  ) {}

  // MVP 1: Listar Talleres (con filtros)
  async findAll(filters: WorkshopQueryFilters): Promise<Workshop[]> {
    // Aquí puedes agregar la lógica de paginación si es necesario
    return this.workshopRepository.findAll(filters);
  }

  // MVP 2: Buscar por Ubicación
  async findNearby(query: SearchNearbyDto): Promise<Workshop[]> {
    const { latitude, longitude, radiusKm, ...filters } = query;
    return this.workshopRepository.findNearby(latitude, longitude, radiusKm, filters);
  }

  // MVP 3: Ver Taller por ID
  async findOne(id: string): Promise<Workshop> {
    const workshop = await this.workshopRepository.findById(id);
    if (!workshop) {
      throw new NotFoundException('Taller no encontrado');
    }
    return workshop;
  }
  
  // NOTA: Los endpoints de Crear, Actualizar y Filtrar Taller
  // están en tu API, pero no en tu lista de MVP.
  // Los agregarías aquí cuando sea necesario (ej. `create(...)`, `update(...)`).
}
// autodiag-workshop-service/src/infrastructure/adapters/input/rest/workshops.controller.ts
import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { WorkshopService } from '../../../../application/use-cases/workshop.service';
import { SearchNearbyDto } from '../../../../application/dto/input/search-nearby.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Workshops & Search')
@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly workshopService: WorkshopService) {}

  // MVP 4: Filtrar Talleres (Listar todos)
  @Get()
  @ApiOperation({ summary: 'Listar talleres (con filtros)' })
  @ApiResponse({ status: 200, description: 'Lista de talleres.' })
  findAll(@Query() query: any) {
    // Aquí deberías crear un DTO de filtros para GET /workshops
    return this.workshopService.findAll(query);
  }

  // MVP 2: Buscar por Ubicación
  @Get('nearby')
  @ApiOperation({ summary: 'Buscar talleres cercanos (PostGIS)' })
  @ApiResponse({ status: 200, description: 'Talleres encontrados.' })
  @ApiResponse({ status: 400, description: 'Parámetros de lat/lng inválidos.' })
  findNearby(@Query() searchNearbyDto: SearchNearbyDto) {
    // El DTO valida automáticamente los query params
    return this.workshopService.findNearby(searchNearbyDto);
  }

  // MVP 3: Ver Taller
  @Get(':id')
  @ApiOperation({ summary: 'Obtener taller por ID' })
  @ApiResponse({ status: 200, description: 'Taller encontrado.' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.workshopService.findOne(id);
  }
  
  // MVP 5: Verificar Disponibilidad
  @Get(':id/availability')
  @ApiOperation({ summary: 'Verificar disponibilidad de un taller' })
  @ApiResponse({ status: 200, description: 'Horarios disponibles.' })
  getAvailability(@Param('id', ParseUUIDPipe) id: string) {
    // Este es un caso de uso separado, deberías crear un
    // AvailabilityService y su propio repositorio.
    // Por ahora, solo simulamos la ruta.
    return { workshopId: id, slots: ['2025-11-11T10:00:00', '2025-11-11T14:00:00'] };
  }
}
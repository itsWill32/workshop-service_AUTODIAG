import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseFloatPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { GetUser, JwtPayload } from '../decorators/get-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import {
  CreateWorkshopDto,
  UpdateWorkshopDto,
} from '../../../application/dtos/request';
import {
  WorkshopDto,
  WorkshopDetailDto,
  PaginatedWorkshopsDto,
} from '../../../application/dtos/response';
import {
  CreateWorkshopUseCase,
  GetWorkshopsUseCase,
  GetWorkshopByIdUseCase,
  UpdateWorkshopUseCase,
  DeleteWorkshopUseCase,
  SearchNearbyWorkshopsUseCase,
  ApproveWorkshopUseCase,
  RejectWorkshopUseCase,
} from '../../../application/use-cases';


@ApiTags('Workshops')
@Controller('workshops')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkshopsController {
  constructor(
    private readonly createWorkshopUseCase: CreateWorkshopUseCase,
    private readonly getWorkshopsUseCase: GetWorkshopsUseCase,
    private readonly getWorkshopByIdUseCase: GetWorkshopByIdUseCase,
    private readonly updateWorkshopUseCase: UpdateWorkshopUseCase,
    private readonly deleteWorkshopUseCase: DeleteWorkshopUseCase,
    private readonly searchNearbyWorkshopsUseCase: SearchNearbyWorkshopsUseCase,
    private readonly approveWorkshopUseCase: ApproveWorkshopUseCase,
    private readonly rejectWorkshopUseCase: RejectWorkshopUseCase,
  ) {}


  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar talleres con paginación y filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'minRating', required: false, type: Number, example: 4.0 })
  @ApiQuery({ name: 'priceRange', required: false, enum: ['LOW', 'MEDIUM', 'HIGH'] })
  @ApiQuery({ name: 'specialtyType', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Lista de talleres obtenida exitosamente',
    type: PaginatedWorkshopsDto,
  })
  async getWorkshops(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('minRating', new ParseFloatPipe({ optional: true })) minRating?: number,
    @Query('priceRange') priceRange?: string,
    @Query('specialtyType') specialtyType?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ): Promise<PaginatedWorkshopsDto> {
    return this.getWorkshopsUseCase.execute(
      page,
      limit,
      minRating,
      priceRange,
      specialtyType,
      city,
      state,
    );
  }

  @Public()
  @Get('search/nearby')
  @ApiOperation({ summary: 'Buscar talleres cercanos por ubicación' })
  @ApiQuery({ name: 'latitude', required: true, type: Number, example: 16.7516 })
  @ApiQuery({ name: 'longitude', required: true, type: Number, example: -93.1134 })
  @ApiQuery({ name: 'radiusKm', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'priceRange', required: false, enum: ['LOW', 'MEDIUM', 'HIGH'] })
  @ApiQuery({ name: 'specialtyType', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Talleres cercanos encontrados',
    type: [WorkshopDto],
  })
  async searchNearby(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radiusKm', new ParseFloatPipe({ optional: true })) radiusKm?: number,
    @Query('minRating', new ParseFloatPipe({ optional: true })) minRating?: number,
    @Query('priceRange') priceRange?: string,
    @Query('specialtyType') specialtyType?: string,
  ): Promise<WorkshopDto[]> {
    return this.searchNearbyWorkshopsUseCase.execute(
      latitude,
      longitude,
      radiusKm,
      minRating,
      priceRange,
      specialtyType,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener taller por ID con información completa' })
  @ApiResponse({
    status: 200,
    description: 'Taller encontrado',
    type: WorkshopDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async getWorkshopById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WorkshopDetailDto> {
    return this.getWorkshopByIdUseCase.execute(id);
  }



  @Post()
  @Roles('WORKSHOP_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar nuevo taller ' })
  @ApiResponse({
    status: 201,
    description: 'Taller creado exitosamente',
    type: WorkshopDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado - requiere rol ----' })
  async createWorkshop(
    @Body() createWorkshopDto: CreateWorkshopDto,
    @GetUser('userId') ownerId: string,
  ): Promise<WorkshopDto> {
    return this.createWorkshopUseCase.execute(ownerId, createWorkshopDto);
  }

  @Get('me/workshops')
  @Roles('WORKSHOP_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener talleres del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de talleres del usuario',
    type: PaginatedWorkshopsDto,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async getMyWorkshops(@GetUser('userId') ownerId: string): Promise<PaginatedWorkshopsDto> {
    const workshops = await this.getWorkshopsUseCase.execute(1, 100);
    
    const userWorkshops = workshops.workshops.filter(w => w.ownerId === ownerId);
    
    return {
      workshops: userWorkshops,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: userWorkshops.length,
        itemsPerPage: userWorkshops.length,
      },
    };
  }

  @Patch(':id')
  @Roles('WORKSHOP_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar taller (solo propietario)' })
  @ApiResponse({
    status: 200,
    description: 'Taller actualizado exitosamente',
    type: WorkshopDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No es el propietario del taller' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async updateWorkshop(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
    @GetUser('userId') ownerId: string,
  ): Promise<WorkshopDto> {
    return this.updateWorkshopUseCase.execute(id, ownerId, updateWorkshopDto);
  }

  @Delete(':id')
  @Roles('WORKSHOP_ADMIN', 'SYSTEM_ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar taller (propietario o admin)' })
  @ApiResponse({ status: 204, description: 'Taller eliminado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async deleteWorkshop(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('userId') userId: string,
    @GetUser('role') role: string,
  ): Promise<void> {
    if (role === 'SYSTEM_ADMIN') {
      await this.deleteWorkshopUseCase.execute(id, userId);
    } else {
      await this.deleteWorkshopUseCase.execute(id, userId);
    }
  }


  @Post(':id/photos')
  @Roles('WORKSHOP_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir fotos del taller (placeholder - implementar con Cloudinary)' })
  @ApiResponse({ status: 200, description: 'Fotos subidas exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al subir fotos' })
  async uploadPhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('userId') ownerId: string,
  ): Promise<{ message: string }> {

    return {
      message: 'Photo upload endpoint - to be implemented with Cloudinary integration',
    };
  }


  @Get('admin/pending')
  @Roles('SYSTEM_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar talleres pendientes de aprobación (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de talleres pendientes',
    type: PaginatedWorkshopsDto,
  })
  @ApiResponse({ status: 403, description: 'Solo administradores' })
  async getPendingWorkshops(): Promise<PaginatedWorkshopsDto> {
    const result = await this.getWorkshopsUseCase['workshopRepository'].findAll(
      1,
      100,
      { isApproved: false, isActive: true }
    );

    return {
      workshops: result.workshops.map((w) => ({
        id: w.getId(),
        ownerId: w.getOwnerId(),
        businessName: w.getBusinessName(),
        description: w.getDescription(),
        phone: w.getPhone(),
        email: w.getEmail(),
        website: w.getWebsite(),
        street: w.getStreet(),
        city: w.getCity(),
        state: w.getState(),
        zipCode: w.getZipCode(),
        country: w.getCountry(),
        latitude: w.getLatitude(),
        longitude: w.getLongitude(),
        priceRange: w.getPriceRange(),
        overallRating: w.getOverallRating(),
        totalReviews: w.getTotalReviews(),
        photoUrls: w.getPhotoUrls(),
        isApproved: w.getIsApproved(),
        isActive: w.getIsActive(),        
        createdAt: w.getCreatedAt(),
        updatedAt: w.getUpdatedAt(),      
      })),
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: 100,
      },
    };
  }


  @Patch(':id/approve')
  @Roles('SYSTEM_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar taller (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Taller aprobado exitosamente',
  })
  @ApiResponse({ status: 403, description: 'Solo administradores' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async approveWorkshop(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('userId') adminUserId: string,
  ): Promise<{ message: string; workshopId: string }> {
    await this.approveWorkshopUseCase.execute(id, adminUserId);

    return {
      message: 'Taller aprobado exitosamente',
      workshopId: id,
    };
  }


  @Patch(':id/reject')
  @Roles('SYSTEM_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rechazar taller (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Taller rechazado exitosamente',
  })
  @ApiResponse({ status: 403, description: 'Solo administradores' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async rejectWorkshop(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('userId') adminUserId: string,
  ): Promise<{ message: string; workshopId: string }> {
    await this.rejectWorkshopUseCase.execute(id, adminUserId);

    return {
      message: 'Taller rechazado exitosamente',
      workshopId: id,
    };
  }
}


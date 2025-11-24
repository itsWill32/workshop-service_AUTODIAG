import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { CreateSpecialtyDto } from '../../../application/dtos/request';
import { WorkshopSpecialtyDto } from '../../../application/dtos/response';
import {
  AddSpecialtyUseCase,
  GetSpecialtiesUseCase,
} from '../../../application/use-cases';
import { IWorkshopRepository } from '../../../domain/repositories';

@ApiTags('Specialties')
@Controller('workshops/:workshopId/specialties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpecialtiesController {
  constructor(
    private readonly addSpecialtyUseCase: AddSpecialtyUseCase,
    private readonly getSpecialtiesUseCase: GetSpecialtiesUseCase,
    @Inject('IWorkshopRepository')
    private readonly workshopRepository: IWorkshopRepository,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar especialidades de un taller' })
  @ApiResponse({
    status: 200,
    description: 'Lista de especialidades',
    type: [WorkshopSpecialtyDto],
  })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async getSpecialties(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
  ): Promise<WorkshopSpecialtyDto[]> {
    return this.getSpecialtiesUseCase.execute(workshopId);
  }

  @Post()
  @Roles('WORKSHOP_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar especialidad a un taller (solo propietario)' })
  @ApiResponse({
    status: 201,
    description: 'Especialidad agregada exitosamente',
    type: WorkshopSpecialtyDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No es el propietario del taller' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  @ApiResponse({ status: 409, description: 'Especialidad duplicada' })
  async addSpecialty(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
    @Body() createSpecialtyDto: CreateSpecialtyDto,
    @GetUser('userId') ownerId: string,
  ): Promise<WorkshopSpecialtyDto> {
    return this.addSpecialtyUseCase.execute(workshopId, ownerId, createSpecialtyDto);
  }

  @Delete(':specialtyId')
  @Roles('WORKSHOP_ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar especialidad de un taller (solo propietario)' })
  @ApiResponse({ status: 204, description: 'Especialidad eliminada exitosamente' })
  @ApiResponse({ status: 403, description: 'No es el propietario del taller' })
  @ApiResponse({ status: 404, description: 'Especialidad no encontrada' })
  async deleteSpecialty(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
    @Param('specialtyId', ParseUUIDPipe) specialtyId: string,
    @GetUser('userId') ownerId: string,
  ): Promise<void> {
    const workshop = await this.workshopRepository.findById(workshopId);
    if (!workshop || workshop.getOwnerId() !== ownerId) {
      throw new Error('Workshop not found or not owned by user');
    }

    await this.workshopRepository.deleteSpecialty(specialtyId);
  }
}
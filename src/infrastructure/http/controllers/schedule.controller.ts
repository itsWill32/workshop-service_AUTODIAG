import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
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
import { CreateScheduleDto } from '../../../application/dtos/request';
import { WorkshopScheduleDto } from '../../../application/dtos/response';
import {
  SetWorkshopScheduleUseCase,
  GetWorkshopScheduleUseCase,
} from '../../../application/use-cases';


@ApiTags('Schedule')
@Controller('workshops/:workshopId/schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(
    private readonly setWorkshopScheduleUseCase: SetWorkshopScheduleUseCase,
    private readonly getWorkshopScheduleUseCase: GetWorkshopScheduleUseCase,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener horarios de un taller' })
  @ApiResponse({
    status: 200,
    description: 'Horarios del taller',
    type: [WorkshopScheduleDto],
  })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async getSchedule(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
  ): Promise<WorkshopScheduleDto[]> {
    return this.getWorkshopScheduleUseCase.execute(workshopId);
  }

  @Put()
  @Roles('WORKSHOP_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Configurar horarios de un taller (reemplaza horarios existentes)',
    description: 'Solo el propietario del taller puede configurar horarios',
  })
  @ApiResponse({
    status: 200,
    description: 'Horarios configurados exitosamente',
    type: [WorkshopScheduleDto],
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No es el propietario del taller' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async setSchedule(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
    @Body() schedules: CreateScheduleDto[],
    @GetUser('userId') ownerId: string,
  ): Promise<WorkshopScheduleDto[]> {
    return this.setWorkshopScheduleUseCase.execute(workshopId, ownerId, schedules);
  }
}
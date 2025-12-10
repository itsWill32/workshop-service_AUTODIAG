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
  Inject,
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
  CreateReviewDto,
  UpdateReviewDto,
  RespondToReviewDto,
} from '../../../application/dtos/request';
import {
  ReviewDto,
  PaginatedReviewsDto,
  ReviewStatisticsDto,
} from '../../../application/dtos/response';
import {
  CreateReviewUseCase,
  GetReviewsUseCase,
  UpdateReviewUseCase,
  DeleteReviewUseCase,
  RespondToReviewUseCase,
} from '../../../application/use-cases';
import { IReviewRepository } from '../../../domain/repositories';

@ApiTags('Reviews')
@Controller('workshops/:workshopId/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getReviewsUseCase: GetReviewsUseCase,
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
    private readonly respondToReviewUseCase: RespondToReviewUseCase,
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) { }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar reseñas de un taller con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['recent', 'rating_high', 'rating_low', 'helpful'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reseñas',
    type: PaginatedReviewsDto,
  })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async getReviews(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('sortBy') sortBy?: string,
  ): Promise<PaginatedReviewsDto> {
    return this.getReviewsUseCase.execute(workshopId, page, limit, sortBy);
  }

  @Public()
  @Get('statistics')
  @ApiOperation({ summary: 'Obtener estadísticas de reseñas de un taller' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de reseñas',
    type: ReviewStatisticsDto,
  })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  async getStatistics(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
  ): Promise<ReviewStatisticsDto> {
    return this.reviewRepository.getReviewStatistics(workshopId);
  }

  @Post()
  @Roles('VEHICLE_OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear reseña para un taller (solo VEHICLE_OWNER)' })
  @ApiResponse({
    status: 201,
    description: 'Reseña creada exitosamente',
    type: ReviewDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Taller no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe reseña para esta cita' })
  async createReview(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: JwtPayload,
  ): Promise<ReviewDto> {
    // Obtener userName del DTO si existe, si no del JWT token
    const userName = createReviewDto.userName || user.fullName || user.email || 'Usuario';

    return this.createReviewUseCase.execute(
      workshopId,
      user.userId,
      userName,
      null,
      createReviewDto,
    );
  }

  @Patch(':reviewId')
  @Roles('VEHICLE_OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar reseña (solo autor)' })
  @ApiResponse({
    status: 200,
    description: 'Reseña actualizada exitosamente',
    type: ReviewDto,
  })
  @ApiResponse({ status: 403, description: 'No es el autor de la reseña' })
  @ApiResponse({ status: 404, description: 'Reseña no encontrada' })
  async updateReview(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser('userId') userId: string,
  ): Promise<ReviewDto> {
    return this.updateReviewUseCase.execute(workshopId, reviewId, userId, updateReviewDto);
  }

  @Delete(':reviewId')
  @Roles('VEHICLE_OWNER', 'SYSTEM_ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar reseña (autor o admin)' })
  @ApiResponse({ status: 204, description: 'Reseña eliminada exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Reseña no encontrada' })
  async deleteReview(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @GetUser('userId') userId: string,
    @GetUser('role') role: string,
  ): Promise<void> {
    const isAdmin = role === 'SYSTEM_ADMIN';
    await this.deleteReviewUseCase.execute(workshopId, reviewId, userId, isAdmin);
  }

  @Post(':reviewId/response')
  @Roles('WORKSHOP_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Responder a una reseña (solo propietario del taller)' })
  @ApiResponse({
    status: 200,
    description: 'Respuesta agregada exitosamente',
    type: ReviewDto,
  })
  @ApiResponse({ status: 400, description: 'Reseña ya tiene respuesta' })
  @ApiResponse({ status: 403, description: 'No es el propietario del taller' })
  @ApiResponse({ status: 404, description: 'Reseña no encontrada' })
  async respondToReview(
    @Param('workshopId', ParseUUIDPipe) workshopId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() respondToReviewDto: RespondToReviewDto,
    @GetUser('userId') ownerId: string,
  ): Promise<ReviewDto> {
    return this.respondToReviewUseCase.execute(
      workshopId,
      reviewId,
      ownerId,
      respondToReviewDto,
    );
  }
}
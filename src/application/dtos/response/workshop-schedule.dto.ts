import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class WorkshopScheduleDto {
  @ApiProperty({
    description: 'ID del horario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del taller',
    example: '987e6543-e21b-12d3-a456-426614174999',
  })
  workshopId: string;

  @ApiProperty({
    description: 'Día de la semana',
    example: 'MONDAY',
    enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
  })
  dayOfWeek: string;

  @ApiPropertyOptional({
    description: 'Hora de apertura (HH:MM)',
    example: '08:00',
  })
  openTime: string | null;

  @ApiPropertyOptional({
    description: 'Hora de cierre (HH:MM)',
    example: '18:00',
  })
  closeTime: string | null;

  @ApiProperty({
    description: 'Si el taller está cerrado ese día',
    example: false,
  })
  isClosed: boolean;
}
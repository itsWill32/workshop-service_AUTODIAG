import { IsString, IsNotEmpty, IsBoolean, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateScheduleDto {
  @ApiProperty({
    description: 'Día de la semana',
    example: 'MONDAY',
    enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
  })
  @IsString()
  @IsNotEmpty()
  dayOfWeek: string;

  @ApiPropertyOptional({
    description: 'Hora de apertura (HH:MM)',
    example: '08:00',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'EL horario de apertura debe estar en formato HH:MM (00:00 a 23:59)',
  })
  openTime?: string;

  @ApiPropertyOptional({
    description: 'Hora de cierre (HH:MM)',
    example: '18:00',
    pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'El horario de cierre debe estar en formato HH:MM (00:00 a 23:59)',
  })
  closeTime?: string;

  @ApiProperty({
    description: 'Si el taller está cerrado ese día',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isClosed?: boolean;
}
import { InvalidSpecialtyTypeException } from '../exceptions/specialty.exceptions';


export enum SpecialtyTypeEnum {
  ENGINE = 'ENGINE',
  TRANSMISSION = 'TRANSMISSION',
  BRAKES = 'BRAKES',
  ELECTRICAL = 'ELECTRICAL',
  AIR_CONDITIONING = 'AIR_CONDITIONING',
  SUSPENSION = 'SUSPENSION',
  BODYWORK = 'BODYWORK',
  PAINTING = 'PAINTING',
  ALIGNMENT = 'ALIGNMENT',
  DIAGNOSTICS = 'DIAGNOSTICS',
  TIRE_SERVICE = 'TIRE_SERVICE',
  OIL_CHANGE = 'OIL_CHANGE',
  GENERAL_MAINTENANCE = 'GENERAL_MAINTENANCE',
}


export class SpecialtyType {
  private constructor(private readonly value: SpecialtyTypeEnum) {}

  static create(value: string): SpecialtyType {
    const upperValue = value.toUpperCase().replace(/ /g, '_');

    if (!Object.values(SpecialtyTypeEnum).includes(upperValue as SpecialtyTypeEnum)) {
      throw new InvalidSpecialtyTypeException(
        `Tipo de especialidad inválido: ${value}. Debe ser uno de: ${Object.values(SpecialtyTypeEnum).join(', ')}`,
      );
    }

    return new SpecialtyType(upperValue as SpecialtyTypeEnum);
  }

  getValue(): string {
    return this.value;
  }

  getDisplayName(): string {
    const names: Record<SpecialtyTypeEnum, string> = {
      [SpecialtyTypeEnum.ENGINE]: 'Motor',
      [SpecialtyTypeEnum.TRANSMISSION]: 'Transmisión',
      [SpecialtyTypeEnum.BRAKES]: 'Frenos',
      [SpecialtyTypeEnum.ELECTRICAL]: 'Sistema Eléctrico',
      [SpecialtyTypeEnum.AIR_CONDITIONING]: 'Aire Acondicionado',
      [SpecialtyTypeEnum.SUSPENSION]: 'Suspensión',
      [SpecialtyTypeEnum.BODYWORK]: 'Hojalatería',
      [SpecialtyTypeEnum.PAINTING]: 'Pintura',
      [SpecialtyTypeEnum.ALIGNMENT]: 'Alineación y Balanceo',
      [SpecialtyTypeEnum.DIAGNOSTICS]: 'Diagnóstico',
      [SpecialtyTypeEnum.TIRE_SERVICE]: 'Servicio de Llantas',
      [SpecialtyTypeEnum.OIL_CHANGE]: 'Cambio de Aceite',
      [SpecialtyTypeEnum.GENERAL_MAINTENANCE]: 'Mantenimiento General',
    };
    return names[this.value];
  }

  equals(other: SpecialtyType): boolean {
    return this.value === other.value;
  }
}
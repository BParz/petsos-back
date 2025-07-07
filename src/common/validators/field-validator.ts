import { BadRequestException } from '@nestjs/common';
import { User } from 'src/users/user.entity';

export interface ValidationField {
  name: string;
  value: any;
  required?: boolean;
}

export class FieldValidator {
  /**
   * Valida campos requeridos de cualquier entidad
   * @param fields Array de campos a validar
   */
  static validateRequiredFields(fields: ValidationField[]): void {
    const missingFields: string[] = [];

    fields.forEach((field) => {
      if (
        field.required !== false && // Por defecto es requerido
        (!field.value ||
          (typeof field.value === 'string' && field.value.trim() === ''))
      ) {
        missingFields.push(field.name);
      }
    });

    if (missingFields.length > 0) {
      throw new BadRequestException({
        message: 'Campos requeridos faltantes',
        missingFields,
      });
    }
  }

  /**
   * Valida campos específicos de la entidad User para registro
   * @param userData Datos del usuario a validar
   */
  static validateUserFields(userData: Partial<User>): void {
    const fields: ValidationField[] = [
      { name: 'firstName', value: userData.firstName },
      { name: 'lastName', value: userData.lastName },
      { name: 'email', value: userData.email },
    ];

    this.validateRequiredFields(fields);
  }

  /**
   * Valida campos específicos de la entidad User para actualización de perfil
   * @param userData Datos del usuario a validar
   */
  static validateUserProfileFields(userData: Partial<User>): void {
    const fields: ValidationField[] = [
      { name: 'firstName', value: userData.firstName },
      { name: 'lastName', value: userData.lastName },
      { name: 'email', value: userData.email },
      { name: 'phoneNumber', value: userData.phoneNumber },
      { name: 'address', value: userData.address },
      { name: 'city', value: userData.city },
      { name: 'region', value: userData.region },
    ];

    this.validateRequiredFields(fields);
  }
}

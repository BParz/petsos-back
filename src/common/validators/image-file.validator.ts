import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageFileValidator implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      return file;
    }

    // Validar MIME types permitidos
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no válido. Tipos permitidos: ${allowedMimeTypes.join(', ')}`,
      );
    }

    // Validar extensión del archivo
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Extensión de archivo no válida. Extensiones permitidas: ${allowedExtensions.join(', ')}`,
      );
    }

    return file;
  }
}

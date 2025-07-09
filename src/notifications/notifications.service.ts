import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PetsService } from '../pets/pets.service';
import { UsersService } from '../users/users.service';

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly petsService: PetsService,
    private readonly usersService: UsersService,
  ) {
    // Configurar el transporter de Nodemailer
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPetLostNotification(petId: number): Promise<void> {
    try {
      // Obtener información de la mascota y su dueño
      const pet = await this.petsService.findOne(petId);
      const owner = await this.usersService.findOne(pet.userId);

      if (!pet || !owner) {
        throw new NotFoundException('Mascota o dueño no encontrado');
      }

      // Crear el template del email para mascota perdida
      const emailTemplate = this.createPetLostEmailTemplate(pet, owner);

      // Enviar el email
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: owner.email,
        subject: `🚨 ALERTA: ${pet.name} ha sido reportada como perdida`,
        html: emailTemplate,
      });

      console.log(
        `Email de mascota perdida enviado a ${owner.email} para ${pet.name}`,
      );
    } catch (error) {
      console.error('Error enviando email de mascota perdida:', error);
      throw error;
    }
  }

  async sendPetFoundNotification(
    petId: number,
    contactInfo: ContactInfo,
  ): Promise<void> {
    try {
      // Obtener información de la mascota y su dueño
      const pet = await this.petsService.findOne(petId);
      const owner = await this.usersService.findOne(pet.userId);

      if (!pet || !owner) {
        throw new NotFoundException('Mascota o dueño no encontrado');
      }

      // Crear el template del email para mascota encontrada
      const emailTemplate = this.createPetFoundEmailTemplate(
        pet,
        owner,
        contactInfo,
      );

      // Enviar el email
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: owner.email,
        subject: `🎉 ¡BUENAS NOTICIAS! ${pet.name} ha sido encontrada`,
        html: emailTemplate,
      });

      console.log(
        `Email de mascota encontrada enviado a ${owner.email} para ${pet.name}`,
      );
    } catch (error) {
      console.error('Error enviando email de mascota encontrada:', error);
      throw error;
    }
  }

  private createPetLostEmailTemplate(pet: any, owner: any): string {
    const petImage = pet.imageUrl
      ? `<img src="${process.env.BASE_URL || 'http://localhost:3000'}${pet.imageUrl}" alt="${pet.name}" style="max-width: 300px; border-radius: 10px; margin: 20px 0;">`
      : '';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mascota Perdida - ${pet.name}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #e74c3c;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .alert-icon {
            font-size: 48px;
            color: #e74c3c;
            margin-bottom: 10px;
          }
          .pet-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #e74c3c;
          }
          .pet-image {
            text-align: center;
            margin: 20px 0;
          }
          .action-buttons {
            text-align: center;
            margin: 30px 0;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 5px;
            background-color: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          .btn:hover {
            background-color: #c0392b;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="alert-icon">🚨</div>
            <h1 style="color: #e74c3c; margin: 0;">ALERTA DE MASCOTA PERDIDA</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Se ha reportado la pérdida de tu mascota</p>
          </div>

          <div class="pet-info">
            <h2 style="color: #e74c3c; margin-top: 0;">Información de ${pet.name}</h2>
            <p><strong>Especie:</strong> ${pet.species}</p>
            <p><strong>Raza:</strong> ${pet.breed}</p>
            <p><strong>Edad:</strong> ${pet.age} años</p>
            <p><strong>Peso:</strong> ${pet.weight} kg</p>
            <p><strong>Color:</strong> ${pet.color}</p>
            ${pet.description ? `<p><strong>Descripción:</strong> ${pet.description}</p>` : ''}
          </div>

          ${
            petImage
              ? `
          <div class="pet-image">
            <h3>Foto de ${pet.name}</h3>
            ${petImage}
          </div>
          `
              : ''
          }

          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">¿Qué hacer ahora?</h3>
            <ul style="color: #856404;">
              <li>Comparte esta información en redes sociales</li>
              <li>Contacta a veterinarias y refugios locales</li>
              <li>Coloca carteles en tu vecindario</li>
              <li>Revisa las páginas de mascotas perdidas</li>
              <li>Mantén tu teléfono disponible</li>
            </ul>
          </div>

          <div class="action-buttons">
            <a href="${process.env.FRONTEND_URL || 'https://bparz.github.io'}/pets/${pet.id}" class="btn">Ver Detalles Completos</a>
            <a href="mailto:${process.env.SUPPORT_EMAIL || 'soporte@petsos.com'}" class="btn">Contactar Soporte</a>
          </div>

          <div class="footer">
            <p>Este es un mensaje automático del sistema PetSOS</p>
            <p>Si tienes alguna pregunta, contacta a nuestro equipo de soporte</p>
            <p><strong>Fecha del reporte:</strong> ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private createPetFoundEmailTemplate(
    pet: any,
    owner: any,
    contactInfo: ContactInfo,
  ): string {
    const petImage = pet.imageUrl
      ? `<img src="${process.env.BASE_URL || 'http://localhost:3000'}${pet.imageUrl}" alt="${pet.name}" style="max-width: 300px; border-radius: 10px; margin: 20px 0;">`
      : '';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡${pet.name} ha sido encontrada!</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #27ae60;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .success-icon {
            font-size: 48px;
            color: #27ae60;
            margin-bottom: 10px;
          }
          .pet-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #27ae60;
          }
          .contact-info {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .pet-image {
            text-align: center;
            margin: 20px 0;
          }
          .action-buttons {
            text-align: center;
            margin: 30px 0;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 5px;
            background-color: #27ae60;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          .btn:hover {
            background-color: #229954;
          }
          .btn-secondary {
            background-color: #6c757d;
          }
          .btn-secondary:hover {
            background-color: #5a6268;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">🎉</div>
            <h1 style="color: #27ae60; margin: 0;">¡BUENAS NOTICIAS!</h1>
            <p style="color: #666; margin: 10px 0 0 0;">${pet.name} ha sido encontrada</p>
          </div>

          <div class="pet-info">
            <h2 style="color: #27ae60; margin-top: 0;">Información de ${pet.name}</h2>
            <p><strong>Especie:</strong> ${pet.species}</p>
            <p><strong>Raza:</strong> ${pet.breed}</p>
            <p><strong>Edad:</strong> ${pet.age} años</p>
            <p><strong>Peso:</strong> ${pet.weight} kg</p>
            <p><strong>Color:</strong> ${pet.color}</p>
            ${pet.description ? `<p><strong>Descripción:</strong> ${pet.description}</p>` : ''}
          </div>

          ${
            petImage
              ? `
          <div class="pet-image">
            <h3>Foto de ${pet.name}</h3>
            ${petImage}
          </div>
          `
              : ''
          }

          <div class="contact-info">
            <h3 style="color: #155724; margin-top: 0;">📞 Datos de Contacto de quien la encontró</h3>
            <p><strong>Nombre:</strong> ${contactInfo.name}</p>
            <p><strong>Teléfono:</strong> <a href="tel:${contactInfo.phone}" style="color: #155724;">${contactInfo.phone}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${contactInfo.email}" style="color: #155724;">${contactInfo.email}</a></p>
          </div>

          <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0c5460; margin-top: 0;">Próximos pasos recomendados:</h3>
            <ul style="color: #0c5460;">
              <li>Contacta inmediatamente a la persona que encontró a ${pet.name}</li>
              <li>Coordina un lugar seguro para el encuentro</li>
              <li>Lleva identificación y documentos de la mascota</li>
              <li>Considera llevar una recompensa como agradecimiento</li>
              <li>Verifica que sea tu mascota antes de llevarla</li>
            </ul>
          </div>

          <div class="action-buttons">
            <a href="tel:${contactInfo.phone}" class="btn">📞 Llamar Ahora</a>
            <a href="mailto:${contactInfo.email}" class="btn btn-secondary">📧 Enviar Email</a>
          </div>

          <div class="footer">
            <p>Este es un mensaje automático del sistema PetSOS</p>
            <p>¡Gracias por usar nuestra plataforma para encontrar a ${pet.name}!</p>
            <p><strong>Fecha del reporte:</strong> ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

# Configuración de Email con Nodemailer

Este sistema utiliza Nodemailer para enviar notificaciones por email cuando se reportan mascotas perdidas o encontradas.

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env`:

```env
# Configuración SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=petsosstg@gmail.com
SMTP_PASS=Petsos2025#

# URLs del sistema
BASE_URL=http://localhost:3000
FRONTEND_URL=https://bparz.github.io

# Email de soporte
SUPPORT_EMAIL=soporte@petsos.com
```

### ⚠️ IMPORTANTE: Configuración para Pruebas

Para las pruebas, usa estas credenciales ya configuradas:
- **Email:** petsosstg@gmail.com
- **Contraseña:** Petsos2025#

## Configuración para Gmail

### 1. Habilitar Autenticación de 2 Factores
1. Ve a tu cuenta de Google
2. Activa la verificación en 2 pasos

### 2. Generar Contraseña de Aplicación
1. Ve a "Seguridad" en tu cuenta de Google
2. Busca "Contraseñas de aplicación"
3. Genera una nueva contraseña para "Correo"
4. Usa esta contraseña en `SMTP_PASS`

### 3. Configuración Recomendada
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

## Otros Proveedores de Email

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
```

## Endpoints Disponibles

### 1. Reportar Mascota Perdida
```
POST /notifications/pet-lost
Authorization: Bearer {token}
Content-Type: application/json

{
  "petId": 1
}
```

### 2. Reportar Mascota Encontrada
```
POST /notifications/pet-found
Authorization: Bearer {token}
Content-Type: application/json

{
  "petId": 1,
  "contactInfo": {
    "name": "Juan Pérez",
    "phone": "+56912345678",
    "email": "juan.perez@email.com"
  }
}
```

## Templates de Email

### Email de Mascota Perdida
- **Asunto:** 🚨 ALERTA: {nombre} ha sido reportada como perdida
- **Contenido:** Información de la mascota, foto, y pasos a seguir
- **Destinatario:** Dueño de la mascota

### Email de Mascota Encontrada
- **Asunto:** 🎉 ¡BUENAS NOTICIAS! {nombre} ha sido encontrada
- **Contenido:** Información de la mascota, datos de contacto de quien la encontró
- **Destinatario:** Dueño de la mascota

## Características de los Templates

### Diseño Responsivo
- Se adapta a dispositivos móviles y de escritorio
- Máximo ancho de 600px para mejor legibilidad

### Elementos Visuales
- Iconos emoji para llamar la atención
- Colores diferenciados (rojo para perdida, verde para encontrada)
- Imagen de la mascota si está disponible

### Información Incluida
- Datos completos de la mascota
- Foto de la mascota (si existe)
- Datos de contacto (en caso de mascota encontrada)
- Pasos recomendados a seguir
- Enlaces de acción directa

### Funcionalidades
- Enlaces clickeables para teléfono y email
- Botones de acción para contactar
- Información de fecha y hora del reporte

## Seguridad

### Autenticación
- Todos los endpoints requieren JWT token válido
- Solo usuarios autenticados pueden enviar notificaciones

### Validación
- Se verifica que la mascota existe
- Se verifica que el dueño existe
- Se valida la información de contacto

### Logs
- Se registran todos los envíos de email
- Se capturan errores para debugging

## Pruebas

### Script de Prueba
```bash
npm run test:email
```

### Verificación Manual
1. Configura las variables de entorno
2. Crea una mascota en el sistema
3. Usa los endpoints para enviar emails de prueba
4. Verifica que los emails lleguen correctamente

## Solución de Problemas

### Error de Autenticación SMTP
- Verifica que `SMTP_USER` y `SMTP_PASS` sean correctos
- Asegúrate de usar contraseña de aplicación para Gmail
- Verifica que la autenticación de 2 factores esté activada

### Emails no llegan
- Revisa la carpeta de spam
- Verifica la configuración del servidor SMTP
- Revisa los logs del servidor

### Error de Puerto
- Puerto 587 para TLS
- Puerto 465 para SSL
- Puerto 25 para conexiones no seguras (no recomendado)

## Notas Importantes

1. **Contraseñas de Aplicación:** Nunca uses tu contraseña principal de Gmail
2. **Límites de Gmail:** 500 emails por día para cuentas gratuitas
3. **Imágenes:** Las imágenes se cargan desde el servidor, asegúrate de que sean accesibles
4. **URLs:** Configura correctamente `BASE_URL` y `FRONTEND_URL` para producción
# Sistema de Autenticación con JWT (Refactorizado)

Este proyecto incluye un sistema completo de autenticación con JWT para registrar usuarios y hacer login, **sin dependencias de Passport**.

## Características

- ✅ Registro de usuarios con validación (solo campos básicos requeridos)
- ✅ Login con JWT personalizado
- ✅ Protección de rutas con guard personalizado
- ✅ Hash de contraseñas con bcrypt
- ✅ Validación de tokens JWT sin Passport
- ✅ Decorador personalizado para obtener usuario actual
- ✅ Actualización de perfil de usuario
- ✅ Campos opcionales que se pueden completar después del registro

## Endpoints Disponibles

### Autenticación

#### POST /auth/register
Registra un nuevo usuario. **Solo requiere campos básicos**.

**Body (campos requeridos):**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Body (con campos opcionales):**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "phoneNumber": "123456789",
  "address": "Calle Principal 123",
  "city": "Madrid",
  "region": "Madrid"
}
```

**Response:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Inicia sesión con un usuario existente.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Gestión de Perfil

#### GET /users/profile/me
Obtiene el perfil del usuario autenticado.

**Header requerido:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phoneNumber": "123456789",
  "address": "Calle Principal 123",
  "city": "Madrid",
  "region": "Madrid",
  "role": "user"
}
```

#### PUT /users/profile/update
Actualiza el perfil del usuario autenticado. Todos los campos son opcionales.

**Header requerido:**
```
Authorization: Bearer <token>
```

**Body (ejemplo):**
```json
{
  "phoneNumber": "987654321",
  "address": "Nueva Dirección 456",
  "city": "Barcelona",
  "region": "Cataluña"
}
```

**Response:**
```json
{
  "id": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phoneNumber": "987654321",
  "address": "Nueva Dirección 456",
  "city": "Barcelona",
  "region": "Cataluña",
  "role": "user"
}
```

### Rutas Protegidas

Las siguientes rutas requieren autenticación (token JWT en el header):

- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener un usuario específico
- `PUT /users/:id` - Actualizar un usuario
- `DELETE /users/:id` - Eliminar un usuario
- `GET /users/profile/me` - Obtener perfil del usuario actual
- `PUT /users/profile/update` - Actualizar perfil del usuario actual

**Header requerido:**
```
Authorization: Bearer <token>
```

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
JWT_SECRET=tu-secreto-super-seguro-aqui
```

### Base de Datos

El sistema usa SQLite por defecto. La base de datos se creará automáticamente en `database.sqlite`.

### CORS (Cross-Origin Resource Sharing)

El backend está configurado para permitir peticiones desde frontends en diferentes orígenes:

- **Desarrollo**: Permite todos los orígenes (`origin: true`)
- **Producción**: Configurar orígenes específicos en `src/main.ts`

**Configuración actual:**
```typescript
app.enableCors({
  origin: true, // Permite todos los orígenes en desarrollo
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Accept, Authorization',
  credentials: true,
});
```

**Para frontend Angular (puerto 4200):**
- ✅ Compatible por defecto
- ✅ Soporte para headers de autorización
- ✅ Soporte para cookies y credenciales

## Instalación y Uso

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor:
```bash
npm run start:dev
```

3. El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto (Refactorizada)

```
src/
├── auth/
│   ├── auth.controller.ts      # Controlador de autenticación
│   ├── auth.service.ts         # Servicio de autenticación (sin Passport)
│   ├── auth.module.ts          # Módulo de autenticación simplificado
│   ├── guards/
│   │   └── jwt-auth.guard.ts   # Guard JWT personalizado
│   └── decorators/
│       └── current-user.decorator.ts # Decorador para usuario actual
├── users/
│   ├── dto/
│   │   ├── register-user.dto.ts # DTO para registro (campos básicos)
│   │   ├── update-profile.dto.ts # DTO para actualizar perfil
│   │   └── login-user.dto.ts    # DTO para login
│   ├── user.entity.ts           # Entidad de usuario (campos opcionales)
│   ├── users.controller.ts      # Controlador de usuarios
│   ├── users.service.ts         # Servicio de usuarios
│   └── users.module.ts          # Módulo de usuarios
└── app.module.ts                # Módulo principal
```

## Seguridad

- Las contraseñas se hashean automáticamente con bcrypt
- Los tokens JWT expiran en 24 horas
- Las rutas sensibles están protegidas con guard personalizado
- Validación de datos con class-validator
- **Sin dependencias de Passport** - implementación más ligera

## Diferencias con la Versión Anterior

### ❌ Eliminado:
- `@nestjs/passport`
- `passport-jwt`
- `passport-local`
- `JwtStrategy` de Passport
- `PassportModule`

### ✅ Nuevo:
- Guard JWT personalizado
- Validación de tokens sin Passport
- Decorador `@CurrentUser()` personalizado
- Implementación más simple y directa
- Registro simplificado (solo campos básicos)
- Endpoints para gestión de perfil

## Ejemplo de Uso con cURL

### Registro (campos básicos)
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "María",
    "lastName": "García",
    "email": "maria@example.com",
    "password": "password123"
  }'
```

### Registro (con campos adicionales)
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "María",
    "lastName": "García",
    "email": "maria@example.com",
    "password": "password123",
    "phoneNumber": "987654321",
    "address": "Avenida Central 456",
    "city": "Barcelona",
    "region": "Cataluña"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "password123"
  }'
```

### Obtener perfil
```bash
curl -X GET http://localhost:3000/users/profile/me \
  -H "Authorization: Bearer <token-obtenido-del-login>"
```

### Actualizar perfil
```bash
curl -X PUT http://localhost:3000/users/profile/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token-obtenido-del-login>" \
  -d '{
    "phoneNumber": "123456789",
    "address": "Nueva Dirección 123",
    "city": "Valencia",
    "region": "Comunidad Valenciana"
  }'
```

### Acceso a ruta protegida
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <token-obtenido-del-login>"
```
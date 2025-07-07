# Configuración de CORS

## 🎯 Problema Solucionado

El error de CORS (Cross-Origin Resource Sharing) se produce cuando el frontend intenta hacer peticiones al backend desde un origen diferente.

**Error típico:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/auth/register'
from origin 'http://localhost:4200' has been blocked by CORS policy
```

## ✅ Solución Implementada

### Configuración en `src/main.ts`

```typescript
app.enableCors({
  origin: true, // Permite todos los orígenes en desarrollo
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Accept, Authorization',
  credentials: true,
});
```

### Configuración para Producción

Para producción, es recomendable especificar orígenes específicos:

```typescript
app.enableCors({
  origin: [
    'https://tu-dominio.com',
    'https://www.tu-dominio.com',
    'http://localhost:4200', // Solo para desarrollo
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Accept, Authorization',
  credentials: true,
});
```

## 🔧 Configuración por Entorno

### Desarrollo
```typescript
// Permitir todos los orígenes
origin: true
```

### Producción
```typescript
// Solo orígenes específicos
origin: ['https://tu-dominio.com']
```

### Variables de Entorno
```typescript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://tu-dominio.com']
  : true;

app.enableCors({
  origin: allowedOrigins,
  // ... resto de configuración
});
```

## 📋 Headers Permitidos

- `Content-Type`: Para JSON, form-data, etc.
- `Accept`: Para especificar tipos de respuesta esperados
- `Authorization`: Para tokens JWT y autenticación

## 🔐 Credentials

`credentials: true` permite:
- Cookies de sesión
- Headers de autenticación
- Tokens JWT en headers

## 🚀 Métodos HTTP Permitidos

- `GET`: Obtener datos
- `POST`: Crear recursos
- `PUT`: Actualizar recursos completos
- `PATCH`: Actualizar recursos parciales
- `DELETE`: Eliminar recursos
- `OPTIONS`: Preflight requests (requerido por CORS)

## 🧪 Pruebas

### Con cURL
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:4200" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@test.com",
    "password": "password123"
  }'
```

### Con Frontend
```javascript
fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Para cookies
  body: JSON.stringify({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@test.com',
    password: 'password123'
  })
});
```

## ⚠️ Consideraciones de Seguridad

1. **En desarrollo**: `origin: true` es aceptable
2. **En producción**: Siempre especificar orígenes exactos
3. **Headers**: Solo permitir los headers necesarios
4. **Métodos**: Solo permitir los métodos HTTP necesarios

## 🔍 Troubleshooting

### Error: "No 'Access-Control-Allow-Origin' header"
- Verificar que CORS esté habilitado
- Revisar configuración de `origin`

### Error: "Method not allowed"
- Verificar que el método HTTP esté en la lista de `methods`

### Error: "Header not allowed"
- Verificar que el header esté en `allowedHeaders`

### Error con Credentials
- Asegurar que `credentials: true` esté configurado
- En frontend, usar `credentials: 'include'`
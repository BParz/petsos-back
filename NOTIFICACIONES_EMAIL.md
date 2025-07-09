# Endpoints de Notificaciones por Correo

Estos endpoints permiten enviar notificaciones por email relacionadas con mascotas perdidas o encontradas.

---

## 1. Notificar última ubicación conocida de mascota perdida

- **URL:** `/notifications/pet-lost`
- **Método:** `POST`
- **Autenticación:** No requiere autenticación

### Body (JSON):
```
{
  "petId": 123,
  "latitude": 40.4168,
  "longitude": -3.7038
}
```

### Headers:
```
Content-Type: application/json
```

### Respuesta exitosa:
```
{
  "message": "Email de mascota perdida enviado exitosamente",
  "petId": 123,
  "location": {
    "latitude": 40.4168,
    "longitude": -3.7038
  }
}
```

### Ejemplo con curl:
```
curl -X POST http://localhost:3000/notifications/pet-lost \
  -H "Content-Type: application/json" \
  -d '{
    "petId": 123,
    "latitude": 40.4168,
    "longitude": -3.7038
  }'
```

---

## 2. Notificar datos de contacto de quien encontró una mascota

- **URL:** `/notifications/pet-found`
- **Método:** `POST`
- **Autenticación:** No requiere autenticación

### Body (JSON):
```
{
  "petId": 123,
  "contactInfo": {
    "name": "Juan Pérez",
    "phone": "+34123456789",
    "email": "juan@email.com"
  },
  "latitude": 40.4168,
  "longitude": -3.7038
}
```

### Headers:
```
Content-Type: application/json
```

### Respuesta exitosa:
```
{
  "message": "Email de mascota encontrada enviado exitosamente",
  "petId": 123,
  "contactInfo": {
    "name": "Juan Pérez",
    "phone": "+34123456789",
    "email": "juan@email.com"
  },
  "location": {
    "latitude": 40.4168,
    "longitude": -3.7038
  }
}
```

### Ejemplo con curl:
```
curl -X POST http://localhost:3000/notifications/pet-found \
  -H "Content-Type: application/json" \
  -d '{
    "petId": 123,
    "contactInfo": {
      "name": "Juan Pérez",
      "phone": "+34123456789",
      "email": "juan@email.com"
    },
    "latitude": 40.4168,
    "longitude": -3.7038
  }'
```

---

## Notas
- Ambos endpoints NO requieren autenticación JWT.
- El campo `petId` debe ser el ID de la mascota registrada en el sistema.
- El campo `contactInfo` es obligatorio solo para `/pet-found` y debe incluir nombre, teléfono y email de contacto.
- Los campos `latitude` y `longitude` son opcionales y se usan para mostrar la ubicación en Google Maps.
- Si se proporcionan coordenadas, se incluirá un enlace directo a Google Maps en el email.
- Las respuestas de error incluirán un mensaje descriptivo en caso de fallo.
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
  "petId": 123
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
  "petId": 123
}
```

### Ejemplo con curl:
```
curl -X POST http://localhost:3000/notifications/pet-lost \
  -H "Content-Type: application/json" \
  -d '{"petId": 123}'
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
  }
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
    }
  }'
```

---

## Notas
- Ambos endpoints NO requieren autenticación JWT.
- El campo `petId` debe ser el ID de la mascota registrada en el sistema.
- El campo `contactInfo` es obligatorio solo para `/pet-found` y debe incluir nombre, teléfono y email de contacto.
- Las respuestas de error incluirán un mensaje descriptivo en caso de fallo.
# Subida de Imágenes de Mascotas

Esta funcionalidad permite subir y gestionar imágenes para las mascotas en el sistema.

## Características

- ✅ Subida de imágenes al crear una mascota
- ✅ Actualización de imágenes al editar una mascota
- ✅ Validación de tipos de archivo (solo JPG, JPEG, PNG, GIF)
- ✅ Límite de tamaño de archivo (5MB máximo)
- ✅ Nombres únicos para evitar conflictos
- ✅ Servir imágenes estáticas desde el servidor

## Endpoints

### Crear mascota con imagen
```
POST /pets
Content-Type: multipart/form-data

FormData:
- name: string (requerido)
- species: string (requerido)
- breed: string (requerido)
- age: number (requerido)
- weight: number (requerido)
- color: string (requerido)
- description: string (opcional)
- image: file (opcional) - Solo JPG, JPEG, PNG, GIF, máximo 5MB
```

### Actualizar mascota con imagen
```
PUT /pets/:id
Content-Type: multipart/form-data

FormData:
- name: string (opcional)
- species: string (opcional)
- breed: string (opcional)
- age: number (opcional)
- weight: number (opcional)
- color: string (opcional)
- description: string (opcional)
- image: file (opcional) - Solo JPG, JPEG, PNG, GIF, máximo 5MB
```

### Obtener imagen de mascota
```
GET /pets/:id/image
```

### Acceder a la imagen directamente
```
GET /uploads/pets/{filename}
```

### Obtener todas las mascotas
```
GET /pets
```
**Respuesta incluye:** `imageUrl` para cada mascota (null si no tiene imagen)

### Obtener mascotas por usuario
```
GET /pets?userId={userId}
```
**Respuesta incluye:** `imageUrl` para cada mascota (null si no tiene imagen)

### Obtener mis mascotas (autenticado)
```
GET /pets/my-pets
Authorization: Bearer {token}
```
**Respuesta incluye:** `imageUrl` para cada mascota (null si no tiene imagen)

### Obtener mascota específica
```
GET /pets/{id}
```
**Respuesta incluye:** `imageUrl` (null si no tiene imagen)

### Actualizar mascota con imagen

## Ejemplo de uso con JavaScript/Fetch

### Crear mascota con imagen
```javascript
const formData = new FormData();
formData.append('name', 'Luna');
formData.append('species', 'Perro');
formData.append('breed', 'Golden Retriever');
formData.append('age', '3');
formData.append('weight', '25');
formData.append('color', 'Dorado');
formData.append('description', 'Muy cariñosa y juguetona');

// Agregar imagen (opcional)
const imageFile = document.getElementById('imageInput').files[0];
if (imageFile) {
  formData.append('image', imageFile);
}

const response = await fetch('/pets', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
});

const pet = await response.json();
console.log('Mascota creada:', pet);
```

### Actualizar mascota con nueva imagen
```javascript
const formData = new FormData();
formData.append('name', 'Luna Actualizada');
formData.append('age', '4');

// Agregar nueva imagen (opcional)
const newImageFile = document.getElementById('newImageInput').files[0];
if (newImageFile) {
  formData.append('image', newImageFile);
}

const response = await fetch('/pets/1', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
});

const updatedPet = await response.json();
console.log('Mascota actualizada:', updatedPet);
```

## Estructura de archivos

```
uploads/
└── pets/
    ├── abc123def456.jpg
    ├── xyz789ghi012.png
    └── ...
```

## Validaciones

- **Tipos de archivo permitidos**: JPG, JPEG, PNG, GIF
- **MIME types permitidos**: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`
- **Extensiones permitidas**: `.jpg`, `.jpeg`, `.png`, `.gif`
- **Tamaño máximo**: 5MB
- **Formato de nombre**: Generado automáticamente con hash único + extensión original
- **Ubicación**: `/uploads/pets/` en el servidor
- **Validación doble**: Se valida tanto el MIME type como la extensión del archivo

## Respuesta del servidor

### Mascota con imagen
```json
{
  "id": 1,
  "name": "Luna",
  "species": "Perro",
  "breed": "Golden Retriever",
  "age": 3,
  "weight": 25,
  "color": "Dorado",
  "description": "Muy cariñosa y juguetona",
  "imageUrl": "/uploads/pets/abc123def456.jpg",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "userId": 1
}
```

### Mascota sin imagen
```json
{
  "id": 2,
  "name": "Max",
  "species": "Gato",
  "breed": "Siamés",
  "age": 2,
  "weight": 4,
  "color": "Blanco y marrón",
  "description": null,
  "imageUrl": null,
  "isActive": true,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z",
  "userId": 1
}
```

### Lista de mascotas (con y sin imágenes)
```json
[
  {
    "id": 1,
    "name": "Luna",
    "species": "Perro",
    "breed": "Golden Retriever",
    "age": 3,
    "weight": 25,
    "color": "Dorado",
    "description": "Muy cariñosa",
    "imageUrl": "/uploads/pets/abc123def456.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "userId": 1
  },
  {
    "id": 2,
    "name": "Max",
    "species": "Gato",
    "breed": "Siamés",
    "age": 2,
    "weight": 4,
    "color": "Blanco y marrón",
    "description": null,
    "imageUrl": null,
    "isActive": true,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "userId": 1
  }
]
```

## Notas importantes

1. **Autenticación requerida**: Todos los endpoints requieren JWT token válido
2. **Permisos**: Solo puedes subir/actualizar imágenes de tus propias mascotas
3. **Imágenes opcionales**: No es obligatorio subir una imagen
4. **Sobrescritura**: Al actualizar con una nueva imagen, la anterior se reemplaza
5. **Persistencia**: Las imágenes se guardan en el sistema de archivos del servidor
6. **URLs relativas**: Las URLs de las imágenes son relativas al servidor
7. **Conversión automática**: Los valores numéricos se convierten automáticamente de strings a números

## Conversión automática de tipos

Cuando usas `FormData` (multipart/form-data), todos los valores se envían como strings. El backend automáticamente convierte los valores numéricos usando `class-transformer`:

```typescript
// En el DTO
@Type(() => Number)
@IsNumber()
@Min(0)
@Max(30)
age: number;

@Type(() => Number)
@IsNumber()
@Min(0.1)
@Max(200)
weight: number;
```

Esto significa que puedes enviar:
- `age: "10"` → se convierte a `age: 10`
- `weight: "5.5"` → se convierte a `weight: 5.5`

## Manejo de errores

### Archivo no válido
```json
{
  "statusCode": 400,
  "message": "Tipo de archivo no válido. Tipos permitidos: image/jpeg, image/jpg, image/png, image/gif",
  "error": "Bad Request"
}
```

### Extensión de archivo no válida
```json
{
  "statusCode": 400,
  "message": "Extensión de archivo no válida. Extensiones permitidas: .jpg, .jpeg, .png, .gif",
  "error": "Bad Request"
}
```

### Archivo muy grande
```json
{
  "statusCode": 400,
  "message": "File too large",
  "error": "Bad Request"
}
```

### Mascota sin imagen
```json
{
  "statusCode": 400,
  "message": "Esta mascota no tiene imagen",
  "error": "Bad Request"
}
```
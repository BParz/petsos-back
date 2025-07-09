require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Función para crear una imagen de prueba
function createTestImage() {
    const testImagePath = path.join(__dirname, 'test-image.jpg');

    // Crear una imagen JPEG simple de 1x1 píxel
    const jpegHeader = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
        0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
        0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
        0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00,
        0xFF, 0xD9
    ]);

    fs.writeFileSync(testImagePath, jpegHeader);
    return testImagePath;
}

async function testImageUpload() {
    try {
        console.log('🚀 Iniciando pruebas de subida de imágenes...\n');

            // 1. Registrar un usuario para obtener token
    console.log('1. Registrando usuario...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'testimage@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

        const token = registerResponse.data.token;
        console.log('✅ Usuario registrado y token obtenido\n');

        // 2. Crear una imagen de prueba
        console.log('2. Creando imagen de prueba...');
        const testImagePath = createTestImage();
        console.log('✅ Imagen de prueba creada\n');

        // 3. Crear mascota con imagen
        console.log('3. Creando mascota con imagen...');
        const formData = new FormData();
        formData.append('name', 'Luna Test');
        formData.append('species', 'Perro');
        formData.append('breed', 'Golden Retriever');
        formData.append('age', '3');
        formData.append('weight', '25');
        formData.append('color', 'Dorado');
        formData.append('description', 'Mascota de prueba con imagen');
        formData.append('image', fs.createReadStream(testImagePath));

        const createResponse = await axios.post(`${BASE_URL}/pets`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });

        const pet = createResponse.data;
        console.log('✅ Mascota creada con imagen:', {
            id: pet.id,
            name: pet.name,
            imageUrl: pet.imageUrl
        });

        // 4. Verificar que la imagen se puede acceder
        console.log('\n4. Verificando acceso a la imagen...');
        const imageResponse = await axios.get(`${BASE_URL}${pet.imageUrl}`);
        console.log('✅ Imagen accesible, tamaño:', imageResponse.data.length, 'bytes');

        // 5. Obtener información de la imagen de la mascota
        console.log('\n5. Obteniendo información de imagen de mascota...');
        const imageInfoResponse = await axios.get(`${BASE_URL}/pets/${pet.id}/image`);
        console.log('✅ Información de imagen:', imageInfoResponse.data);

        // 6. Actualizar mascota con nueva imagen
        console.log('\n6. Actualizando mascota con nueva imagen...');
        const updateFormData = new FormData();
        updateFormData.append('name', 'Luna Test Actualizada');
        updateFormData.append('age', '4');
        updateFormData.append('image', fs.createReadStream(testImagePath));

        const updateResponse = await axios.put(`${BASE_URL}/pets/${pet.id}`, updateFormData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...updateFormData.getHeaders()
            }
        });

        const updatedPet = updateResponse.data;
        console.log('✅ Mascota actualizada:', {
            id: updatedPet.id,
            name: updatedPet.name,
            imageUrl: updatedPet.imageUrl
        });

        // 7. Probar crear mascota sin imagen
        console.log('\n7. Creando mascota sin imagen...');
        const petWithoutImageResponse = await axios.post(`${BASE_URL}/pets`, {
            name: 'Max Test',
            species: 'Gato',
            breed: 'Siamés',
            age: 2,
            weight: 4,
            color: 'Blanco y marrón',
            description: 'Mascota de prueba sin imagen'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const petWithoutImage = petWithoutImageResponse.data;
        console.log('✅ Mascota sin imagen creada:', {
            id: petWithoutImage.id,
            name: petWithoutImage.name,
            imageUrl: petWithoutImage.imageUrl
        });

        // 8. Probar obtener imagen de mascota sin imagen
        console.log('\n8. Probando obtener imagen de mascota sin imagen...');
        try {
            await axios.get(`${BASE_URL}/pets/${petWithoutImage.id}/image`);
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correcto: Error al intentar obtener imagen de mascota sin imagen');
            } else {
                throw error;
            }
        }

        // Limpiar archivo de prueba
        fs.unlinkSync(testImagePath);
        console.log('\n🧹 Archivo de prueba eliminado');

        console.log('\n🎉 ¡Todas las pruebas de subida de imágenes pasaron exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('- ✅ Crear mascota con imagen');
        console.log('- ✅ Acceder a imagen subida');
        console.log('- ✅ Obtener información de imagen');
        console.log('- ✅ Actualizar mascota con nueva imagen');
        console.log('- ✅ Crear mascota sin imagen');
        console.log('- ✅ Manejo de errores para mascotas sin imagen');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.response?.data || error.message);

        // Limpiar archivo de prueba si existe
        const testImagePath = path.join(__dirname, 'test-image.jpg');
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }

        process.exit(1);
    }
}

// Ejecutar las pruebas
testImageUpload();
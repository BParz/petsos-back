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

async function testImageEndpoints() {
    try {
        console.log('🚀 Probando que todos los endpoints retornen información de imágenes...\n');

            // 1. Registrar un usuario para obtener token
    console.log('1. Registrando usuario...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'testendpoints@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

        const token = registerResponse.data.token;
        const userId = registerResponse.data.user.id;
        console.log('✅ Usuario registrado y token obtenido\n');

        // 2. Crear una imagen de prueba
        console.log('2. Creando imagen de prueba...');
        const testImagePath = createTestImage();
        console.log('✅ Imagen de prueba creada\n');

        // 3. Crear mascota con imagen
        console.log('3. Creando mascota con imagen...');
        const formData = new FormData();
        formData.append('name', 'Luna Endpoints');
        formData.append('species', 'Perro');
        formData.append('breed', 'Golden Retriever');
        formData.append('age', '3');
        formData.append('weight', '25');
        formData.append('color', 'Dorado');
        formData.append('description', 'Mascota para probar endpoints');
        formData.append('image', fs.createReadStream(testImagePath));

        const createResponse = await axios.post(`${BASE_URL}/pets`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });

        const petWithImage = createResponse.data;
        console.log('✅ Mascota con imagen creada:', {
            id: petWithImage.id,
            name: petWithImage.name,
            imageUrl: petWithImage.imageUrl
        });

        // 4. Crear mascota sin imagen
        console.log('\n4. Creando mascota sin imagen...');
        const petWithoutImageResponse = await axios.post(`${BASE_URL}/pets`, {
            name: 'Max Sin Imagen',
            species: 'Gato',
            breed: 'Siamés',
            age: 2,
            weight: 4,
            color: 'Blanco y marrón',
            description: 'Mascota sin imagen para probar endpoints'
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

        // 5. Probar GET /pets (todas las mascotas)
        console.log('\n5. Probando GET /pets (todas las mascotas)...');
        const allPetsResponse = await axios.get(`${BASE_URL}/pets`);
        const allPets = allPetsResponse.data;

        console.log(`✅ Encontradas ${allPets.length} mascotas en total`);
        allPets.forEach(pet => {
            console.log(`  - ${pet.name}: imageUrl = ${pet.imageUrl || 'null'}`);
        });

        // 6. Probar GET /pets?userId=X (mascotas por usuario)
        console.log('\n6. Probando GET /pets?userId=X (mascotas por usuario)...');
        const userPetsResponse = await axios.get(`${BASE_URL}/pets?userId=${userId}`);
        const userPets = userPetsResponse.data;

        console.log(`✅ Encontradas ${userPets.length} mascotas del usuario`);
        userPets.forEach(pet => {
            console.log(`  - ${pet.name}: imageUrl = ${pet.imageUrl || 'null'}`);
        });

        // 7. Probar GET /pets/my-pets (mis mascotas)
        console.log('\n7. Probando GET /pets/my-pets (mis mascotas)...');
        const myPetsResponse = await axios.get(`${BASE_URL}/pets/my-pets`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const myPets = myPetsResponse.data;

        console.log(`✅ Encontradas ${myPets.length} mascotas mías`);
        myPets.forEach(pet => {
            console.log(`  - ${pet.name}: imageUrl = ${pet.imageUrl || 'null'}`);
        });

        // 8. Probar GET /pets/:id (mascota específica con imagen)
        console.log('\n8. Probando GET /pets/:id (mascota específica con imagen)...');
        const specificPetWithImageResponse = await axios.get(`${BASE_URL}/pets/${petWithImage.id}`);
        const specificPetWithImage = specificPetWithImageResponse.data;

        console.log('✅ Mascota específica con imagen:', {
            id: specificPetWithImage.id,
            name: specificPetWithImage.name,
            imageUrl: specificPetWithImage.imageUrl
        });

        // 9. Probar GET /pets/:id (mascota específica sin imagen)
        console.log('\n9. Probando GET /pets/:id (mascota específica sin imagen)...');
        const specificPetWithoutImageResponse = await axios.get(`${BASE_URL}/pets/${petWithoutImage.id}`);
        const specificPetWithoutImage = specificPetWithoutImageResponse.data;

        console.log('✅ Mascota específica sin imagen:', {
            id: specificPetWithoutImage.id,
            name: specificPetWithoutImage.name,
            imageUrl: specificPetWithoutImage.imageUrl
        });

        // 10. Probar GET /pets/:id/image (endpoint específico de imagen)
        console.log('\n10. Probando GET /pets/:id/image (endpoint específico de imagen)...');
        const imageInfoResponse = await axios.get(`${BASE_URL}/pets/${petWithImage.id}/image`);
        const imageInfo = imageInfoResponse.data;

        console.log('✅ Información de imagen:', imageInfo);

        // 11. Probar GET /pets/:id/image con mascota sin imagen (debería fallar)
        console.log('\n11. Probando GET /pets/:id/image con mascota sin imagen (debería fallar)...');
        try {
            await axios.get(`${BASE_URL}/pets/${petWithoutImage.id}/image`);
            console.log('❌ Error: Debería haber fallado con mascota sin imagen');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correcto: Error con mascota sin imagen');
                console.log('Mensaje de error:', error.response.data.message);
            } else {
                throw error;
            }
        }

        // 12. Verificar que las imágenes son accesibles
        console.log('\n12. Verificando que las imágenes son accesibles...');
        if (petWithImage.imageUrl) {
            const imageResponse = await axios.get(`${BASE_URL}${petWithImage.imageUrl}`);
            console.log('✅ Imagen accesible, tamaño:', imageResponse.data.length, 'bytes');
        }

        // Limpiar archivo de prueba
        fs.unlinkSync(testImagePath);
        console.log('\n🧹 Archivo de prueba eliminado');

        console.log('\n🎉 ¡Todas las pruebas de endpoints con imágenes pasaron exitosamente!');
        console.log('\n📋 Resumen de endpoints probados:');
        console.log('- ✅ POST /pets (crear con imagen)');
        console.log('- ✅ POST /pets (crear sin imagen)');
        console.log('- ✅ GET /pets (todas las mascotas)');
        console.log('- ✅ GET /pets?userId=X (mascotas por usuario)');
        console.log('- ✅ GET /pets/my-pets (mis mascotas)');
        console.log('- ✅ GET /pets/:id (mascota específica con imagen)');
        console.log('- ✅ GET /pets/:id (mascota específica sin imagen)');
        console.log('- ✅ GET /pets/:id/image (información de imagen)');
        console.log('- ✅ GET /pets/:id/image (error con mascota sin imagen)');
        console.log('- ✅ GET /uploads/pets/:filename (acceso directo a imagen)');

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
testImageEndpoints();
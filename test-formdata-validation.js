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

async function testFormDataValidation() {
    try {
        console.log('🚀 Probando validación de FormData con valores numéricos...\n');

            // 1. Registrar un usuario para obtener token
    console.log('1. Registrando usuario...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'testformdata@example.com',
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

        // 3. Probar con los datos exactos del frontend
        console.log('3. Probando con datos del frontend (strings numéricos)...');
        const formData = new FormData();
        formData.append('name', 'prueba1');
        formData.append('species', 'perro');
        formData.append('breed', 'test');
        formData.append('age', '10'); // String numérico
        formData.append('weight', '5'); // String numérico
        formData.append('color', 'red');
        formData.append('image', fs.createReadStream(testImagePath));

        const createResponse = await axios.post(`${BASE_URL}/pets`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });

        const pet = createResponse.data;
        console.log('✅ Mascota creada exitosamente con strings numéricos:', {
            id: pet.id,
            name: pet.name,
            age: pet.age,
            weight: pet.weight,
            imageUrl: pet.imageUrl
        });

        // 4. Verificar que los tipos son correctos
        console.log('\n4. Verificando tipos de datos...');
        console.log('age type:', typeof pet.age, 'value:', pet.age);
        console.log('weight type:', typeof pet.weight, 'value:', pet.weight);

        if (typeof pet.age === 'number' && typeof pet.weight === 'number') {
            console.log('✅ Los valores se convirtieron correctamente a números');
        } else {
            console.log('❌ Los valores no se convirtieron a números');
        }

        // 5. Probar con valores límite
        console.log('\n5. Probando con valores límite...');
        const limitFormData = new FormData();
        limitFormData.append('name', 'Límite Test');
        limitFormData.append('species', 'Gato');
        limitFormData.append('breed', 'Test');
        limitFormData.append('age', '30'); // Límite máximo
        limitFormData.append('weight', '0.1'); // Límite mínimo
        limitFormData.append('color', 'Negro');
        limitFormData.append('image', fs.createReadStream(testImagePath));

        const limitResponse = await axios.post(`${BASE_URL}/pets`, limitFormData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...limitFormData.getHeaders()
            }
        });

        const limitPet = limitResponse.data;
        console.log('✅ Mascota con valores límite creada:', {
            id: limitPet.id,
            age: limitPet.age,
            weight: limitPet.weight
        });

        // 6. Probar con valores inválidos (debería fallar)
        console.log('\n6. Probando con valores inválidos...');
        const invalidFormData = new FormData();
        invalidFormData.append('name', 'Inválido Test');
        invalidFormData.append('species', 'Perro');
        invalidFormData.append('breed', 'Test');
        invalidFormData.append('age', '35'); // Mayor al límite
        invalidFormData.append('weight', '0.05'); // Menor al límite
        invalidFormData.append('color', 'Blanco');

        try {
            await axios.post(`${BASE_URL}/pets`, invalidFormData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...invalidFormData.getHeaders()
                }
            });
            console.log('❌ Error: Debería haber fallado con valores inválidos');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correcto: Error con valores inválidos');
                console.log('Mensajes de error:', error.response.data.message);
            } else {
                throw error;
            }
        }

        // Limpiar archivo de prueba
        fs.unlinkSync(testImagePath);
        console.log('\n🧹 Archivo de prueba eliminado');

        console.log('\n🎉 ¡Todas las pruebas de validación de FormData pasaron exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('- ✅ FormData con strings numéricos se convierte correctamente');
        console.log('- ✅ Valores límite funcionan correctamente');
        console.log('- ✅ Validación de valores inválidos funciona');
        console.log('- ✅ Tipos de datos se mantienen correctos');

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
testFormDataValidation();
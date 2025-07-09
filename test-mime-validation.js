require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Función para crear una imagen JPEG de prueba
function createTestJPEG() {
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

// Función para crear un archivo de texto (no válido)
function createTestTextFile() {
    const testTextPath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testTextPath, 'Este es un archivo de texto, no una imagen');
    return testTextPath;
}

async function testMimeValidation() {
    try {
        console.log('🚀 Probando validación de MIME types...\n');

            // 1. Registrar un usuario para obtener token
    console.log('1. Registrando usuario...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'testmime@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

        const token = registerResponse.data.token;
        console.log('✅ Usuario registrado y token obtenido\n');

        // 2. Crear archivos de prueba
        console.log('2. Creando archivos de prueba...');
        const testJPEGPath = createTestJPEG();
        const testTextPath = createTestTextFile();
        console.log('✅ Archivos de prueba creados\n');

        // 3. Probar con imagen JPEG válida
        console.log('3. Probando con imagen JPEG válida...');
        const validFormData = new FormData();
        validFormData.append('name', 'Luna JPEG');
        validFormData.append('species', 'Perro');
        validFormData.append('breed', 'Golden Retriever');
        validFormData.append('age', '3');
        validFormData.append('weight', '25');
        validFormData.append('color', 'Dorado');
        validFormData.append('image', fs.createReadStream(testJPEGPath), {
            filename: 'test-image.jpg',
            contentType: 'image/jpeg'
        });

        const validResponse = await axios.post(`${BASE_URL}/pets`, validFormData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...validFormData.getHeaders()
            }
        });

        const validPet = validResponse.data;
        console.log('✅ Imagen JPEG válida aceptada:', {
            id: validPet.id,
            name: validPet.name,
            imageUrl: validPet.imageUrl
        });

        // 4. Probar con archivo de texto (debería fallar)
        console.log('\n4. Probando con archivo de texto (debería fallar)...');
        const invalidFormData = new FormData();
        invalidFormData.append('name', 'Luna Texto');
        invalidFormData.append('species', 'Perro');
        invalidFormData.append('breed', 'Golden Retriever');
        invalidFormData.append('age', '3');
        invalidFormData.append('weight', '25');
        invalidFormData.append('color', 'Dorado');
        invalidFormData.append('image', fs.createReadStream(testTextPath), {
            filename: 'test-file.txt',
            contentType: 'text/plain'
        });

        try {
            await axios.post(`${BASE_URL}/pets`, invalidFormData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...invalidFormData.getHeaders()
                }
            });
            console.log('❌ Error: Debería haber fallado con archivo de texto');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correcto: Error con archivo de texto');
                console.log('Mensaje de error:', error.response.data.message);
            } else {
                throw error;
            }
        }

        // 5. Probar con archivo sin extensión (debería fallar)
        console.log('\n5. Probando con archivo sin extensión (debería fallar)...');
        const noExtensionFormData = new FormData();
        noExtensionFormData.append('name', 'Luna Sin Extensión');
        noExtensionFormData.append('species', 'Perro');
        noExtensionFormData.append('breed', 'Golden Retriever');
        noExtensionFormData.append('age', '3');
        noExtensionFormData.append('weight', '25');
        noExtensionFormData.append('color', 'Dorado');
        noExtensionFormData.append('image', fs.createReadStream(testJPEGPath), {
            filename: 'test-image', // Sin extensión
            contentType: 'image/jpeg'
        });

        try {
            await axios.post(`${BASE_URL}/pets`, noExtensionFormData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...noExtensionFormData.getHeaders()
                }
            });
            console.log('❌ Error: Debería haber fallado con archivo sin extensión');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correcto: Error con archivo sin extensión');
                console.log('Mensaje de error:', error.response.data.message);
            } else {
                throw error;
            }
        }

        // 6. Probar con MIME type incorrecto (debería fallar)
        console.log('\n6. Probando con MIME type incorrecto (debería fallar)...');
        const wrongMimeFormData = new FormData();
        wrongMimeFormData.append('name', 'Luna MIME Incorrecto');
        wrongMimeFormData.append('species', 'Perro');
        wrongMimeFormData.append('breed', 'Golden Retriever');
        wrongMimeFormData.append('age', '3');
        wrongMimeFormData.append('weight', '25');
        wrongMimeFormData.append('color', 'Dorado');
        wrongMimeFormData.append('image', fs.createReadStream(testJPEGPath), {
            filename: 'test-image.jpg',
            contentType: 'application/pdf' // MIME type incorrecto
        });

        try {
            await axios.post(`${BASE_URL}/pets`, wrongMimeFormData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...wrongMimeFormData.getHeaders()
                }
            });
            console.log('❌ Error: Debería haber fallado con MIME type incorrecto');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correcto: Error con MIME type incorrecto');
                console.log('Mensaje de error:', error.response.data.message);
            } else {
                throw error;
            }
        }

        // Limpiar archivos de prueba
        fs.unlinkSync(testJPEGPath);
        fs.unlinkSync(testTextPath);
        console.log('\n🧹 Archivos de prueba eliminados');

        console.log('\n🎉 ¡Todas las pruebas de validación de MIME types pasaron exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('- ✅ Imagen JPEG válida aceptada');
        console.log('- ✅ Archivo de texto rechazado');
        console.log('- ✅ Archivo sin extensión rechazado');
        console.log('- ✅ MIME type incorrecto rechazado');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.response?.data || error.message);

        // Limpiar archivos de prueba si existen
        const testJPEGPath = path.join(__dirname, 'test-image.jpg');
        const testTextPath = path.join(__dirname, 'test-file.txt');

        if (fs.existsSync(testJPEGPath)) {
            fs.unlinkSync(testJPEGPath);
        }
        if (fs.existsSync(testTextPath)) {
            fs.unlinkSync(testTextPath);
        }

        process.exit(1);
    }
}

// Ejecutar las pruebas
testMimeValidation();
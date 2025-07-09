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

async function testEmailNotifications() {
  try {
    console.log('🚀 Probando sistema de notificaciones por email...\n');

    // Verificar configuración de email
    console.log('1. Verificando configuración de email...');
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('⚠️  Advertencia: Variables SMTP_USER y SMTP_PASS no configuradas');
      console.log('   Los emails no se enviarán, pero se probará la funcionalidad\n');
    } else {
      console.log('✅ Configuración de email detectada\n');
    }

    // 1. Registrar un usuario para obtener token
    console.log('2. Registrando usuario...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'testemail@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

            const token = registerResponse.data.token;
    console.log('✅ Usuario registrado y token obtenido\n');

    // 2. Crear una imagen de prueba
    console.log('3. Creando imagen de prueba...');
    const testImagePath = createTestImage();
    console.log('✅ Imagen de prueba creada\n');

    // 3. Crear mascota con imagen
    console.log('4. Creando mascota con imagen...');
    const formData = new FormData();
    formData.append('name', 'Luna Email Test');
    formData.append('species', 'Perro');
    formData.append('breed', 'Golden Retriever');
    formData.append('age', '3');
    formData.append('weight', '25');
    formData.append('color', 'Dorado');
    formData.append('description', 'Mascota para probar emails');
    formData.append('image', fs.createReadStream(testImagePath));

    const createResponse = await axios.post(`${BASE_URL}/pets`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });

    const pet = createResponse.data;
    console.log('✅ Mascota creada:', {
      id: pet.id,
      name: pet.name,
      imageUrl: pet.imageUrl
    });

    // 4. Probar endpoint de mascota perdida
    console.log('\n5. Probando endpoint de mascota perdida...');
    try {
      const lostResponse = await axios.post(`${BASE_URL}/notifications/pet-lost`, {
        petId: pet.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Email de mascota perdida enviado:', lostResponse.data);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('❌ Error enviando email de mascota perdida:', error.response.data.message);
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }

    // 5. Probar endpoint de mascota encontrada
    console.log('\n6. Probando endpoint de mascota encontrada...');
    try {
      const foundResponse = await axios.post(`${BASE_URL}/notifications/pet-found`, {
        petId: pet.id,
        contactInfo: {
          name: 'Juan Pérez',
          phone: '+56912345678',
          email: 'juan.perez@email.com'
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Email de mascota encontrada enviado:', foundResponse.data);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('❌ Error enviando email de mascota encontrada:', error.response.data.message);
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }

    // 6. Probar con mascota inexistente (debería fallar)
    console.log('\n7. Probando con mascota inexistente (debería fallar)...');
    try {
      await axios.post(`${BASE_URL}/notifications/pet-lost`, {
        petId: 99999
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Error: Debería haber fallado con mascota inexistente');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correcto: Error con mascota inexistente');
        console.log('Mensaje de error:', error.response.data.message);
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }

    // 7. Probar sin autenticación (debería fallar)
    console.log('\n8. Probando sin autenticación (debería fallar)...');
    try {
      await axios.post(`${BASE_URL}/notifications/pet-lost`, {
        petId: pet.id
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Error: Debería haber fallado sin autenticación');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correcto: Error sin autenticación');
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }

    // Limpiar archivo de prueba
    fs.unlinkSync(testImagePath);
    console.log('\n🧹 Archivo de prueba eliminado');

    console.log('\n🎉 ¡Pruebas de notificaciones por email completadas!');
    console.log('\n📋 Resumen:');
    console.log('- ✅ Endpoint de mascota perdida probado');
    console.log('- ✅ Endpoint de mascota encontrada probado');
    console.log('- ✅ Validación de mascota inexistente');
    console.log('- ✅ Validación de autenticación');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('\n⚠️  Nota: Para enviar emails reales, configura las variables de entorno:');
      console.log('   SMTP_USER=tu-email@gmail.com');
      console.log('   SMTP_PASS=tu-contraseña-de-aplicación');
      console.log('   Consulta EMAIL_CONFIG.md para más detalles');
    }

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
testEmailNotifications();
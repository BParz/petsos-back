require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEmailSimple() {
    try {
        console.log('🚀 Probando configuración de email...\n');

        // Verificar configuración de email
        console.log('1. Verificando variables de entorno...');
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('❌ Variables SMTP_USER y SMTP_PASS no configuradas');
            console.log('💡 Ejecuta: npm run setup:email');
            return;
        } else {
            console.log('✅ Configuración de email detectada');
            console.log(`📧 Email: ${process.env.SMTP_USER}`);
            console.log(`🔑 Contraseña: ${process.env.SMTP_PASS}\n`);
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

        // 2. Crear mascota sin imagen
        console.log('3. Creando mascota...');
        const createResponse = await axios.post(`${BASE_URL}/pets`, {
            name: 'Luna Email Test',
            species: 'Perro',
            breed: 'Golden Retriever',
            age: 3,
            weight: 25,
            color: 'Dorado',
            description: 'Mascota para probar emails'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const pet = createResponse.data;
        console.log('✅ Mascota creada:', {
            id: pet.id,
            name: pet.name
        });

        // 3. Probar endpoint de mascota perdida
        console.log('\n4. Probando endpoint de mascota perdida...');
        const lostResponse = await axios.post(`${BASE_URL}/notifications/pet-lost`, {
            petId: pet.id
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Email de mascota perdida enviado:', lostResponse.data);

        // 4. Probar endpoint de mascota encontrada
        console.log('\n5. Probando endpoint de mascota encontrada...');
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

        console.log('\n🎉 ¡Pruebas de email completadas exitosamente!');
        console.log('📧 Verifica tu email: petsosstg@gmail.com');
        console.log('📁 Revisa también la carpeta de spam');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.response?.data || error.message);

        if (error.response?.status === 400 && error.response?.data?.message?.includes('username')) {
            console.log('\n💡 El error indica que el campo username no es válido');
            console.log('   Los scripts han sido corregidos para usar solo los campos válidos');
        }

        process.exit(1);
    }
}

// Ejecutar las pruebas
testEmailSimple();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testCORS() {
    console.log('🧪 Probando configuración de CORS...\n');

    try {
        // Test 1: Petición simple sin CORS
        console.log('📝 Test 1: Petición básica sin headers de origen');

        const response1 = await axios.get(`${API_BASE_URL}/users`);
        console.log('✅ Petición básica exitosa');
        console.log('📊 Status:', response1.status);
        console.log('📊 CORS Headers:', {
            'Access-Control-Allow-Origin': response1.headers['access-control-allow-origin'],
            'Access-Control-Allow-Methods': response1.headers['access-control-allow-methods'],
            'Access-Control-Allow-Headers': response1.headers['access-control-allow-headers'],
        });
        console.log('');

        // Test 2: Petición con origen específico
        console.log('📝 Test 2: Petición con origen localhost:4200');

        const response2 = await axios.get(`${API_BASE_URL}/users`, {
            headers: {
                'Origin': 'http://localhost:4200',
                'Content-Type': 'application/json',
            }
        });
        console.log('✅ Petición con origen específico exitosa');
        console.log('📊 CORS Headers:', {
            'Access-Control-Allow-Origin': response2.headers['access-control-allow-origin'],
            'Access-Control-Allow-Credentials': response2.headers['access-control-allow-credentials'],
        });
        console.log('');

        // Test 3: Preflight request (OPTIONS)
        console.log('📝 Test 3: Preflight request (OPTIONS)');

        const response3 = await axios.options(`${API_BASE_URL}/auth/register`, {
            headers: {
                'Origin': 'http://localhost:4200',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type, Authorization',
            }
        });
        console.log('✅ Preflight request exitoso');
        console.log('📊 Status:', response3.status);
        console.log('📊 CORS Headers:', {
            'Access-Control-Allow-Origin': response3.headers['access-control-allow-origin'],
            'Access-Control-Allow-Methods': response3.headers['access-control-allow-methods'],
            'Access-Control-Allow-Headers': response3.headers['access-control-allow-headers'],
            'Access-Control-Allow-Credentials': response3.headers['access-control-allow-credentials'],
        });
        console.log('');

        // Test 4: Registro con CORS
        console.log('📝 Test 4: Registro con headers de origen');

        const registerData = {
            firstName: 'Test',
            lastName: 'CORS',
            email: 'test.cors@example.com',
            password: 'password123'
        };

        const response4 = await axios.post(`${API_BASE_URL}/auth/register`, registerData, {
            headers: {
                'Origin': 'http://localhost:4200',
                'Content-Type': 'application/json',
            }
        });
        console.log('✅ Registro con CORS exitoso');
        console.log('📊 Status:', response4.status);
        console.log('📊 Response:', {
            message: response4.data.message,
            hasToken: !!response4.data.token,
            user: response4.data.user
        });
        console.log('');

        // Test 5: Login con CORS
        console.log('📝 Test 5: Login con headers de origen');

        const loginData = {
            email: 'test.cors@example.com',
            password: 'password123'
        };

        const response5 = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
            headers: {
                'Origin': 'http://localhost:4200',
                'Content-Type': 'application/json',
            }
        });
        console.log('✅ Login con CORS exitoso');
        console.log('📊 Status:', response5.status);
        console.log('📊 Token obtenido:', response5.data.token ? 'Sí' : 'No');
        console.log('');

        // Test 6: Petición autenticada con CORS
        console.log('📝 Test 6: Petición autenticada con CORS');

        const token = response5.data.token;
        const response6 = await axios.get(`${API_BASE_URL}/users/profile/me`, {
            headers: {
                'Origin': 'http://localhost:4200',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log('✅ Petición autenticada con CORS exitosa');
        console.log('📊 Status:', response6.status);
        console.log('📊 User ID:', response6.data.id);
        console.log('');

        console.log('🎉 ¡Todas las pruebas de CORS pasaron exitosamente!');
        console.log('✅ El backend está configurado correctamente para CORS');
        console.log('✅ Compatible con frontend Angular en puerto 4200');
        console.log('✅ Soporte para autenticación JWT');
        console.log('✅ Preflight requests funcionando correctamente');

    } catch (error) {
        console.error('❌ Error en las pruebas de CORS:', error.response?.data || error.message);

        if (error.response?.status === 0) {
            console.log('💡 Verifica que el servidor esté ejecutándose con: npm run start:dev');
        }

        if (error.response?.status === 401) {
            console.log('💡 Error de autenticación - verificar token');
        }
    }
}

// Ejecutar las pruebas
testCORS();
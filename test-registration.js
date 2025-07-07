const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testRegistration() {
    console.log('🧪 Probando registro con campos básicos...\n');

    try {
        // Test 1: Registro con campos básicos únicamente
        console.log('📝 Test 1: Registro con campos básicos (firstName, lastName, email, password)');

        const basicUser = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan.perez@test.com',
            password: 'password123'
        };

        const response1 = await axios.post(`${API_BASE_URL}/auth/register`, basicUser);

        console.log('✅ Registro exitoso con campos básicos');
        console.log('📊 Respuesta:', {
            message: response1.data.message,
            user: {
                id: response1.data.user.id,
                firstName: response1.data.user.firstName,
                lastName: response1.data.user.lastName,
                email: response1.data.user.email,
                role: response1.data.user.role
            },
            hasToken: !!response1.data.token
        });
        console.log('');

        // Test 2: Registro con campos adicionales
        console.log('📝 Test 2: Registro con campos adicionales');

        const fullUser = {
            firstName: 'María',
            lastName: 'García',
            email: 'maria.garcia@test.com',
            password: 'password123',
            phoneNumber: '123456789',
            address: 'Calle Principal 123',
            city: 'Madrid',
            region: 'Madrid'
        };

        const response2 = await axios.post(`${API_BASE_URL}/auth/register`, fullUser);

        console.log('✅ Registro exitoso con campos adicionales');
        console.log('📊 Respuesta:', {
            message: response2.data.message,
            user: {
                id: response2.data.user.id,
                firstName: response2.data.user.firstName,
                lastName: response2.data.user.lastName,
                email: response2.data.user.email,
                role: response2.data.user.role
            },
            hasToken: !!response2.data.token
        });
        console.log('');

        // Test 3: Login con usuario básico
        console.log('📝 Test 3: Login con usuario registrado');

        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: 'juan.perez@test.com',
            password: 'password123'
        });

        console.log('✅ Login exitoso');
        console.log('📊 Token obtenido:', loginResponse.data.token ? 'Sí' : 'No');
        console.log('');

        // Test 4: Obtener perfil del usuario
        console.log('📝 Test 4: Obtener perfil del usuario');

        const profileResponse = await axios.get(`${API_BASE_URL}/users/profile/me`, {
            headers: {
                'Authorization': `Bearer ${loginResponse.data.token}`
            }
        });

        console.log('✅ Perfil obtenido exitosamente');
        console.log('📊 Datos del perfil:', {
            id: profileResponse.data.id,
            firstName: profileResponse.data.firstName,
            lastName: profileResponse.data.lastName,
            email: profileResponse.data.email,
            phoneNumber: profileResponse.data.phoneNumber,
            address: profileResponse.data.address,
            city: profileResponse.data.city,
            region: profileResponse.data.region,
            role: profileResponse.data.role
        });
        console.log('');

        // Test 5: Actualizar perfil
        console.log('📝 Test 5: Actualizar perfil del usuario');

        const updateData = {
            phoneNumber: '987654321',
            address: 'Nueva Dirección 456',
            city: 'Barcelona',
            region: 'Cataluña'
        };

        const updateResponse = await axios.put(`${API_BASE_URL}/users/profile/update`, updateData, {
            headers: {
                'Authorization': `Bearer ${loginResponse.data.token}`
            }
        });

        console.log('✅ Perfil actualizado exitosamente');
        console.log('📊 Datos actualizados:', {
            phoneNumber: updateResponse.data.phoneNumber,
            address: updateResponse.data.address,
            city: updateResponse.data.city,
            region: updateResponse.data.region
        });

        console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
        console.log('✅ El sistema de registro funciona correctamente con campos básicos');
        console.log('✅ Los campos opcionales se pueden completar después del registro');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.response?.data || error.message);

        if (error.response?.status === 400) {
            console.log('💡 Verifica que el servidor esté ejecutándose con: npm run start:dev');
        }
    }
}

// Ejecutar las pruebas
testRegistration();
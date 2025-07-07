const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testPetsAPI() {
    try {
        console.log('🐾 Probando funcionalidades de Pets...\n');

        // 1. Primero obtener un usuario existente para asociar las mascotas
        console.log('1. Obteniendo usuarios existentes...');
        const usersResponse = await axios.get(`${BASE_URL}/users`);
        const users = usersResponse.data;
        console.log(`✅ Encontrados ${users.length} usuarios`);

        if (users.length === 0) {
            console.log('❌ No hay usuarios disponibles. Primero crea un usuario.');
            return;
        }

        const userId = users[0].id; // Usar el primer usuario
        console.log(`📋 Usando usuario ID: ${userId} (${users[0].firstName} ${users[0].lastName})\n`);

        // 2. Crear una mascota
        console.log('2. Creando mascota...');
        const petData = {
            name: 'Luna',
            species: 'perro',
            breed: 'Golden Retriever',
            age: 3,
            weight: 25.5,
            color: 'Dorado',
            description: 'Mascota muy cariñosa y juguetona',
            userId: userId
        };

        const createResponse = await axios.post(`${BASE_URL}/pets`, petData);
        console.log('✅ Mascota creada exitosamente:');
        console.log(`   ID: ${createResponse.data.id}`);
        console.log(`   Nombre: ${createResponse.data.name}`);
        console.log(`   Especie: ${createResponse.data.species}`);
        console.log(`   Propietario: ${createResponse.data.owner.firstName} ${createResponse.data.owner.lastName}\n`);

        const petId = createResponse.data.id;

        // 3. Crear otra mascota
        console.log('3. Creando segunda mascota...');
        const petData2 = {
            name: 'Mittens',
            species: 'gato',
            breed: 'Siamés',
            age: 2,
            weight: 4.2,
            color: 'Blanco y marrón',
            description: 'Gato elegante y tranquilo',
            userId: userId
        };

        const createResponse2 = await axios.post(`${BASE_URL}/pets`, petData2);
        console.log('✅ Segunda mascota creada:');
        console.log(`   ID: ${createResponse2.data.id}`);
        console.log(`   Nombre: ${createResponse2.data.name}`);
        console.log(`   Especie: ${createResponse2.data.species}\n`);

        // 4. Obtener todas las mascotas
        console.log('4. Obteniendo todas las mascotas...');
        const allPetsResponse = await axios.get(`${BASE_URL}/pets`);
        console.log(`✅ Total de mascotas: ${allPetsResponse.data.length}`);
        allPetsResponse.data.forEach(pet => {
            console.log(`   - ${pet.name} (${pet.species}, ${pet.breed}) - Propietario: ${pet.owner.firstName}`);
        });
        console.log('');

        // 5. Obtener mascotas de un usuario específico
        console.log('5. Obteniendo mascotas del usuario específico...');
        const userPetsResponse = await axios.get(`${BASE_URL}/pets?userId=${userId}`);
        console.log(`✅ Mascotas del usuario ${userId}: ${userPetsResponse.data.length}`);
        userPetsResponse.data.forEach(pet => {
            console.log(`   - ${pet.name} (${pet.species})`);
        });
        console.log('');

        // 6. Obtener una mascota específica
        console.log('6. Obteniendo mascota específica...');
        const onePetResponse = await axios.get(`${BASE_URL}/pets/${petId}`);
        console.log('✅ Mascota específica:');
        console.log(`   ID: ${onePetResponse.data.id}`);
        console.log(`   Nombre: ${onePetResponse.data.name}`);
        console.log(`   Edad: ${onePetResponse.data.age} años`);
        console.log(`   Peso: ${onePetResponse.data.weight} kg`);
        console.log(`   Color: ${onePetResponse.data.color}`);
        console.log(`   Descripción: ${onePetResponse.data.description}`);
        console.log(`   Propietario: ${onePetResponse.data.owner.firstName} ${onePetResponse.data.owner.lastName}\n`);

        // 7. Actualizar una mascota
        console.log('7. Actualizando mascota...');
        const updateData = {
            age: 4,
            weight: 26.0,
            description: 'Mascota muy cariñosa, juguetona y ahora más madura'
        };

        const updateResponse = await axios.put(`${BASE_URL}/pets/${petId}`, updateData);
        console.log('✅ Mascota actualizada:');
        console.log(`   Nueva edad: ${updateResponse.data.age} años`);
        console.log(`   Nuevo peso: ${updateResponse.data.weight} kg`);
        console.log(`   Nueva descripción: ${updateResponse.data.description}\n`);

        console.log('🎉 ¡Todas las pruebas de Pets completadas exitosamente!');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    }
}

testPetsAPI();
const fs = require('fs');
const path = require('path');

// Configuración para pruebas de email
const envConfig = `# Configuración SMTP para pruebas
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=petsosstg@gmail.com
SMTP_PASS=Petsos2025#

# URLs del sistema
BASE_URL=http://localhost:3000
FRONTEND_URL=https://bparz.github.io

# Email de soporte
SUPPORT_EMAIL=soporte@petsos.com
`;

function setupEmailEnv() {
    const envPath = path.join(__dirname, '.env');

    try {
        // Verificar si el archivo .env ya existe
        if (fs.existsSync(envPath)) {
            console.log('📝 Archivo .env ya existe. Verificando configuración de email...');

            const currentEnv = fs.readFileSync(envPath, 'utf8');

            // Verificar si ya tiene la configuración de email
            if (currentEnv.includes('SMTP_USER=petsosstg@gmail.com')) {
                console.log('✅ Configuración de email ya está presente en .env');
                return;
            }

            // Agregar configuración de email al archivo existente
            const updatedEnv = currentEnv + '\n' + envConfig;
            fs.writeFileSync(envPath, updatedEnv);
            console.log('✅ Configuración de email agregada al archivo .env existente');
        } else {
            // Crear nuevo archivo .env
            fs.writeFileSync(envPath, envConfig);
            console.log('✅ Archivo .env creado con configuración de email');
        }

        console.log('\n🎉 Configuración de email lista para pruebas!');
        console.log('📧 Email: petsosstg@gmail.com');
        console.log('🔑 Contraseña: Petsos2025#');
        console.log('\n💡 Ahora puedes ejecutar: npm run test:email');

    } catch (error) {
        console.error('❌ Error configurando variables de entorno:', error.message);
        console.log('\n📋 Configuración manual:');
        console.log('Crea un archivo .env en la raíz del proyecto con:');
        console.log(envConfig);
    }
}

// Ejecutar configuración
setupEmailEnv();
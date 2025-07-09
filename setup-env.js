const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando variables de entorno...');

// Verificar si ya existe el archivo .env
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (fs.existsSync(envPath)) {
    console.log('✅ El archivo .env ya existe');
    console.log('📝 Si necesitas actualizar las variables, edita el archivo .env manualmente');
} else {
    if (fs.existsSync(envExamplePath)) {
        // Copiar el archivo de ejemplo
        const envContent = fs.readFileSync(envExamplePath, 'utf8');
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Archivo .env creado desde env.example');
        console.log('📝 Por favor, edita el archivo .env con tus valores reales');
    } else {
        console.log('❌ No se encontró el archivo env.example');
        console.log('📝 Crea manualmente un archivo .env con las variables necesarias');
    }
}

console.log('\n📋 Variables de entorno necesarias:');
console.log('- DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME');
console.log('- JWT_SECRET, JWT_EXPIRES_IN');
console.log('- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM');
console.log('- UPLOAD_DEST, MAX_FILE_SIZE');
console.log('\n🚀 Una vez configurado, ejecuta: npm run start:dev');
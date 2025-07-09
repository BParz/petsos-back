require('dotenv').config();

console.log('🔍 Verificando variables de entorno...\n');

// Variables de entorno importantes
const envVars = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'UPLOAD_DEST',
    'MAX_FILE_SIZE',
    'PORT',
    'NODE_ENV'
];

console.log('📋 Variables de entorno configuradas:');
envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        // Ocultar valores sensibles
        const displayValue = varName.includes('PASSWORD') || varName.includes('SECRET') || varName.includes('PASS')
            ? '***'
            : value;
        console.log(`✅ ${varName}: ${displayValue}`);
    } else {
        console.log(`❌ ${varName}: NO CONFIGURADA`);
    }
});

console.log('\n🔧 Para configurar las variables faltantes:');
console.log('1. Edita el archivo .env');
console.log('2. O ejecuta: npm run setup:env');
console.log('3. Reinicia el servidor: npm run start:dev');
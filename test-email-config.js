require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔧 Probando configuración de email...\n');

// Mostrar configuración (sin mostrar contraseña)
console.log('📋 Configuración SMTP:');
console.log(`- Host: ${process.env.SMTP_HOST}`);
console.log(`- Port: ${process.env.SMTP_PORT}`);
console.log(`- User: ${process.env.SMTP_USER}`);
console.log(`- From: ${process.env.SMTP_FROM}`);
console.log(`- Pass: ${process.env.SMTP_PASS ? '***' : 'NO CONFIGURADA'}`);

if (!process.env.SMTP_PASS) {
    console.log('\n❌ ERROR: SMTP_PASS no está configurada');
    console.log('\n🔧 Para solucionarlo:');
    console.log('1. Ve a https://myaccount.google.com/apppasswords');
    console.log('2. Genera una contraseña de aplicación para "Mail"');
    console.log('3. Agrega SMTP_PASS=tu_contraseña_de_aplicacion en el archivo .env');
    process.exit(1);
}

// Crear transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verificar conexión
async function testConnection() {
    try {
        console.log('\n🔍 Verificando conexión SMTP...');
        await transporter.verify();
        console.log('✅ Conexión SMTP exitosa');

        // Enviar email de prueba
        console.log('\n📧 Enviando email de prueba...');
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_USER, // Enviar a ti mismo como prueba
            subject: '🧪 Prueba de configuración - PetSOS',
            html: `
        <h2>✅ Configuración de email exitosa</h2>
        <p>Este es un email de prueba para verificar que la configuración SMTP funciona correctamente.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Servidor:</strong> ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}</p>
      `,
        });

        console.log('✅ Email de prueba enviado exitosamente');
        console.log(`📧 Message ID: ${info.messageId}`);

    } catch (error) {
        console.log('\n❌ Error en la configuración de email:');
        console.log(`- Código: ${error.code}`);
        console.log(`- Respuesta: ${error.response}`);
        console.log(`- Comando: ${error.command}`);

        if (error.code === 'EAUTH') {
            console.log('\n🔧 Solución para error de autenticación:');
            console.log('1. Verifica que tengas 2FA habilitado en tu cuenta de Google');
            console.log('2. Ve a https://myaccount.google.com/apppasswords');
            console.log('3. Genera una nueva contraseña de aplicación para "Mail"');
            console.log('4. Actualiza SMTP_PASS en el archivo .env');
            console.log('5. Reinicia el servidor');
        }
    }
}

testConnection();
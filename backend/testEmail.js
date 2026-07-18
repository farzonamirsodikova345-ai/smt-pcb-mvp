require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function testEmail() {
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS установлен:', process.env.EMAIL_PASS ? 'да (' + process.env.EMAIL_PASS.length + ' символов)' : 'НЕТ');

  try {
    await transporter.sendMail({
      from: `"SMT-PCB Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Тестовое письмо от SMT-PCB',
      html: '<h2>Работает!</h2><p>Если вы видите это письмо — настройка Gmail прошла успешно.</p>',
    });
    console.log('✅ Письмо успешно отправлено! Проверьте почту:', process.env.EMAIL_USER);
  } catch (err) {
    console.error('❌ Ошибка отправки:', err.message);
  }
}

testEmail();
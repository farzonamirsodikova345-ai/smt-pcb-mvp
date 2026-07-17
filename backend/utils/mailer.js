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

async function sendMail(to, subject, html) {
  if (!to) return;
  try {
    await transporter.sendMail({
      from: `"SMT-PCB" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Письмо отправлено: ${to} — ${subject}`);
  } catch (err) {
    console.error('Ошибка отправки письма:', err.message);
  }
}

function taskCreatedEmail(task, employee) {
  return sendMail(
    employee.email,
    `Новая задача: ${task.title}`,
    `<h2>Вам назначена новая задача</h2>
     <p><b>Название:</b> ${task.title}</p>
     <p><b>Описание:</b> ${task.description || '—'}</p>
     <p><b>Срок:</b> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString('ru-RU') : 'не указан'}</p>`
  );
}

function taskStatusChangedEmail(task, employee, newStatus) {
  const labels = { todo: 'К выполнению', in_progress: 'В процессе', done: 'Готово' };
  return sendMail(
    employee.email,
    `Статус задачи изменён: ${task.title}`,
    `<h2>Статус задачи обновлён</h2>
     <p><b>Задача:</b> ${task.title}</p>
     <p><b>Новый статус:</b> ${labels[newStatus] || newStatus}</p>`
  );
}

function taskOverdueEmail(task, employee) {
  return sendMail(
    employee.email,
    `Просрочена задача: ${task.title}`,
    `<h2 style="color:#c62828">Задача просрочена</h2>
     <p><b>Название:</b> ${task.title}</p>
     <p><b>Срок был:</b> ${new Date(task.dueDate).toLocaleDateString('ru-RU')}</p>`
  );
}

module.exports = { sendMail, taskCreatedEmail, taskStatusChangedEmail, taskOverdueEmail };
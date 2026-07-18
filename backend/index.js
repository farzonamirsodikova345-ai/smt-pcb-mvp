const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const Task = require('./models/Task');
const { taskOverdueEmail } = require('./utils/mailer');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000
})
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.log('❌ Ошибка подключения', err));

mongoose.set('bufferTimeoutMS', 30000);

app.get('/', (req, res) => {
  res.send('Backend server is running !SMT');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/tasks', require('./routes/tasks'));

// Ежедневная проверка просроченных задач — каждый день в 9:00 утра
cron.schedule('*/1 * * * *', async () => {
  console.log('🔍 Проверка просроченных задач...');
  try {
    const overdueTasks = await Task.find({
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' },
    }).populate('assignedTo', 'name email position');

    for (const task of overdueTasks) {
      if (task.assignedTo) {
        await taskOverdueEmail(task, task.assignedTo);
      }
    }
    console.log(`✅ Проверка завершена, найдено просроченных задач: ${overdueTasks.length}`);
  } catch (err) {
    console.error('❌ Ошибка при проверке просроченных задач:', err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
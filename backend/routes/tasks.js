const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const { taskCreatedEmail, taskStatusChangedEmail } = require('../utils/mailer');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user.id };
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email position')
      .populate('createdBy', 'name email position');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Только администратор может создавать задачи' });
    }
    const { title, description, assignedTo, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || req.user.id,
      dueDate,
      createdBy: req.user.id
    });

    // Отправка email-уведомления назначенному сотруднику
    const populatedTask = await task.populate([
      { path: 'assignedTo', select: 'name email position' },
      { path: 'createdBy', select: 'name email position' },
    ]);
    if (populatedTask.assignedTo) {
      taskCreatedEmail(populatedTask, populatedTask.assignedTo);
    }

    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('assignedTo', 'name email position')
      .populate('createdBy', 'name email position');

    // Отправка email-уведомления о смене статуса
    if (task.assignedTo) {
      taskStatusChangedEmail(task, task.assignedTo, status);
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Только администратор может удалять задачи' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Задача удалена' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// Список сотрудников для выбора при назначении задачи
router.get('/users/list', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещён' });
    }
    const User = require('../models/User');
    const users = await User.find({}, 'name email position role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

module.exports = router;
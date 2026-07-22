const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: проверка токена
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Неверный токен' });
  }
};

// Middleware: только админ
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещён' });
  }
  next();
};

// GET /api/users — список всех пользователей
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'name email position role createdAt');
    res.json(users);
  } catch (err) {
    console.error('Ошибка получения пользователей:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/users/:id/role — сменить роль
router.put('/:id/role', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Неверная роль' });
  }

  try {
    await User.findByIdAndUpdate(id, { role });
    res.json({ message: 'Роль обновлена' });
  } catch (err) {
    console.error('Ошибка обновления роли:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/users/:id — удалить пользователя
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  // Нельзя удалить самого себя
  if (id === req.user.id) {
    return res.status(400).json({ message: 'Нельзя удалить самого себя' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    console.error('Ошибка удаления:', err);
    res.status(500).json({ message: 'Ошибка сервера при удалении' });
  }
});

module.exports = router;
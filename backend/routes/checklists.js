const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CheckListTemplate = require('../models/CheckListTemplate');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Нет токена' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Неверный токен' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Только для администратора' });
  next();
}

router.get('/', auth, async (req, res) => {
  try {
    const templates = await CheckListTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const template = await CheckListTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Не найдено' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const template = new CheckListTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

router.patch('/:id', auth, adminOnly, async (req, res) => {
  try {
    const dataToUpdate = {
      ...req.body,
      updatedBy: req.user.name || req.user.email || req.user.id,
    };
    const updated = await CheckListTemplate.findByIdAndUpdate(req.params.id, dataToUpdate, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await CheckListTemplate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
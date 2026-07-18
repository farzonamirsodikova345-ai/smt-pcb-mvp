const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Equipment = require('../models/Equipment');

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
    const equipment = await Equipment.find().sort({ createdAt: -1 });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      photoUrl,
      status,
      yearOfManufacture,
      purpose,
      functionality,
      workingPrinciple,
    } = req.body;

    const equipment = new Equipment({
      name,
      description,
      photoUrl,
      status,
      yearOfManufacture,
      purpose,
      functionality,
      workingPrinciple,
    });

    await equipment.save();
    res.status(201).json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

router.patch('/:id', auth, adminOnly, async (req, res) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
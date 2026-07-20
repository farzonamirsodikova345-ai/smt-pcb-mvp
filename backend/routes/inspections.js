const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Inspection = require('../models/Inspection');
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

router.get('/', auth, async (req, res) => {
  try {
    const inspections = await Inspection.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Не найдено' });
    res.json(inspection);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { templateId } = req.body;
    const template = await CheckListTemplate.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Шаблон не найден' });

    const inspection = new Inspection({
      templateId,
      templateName: template.name,
      color: template.color,
      createdBy: req.user.id,
      answers: [],
    });
    await inspection.save();

    await CheckListTemplate.findByIdAndUpdate(templateId, {
      $inc: { usageCount: 1 },
      lastUsedAt: new Date(),
    });

    res.status(201).json(inspection);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const updated = await Inspection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

module.exports = router;
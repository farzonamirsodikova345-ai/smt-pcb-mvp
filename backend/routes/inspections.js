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

function todayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Все проверки текущего пользователя
router.get('/', auth, async (req, res) => {
  try {
    const inspections = await Inspection.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// История всех проверок по конкретному шаблону (видно всем)
router.get('/template/:templateId', auth, async (req, res) => {
  try {
    const inspections = await Inspection.find({ templateId: req.params.templateId })
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Каждый клик — новая отдельная запись проверки
router.post('/today', auth, async (req, res) => {
  try {
    const { templateId } = req.body;
    const template = await CheckListTemplate.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Шаблон не найден' });

    const inspection = new Inspection({
      templateId,
      templateName: template.name,
      color: template.color,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      inspectionDate: todayString(),
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

router.get('/:id', auth, async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Не найдено' });
    res.json(inspection);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const updates = { ...req.body, updatedBy: req.user.id };
    if (updates.status === 'completed') {
      updates.completedAt = new Date();
    }
    const updated = await Inspection.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

module.exports = router;
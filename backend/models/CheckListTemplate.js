const mongoose = require('mongoose');

const criterionSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  type: {
    type: String,
    enum: ['yesNo', 'photo', 'text', 'info'],
    default: 'text',
  },
  weight: { type: Number, default: 1 },
});

const categorySchema = new mongoose.Schema({
  title: { type: String, default: '' },
  criteria: [criterionSchema],
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  weight: { type: Number, default: 1 },
  categories: [categorySchema],
});

const checkListTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instruction: { type: String, default: '' },
  color: { type: String, default: '#2e7d32' },
  sections: [sectionSchema],
  updatedBy: { type: String, default: '' },
  usageCount: { type: Number, default: 0 },
  lastUsedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('CheckListTemplate', checkListTemplateSchema);
const mongoose = require('mongoose');

const criterionSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  type: {
    type: String,
    enum: ['yesNoNA', 'scale', 'list', 'multiselect', 'number', 'checkbox', 'datetime', 'photo', 'text', 'info', 'signature'],
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
  linearFlow: { type: Boolean, default: false },
  allowGalleryUpload: { type: Boolean, default: false },
  requireGeolocation: { type: Boolean, default: false },
  sections: [sectionSchema],
}, { timestamps: true });

module.exports = mongoose.model('CheckListTemplate', checkListTemplateSchema);
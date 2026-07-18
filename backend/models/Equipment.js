const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  status: { type: String, default: 'active' },
  yearOfManufacture: { type: String, default: '' },   // год выпуска
  purpose: { type: String, default: '' },             // назначение
  functionality: { type: String, default: '' },       // функционал
  workingPrinciple: { type: String, default: '' },    // принцип работы
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
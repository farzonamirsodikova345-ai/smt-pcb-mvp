const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  criterionId: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, default: null },
}, { _id: false });

const inspectionSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'CheckListTemplate', required: true },
  templateName: { type: String, default: '' },
  color: { type: String, default: '#2e7d32' },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [answerSchema],
  completedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Inspection', inspectionSchema);
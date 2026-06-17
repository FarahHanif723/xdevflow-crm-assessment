const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  changes: { type: String },
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Won'],
    default: 'New'
  },
  timeline: [timelineSchema]
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
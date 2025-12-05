// RouletteResult.js
const mongoose = require('mongoose');

const RouletteResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
  resultText: String,
}, { timestamps: true });

module.exports = mongoose.model('RouletteResult', RouletteResultSchema);

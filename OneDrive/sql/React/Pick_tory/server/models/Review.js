// Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String },
  text: { type: String, required: true },
  images: [String],
  category: String, // beauty / fashion / etc
  tags: [String],
  likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);

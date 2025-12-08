// Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String },
  text: { type: String, required: true },
  images: [String],
  // 댓글 필드 제거 (원래대로)
  category: String, // beauty / fashion / etc
  tags: [String],
  likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);

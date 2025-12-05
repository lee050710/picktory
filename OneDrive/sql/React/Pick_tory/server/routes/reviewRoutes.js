// reviewRoutes.js
const express = require('express');
const { getReviews, getReview, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getReviews);
router.get('/:id', getReview);
router.post('/', protect, createReview); // 로그인한 사용자만 작성 가능

module.exports = router;

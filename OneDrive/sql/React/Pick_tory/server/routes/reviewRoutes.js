// reviewRoutes.js
const express = require('express');
const { getReviews, getReview, createReview, updateReview, deleteReview, createComment, deleteComment } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getReviews);
router.get('/:id', getReview);
router.post('/', protect, createReview); // 로그인한 사용자만 작성 가능
router.put('/:id', protect, updateReview); // 작성자만 수정 가능
router.delete('/:id', protect, deleteReview); // 작성자만 삭제 가능
// 댓글 라우트 제거 (원래대로)

module.exports = router;

// couponRoutes.js
const express = require('express');
const { createCoupon, getMyCoupons, redeemCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createCoupon); // 간단하게 사용자도 생성 가능 (관리자 권한 추가 가능)
router.get('/my', protect, getMyCoupons);
router.post('/redeem/:id', protect, redeemCoupon);

module.exports = router;

// server/routes/rouletteRoutes.js

const express = require('express');
const router = express.Router();
const { 
    spinRoulette, 
    getRouletteRewards // 💡 보상 목록 조회 함수 추가
} = require('../controllers/rouletteController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/roulette/spin → 룰렛 실행 (인증 필요)
router.post('/spin', protect, spinRoulette);

// GET /api/roulette/rewards → 룰렛 보상 목록 조회 (인증 불필요 또는 protect 사용 가능)
// 💡 룰렛 UI 구성을 위해 보상 목록을 프론트엔드에 제공
router.get('/rewards', getRouletteRewards); 

module.exports = router;
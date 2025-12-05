// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { 
    // 🚨 함수 이름 수정: register -> registerUser
    registerUser, 
    // 🚨 함수 이름 수정: login -> authUser
    authUser, 
    // 🚨 함수 이름 수정: getMe -> getUserProfile
    getUserProfile, 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// POST /api/users/register (회원가입)
router.post('/register', registerUser);

// POST /api/users/login (로그인)
router.post('/login', authUser);

// GET /api/users/profile (프로필 조회 - 인증 필요)
// 🚨 라우트 경로 수정: /me -> /profile
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
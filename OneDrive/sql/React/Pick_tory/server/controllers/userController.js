// server/controllers/userController.js

// 💡 asyncHandler 임포트 (try...catch 제거 및 에러 미들웨어로 자동 전달)
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT 토큰 생성 함수 (이름 통일)
const generateToken = (userId) => {
    // 💡 JWT_SECRET이 process.env에 정의되어야 함
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || "fallbacksecret", { expiresIn: "30d" });
};

// @desc    새로운 사용자 등록 (회원가입)
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    // 💡 User 모델 필드에 맞게 'username' 대신 'name' 사용 (User.js 모델 기준)
    const { name, email, password } = req.body; 

    // 1. 필수 필드 검사
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('모든 필수 필드(이름, 이메일, 비밀번호)를 입력해주세요.');
    }

    // 2. 이메일 중복 확인
    const existing = await User.findOne({ email });
    if (existing) {
        res.status(400);
        throw new Error("이미 가입된 이메일입니다.");
    }

    // 3. 사용자 생성 (패스워드 자동 해싱)
    const user = await User.create({ name, email, password });

    if (user) {
        // 4. 성공 응답 및 토큰 발급
        res.status(201).json({
            token: generateToken(user._id),
            user: { 
                id: user._id, 
                name: user.name, // 💡 name 필드 사용
                email: user.email,
                points: user.points, // 💡 포인트 정보 추가
                skinType: user.skinType, // 💡 피부 타입 정보 추가
            }
        });
    } else {
        res.status(400);
        throw new Error('사용자 등록에 실패했습니다.');
    }
});


// @desc    사용자 인증 및 토큰 발급 (로그인)
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // 사용자 존재 및 비밀번호 일치 확인
    if (user && (await user.matchPassword(password))) {
        // 성공 응답 및 토큰 발급
        res.json({ 
            token: generateToken(user._id), 
            user: { 
                id: user._id, 
                name: user.name, // 💡 name 필드 사용
                email: user.email,
                points: user.points, // 💡 포인트 정보 추가
                skinType: user.skinType, // 💡 피부 타입 정보 추가
            }
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error("유효하지 않은 이메일 또는 비밀번호입니다.");
    }
});

// @desc    현재 로그인한 사용자 정보 반환 (프로필 조회)
// @route   GET /api/users/profile
// @access  Private (인증 미들웨어 필요)
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user는 인증 미들웨어(protect)에서 설정됨
    // 💡 필요한 필드를 명시적으로 선택하고 비밀번호 제외
    const user = await User.findById(req.user.id)
        .select("-password")
        // 💡 populate("coupons")는 User 모델에만 쿠폰 ID 배열이 있을 때 적합
        // (쿠폰 데이터를 많이 가져올 필요가 없다면, 나중에 Coupon API를 따로 호출하는 것이 더 효율적일 수 있습니다.)
        .populate("coupons"); 
        
    if (user) {
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            points: user.points,
            skinType: user.skinType,
            bio: user.bio,
            coupons: user.coupons,
            createdAt: user.createdAt,
        });
    } else {
        res.status(404);
        throw new Error('사용자를 찾을 수 없습니다.');
    }
});

module.exports = { registerUser, authUser, getUserProfile };
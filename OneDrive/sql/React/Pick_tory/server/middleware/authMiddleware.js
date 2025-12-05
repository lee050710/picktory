// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
// 💡 asyncHandler 임포트 (try...catch 대신 사용)
const asyncHandler = require('express-async-handler'); 
const User = require('../models/User');

// @desc    요청 헤더의 JWT를 검증하고 req.user에 사용자 정보 추가
const protect = asyncHandler(async (req, res, next) => {
    let token;

    const header = req.headers.authorization;
    
    // 1. 토큰 존재 여부 및 형식 확인
    if (header && header.startsWith('Bearer')) {
        // 'Bearer ' 부분을 제외하고 토큰만 추출
        token = header.split(' ')[1];
        
        try {
            // 2. 토큰 검증
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');
            
            // 토큰에 사용자 ID가 없거나 유효하지 않은 경우
            if (!decoded || !decoded.id) {
                res.status(401);
                throw new Error('유효하지 않거나 손상된 토큰입니다.');
            }

            // 3. 토큰 ID로 사용자 찾기 (비밀번호 제외)
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                res.status(401);
                throw new Error('토큰에 해당하는 사용자를 찾을 수 없습니다.');
            }

            // 4. req.user에 사용자 정보 추가 (컨트롤러에서 사용)
            // 💡 User 모델 필드(name, points, skinType)에 맞춰 객체 구성
            req.user = {
                _id: user._id, 
                name: user.name, 
                email: user.email,
                points: user.points,
                skinType: user.skinType,
            };

            next(); // 다음 컨트롤러로 진행
        } catch (error) {
            // 토큰 만료, 서명 불일치 등 JWT 검증 에러 처리
            res.status(401); 
            // 💡 throw Error를 사용하여 asyncHandler가 에러를 잡도록 합니다.
            throw new Error('인증에 실패했습니다: ' + error.message); 
        }
    } else {
        // 토큰이 없는 경우
        res.status(401);
        throw new Error('토큰이 없습니다. 인증에 실패했습니다.');
    }
});

// module.exports.protect 대신 exports 객체 사용
module.exports = { protect };
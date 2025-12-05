// server/server.js (최종 수정)

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// 💡 우리가 만들 라우트와 에러 핸들러를 임포트합니다.
const userRoutes = require('./routes/userRoutes');
const couponRoutes = require('./routes/couponRoutes');    
const rouletteRoutes = require('./routes/rouletteRoutes');  
const reviewRoutes = require('./routes/reviewRoutes'); // 🚨 리뷰 라우트 임포트 추가!
const { notFound, errorHandler } = require('./middleware/errorHandlerMiddleware');

// 환경 변수 로드 (.env 파일)
dotenv.config();

// --- 1. DB 연결 함수 ---
const connectDB = async () => {
try {
 const conn = await mongoose.connect(process.env.MONGO_URI);
 console.log(`MongoDB Connected: ${conn.connection.host}`);
 } catch (error) {
 console.error(`Error: ${error.message}`);
 process.exit(1); 
 }
};

// DB 연결 실행
connectDB();

// Express 앱 생성 및 미들웨어 설정
const app = express();

// --- 2. 미들웨어 설정 ---
app.use(express.json()); 
app.use(cors({
origin: 'http://localhost:3000', 
  credentials: true
}));

// --- 3. 기본 라우트 및 API 라우트 연결 ---

// 서버 상태 확인용 기본 라우트
app.get('/', (req, res) => {
 res.send('API is running...');
});

// 💡 사용자 라우트 연결 (현재 프론트엔드 로그인/회원가입 문제가 있다면, 
// '/api/auth' 대신 '/api/users'로 변경을 고려해야 합니다. 일단 현재 설정 유지.)
app.use('/api/auth', userRoutes); 

// 💡 쿠폰 라우트 연결
app.use('/api/coupons', couponRoutes);

// 💡 룰렛 라우트 연결
app.use('/api/roulette', rouletteRoutes);

// 🚨 리뷰 라우트 연결 추가 (404 오류 해결)
app.use('/api/reviews', reviewRoutes);


// --- 4. 에러 핸들러 미들웨어 설정 ---

app.use(notFound);
app.use(errorHandler);


// --- 5. 서버 실행 ---
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// 서버를 변수에 할당하여 에러 이벤트를 잡을 수 있게 함
const server = app.listen(PORT, HOST, () => {
	console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on ${HOST}:${PORT}`);
});

// 서버 에러 핸들러 (예: 포트 충돌)
server.on('error', (err) => {
	if (err && err.code === 'EADDRINUSE') {
		console.error(`❌ Port ${PORT} is already in use. Please free the port or change PORT.`);
		process.exit(1);
	}
	console.error('Server error:', err);
});

// 프로미스 미처리 거부를 로그로 남기고 종료
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// 필요 시 graceful shutdown 처리
});
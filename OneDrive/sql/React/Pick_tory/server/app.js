const express = require('express');
const rouletteRoutes = require('./routes/rouletteRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandlerMiddleware');
const connectDB = require('./config/db');

const app = express();

// DB 연결
connectDB();

app.use(express.json());
app.use('/api/roulette', rouletteRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', userRoutes);

// 에러 핸들러는 라우터 뒤에 위치해야 함
app.use(notFound);
app.use(errorHandler);

module.exports = app;

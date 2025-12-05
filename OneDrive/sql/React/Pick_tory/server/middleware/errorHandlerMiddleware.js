// server/middleware/errorMiddleware.js

// 1. 404 Not Found 핸들러
const notFound = (req, res, next) => {
    // 💡 정의되지 않은 URL에 접근했을 때 에러 객체 생성
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // 에러를 다음 미들웨어(errorHandler)로 전달
};

// 2. 일반 에러 핸들러
const errorHandler = (err, req, res, next) => {
    // 💡 상태 코드가 이미 설정되어 있으면 그대로 사용하고, 200이거나 없는 경우 500 사용
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    res.status(statusCode);

    // 💡 클라이언트에게 반환할 JSON 응답
    res.json({
        message: err.message,
        // 💡 보안: 개발 환경에서만 에러 스택 트레이스 제공
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    notFound,
    errorHandler,
};
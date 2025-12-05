// server/config/rouletteRewards.js

const SPIN_COST = 100; // 룰렛 1회 참여 비용 (포인트)
const COUPON_EXPIRY_DAYS = 30; // 룰렛으로 획득한 쿠폰의 유효기간

// 룰렛 보상 정의 (Reward Definitions)
const rouletteRewards = [
    { name: "50 포인트", type: "POINTS", amount: 50, probability: 30, message: "아쉽지만, 다음 기회에! 50 포인트를 얻으셨습니다." }, // 30%
    { name: "100 포인트", type: "POINTS", amount: 100, probability: 25, message: "본전 찾기 성공! 100 포인트를 얻으셨습니다." }, // 25%
    { name: "200 포인트", type: "POINTS", amount: 200, probability: 15, message: "200 포인트 당첨! 다음 룰렛에 도전해보세요!" }, // 15%
    { name: "A 브랜드 10%", type: "COUPON", brand: "A-Brand", discount: 10, externalUrl: "https://a-brand.com", probability: 10, message: "🎉 A 브랜드 10% 할인 쿠폰 당첨!" }, // 10%
    { name: "B 브랜드 20%", type: "COUPON", brand: "B-Brand", discount: 20, externalUrl: "https://b-brand.com", probability: 5, message: "🎁 B 브랜드 20% 할인 쿠폰 획득!" }, // 5%
    { name: "500 포인트", type: "POINTS", amount: 500, probability: 2, message: "대박! 500 포인트를 획득했습니다!" }, // 2%
    { name: "꽝", type: "NONE", amount: 0, probability: 13, message: "😔 꽝! 다음 기회에 다시 도전해보세요." }, // 13%
]; // 총합: 100%

module.exports = {
    rewards: rouletteRewards,
    SPIN_COST,
    COUPON_EXPIRY_DAYS
};
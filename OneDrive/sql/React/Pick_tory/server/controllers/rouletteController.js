// server/controllers/rouletteController.js

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const { nanoid } = require('nanoid'); 
const mongoose = require('mongoose');

// 룰렛 참여 비용 (Cost) 및 유효 기간 (Expiry) 설정
const SPIN_COST = 100; // 룰렛 1회 참여 비용 (포인트)
const COUPON_EXPIRY_DAYS = 30;

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


// @desc    룰렛 참여 및 보상 지급
// @route   POST /api/roulette/spin
// @access  Private
const spinRoulette = asyncHandler(async (req, res) => {
    // 💡 MongoDB 트랜잭션 시작 (원자성 보장: 포인트 차감과 쿠폰 지급은 동시에 성공해야 함)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(req.user._id).select('-password').session(session);

        if (!user) {
            res.status(404);
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        // 1. 포인트 확인 및 차감
        if (user.points < SPIN_COST) { // 💡 SPIN_COST 사용
            res.status(400);
            throw new Error(`포인트가 부족합니다. (현재: ${user.points}P, 필요: ${SPIN_COST}P)`); // 💡 SPIN_COST 사용
        }
        
        user.points -= SPIN_COST; // 💡 SPIN_COST 사용

        // 2. 보상 결정 (가중치 기반 확률 선택)
        const totalWeight = rouletteRewards.reduce((sum, reward) => sum + reward.probability, 0); // 💡 rouletteRewards 사용
        let randomNum = Math.random() * totalWeight;
        let selectedReward = null;

        for (const reward of rouletteRewards) { // 💡 rouletteRewards 사용
            if (randomNum < reward.probability) {
                selectedReward = reward;
                break;
            }
            randomNum -= reward.probability;
        }

        if (!selectedReward) {
             selectedReward = rouletteRewards.find(r => r.name === "꽝"); // 💡 rouletteRewards 사용
        }


        // 3. 보상 처리 및 지급
        let wonCoupon = null;
        let resultMessage = selectedReward.message;

        if (selectedReward.type === 'POINTS') {
            user.points += selectedReward.amount;
            
        } else if (selectedReward.type === 'COUPON') {
            // 새 쿠폰 발행
            const newCouponCode = `${selectedReward.brand.slice(0, 4).toUpperCase()}${nanoid(6).toUpperCase()}`;
            
            wonCoupon = await Coupon.create([{
                user: user._id,
                code: newCouponCode,
                brand: selectedReward.brand,
                discount: selectedReward.discount,
                externalUrl: selectedReward.externalUrl,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * COUPON_EXPIRY_DAYS), // 💡 COUPON_EXPIRY_DAYS 사용
                redeemed: false,
            }], { session });

            wonCoupon = wonCoupon[0];
        }

        // 4. 사용자 정보 저장
        const updatedUser = await user.save({ session });

        // 트랜잭션 커밋
        await session.commitTransaction();
        session.endSession();
        
        // 5. 최종 응답
        res.json({
            success: true,
            reward: selectedReward,
            coupon: wonCoupon,
            userPoints: updatedUser.points,
            message: resultMessage,
        });

    } catch (error) {
        // 트랜잭션 롤백
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});


// @desc    룰렛 보상 목록 반환
// @route   GET /api/roulette/rewards
// @access  Public (또는 Private)
const getRouletteRewards = asyncHandler(async (req, res) => {
    res.json(rouletteRewards.map(r => ({ // 💡 rouletteRewards 사용
        name: r.name,
        type: r.type,
        probability: r.probability,
    })));
});


module.exports = {
    spinRoulette,
    getRouletteRewards,
    rouletteRewards, // 💡 rouletteRewards 사용
};
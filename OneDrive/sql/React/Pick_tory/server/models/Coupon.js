// server/models/Coupon.js

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        // 1. 쿠폰 코드
        code: { 
            type: String, 
            required: [true, '쿠폰 코드는 필수입니다.'], 
            unique: true,
            uppercase: true, // 코드는 대문자로 저장
        },
        
        // 2. 쿠폰 정보
        brand: { 
            type: String, 
            required: [true, '브랜드는 필수 항목입니다.'],
            trim: true,
        },
        discount: { 
            type: Number, 
            required: [true, '할인율은 필수 항목입니다.'],
            min: 1,
            max: 100,
        },
        
        // 3. 외부 사용처 정보
        externalUrl: { 
            type: String, 
            required: false, // URL은 필수가 아님
        },
        
        // 4. 쿠폰 소유자 (필수)
        // 🚨 필드 이름을 'owner'에서 'user'로 통일 (couponController.js와 일치)
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: [true, '소유자는 필수입니다.'],
            ref: 'User' 
        },
        
        // 5. 사용 상태 관리
        expiresAt: { 
            type: Date,
            required: [true, '만료일은 필수입니다.'],
        },
        redeemed: { 
            type: Boolean, 
            default: false 
        },
        // 사용된 시점을 기록하여 통계에 활용 (컨트롤러에서 업데이트됨)
        redeemedAt: {
            type: Date,
            default: null, 
        },
    },
    { timestamps: true }
);

// 쿠폰 코드는 이미 unique: true가 설정되어 있으나, 인덱스를 유지하여 조회 속도를 높입니다.
couponSchema.index({ code: 1 });
// 사용자별 쿠폰 조회를 빠르게 하기 위한 인덱스 추가 (couponController에서 사용)
couponSchema.index({ user: 1, redeemed: 1, expiresAt: 1 }); 

module.exports = mongoose.model('Coupon', couponSchema);
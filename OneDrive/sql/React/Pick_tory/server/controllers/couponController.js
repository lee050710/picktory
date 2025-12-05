const Coupon = require('../models/Coupon');
const User = require('../models/User');

// nanoid 동적 import (CommonJS 호환)
let nanoid;
(async () => {
  nanoid = (await import('nanoid')).nanoid;
})();

/**
 * createCoupon: 새 쿠폰 생성 (코드 자동 생성)
 * body: { brand, discount, description, externalUrl, expiresAt }
 */
const createCoupon = async (req, res, next) => {
  try {
    const { brand, discount, description, externalUrl, expiresAt } = req.body;

    if (!brand || !discount) {
      return res.status(400).json({ message: "brand, discount는 필수입니다." });
    }

    // 쿠폰 코드 생성
    const code = `${brand.slice(0, 4).toUpperCase()}${nanoid(6).toUpperCase()}`;

    const coupon = await Coupon.create({
      code,
      brand,
      discount,
      description: description || "",
      externalUrl: externalUrl || "",
      owner: req.user ? req.user.id : null,
      expiresAt: expiresAt
        ? new Date(expiresAt)
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 기본 30일 유효
    });

    return res.status(201).json({
      success: true,
      message: "쿠폰이 생성되었습니다.",
      coupon,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * getMyCoupons: 로그인한 사용자의 쿠폰 조회
 */
const getMyCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ owner: req.user.id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: coupons.length,
      coupons,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * redeemCoupon: 쿠폰 사용 처리(외부에서 사용했다는 표시)
 */
const redeemCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "쿠폰을 찾을 수 없습니다." });
    }

    // 소유자 인증
    if (String(coupon.owner) !== req.user.id) {
      return res.status(403).json({ message: "본인 소유 쿠폰만 사용할 수 있습니다." });
    }

    if (coupon.redeemed) {
      return res.status(400).json({ message: "이미 사용된 쿠폰입니다." });
    }

    coupon.redeemed = true;
    await coupon.save();

    res.json({
      success: true,
      message: "쿠폰 사용 완료!",
      coupon,
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { createCoupon, getMyCoupons, redeemCoupon };

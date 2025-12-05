// client/src/api/couponApi.js (최종 정리)

// client-only coupon API (mocked)
const SAMPLE_COUPONS = [
	{ _id: 'c1', brand: 'A브랜드', discount: 10, code: 'A10OFF', redeemed: false },
	{ _id: 'c2', brand: 'B브랜드', discount: 20, code: 'B20OFF', redeemed: false },
];

function loadCoupons() {
	try { const raw = localStorage.getItem('mock_coupons'); if (!raw) return SAMPLE_COUPONS.slice(); return JSON.parse(raw); } catch (e) { return SAMPLE_COUPONS.slice(); }
}

function saveCoupons(list) { try { localStorage.setItem('mock_coupons', JSON.stringify(list)); } catch (e) {} }

export const getMyCoupons = async () => {
	const data = loadCoupons();
	return Promise.resolve({ data });
};

export const redeemCoupon = async (couponId) => {
	const all = loadCoupons();
	const idx = all.findIndex(c => c._id === couponId);
	if (idx === -1) return Promise.reject(new Error('쿠폰을 찾을 수 없습니다.'));
	all[idx] = { ...all[idx], redeemed: true };
	saveCoupons(all);
	return Promise.resolve({ data: all[idx] });
};

const couponApi = { getMyCoupons, redeemCoupon };
export default couponApi;
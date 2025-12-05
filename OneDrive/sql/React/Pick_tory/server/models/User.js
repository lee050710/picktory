// server/models/User.js (수정 완료)

const mongoose = require('mongoose');
// 🚨 수정! bcryptjs를 불러온 변수명을 명확하게 'bcryptjs'로 변경합니다.
const bcryptjs = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
 // 💡 name으로 변경 (프론트엔드 UI의 '이름' 필드와 일치)
 name: { 
 type: String, 
 required: [true, '이름은 필수 항목입니다.'], 
 unique: false // 이름은 중복 가능
 },
 email: { 
  type: String, 
 required: [true, '이메일은 필수 항목입니다.'], 
 unique: true 
 },
 password: { 
 type: String, 
 required: [true, '비밀번호는 필수 항목입니다.'],
 // 최소 길이 제한을 추가하여 보안 강화
 minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다.'] 
 },
 // 💡 핵심 기능 1: 룰렛/쿠폰 시스템에 사용될 포인트 추가
 points: {
 type: Number,
 default: 500, // 초기 가입 시 기본 포인트 제공
 min: 0
 },
 // 💡 핵심 기능 2: AI 매거진 개인화 추천에 사용될 피부 타입
 skinType: {
 type: String,
 enum: ['건성', '지성', '복합성', '민감성', '중성', '미지정'],
 default: '미지정',
 },
 // bio 필드는 유지 (프로필 페이지 상세 정보)
 bio: { 
 type: String, 
 default: '프로필을 설정해주세요.' 
 },
 // coupons 필드 유지 (User가 가진 쿠폰 목록 참조)
 coupons: [{ 
  type: mongoose.Schema.Types.ObjectId, 
 ref: 'Coupon' 
 }],
}, { 
 timestamps: true // 생성일, 수정일 자동 기록
});

// 사용자 저장(save) 전에 비밀번호를 암호화하는 미들웨어 (Hooks)
userSchema.pre('save', async function (next) {
 if (!this.isModified('password')) {
  return next();
 }
 // salt rounds 10 (비용과 보안의 균형)
 // 🚨 수정! bcrypt 대신 bcryptjs를 사용합니다.
 const salt = await bcryptjs.genSalt(10); 
this.password = await bcryptjs.hash(this.password, salt);
 next();
});

// 로그인 시 비밀번호 일치 여부를 확인하는 메소드
userSchema.methods.matchPassword = async function (enteredPassword) {
 // 저장된 암호화된 비밀번호와 입력된 비밀번호를 비교
 // 🚨 수정! bcrypt 대신 bcryptjs를 사용합니다.
 return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
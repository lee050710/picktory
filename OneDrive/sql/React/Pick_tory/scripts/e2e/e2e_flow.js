// 간단 E2E 스크립트: 회원가입 -> 로그인 -> 룰렛 스핀 -> 내 쿠폰 조회
// 사용법: node scripts/e2e/e2e_flow.js

const API = process.env.API_URL || 'http://localhost:4000/api';

async function run() {
  try {
    const email = `e2e_test_${Date.now()}@example.com`;
    const password = 'Test1234!';

    console.log('1) Registering user:', email);
    let res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'e2e_user', email, password })
    });
    const register = await res.json();
    if (!res.ok) throw new Error('Register failed: ' + JSON.stringify(register));
    console.log('-> registered', register.user?.email || register.user?.username);

    console.log('2) Logging in');
    res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const login = await res.json();
    if (!res.ok) throw new Error('Login failed: ' + JSON.stringify(login));
    const token = login.token;
    console.log('-> got token');

    console.log('3) Spin roulette');
    res = await fetch(`${API}/roulette/spin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    const spin = await res.json();
    console.log('-> spin result:', spin);

    console.log('4) Fetch my coupons');
    res = await fetch(`${API}/coupons/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const coupons = await res.json();
    console.log('-> my coupons:', coupons);

    console.log('\nE2E flow completed successfully.');
  } catch (err) {
    console.error('E2E error:', err);
    process.exit(1);
  }
}

run();

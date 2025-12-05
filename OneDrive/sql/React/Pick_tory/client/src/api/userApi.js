// client-only mock user API
// Provides minimal register/login/getMe/logout behavior using localStorage

const USERS_KEY = 'mock_users';

function loadUsers() {
	try { const raw = localStorage.getItem(USERS_KEY); if (!raw) return []; return JSON.parse(raw); } catch (e) { return []; }
}

function saveUsers(list) { try { localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch (e) {} }

// create a default demo user if none exist
(function ensureDefault() {
	const users = loadUsers();
	if (users.length === 0) { users.push({ _id: 'u1', username: 'demo', password: 'demo', points: 1000 }); saveUsers(users); }
})();

export const register = async (payload) => {
	const users = loadUsers();
	if (users.find(u => u.username === payload.username)) return Promise.reject(new Error('이미 존재하는 사용자입니다.'));
	const newUser = { _id: 'u' + Date.now(), username: payload.username, password: payload.password, points: 0 };
	users.push(newUser); saveUsers(users);
	const token = 'mock-token-' + newUser._id;
	return Promise.resolve({ data: { token, user: newUser } });
};

export const login = async (payload) => {
	const users = loadUsers();
	const u = users.find(x => x.username === payload.username && x.password === payload.password);
	if (!u) return Promise.reject(new Error('아이디 또는 비밀번호가 틀립니다.'));
	const token = 'mock-token-' + u._id;
	return Promise.resolve({ data: { token, user: u } });
};

export const getMe = async () => {
	// prefer stored user in localStorage
	try {
		const raw = localStorage.getItem('user');
		if (raw) return Promise.resolve({ data: JSON.parse(raw) });
	} catch (e) {}
	return Promise.resolve({ data: null });
};

export const logout = async () => { localStorage.removeItem('token'); localStorage.removeItem('user'); return Promise.resolve(); };

const userApi = { register, login, getMe, logout };
export default userApi;
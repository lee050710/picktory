// client-only mock review API
// Provides the same async interface as axios-based api (returns Promise resolving to { data: ... })

const SAMPLE_REVIEWS = [
	{ _id: 'r1', title: '맛있어요', text: '정말 맛있게 먹었어요.', author: { username: 'alice' }, images: [], likes: 3, createdAt: new Date().toISOString() },
	{ _id: 'r2', title: '별로였어요', text: '음식이 조금 짰습니다.', author: { username: 'bob' }, images: [], likes: 1, createdAt: new Date().toISOString() },
];

function loadReviews() {
	try {
		const raw = localStorage.getItem('mock_reviews');
		if (!raw) return SAMPLE_REVIEWS.slice();
		return JSON.parse(raw);
	} catch (e) {
		return SAMPLE_REVIEWS.slice();
	}
}

function saveReviews(list) {
	try { localStorage.setItem('mock_reviews', JSON.stringify(list)); } catch (e) { /* ignore */ }
}

export const fetchReviews = async (params = {}) => {
	const all = loadReviews();
	// simple pagination support
	const page = parseInt(params.page || 1, 10);
	const limit = parseInt(params.limit || 20, 10);
	const start = (page - 1) * limit;
	const data = all.slice(start, start + limit);
	return Promise.resolve({ data });
};

export const fetchReview = async (id) => {
	const all = loadReviews();
	const item = all.find(r => r._id === id) || null;
	return Promise.resolve({ data: item });
};

export const createReview = async (payload) => {
	const all = loadReviews();
	// Ensure author stored in a consistent shape (object with username)
	const authorObj = payload && payload.author
		? (typeof payload.author === 'string' ? { username: payload.author } : (payload.author.username || payload.author.name ? { username: payload.author.username || payload.author.name } : payload.author))
		: null;
	const newItem = { _id: 'r' + (Date.now()), ...payload, author: authorObj || payload.author || null, createdAt: new Date().toISOString(), likes: 0, comments: [] };

	// 보상 포인트: 리뷰 작성 시 기본 보상 지급 (클라이언트 모드)
	const AWARD_POINTS_FOR_REVIEW = 50;

	// 사용자 포인트 업데이트: localStorage의 사용자 목록을 찾아 포인트 추가
	try {
		const usersRaw = localStorage.getItem('mock_users');
		if (usersRaw) {
			const users = JSON.parse(usersRaw);
			// payload.author may be object { username }
			const authorName = payload.author && payload.author.username ? payload.author.username : (payload.author || null);
			if (authorName) {
				const idx = users.findIndex(u => u.username === authorName);
				if (idx !== -1) {
					users[idx].points = (users[idx].points || 0) + AWARD_POINTS_FOR_REVIEW;
					localStorage.setItem('mock_users', JSON.stringify(users));
					// 또한, 현재 세션의 저장된 user가 동일 사용자라면 로컬스토리지의 `user`도 갱신
					try {
						const saved = JSON.parse(localStorage.getItem('user') || 'null');
						if (saved && saved.username === users[idx].username) {
							saved.points = users[idx].points;
							localStorage.setItem('user', JSON.stringify(saved));
						}
					} catch (e) { /* ignore */ }
				}
			}
		}
	} catch (e) {
		console.warn('failed to award points for review', e);
	}

	all.unshift(newItem);
	saveReviews(all);
	// attach awardedPoints meta so callers can update UI/state immediately
	newItem.awardedPoints = AWARD_POINTS_FOR_REVIEW;
	return Promise.resolve({ data: newItem });
};

// 본인 글만 수정
export const updateReview = async (id, payload, currentUserName) => {
	const all = loadReviews();
	const idx = all.findIndex(r => r._id === id);
	if (idx === -1) return Promise.resolve({ data: null });
	const authorName = all[idx].author?.username || all[idx].author?.name || all[idx].author;
	if (authorName !== currentUserName) return Promise.resolve({ data: null });
	all[idx] = { ...all[idx], ...payload };
	saveReviews(all);
	return Promise.resolve({ data: all[idx] });
};

// 본인 글만 삭제
export const deleteReview = async (id, currentUserName) => {
	let all = loadReviews();
	const idx = all.findIndex(r => r._id === id && ((r.author?.username || r.author?.name || r.author) === currentUserName));
	if (idx === -1) return Promise.resolve({ data: null });
	const removed = all.splice(idx, 1)[0];
	saveReviews(all);
	return Promise.resolve({ data: removed });
};

// 댓글 추가
export const addComment = async (reviewId, text, authorName) => {
	const all = loadReviews();
	const idx = all.findIndex(r => r._id === reviewId);
	if (idx === -1) return Promise.resolve({ data: null });
	const comment = { _id: 'c' + Date.now(), text, author: authorName, createdAt: new Date().toISOString() };
	all[idx].comments = all[idx].comments || [];
	all[idx].comments.push(comment);
	saveReviews(all);
	return Promise.resolve({ data: comment });
};

// 본인 댓글만 삭제
export const removeComment = async (reviewId, commentId, currentUserName) => {
	const all = loadReviews();
	const idx = all.findIndex(r => r._id === reviewId);
	if (idx === -1) return Promise.resolve({ data: null });
	all[idx].comments = all[idx].comments || [];
	const cidx = all[idx].comments.findIndex(c => c._id === commentId && c.author === currentUserName);
	if (cidx === -1) return Promise.resolve({ data: null });
	const removed = all[idx].comments.splice(cidx, 1)[0];
	saveReviews(all);
	return Promise.resolve({ data: removed });
};

// pages/CommunityDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // 커뮤니티 글 데이터 가져오기 (localStorage 기반)
  const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
  const post = posts.find(p => p._id === id);

  if (!post) {
    return <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>글을 찾을 수 없습니다.</h2>
      <button onClick={() => navigate(-1)} style={{ marginTop: 20 }}>뒤로가기</button>
    </div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(139,92,246,0.08)', padding: 32 }}>
      <h2 style={{ fontWeight: 800, fontSize: 24 }}>{post.title}</h2>
      <div style={{ color: '#888', marginBottom: 12 }}>@{post.author?.username} • {new Date(post.createdAt).toLocaleString()}</div>
      {post.images && post.images.length > 0 && (
        <img src={post.images[0]} alt="이미지" style={{ width: '100%', borderRadius: 16, marginBottom: 18 }} />
      )}
      <div style={{ fontSize: 16, color: '#333', marginBottom: 18, whiteSpace: 'pre-wrap' }}>{post.text}</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        {post.tags?.map(tag => <span key={tag} style={{ background: '#f3e8ff', color: '#8b5cf6', padding: '6px 14px', borderRadius: 16, fontSize: 13 }}>#{tag}</span>)}
      </div>
      <div style={{ color: '#ff4d88', fontWeight: 600, marginBottom: 8 }}>❤️ {post.likes}</div>
      <div style={{ color: '#8b5cf6', fontWeight: 600 }}>💬 {post.comments}</div>
      <button onClick={() => navigate(-1)} style={{ marginTop: 24, background: 'linear-gradient(135deg,#ff4d88,#a855f7)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 12, cursor: 'pointer' }}>뒤로가기</button>
    </div>
  );
}

export default CommunityDetail;

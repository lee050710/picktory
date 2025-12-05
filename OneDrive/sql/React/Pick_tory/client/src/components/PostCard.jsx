import React from 'react';

function PostCard({ post }) {
  return (
    <div style={{ border: '1px solid #e6e6e6', borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: 12, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#333', marginRight: 12 }}>
          {post.author?.slice(0,1) || 'U'}
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>{post.author || '익명'}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>

      {post.image && (
        <div style={{ width: '100%', maxHeight: 420, overflow: 'hidden' }}>
          <img src={post.image} alt="post" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      )}

      <div style={{ padding: 12 }}>
        <div style={{ marginBottom: 8, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{post.text}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#999', fontSize: 13 }}>{post.likes || 0} 좋아요</div>
          <button style={{ border: 'none', background: '#ff6b6b', color: '#fff', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }} onClick={() => { alert('좋아요(로컬)'); }}>
            좋아요
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;

// components/ReviewCard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function ReviewCard({ id, username, brand, product, title, text, images = [], createdAt, likes = 0, comments = 0, commentsList = [], tags = [], rating, canEdit = false, onEdit, onDelete, onAddComment, onDeleteComment }) {
  const mainImage = images && images.length > 0 ? images[0] : null;
  const [isHovered, setIsHovered] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localComments, setLocalComments] = useState(commentsList || []);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setLocalComments(commentsList || []);
  }, [commentsList]);

  const currentUser = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch (e) { return null; } })();
  const currentUserName = currentUser ? (currentUser.username || currentUser.name || currentUser.email) : null;

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (onAddComment) {
      await onAddComment(id, commentText);
      setCommentText('');
    }
  };

  const handleDeleteComment = async (commentId, author) => {
    if (!onDeleteComment) return;
    await onDeleteComment(id, commentId);
  };
      {/* ✨ 반짝이는 글래스 효과 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: isHovered ? '150%' : '-100%',
        width: '80%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(255,215,0,0.2), transparent)',
        transform: 'skewX(-20deg)',
        transition: 'left 0.8s ease',
        pointerEvents: 'none',
        zIndex: 10
      }} />
      {mainImage && (
        <div style={{ 
          width: '100%', 
          height: 260, 
          overflow: 'hidden', 
          position: 'relative',
          background: 'linear-gradient(135deg, #fff5f7, #faf5ff)'
        }}>
          <img 
            src={mainImage} 
            alt={title || 'review'} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              display: 'block',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.5s ease',
              filter: isHovered ? 'brightness(1.05) saturate(1.1)' : 'brightness(1)'
            }} 
          />
          {/* 이미지 위 글래스 오버레이 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: isHovered 
              ? 'linear-gradient(180deg, transparent 50%, rgba(255,77,136,0.1) 100%)'
              : 'transparent',
            transition: 'background 0.4s ease',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
            <span style={{ 
              background: 'linear-gradient(135deg, rgba(255,77,136,0.9), rgba(168,85,247,0.9))', 
              backdropFilter: 'blur(10px)',
              color: '#fff', 
              padding: '6px 14px', 
              borderRadius: 20, 
              fontSize: 11, 
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(255,77,136,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <span style={{ animation: 'pulse 2s ease-in-out infinite' }}>📷</span> 사진리뷰
            </span>
          </div>
          {canEdit && (
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
              <button onClick={() => onEdit && onEdit(id)} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', padding: '6px 8px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>수정</button>
              <button onClick={() => onDelete && onDelete(id)} style={{ background: '#fff5f5', border: 'none', padding: '6px 8px', borderRadius: 8, cursor: 'pointer', color: '#ef4444', fontWeight: 700 }}>삭제</button>
            </div>
          )}
          {/* 코너 반짝이 장식 */}
          {isHovered && (
            <>
              <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 16, animation: 'sparkle 1s ease-in-out infinite' }}>✨</div>
              <div style={{ position: 'absolute', bottom: 10, right: 15, fontSize: 14, animation: 'sparkle 1.2s ease-in-out infinite 0.3s' }}>💖</div>
            </>
          )}
        </div>
      )}

      <div style={{ padding: 14 }}>
        {/* 브랜드 & 제품명 */}
        {(brand || product) && (
          <div style={{ marginBottom: 10, padding: '8px 12px', background: 'linear-gradient(135deg, #fff5f8, #f8f4ff)', borderRadius: 10, border: '1px solid rgba(255,77,136,0.1)' }}>
            {brand && <span style={{ fontSize: 12, fontWeight: 700, color: '#ff4d88' }}>{brand}</span>}
            {brand && product && <span style={{ color: '#ccc', margin: '0 6px' }}>|</span>}
            {product && <span style={{ fontSize: 12, color: '#666' }}>{product}</span>}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d88, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>{username?.slice(0,1) || 'U'}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{username || '익명'}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{createdAt ? new Date(createdAt).toLocaleDateString() : ''}</div>
              </div>
            </div>

            {title && <h3 style={{ margin: '10px 0 6px', fontSize: 16 }}>{title}</h3>}
            <p style={{ color: '#333', lineHeight: 1.6, margin: 0, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{text}</p>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 8 }}>
              {tags && tags.slice(0,3).map((t, i) => (
                <span key={i} style={{ background: 'rgba(255,77,136,0.08)', color: '#ff4d88', padding: '4px 8px', borderRadius: 16, fontSize: 12 }}>{`#${t}`}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ fontSize: 14, color: '#ff4d88', fontWeight: 800 }}>{rating ? `${rating} ★` : ''}</div>
            <Link to={`/review/${id}`} style={{ textDecoration: 'none' }}>
              <button className="btn" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ffe0eb', background: '#fff5f8', color: '#ff4d88', fontWeight: 600 }}>자세히 보기</button>
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div style={{ color: '#777', fontSize: 13, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span>❤️ {likes}</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowComments(s => !s)}>💬 {localComments.length || comments}</span>
          </div>
        </div>
        {/* 댓글 섹션 */}
        {showComments && (
          <div style={{ padding: '12px 0 0', borderTop: '1px solid #f0f0f0', marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="댓글을 작성하세요" style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #eee' }} />
              <button onClick={handleAddComment} style={{ background: 'linear-gradient(135deg,#ff4d88,#a855f7)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>등록</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(localComments || []).map(c => (
                <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, background: '#fff', padding: 8, borderRadius: 8, border: '1px solid #faf0f5' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{(c.author && (c.author.username || c.author.name)) || '익명'}</div>
                    <div style={{ fontSize: 13, color: '#333' }}>{c.text}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 6 }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    {currentUserName && c.author && (c.author === currentUserName || c.author.username === currentUserName || c.author.name === currentUserName) && (
                      <button onClick={() => handleDeleteComment(c._id, c.author)} style={{ background: '#fff5f5', border: 'none', color: '#ef4444', padding: '6px 8px', borderRadius: 8, cursor: 'pointer' }}>삭제</button>
                    )}
                  </div>
                </div>
              ))}
              {(!localComments || localComments.length === 0) && <div style={{ color: '#888', fontSize: 13 }}>댓글이 없습니다.</div>}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default ReviewCard;

import React, { useState, useEffect } from 'react';
import PhotoUploader from './PhotoUploader';

function PostEditor({ initial = null, onCancel, onSubmit }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [text, setText] = useState(initial?.text || '');
  const [images, setImages] = useState(initial?.images || []);

  useEffect(() => {
    setTitle(initial?.title || '');
    setText(initial?.text || '');
    setImages(initial?.images || []);
  }, [initial]);

  const handleImageChange = (dataUrl) => {
    if (!dataUrl) return setImages([]);
    setImages([dataUrl]);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return alert('내용을 입력하세요');
    const payload = { title: title || undefined, text, images };
    if (onSubmit) onSubmit(payload);
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20, background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목 (선택)" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #eee' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="리뷰 내용을 작성하세요..." rows={4} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #eee' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <PhotoUploader onChange={handleImageChange} />
        <div style={{ display: 'flex', gap: 8 }}>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>취소</button>
          )}
          <button type="submit" style={{ padding: '8px 14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#ff4d88,#a855f7)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{initial ? '수정하기' : '등록하기'}</button>
        </div>
      </div>
    </form>
  );
}

export default PostEditor;

import React, { useRef, useState } from 'react';

function PhotoUploader({ onChange }) {
  const ref = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      if (onChange) onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files && e.target.files[0])} />
      <button
        type="button"
        onClick={() => ref.current && ref.current.click()}
        style={{ background: 'linear-gradient(135deg,#ff4d88,#a855f7)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
      >
        사진 첨부
      </button>
      {preview && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <img src={preview} alt="preview" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
          <button type="button" onClick={() => { setPreview(null); if (onChange) onChange(null); }} style={{ background: '#f3f4f6', border: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>제거</button>
        </div>
      )}
    </div>
  );
}

export default PhotoUploader;

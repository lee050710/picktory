import React, { useState, useEffect, useContext } from "react";
import PhotoUploader from "./PhotoUploader";
import { AuthContext } from "../context/AuthContext"; // 🔧 프로젝트 구조에 맞게 경로 조정

function PostEditor({ initial = null, onCancel, onSubmit }) {
  const { user } = useContext(AuthContext); // ✅ 로그인 여부 확인

  const [title, setTitle] = useState(initial?.title || "");
  const [text, setText] = useState(initial?.text || "");
  const [images, setImages] = useState(initial?.images || []);

  useEffect(() => {
    setTitle(initial?.title || "");
    setText(initial?.text || "");
    setImages(initial?.images || []);
  }, [initial]);

  const handleImageChange = (dataUrl) => {
    if (!dataUrl) return setImages([]);
    setImages([dataUrl]);
  };

  // ✅ 익명 유저용 anonKey 보장 함수
  const ensureAnonKey = () => {
    let anonKey = localStorage.getItem("anonKey");
    if (!anonKey) {
      if (window.crypto?.randomUUID) {
        anonKey = window.crypto.randomUUID();
      } else {
        anonKey = Math.random().toString(36).slice(2);
      }
      localStorage.setItem("anonKey", anonKey);
    }
    return anonKey;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return alert("내용을 입력하세요");

    const payload = {
      title: title || undefined,
      text,
      images,
    };

    // 🔹 1) 수정 모드 & 기존에 anonHash가 있으면 그대로 유지
    if (initial?.anonHash) {
      payload.anonHash = initial.anonHash;
    }
    // 🔹 2) 새 글 + 로그인 안 된 상태 → 익명 hash 부여
    else if (!user) {
      const anonKey = ensureAnonKey();
      payload.anonHash = anonKey;
    }
    // 🔹 3) 로그인 상태면 anonHash 안 보냄 (백엔드가 author로 처리)

    if (onSubmit) onSubmit(payload);
  };

  return (
    <form
      onSubmit={submit}
      style={{
        marginBottom: 20,
        background: "#fff",
        padding: 16,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목 (선택)"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #eee",
          }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="리뷰 내용을 작성하세요..."
          rows={4}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #eee",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <PhotoUploader onChange={handleImageChange} />
        <div style={{ display: "flex", gap: 8 }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              취소
            </button>
          )}
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#ff4d88,#a855f7)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {initial ? "수정하기" : "등록하기"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PostEditor;

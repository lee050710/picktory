import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PostCard({
  post,
  canEdit = false,
  onEdit,
  onDelete,
  onLike,
  onComment,
  ownerOnlyActions = false,
}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleDetail = () => {
    if (ownerOnlyActions) return;
    navigate(`/community/${post._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) return onEdit(post);
    navigate(`/community/${post._id}/edit`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!window.confirm("정말 이 글을 삭제하시겠어요?")) return;
    if (onDelete) return onDelete(post);
    alert("삭제 핸들러(onDelete)가 연결되어 있지 않습니다.");
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (onLike) return onLike(post);
    if (!ownerOnlyActions) {
      alert("좋아요(로컬) – onLike 핸들러를 연결해보세요!");
    }
  };

  const handleComment = (e) => {
    e.stopPropagation();
    if (onComment) return onComment(post);
    if (!ownerOnlyActions) {
      handleDetail();
    }
  };

  const createdAtMs =
    typeof post.createdAt === "string"
      ? new Date(post.createdAt).getTime()
      : post.createdAt;
  const hoursAgo = Math.floor((Date.now() - createdAtMs) / (1000 * 60 * 60));

  const commentsCount = Array.isArray(post.comments)
    ? post.comments.length
    : post.comments || 0;

  const authorName = post.author?.username || "익명";
  const authorInitial = authorName.charAt(0) || "?";

  // ------------------- ✅ 내가 쓴 글인지 판별 -------------------
  const isLoggedIn = !!user;

  const isMyPostAsUser =
    isLoggedIn &&
    post.author &&
    ((post.author._id && user._id && post.author._id === user._id) ||
      (post.author.username &&
        user.username &&
        post.author.username === user.username));

  const anonKey = localStorage.getItem("anonKey");

  const isMyPostAsAnonymous =
    !isLoggedIn &&
    authorName === "익명" &&
    anonKey &&
    post.anonHash &&
    post.anonHash === anonKey;

  const canEditResolved = canEdit || isMyPostAsUser || isMyPostAsAnonymous;
  // -------------------------------------------------------------

  return (
    <div
      onClick={handleDetail}
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: 24,
        padding: "24px 28px",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        cursor: ownerOnlyActions ? "default" : "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative", // ✅ 상단 고정 버튼 기준
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
        e.currentTarget.style.boxShadow = "0 20px 50px rgba(139,92,246,0.15)";
        e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
      }}
    >
      {/* ✏🗑 우측 상단 고정 버튼 */}
      {canEditResolved && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            display: "flex",
            gap: 6,
            zIndex: 20,
          }}
        >
          <button
            type="button"
            onClick={handleEdit}
            style={{
              border: "none",
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.03)",
              color: "#555",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            ✏ 수정
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              border: "none",
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(248,113,113,0.12)",
              color: "#ef4444",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(248,113,113,0.15)",
            }}
          >
            🗑 삭제
          </button>
        </div>
      )}

      {/* 호버 그라데이션 레이어 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.02) 0%, rgba(255,77,136,0.02) 100%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* 상단 영역: 카테고리, 프로필, 시간 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            {/* 카테고리 배지 */}
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background:
                  post.category === "tip"
                    ? "linear-gradient(135deg, #dcfce7, #bbf7d0)"
                    : post.category === "question"
                    ? "linear-gradient(135deg, #fef3c7, #fde68a)"
                    : "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
                color:
                  post.category === "tip"
                    ? "#16a34a"
                    : post.category === "question"
                    ? "#d97706"
                    : "#8b5cf6",
                fontSize: 12,
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {post.category === "tip"
                ? "💡 꿀팁"
                : post.category === "question"
                ? "❓ 질문"
                : "💬 수다"}
            </span>

            {/* 작성자 정보 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0,0,0,0.02)",
                padding: "4px 12px",
                borderRadius: 20,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ff4d88, #a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {authorInitial}
              </span>
              <span style={{ color: "#666", fontSize: 13, fontWeight: 500 }}>
                @{authorName}
              </span>
            </div>

            <span style={{ color: "#bbb", fontSize: 12 }}>•</span>
            <span style={{ color: "#999", fontSize: 12 }}>
              {hoursAgo > 0 ? `${hoursAgo}시간 전` : "방금 전"}
            </span>
          </div>

          {/* 제목 & 본문 요약 */}
          {post.title && (
            <h4
              style={{
                margin: "0 0 10px",
                fontSize: 18,
                fontWeight: 800,
                color: "#1a1a1a",
              }}
            >
              {post.title}
            </h4>
          )}
          <p
            style={{
              margin: 0,
              color: "#555",
              fontSize: 15,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {post.text && post.text.length > 150
              ? post.text.slice(0, 150) + "..."
              : post.text}
          </p>
        </div>

        {/* 썸네일 이미지 */}
        {post.images && post.images.length > 0 && (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 20,
              overflow: "hidden",
              flexShrink: 0,
              marginLeft: 20,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              border: "3px solid #fff",
            }}
          >
            <img
              src={post.images[0]}
              alt="post"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        )}
      </div>

      {/* 태그 + 좋아요/댓글 수 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          marginTop: 4,
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {post.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(255,77,136,0.08))",
                color: "#8b5cf6",
                padding: "6px 14px",
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* ✅ 좋아요 수 / 댓글 수는 항상 표시 */}
        <div
          style={{
            display: "flex",
            gap: 20,
            color: "#888",
            fontSize: 14,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 20,
              background: "rgba(255,77,136,0.06)",
              color: "#ff4d88",
              fontWeight: 600,
            }}
          >
            ❤️ {post.likes || 0}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 20,
              background: "rgba(139,92,246,0.06)",
              color: "#8b5cf6",
              fontWeight: 600,
            }}
          >
            💬 {commentsCount}
          </span>
        </div>
      </div>

      {/* 하단 버튼 영역 - 이제는 자세히 보기만 */}
      {!ownerOnlyActions && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: 16,
            position: "relative",
            zIndex: 1,
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDetail();
            }}
            style={{
              border: "none",
              padding: "8px 18px",
              borderRadius: 12,
              background: "linear-gradient(135deg,#ff4d88,#a855f7)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(139,92,246,0.12)",
            }}
          >
            자세히 보기
          </button>
        </div>
      )}
    </div>
  );
}

export default PostCard;

// components/GlobalBGM.jsx - 전역 BGM 플레이어
import React, { useState, useRef, useEffect } from 'react';

function GlobalBGM() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);

  // 딸기 맛 사이다 BGM
  const bgmUrl = '/sounds/strawberry-soda.mp3';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.log('자동 재생 차단됨:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      <audio ref={audioRef} src={bgmUrl} preload="auto" />
      
      {/* BGM 플레이어 UI */}
      <div
        style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8
        }}
      >
        {/* 확장된 컨트롤 패널 */}
        {isExpanded && (
          <div
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 16,
              padding: '16px 20px',
              boxShadow: '0 8px 32px rgba(255,77,136,0.2)',
              border: '2px solid rgba(255,77,136,0.2)',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div style={{ 
              fontSize: 12, 
              color: '#888', 
              marginBottom: 8,
              fontWeight: 600
            }}>
              🍓 딸기 맛 사이다
            </div>
            
            {/* 볼륨 슬라이더 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  width: 100,
                  accentColor: '#ff4d88',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: 14 }}>🔊</span>
            </div>
            
            <div style={{ 
              fontSize: 10, 
              color: '#aaa', 
              marginTop: 8,
              textAlign: 'center'
            }}>
              Volume: {Math.round(volume * 100)}%
            </div>
          </div>
        )}

        {/* 메인 버튼 */}
        <div style={{ display: 'flex', gap: 8 }}>
          {/* 설정 버튼 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            ⚙️
          </button>

          {/* 재생/일시정지 버튼 */}
          <button
            onClick={togglePlay}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: 'none',
              background: isPlaying 
                ? 'linear-gradient(135deg, #ff4d88, #ff6b9d)' 
                : 'linear-gradient(135deg, #a855f7, #8b5cf6)',
              boxShadow: isPlaying 
                ? '0 4px 20px rgba(255,77,136,0.4)' 
                : '0 4px 20px rgba(168,85,247,0.4)',
              cursor: 'pointer',
              fontSize: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              animation: isPlaying ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isPlaying ? '⏸️' : '🎵'}
          </button>
        </div>

        {/* 재생 중 표시 */}
        {isPlaying && (
          <div
            style={{
              background: 'rgba(255,77,136,0.1)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 11,
              color: '#ff4d88',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span style={{ animation: 'pulse 1s ease-in-out infinite' }}>♪</span>
            Now Playing
            <span style={{ animation: 'pulse 1s ease-in-out infinite 0.5s' }}>♪</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}

export default GlobalBGM;

// client/src/components/RouletteWheel.jsx
import React, { useRef, useEffect, useState } from 'react';

function RouletteWheel({ rewards, rotationAngle, isSpinning }) {
  const [segments, setSegments] = useState([]);
  const radius = 200;
  const center = radius + 20;
  const degToRad = (d) => (d * Math.PI) / 180;

  // 화려한 그라데이션 색상 팔레트 (핑크/퍼플/골드 테마)
  const colorPalette = [
    { bg: '#ff4d88', text: '#fff' },      // 핫핑크
    { bg: '#a855f7', text: '#fff' },      // 퍼플
    { bg: '#ff6b9d', text: '#fff' },      // 라이트핑크
    { bg: '#8b5cf6', text: '#fff' },      // 바이올렛
    { bg: '#f472b6', text: '#fff' },      // 핑크
    { bg: '#c084fc', text: '#fff' },      // 라벤더
    { bg: '#fb7185', text: '#fff' },      // 로즈
    { bg: '#a78bfa', text: '#fff' },      // 라일락
    { bg: '#fbbf24', text: '#333' },      // 골드 (포인트용)
    { bg: '#f59e0b', text: '#333' },      // 앰버 (포인트용)
    { bg: '#9ca3af', text: '#fff' },      // 그레이 (꽝용)
  ];

  useEffect(() => {
    if (Array.isArray(rewards) && rewards.length > 0) {
      setSegments(rewards.map((r) => ({ label: r.name, key: r.name, type: r.type, brand: r.brand })));
    }
  }, [rewards]);

  if (!segments || segments.length === 0) {
    return <div style={{ textAlign: 'center', padding: 32, color: '#888' }}>룰렛 로딩중...</div>;
  }

  const getSegmentColor = (seg, index) => {
    if (seg.type === 'NONE') return { bg: '#d1d5db', text: '#666' };
    if (seg.type === 'POINTS') {
      return seg.label.includes('50') 
        ? { bg: 'url(#goldGradient)', text: '#333' }
        : { bg: 'url(#amberGradient)', text: '#333' };
    }
    // 쿠폰은 핑크/퍼플 계열 번갈아가며
    const couponColors = [
      { bg: 'url(#pinkGradient)', text: '#fff' },
      { bg: 'url(#purpleGradient)', text: '#fff' },
      { bg: 'url(#roseGradient)', text: '#fff' },
      { bg: 'url(#violetGradient)', text: '#fff' },
      { bg: 'url(#fuchsiaGradient)', text: '#fff' },
      { bg: 'url(#lavenderGradient)', text: '#fff' },
      { bg: 'url(#coralGradient)', text: '#fff' },
      { bg: 'url(#orchidGradient)', text: '#fff' },
    ];
    return couponColors[index % couponColors.length];
  };

  return (
    <div style={{ position: 'relative', width: center * 2, height: center * 2 }}>
      {/* 외곽 글로우 링 */}
      <div style={{
        position: 'absolute',
        top: -10, left: -10, right: -10, bottom: -10,
        borderRadius: '50%',
        background: 'conic-gradient(from 0deg, #ff4d88, #a855f7, #3b82f6, #10b981, #fbbf24, #ff4d88)',
        opacity: isSpinning ? 0.8 : 0.4,
        animation: isSpinning ? 'spin 2s linear infinite' : 'pulse 3s ease-in-out infinite',
        filter: 'blur(8px)',
        zIndex: -1
      }} />
      
      {/* 화살표 */}
      <div style={{ 
        position: 'absolute', 
        left: '50%', 
        top: -8, 
        transform: 'translateX(-50%)', 
        zIndex: 50,
        filter: 'drop-shadow(0 4px 8px rgba(255,77,136,0.5))'
      }}>
        <svg width="44" height="44" viewBox="0 0 44 44">
          <defs>
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff4d88" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="arrowGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path 
            d="M22 40 L8 8 L22 16 L36 8 Z" 
            fill="url(#arrowGradient)" 
            stroke="#fff" 
            strokeWidth="2"
            filter="url(#arrowGlow)"
          />
          <circle cx="22" cy="20" r="4" fill="#fff" />
        </svg>
      </div>
      
      {/* SVG 룰렛 */}
      <svg 
        width={center * 2} 
        height={center * 2} 
        viewBox={`0 0 ${center * 2} ${center * 2}`}
        style={{ 
          display: 'block',
          transition: 'transform 4s cubic-bezier(.17,.67,.12,.99)',
          transform: `rotate(${rotationAngle}deg)`
        }}
      >
        <defs>
          {/* 그라데이션 정의 */}
          <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d88" />
            <stop offset="100%" stopColor="#ff6b9d" />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#fda4af" />
          </linearGradient>
          <linearGradient id="violetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="fuchsiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
          <linearGradient id="lavenderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a5b4fc" />
          </linearGradient>
          <linearGradient id="coralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#f9a8d4" />
          </linearGradient>
          <linearGradient id="orchidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#d8b4fe" />
          </linearGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d88" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="innerShadow">
            <feOffset dx="0" dy="2"/>
            <feGaussianBlur stdDeviation="2" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.15" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
          <filter id="segmentGlow">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 외곽 장식 링 */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius + 8} 
          fill="none" 
          stroke="url(#centerGradient)" 
          strokeWidth="4"
          opacity="0.6"
        />
        
        {/* 점선 장식 */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius + 14} 
          fill="none" 
          stroke="#fff" 
          strokeWidth="2"
          strokeDasharray="8 8"
          opacity="0.5"
        />

        <g transform={`translate(${center},${center})`}>
          {segments.map((seg, i) => {
            const angle = 360 / segments.length;
            const start = i * angle;
            const end = start + angle;
            const x1 = radius * Math.cos(degToRad(start));
            const y1 = radius * Math.sin(degToRad(start));
            const x2 = radius * Math.cos(degToRad(end));
            const y2 = radius * Math.sin(degToRad(end));
            const path = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
            const textAngle = start + angle / 2;
            const textR = radius * 0.62;
            const textX = textR * Math.cos(degToRad(textAngle));
            const textY = textR * Math.sin(degToRad(textAngle));
            
            const colors = getSegmentColor(seg, i);
            const iconR = radius * 0.85;
            const iconX = iconR * Math.cos(degToRad(textAngle));
            const iconY = iconR * Math.sin(degToRad(textAngle));

            // 아이콘 결정
            let icon = '🎫';
            if (seg.type === 'POINTS') icon = '💰';
            else if (seg.type === 'NONE') icon = '😢';

            return (
              <g key={i}>
                <path 
                  d={path} 
                  fill={colors.bg} 
                  stroke="#fff" 
                  strokeWidth={2.5}
                  filter="url(#innerShadow)"
                />
                {/* 세그먼트 하이라이트 */}
                <path 
                  d={path} 
                  fill="url(#segmentHighlight)" 
                  opacity="0.1"
                />
                {/* 아이콘 */}
                <text 
                  x={iconX} 
                  y={iconY} 
                  fontSize={14} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle} ${iconX} ${iconY})`}
                >
                  {icon}
                </text>
                {/* 텍스트 */}
                <text 
                  x={textX} 
                  y={textY} 
                  fill={colors.text}
                  fontSize={9} 
                  fontWeight={800} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle} ${textX} ${textY})`}
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  {seg.label.length > 12 ? seg.label.substring(0, 12) + '...' : seg.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* 중앙 장식 원들 */}
        <circle cx={center} cy={center} r={45} fill="url(#centerGradient)" filter="url(#segmentGlow)" />
        <circle cx={center} cy={center} r={38} fill="#fff" />
        <circle cx={center} cy={center} r={32} fill="url(#centerGradient)" opacity="0.1" />
        
        {/* 중앙 텍스트 */}
        <text 
          x={center} 
          y={center - 6} 
          textAnchor="middle" 
          fontSize={11} 
          fontWeight={900} 
          fill="#ff4d88"
        >
          LUCKY
        </text>
        <text 
          x={center} 
          y={center + 10} 
          textAnchor="middle" 
          fontSize={14} 
          fontWeight={900} 
          fill="#a855f7"
        >
          SPIN
        </text>
      </svg>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

export default RouletteWheel;

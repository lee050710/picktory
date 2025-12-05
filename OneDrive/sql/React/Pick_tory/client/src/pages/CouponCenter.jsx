// client/src/pages/CouponCenter.jsx
import React, { useEffect, useState, useRef } from 'react';
import { getMyCoupons, redeemCoupon } from '../api/couponApi';
import RouletteWheel from '../components/RouletteWheel';

function CouponCenter() {
  const [coupons, setCoupons] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [spinResult, setSpinResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);

  const [showResultModal, setShowResultModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState('roulette');

  // 포인트 & 통계 로드
  useEffect(() => {
    const savedPoints = localStorage.getItem('my_points');
    const savedStreak = localStorage.getItem('spin_streak');
    const savedTotalSpins = localStorage.getItem('total_spins');
    
    if (savedPoints) {
      // 저장된 포인트가 있으면 그대로 사용
      setPoints(parseInt(savedPoints, 10));
    } else {
      // 처음 방문 시 300P 지급 (발표용)
      setPoints(300);
      localStorage.setItem('my_points', '300');
    }
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedTotalSpins) setTotalSpins(parseInt(savedTotalSpins, 10));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // localStorage에서 쿠폰 가져오기
        const savedCoupons = JSON.parse(localStorage.getItem('my_coupons') || '[]');
        setCoupons(savedCoupons);
        
        const defaultRewards = [
          { name: '이니스프리 10% OFF', type: 'COUPON', probability: 8, brand: 'Innisfree', url: 'https://www.innisfree.com', color: '#2d5a27' },
          { name: '에뛰드 10% OFF', type: 'COUPON', probability: 8, brand: 'Etude', url: 'https://www.etude.com', color: '#ff6b9d' },
          { name: '토니모리 10% OFF', type: 'COUPON', probability: 6, brand: 'TonyMoly', url: 'https://www.tonymoly.com', color: '#00a651' },
          { name: '미샤 10% OFF', type: 'COUPON', probability: 5, brand: 'Missha', url: 'https://www.missha.com', color: '#8b4513' },
          { name: '클리오 10% OFF', type: 'COUPON', probability: 6, brand: 'Clio', url: 'https://www.cliocosmetic.com', color: '#000' },
          { name: '롬앤 10% OFF', type: 'COUPON', probability: 7, brand: "Rom&nd", url: 'https://romand.co.kr', color: '#ff4d6d' },
          { name: '라네즈 10% OFF', type: 'COUPON', probability: 5, brand: 'Laneige', url: 'https://www.laneige.com', color: '#87ceeb' },
          { name: '올리브영 10% OFF', type: 'COUPON', probability: 7, brand: 'OliveYoung', url: 'https://www.oliveyoung.co.kr', color: '#9acd32' },
          { name: '10 포인트', type: 'POINTS', probability: 10, color: '#ffd700' },
          { name: '50 포인트', type: 'POINTS', probability: 8, color: '#ffa500' },
          { name: '꽝', type: 'NONE', probability: 30, color: '#ccc' },
        ];
        setRewards(defaultRewards);
      } catch (err) {
        console.error(err);
        setRewards([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const weightedPick = (items) => {
    const total = items.reduce((s, it) => s + (it.probability || 0), 0);
    const r = Math.random() * total;
    let acc = 0;
    for (const it of items) {
      acc += (it.probability || 0);
      if (r <= acc) return it;
    }
    return items[items.length - 1];
  };

  const handleSpin = () => {
    if (isSpinning || rewards.length === 0) return;
    
    if (points < 100) {
      alert(`❌ 포인트가 부족합니다!\n\n현재 포인트: ${points}P\n필요 포인트: 100P`);
      return;
    }
    const newPoints = points - 100;
    setPoints(newPoints);
    localStorage.setItem('my_points', newPoints.toString());
    
    const newTotalSpins = totalSpins + 1;
    setTotalSpins(newTotalSpins);
    localStorage.setItem('total_spins', newTotalSpins.toString());
    
    setIsSpinning(true);
    setSpinResult(null);
    
    const resReward = weightedPick(rewards);
    const totalSegments = rewards.length;
    const segmentAngle = 360 / totalSegments;
    const rewardIndex = rewards.findIndex(r => r.name === resReward.name);
    
    // SVG 좌표계: 0도 = 3시 방향, 시계방향으로 증가
    // 화살표: 12시 방향 (= -90도 = 270도)
    // 세그먼트 i의 중앙 각도: i * segmentAngle + segmentAngle/2
    // 해당 세그먼트가 12시에 오려면: -(세그먼트중앙각도 + 90도) 만큼 회전
    const segmentCenterAngle = rewardIndex * segmentAngle + segmentAngle / 2;
    const spins = 5 + Math.floor(Math.random() * 3);
    const targetAngle = -(segmentCenterAngle + 90);
    const totalRotation = spins * 360 + targetAngle;
    
    // 절대 각도로 설정 (이전 각도 무시)
    const currentNormalized = rotationAngle % 360;
    const adjustment = totalRotation - currentNormalized;
    setRotationAngle(prev => prev + adjustment + spins * 360);
    
    setTimeout(() => {
      setIsSpinning(false);
      setShowConfetti(true);
      setSpinResult({ success: true, reward: resReward });
      setShowResultModal(true);
      setTimeout(() => setShowConfetti(false), 4000);
      
      if (resReward.type === 'COUPON') {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('spin_streak', newStreak.toString());
        
        const couponCode = resReward.brand.toUpperCase() + '-' + Math.random().toString(36).slice(2,8).toUpperCase();
        const newCoupon = { 
          _id: 'coupon-' + Date.now(), 
          brand: resReward.brand, 
          name: resReward.name,
          code: couponCode, 
          discount: resReward.name.match(/(\d+%)/)?.[0] || '10%', 
          url: resReward.url,
          redeemed: false,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        const savedCoupons = JSON.parse(localStorage.getItem('my_coupons') || '[]');
        savedCoupons.unshift(newCoupon);
        localStorage.setItem('my_coupons', JSON.stringify(savedCoupons));
        setCoupons(prev => [newCoupon, ...prev]);
      } else if (resReward.type === 'POINTS') {
        const pointsWon = parseInt(resReward.name, 10) || 0;
        const currentPoints = parseInt(localStorage.getItem('my_points') || '0', 10);
        const updatedPoints = currentPoints + pointsWon;
        setPoints(updatedPoints);
        localStorage.setItem('my_points', updatedPoints.toString());
      } else {
        setStreak(0);
        localStorage.setItem('spin_streak', '0');
      }
    }, 4200);
  };

  const getRankBadge = () => {
    if (totalSpins >= 100) return { name: '💎 다이아몬드', color: '#b9f2ff' };
    if (totalSpins >= 50) return { name: '👑 플래티넘', color: '#e5e4e2' };
    if (totalSpins >= 20) return { name: '🥇 골드', color: '#ffd700' };
    if (totalSpins >= 10) return { name: '🥈 실버', color: '#c0c0c0' };
    return { name: '🥉 브론즈', color: '#cd7f32' };
  };

  const rank = getRankBadge();
  
  // 새로고침 시 한 번만 계산되는 행운 지수
  const [luckyIndex] = useState(() => Math.floor(Math.random() * 30) + 70);

  return (
    <div 
      ref={containerRef}
      className="page-enter" 
      style={{ 
        padding: '40px 20px 80px', 
        background: `
          radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,77,136,0.12) 0%, transparent 40%),
          radial-gradient(circle at 80% 20%, rgba(168,85,247,0.08) 0%, transparent 30%),
          radial-gradient(circle at 20% 80%, rgba(59,130,246,0.08) 0%, transparent 30%),
          linear-gradient(180deg, #fffbfc 0%, #fff5f7 20%, #faf5ff 50%, #f0f9ff 80%, #f5fffa 100%)
        `, 
        minHeight: '100vh', 
        position: 'relative',
        transition: 'background 0.5s ease'
      }}>
      
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(8deg); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 30px rgba(255,77,136,0.4), 0 0 60px rgba(168,85,247,0.2); } 50% { box-shadow: 0 0 50px rgba(255,77,136,0.6), 0 0 100px rgba(168,85,247,0.3); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes rainbow { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        @keyframes confettiFall { 
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } 
        }
        @keyframes modalIn { 
          from { opacity: 0; transform: scale(0.8) translateY(20px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes wiggle { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        .glass-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .coupon-card { 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .coupon-card:hover { 
          transform: translateY(-8px) scale(1.02) rotate(-1deg); 
          box-shadow: 0 25px 60px rgba(255,77,136,0.25), 0 10px 20px rgba(0,0,0,0.1); 
        }
        .reward-item { 
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .reward-item:hover { 
          transform: translateX(8px) scale(1.02); 
          background: linear-gradient(135deg, rgba(255,77,136,0.18), rgba(168,85,247,0.18)) !important; 
          box-shadow: 0 8px 24px rgba(255,77,136,0.15);
        }
        .sparkle-btn {
          position: relative;
          overflow: hidden;
        }
        .sparkle-btn::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%);
          transform: rotate(45deg);
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* 플로팅 장식 */}
      <div style={{ position: 'fixed', top: 80, left: '3%', fontSize: 42, animation: 'float 7s ease-in-out infinite', opacity: 0.5, pointerEvents: 'none', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>🎫</div>
      <div style={{ position: 'fixed', top: 150, right: '8%', fontSize: 32, animation: 'float 5s ease-in-out infinite 1s', opacity: 0.4, pointerEvents: 'none' }}>✨</div>
      <div style={{ position: 'fixed', top: 300, left: '10%', fontSize: 28, animation: 'floatSlow 8s ease-in-out infinite', opacity: 0.35, pointerEvents: 'none' }}>🌸</div>
      <div style={{ position: 'fixed', bottom: 200, left: '5%', fontSize: 26, animation: 'float 6s ease-in-out infinite 2s', opacity: 0.4, pointerEvents: 'none' }}>🎁</div>
      <div style={{ position: 'fixed', bottom: 300, right: '4%', fontSize: 38, animation: 'heartbeat 2s ease-in-out infinite', opacity: 0.5, pointerEvents: 'none' }}>💖</div>
      <div style={{ position: 'fixed', top: 400, right: '15%', fontSize: 24, animation: 'sparkle 3s ease-in-out infinite', opacity: 0.6, pointerEvents: 'none' }}>⭐</div>
      <div style={{ position: 'fixed', bottom: 150, right: '20%', fontSize: 30, animation: 'wiggle 2s ease-in-out infinite', opacity: 0.4, pointerEvents: 'none' }}>🦋</div>

      {/* 컨페티 */}
      {showConfetti && (
        <>
          {[...Array(80)].map((_, i) => (
            <div key={i} style={{ 
              position: 'fixed', left: `${Math.random() * 100}%`, top: '-20px',
              width: `${Math.random() * 12 + 6}px`, height: `${Math.random() * 12 + 6}px`,
              background: ['#ff4d88', '#ff2d6f', '#ffd7e4', '#ffb3d1', '#a855f7', '#ffd700', '#3b82f6', '#10b981', '#f472b6'][Math.floor(Math.random() * 9)],
              borderRadius: Math.random() > 0.5 ? '50%' : '3px',
              animation: `confettiFall ${Math.random() * 2.5 + 2}s linear forwards`,
              animationDelay: `${Math.random() * 0.8}s`, zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}></div>
          ))}
        </>
      )}

      {/* 결과 모달 */}
      {showResultModal && spinResult && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }} onClick={() => setShowResultModal(false)}>
          <div style={{
            background: 'linear-gradient(180deg, #fff 0%, #fff5f7 100%)',
            borderRadius: 32, padding: '48px 56px', textAlign: 'center',
            boxShadow: '0 40px 100px rgba(255,77,136,0.4)',
            animation: 'modalIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            maxWidth: 420, width: '90%', position: 'relative', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'absolute', top: -100, left: -100, width: 200, height: 200, background: 'radial-gradient(circle, rgba(255,77,136,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -80, right: -80, width: 160, height: 160, background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
            
            <div style={{ fontSize: 72, marginBottom: 20, animation: 'bounce 1s ease-in-out infinite', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}>
              {spinResult.reward.type === 'COUPON' ? '🎉' : spinResult.reward.type === 'POINTS' ? '💰' : '😢'}
            </div>
            <div style={{ 
              fontSize: 32, fontWeight: 900, marginBottom: 12,
              background: spinResult.reward.type !== 'NONE' 
                ? 'linear-gradient(135deg, #ff4d88 0%, #a855f7 50%, #3b82f6 100%)' 
                : 'linear-gradient(135deg, #888, #666)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'shimmer 2s linear infinite'
            }}>
              {spinResult.reward.type !== 'NONE' ? '축하합니다!' : '아쉬워요...'}
            </div>
            <div style={{ 
              fontSize: 24, fontWeight: 700, color: '#333', marginBottom: 24,
              padding: '16px 24px', background: 'rgba(255,77,136,0.08)', borderRadius: 16
            }}>
              {spinResult.reward.name}
            </div>
            {spinResult.reward.type === 'COUPON' && (
              <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>🎫 쿠폰이 쿠폰함에 추가되었습니다!</div>
            )}
            {spinResult.reward.type === 'POINTS' && (
              <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>💰 현재 보유 포인트: <strong style={{ color: '#ff8c00' }}>{points}P</strong></div>
            )}
            <button 
              onClick={() => setShowResultModal(false)}
              style={{
                background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
                color: '#fff', border: 'none', padding: '16px 48px',
                borderRadius: 50, fontSize: 16, fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,77,136,0.4)'
              }}
            >확인</button>
          </div>
        </div>
      )}
      
      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 36, animation: 'slideUp 0.6s ease-out' }}>
          <div style={{ 
            display: 'inline-block', 
            background: 'linear-gradient(135deg, rgba(255,77,136,0.1), rgba(168,85,247,0.1))',
            padding: '8px 20px', borderRadius: 50, marginBottom: 16,
            border: '1px solid rgba(255,77,136,0.2)'
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ff4d88' }}>✨ 100P로 룰렛을 돌려보세요!</span>
          </div>
          <h2 style={{ 
            fontSize: 48, fontWeight: 900, marginBottom: 16,
            background: 'linear-gradient(135deg, #ff4d88 0%, #ff6b9d 25%, #a855f7 50%, #3b82f6 75%, #10b981 100%)',
            backgroundSize: '300% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'gradientMove 5s linear infinite'
          }}>🎰 럭키 뷰티 룰렛</h2>
          <p style={{ color: '#666', fontSize: 17, fontWeight: 500 }}>
            행운의 룰렛을 돌려 <span style={{ color: '#ff4d88', fontWeight: 700 }}>브랜드 쿠폰</span>과 <span style={{ color: '#ffa500', fontWeight: 700 }}>포인트</span>를 획득하세요! 🍀
          </p>
        </div>

        {/* 통계 바 */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center', animation: 'slideUp 0.6s ease-out 0.1s both' }}>
          <div className="glass-card" style={{ 
            padding: '20px 32px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16,
            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1))',
            border: '2px solid rgba(255,215,0,0.3)'
          }}>
            <div style={{ fontSize: 36, animation: 'bounce 2s ease-in-out infinite' }}>💰</div>
            <div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>내 포인트</div>
              <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #ff8c00, #ffd700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{points.toLocaleString()}P</div>
            </div>
          </div>

          <div className="glass-card" style={{ 
            padding: '20px 32px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16,
            background: `linear-gradient(135deg, ${rank.color}22, ${rank.color}11)`,
            border: `2px solid ${rank.color}55`
          }}>
            <div style={{ fontSize: 36, animation: 'pulse 2s ease-in-out infinite' }}>{rank.name.split(' ')[0]}</div>
            <div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>내 등급</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#333' }}>{rank.name.split(' ')[1]}</div>
            </div>
          </div>

          <div className="glass-card" style={{ 
            padding: '20px 32px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16,
            background: 'linear-gradient(135deg, rgba(255,77,136,0.1), rgba(168,85,247,0.08))',
            border: '2px solid rgba(255,77,136,0.2)'
          }}>
            <div style={{ fontSize: 36, animation: 'heartbeat 1.5s ease-in-out infinite' }}>🔥</div>
            <div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>연속 당첨</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#ff4d88' }}>{streak}회</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px 32px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 36 }}>🎯</div>
            <div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>총 참여</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6' }}>{totalSpins}회</div>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, justifyContent: 'center', animation: 'slideUp 0.6s ease-out 0.15s both' }}>
          {[
            { id: 'roulette', label: '🎰 룰렛' },
            { id: 'coupons', label: '🎫 내 쿠폰함' },
            { id: 'rewards', label: '🎁 보상 목록' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 28px', borderRadius: 50, border: 'none',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #ff4d88, #a855f7)' : 'rgba(255,255,255,0.8)',
                color: activeTab === tab.id ? '#fff' : '#666',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 8px 24px rgba(255,77,136,0.35)' : '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* 룰렛 탭 */}
        {activeTab === 'roulette' && (
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', animation: 'slideUp 0.5s ease-out' }}>
            <div className="glass-card" style={{ 
              flex: 1, borderRadius: 32, padding: '48px', 
              minHeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,77,136,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: -80, right: -80, width: 250, height: 250, background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
              
              <div style={{ 
                position: 'relative', padding: 20, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,77,136,0.05) 100%)',
                boxShadow: isSpinning ? '0 0 60px rgba(255,77,136,0.5)' : '0 20px 60px rgba(0,0,0,0.1)',
                animation: isSpinning ? 'glow 0.5s ease-in-out infinite' : 'none'
              }}>
                <RouletteWheel rewards={rewards} rotationAngle={rotationAngle} isSpinning={isSpinning} spinResult={spinResult} />
              </div>

              <div style={{ marginTop: 36, textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleSpin()} 
                    disabled={isSpinning || points < 100}
                    className="sparkle-btn"
                    style={{ 
                      background: (isSpinning || points < 100) ? 'linear-gradient(135deg, #ccc, #aaa)' : 'linear-gradient(135deg, #ff4d88, #ff6b9d, #a855f7)',
                      backgroundSize: '200% auto', color: '#fff', border: 'none', padding: '18px 36px', borderRadius: 50, 
                      fontWeight: 800, fontSize: 17, 
                      boxShadow: (isSpinning || points < 100) ? 'none' : '0 12px 36px rgba(255,77,136,0.4)', 
                      cursor: (isSpinning || points < 100) ? 'not-allowed' : 'pointer',
                      animation: (isSpinning || points < 100) ? 'none' : 'glow 2.5s ease-in-out infinite'
                    }}
                  >{isSpinning ? '🎰 돌아가는 중...' : '🎯 스핀하기 (-100P)'}</button>
                </div>
                
                <p style={{ color: '#888', fontSize: 14, marginTop: 20 }}>
                  {points >= 100 ? `✅ 참여 가능 (보유: ${points.toLocaleString()}P)` : `❌ 포인트 부족 (보유: ${points.toLocaleString()}P / 필요: 100P)`}
                </p>
              </div>
            </div>

            <div style={{ width: 360 }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                borderRadius: 24, padding: '28px', marginBottom: 20,
                boxShadow: '0 16px 48px rgba(102,126,234,0.35)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: -30, right: -30, fontSize: 100, opacity: 0.15 }}>🍀</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: 8 }}>오늘의 행운 지수</div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    {luckyIndex}%
                  </div>
                  <div style={{ marginTop: 16, padding: '10px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600 }}>
                    💫 오늘은 쿠폰 당첨 확률이 높아요!
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ borderRadius: 24, padding: '24px' }}>
                <h4 style={{ marginTop: 0, fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📜</span> 최근 당첨 기록
                </h4>
                {coupons.slice(0, 5).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                    <div style={{ fontSize: 40, marginBottom: 8, opacity: 0.5 }}>🎫</div>
                    <div>아직 당첨 기록이 없어요</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {coupons.slice(0, 5).map((c, idx) => (
                      <div key={c._id} style={{ 
                        display: 'flex', alignItems: 'center', gap: 12, 
                        padding: '12px 14px', borderRadius: 14,
                        background: idx === 0 ? 'linear-gradient(135deg, rgba(255,77,136,0.1), rgba(168,85,247,0.1))' : 'rgba(0,0,0,0.02)',
                        animation: `slideIn 0.4s ease-out ${idx * 0.1}s both`
                      }}>
                        <div style={{ fontSize: 24 }}>🎫</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>{c.brand}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{c.discount}</div>
                        </div>
                        {idx === 0 && <span style={{ fontSize: 11, background: '#ff4d88', color: '#fff', padding: '4px 8px', borderRadius: 10, fontWeight: 700 }}>NEW</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 쿠폰함 탭 */}
        {activeTab === 'coupons' && (
          <div className="glass-card" style={{ borderRadius: 32, padding: '40px', animation: 'slideUp 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12, margin: 0 }}>
                <span style={{ animation: 'bounce 2s ease-in-out infinite' }}>🎫</span>
                내 쿠폰함
                <span style={{ background: 'linear-gradient(135deg, #ff4d88, #a855f7)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 700 }}>{coupons.length}장</span>
              </h3>
            </div>

            {coupons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 80, marginBottom: 20, animation: 'float 4s ease-in-out infinite' }}>🎫</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#666', marginBottom: 8 }}>보유한 쿠폰이 없습니다</div>
                <div style={{ color: '#888', fontSize: 15 }}>룰렛을 돌려 쿠폰을 획득해보세요!</div>
                <button 
                  onClick={() => setActiveTab('roulette')}
                  style={{ marginTop: 24, background: 'linear-gradient(135deg, #ff4d88, #a855f7)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 50, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,77,136,0.3)' }}
                >룰렛 돌리러 가기 →</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                {coupons.map((c, idx) => (
                  <div key={c._id} className="coupon-card" style={{ 
                    padding: '24px', borderRadius: 20, 
                    background: c.redeemed ? 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' : 'linear-gradient(135deg, #fff 0%, #fff5f7 100%)',
                    border: c.redeemed ? '2px dashed #ccc' : '2px dashed rgba(255,77,136,0.3)',
                    position: 'relative', overflow: 'hidden',
                    animation: `slideUp 0.4s ease-out ${idx * 0.08}s both`,
                    opacity: c.redeemed ? 0.7 : 1
                  }}>
                    <div style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, background: '#fff5f7', borderRadius: '50%', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }} />
                    <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, background: '#fff5f7', borderRadius: '50%', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{c.redeemed ? '사용완료' : '사용가능'}</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: c.redeemed ? '#888' : '#ff4d88', marginBottom: 4 }}>{c.brand}</div>
                        <div style={{ fontSize: 15, color: '#666', marginBottom: 12 }}>{c.name || c.discount}</div>
                        <div style={{ display: 'inline-block', padding: '8px 14px', background: 'rgba(0,0,0,0.04)', borderRadius: 10, fontFamily: 'monospace', fontSize: 14, color: '#555', letterSpacing: 1 }}>{c.code}</div>
                        {c.expiresAt && <div style={{ fontSize: 12, color: '#888', marginTop: 10 }}>⏰ {c.expiresAt}까지</div>}
                      </div>
                      {!c.redeemed && (
                        <button 
                          onClick={() => { 
                            navigator.clipboard.writeText(c.code);
                            alert(`✅ 쿠폰 코드 복사 완료!\n\n${c.code}`);
                            if (c.url) window.open(c.url, '_blank');
                            setCoupons(prev => prev.map(coupon => coupon._id === c._id ? {...coupon, redeemed: true} : coupon));
                            const savedCoupons = JSON.parse(localStorage.getItem('my_coupons') || '[]');
                            const updated = savedCoupons.map(sc => sc._id === c._id ? {...sc, redeemed: true} : sc);
                            localStorage.setItem('my_coupons', JSON.stringify(updated));
                          }} 
                          style={{ padding: '14px 24px', borderRadius: 14, background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,77,136,0.3)', whiteSpace: 'nowrap' }}
                        >사용하기</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 보상 목록 탭 */}
        {activeTab === 'rewards' && (
          <div className="glass-card" style={{ borderRadius: 32, padding: '40px', animation: 'slideUp 0.5s ease-out' }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ animation: 'wiggle 2s ease-in-out infinite' }}>🎁</span>
              획득 가능한 보상
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {rewards.map((r, i) => (
                <div key={i} className="reward-item" style={{ 
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '20px', borderRadius: 20, 
                  background: r.type === 'COUPON' ? `linear-gradient(135deg, ${r.color}15, ${r.color}08)` : r.type === 'POINTS' ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.08))' : 'linear-gradient(135deg, rgba(200,200,200,0.15), rgba(180,180,180,0.08))',
                  border: `1px solid ${r.color}30`,
                  animation: `slideIn 0.4s ease-out ${i * 0.05}s both`
                }}>
                  <div style={{ 
                    width: 50, height: 50, borderRadius: 14, 
                    background: r.type === 'COUPON' ? r.color : r.type === 'POINTS' ? '#ffd700' : '#ccc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, color: '#fff', fontWeight: 900,
                    boxShadow: `0 4px 12px ${r.color}40`
                  }}>
                    {r.type === 'COUPON' ? '🎫' : r.type === 'POINTS' ? '💰' : '❌'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#333', marginBottom: 4 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{r.type === 'COUPON' ? r.brand : r.type === 'POINTS' ? '포인트 적립' : '꽝'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg, #ff4d88, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{r.probability}%</div>
                    <div style={{ fontSize: 11, color: '#888' }}>확률</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(168,85,247,0.08))', borderRadius: 20, border: '1px solid rgba(59,130,246,0.2)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💡</span> 확률 안내
              </div>
              <div style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
                • 모든 확률은 공정하게 적용됩니다.<br/>
                • 연속 당첨 시 보너스 포인트가 지급될 수 있습니다.<br/>
                • 등급이 높을수록 추가 혜택이 제공됩니다.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CouponCenter;

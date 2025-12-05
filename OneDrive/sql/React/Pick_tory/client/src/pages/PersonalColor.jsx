// pages/PersonalColor.jsx - 퍼스널컬러 테스트
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    id: 1,
    question: "햇빛 아래에서 당신의 피부는 어떻게 보이나요?",
    options: [
      { text: "핑크빛이 도는 밝은 피부", type: "cool" },
      { text: "노르스름하고 따뜻한 느낌", type: "warm" },
      { text: "올리브톤 또는 중성적인 느낌", type: "neutral" }
    ]
  },
  {
    id: 2,
    question: "손목 안쪽의 혈관 색은 어떤가요?",
    options: [
      { text: "파란색 또는 보라색에 가까움", type: "cool" },
      { text: "초록색에 가까움", type: "warm" },
      { text: "파란색과 초록색이 섞여 있음", type: "neutral" }
    ]
  },
  {
    id: 3,
    question: "골드와 실버 주얼리 중 어떤 것이 더 잘 어울리나요?",
    options: [
      { text: "실버, 화이트골드가 더 잘 어울림", type: "cool" },
      { text: "골드, 로즈골드가 더 잘 어울림", type: "warm" },
      { text: "둘 다 잘 어울림", type: "neutral" }
    ]
  },
  {
    id: 4,
    question: "순백색과 아이보리색 옷 중 어떤 것이 더 잘 어울리나요?",
    options: [
      { text: "순백색이 얼굴을 더 화사하게 해줌", type: "cool" },
      { text: "아이보리색이 더 자연스럽고 편안함", type: "warm" },
      { text: "둘 다 괜찮음", type: "neutral" }
    ]
  },
  {
    id: 5,
    question: "야외에서 햇볕을 받으면 피부가 어떻게 되나요?",
    options: [
      { text: "쉽게 빨개지거나 탐", type: "cool" },
      { text: "천천히 건강하게 태닝됨", type: "warm" },
      { text: "처음엔 빨개지다가 나중에 태닝됨", type: "neutral" }
    ]
  },
  {
    id: 6,
    question: "어떤 색상의 립스틱이 더 잘 어울리나요?",
    options: [
      { text: "핑크, 베리, 와인 계열", type: "cool" },
      { text: "코랄, 오렌지, 피치 계열", type: "warm" },
      { text: "누드, MLBB 계열", type: "neutral" }
    ]
  },
  {
    id: 7,
    question: "눈동자 색은 어떤가요?",
    options: [
      { text: "짙은 갈색 또는 검정, 차가운 느낌", type: "cool" },
      { text: "밝은 갈색, 황금빛이 도는 느낌", type: "warm" },
      { text: "그레이 또는 헤이즐", type: "neutral" }
    ]
  }
];

const results = {
  cool: {
    spring: {
      title: "🌸 쿨톤 여름 (Cool Summer)",
      emoji: "💜",
      description: "차분하고 우아한 매력의 소유자! 부드럽고 뮤트된 색상이 잘 어울려요.",
      colors: ["#E6E6FA", "#DDA0DD", "#87CEEB", "#778899", "#C0C0C0", "#FFB6C1"],
      bestColors: "라벤더, 로즈핑크, 스카이블루, 그레이, 소프트화이트",
      avoidColors: "오렌지, 머스타드, 카키",
      celebs: "아이유, 수지, 윈터",
      makeupTip: "블루베이스 핑크 립, 라벤더 아이섀도우가 찰떡!"
    },
    winter: {
      title: "❄️ 쿨톤 겨울 (Cool Winter)",
      emoji: "💎",
      description: "강렬하고 시크한 매력! 선명하고 대비가 강한 색상이 잘 어울려요.",
      colors: ["#000000", "#FFFFFF", "#FF0080", "#0000FF", "#800080", "#C0C0C0"],
      bestColors: "블랙, 화이트, 버건디, 로얄블루, 핫핑크",
      avoidColors: "브라운, 오렌지, 머스타드",
      celebs: "장원영, 카리나, 제니",
      makeupTip: "딥레드 립, 시크한 스모키 메이크업이 찰떡!"
    }
  },
  warm: {
    spring: {
      title: "🌷 웜톤 봄 (Warm Spring)",
      emoji: "🌻",
      description: "밝고 생기 넘치는 매력! 선명하고 따뜻한 색상이 잘 어울려요.",
      colors: ["#FFD700", "#FF6347", "#FF69B4", "#98FB98", "#FFA500", "#FFFACD"],
      bestColors: "코랄, 피치, 연두, 아이보리, 골드",
      avoidColors: "블랙, 그레이, 버건디",
      celebs: "나연, 유나, 사나",
      makeupTip: "코랄 립, 오렌지 블러셔가 찰떡!"
    },
    autumn: {
      title: "🍂 웜톤 가을 (Warm Autumn)",
      emoji: "🧡",
      description: "깊고 고급스러운 매력! 차분하고 깊이 있는 색상이 잘 어울려요.",
      colors: ["#8B4513", "#D2691E", "#DAA520", "#556B2F", "#BC8F8F", "#F5DEB3"],
      bestColors: "브라운, 카키, 머스타드, 테라코타, 카멜",
      avoidColors: "핑크, 블루, 그레이",
      celebs: "제시카, 선미, 현아",
      makeupTip: "브릭레드 립, 웜브라운 아이섀도우가 찰떡!"
    }
  },
  neutral: {
    title: "⚖️ 뉴트럴톤 (Neutral)",
    emoji: "✨",
    description: "어떤 색이든 잘 소화하는 만능 피부톤! 다양한 색상을 시도해보세요.",
    colors: ["#F5F5DC", "#DEB887", "#BC8F8F", "#708090", "#9370DB", "#E0E0E0"],
    bestColors: "누드, 토프, 더스티로즈, 세이지그린",
    avoidColors: "너무 극단적인 색상만 피하기",
    celebs: "태연, 아이린, 츄",
    makeupTip: "MLBB 립, 자연스러운 눈매 연출이 찰떡!"
  }
};

function PersonalColor() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleAnswer = (type) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (allAnswers) => {
    const counts = { cool: 0, warm: 0, neutral: 0 };
    allAnswers.forEach(answer => {
      counts[answer]++;
    });

    let mainType;
    if (counts.cool > counts.warm && counts.cool > counts.neutral) {
      mainType = 'cool';
    } else if (counts.warm > counts.cool && counts.warm > counts.neutral) {
      mainType = 'warm';
    } else {
      mainType = 'neutral';
    }

    let finalResult;
    if (mainType === 'neutral') {
      finalResult = results.neutral;
    } else {
      // 세부 타입 결정 (간단히 랜덤하게 또는 추가 로직)
      const subTypes = Object.keys(results[mainType]);
      const subType = subTypes[Math.floor(Math.random() * subTypes.length)];
      finalResult = results[mainType][subType];
    }

    setResult(finalResult);
    setShowResult(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ffecd2 100%)',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 배경 장식 */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: 60, opacity: 0.3, animation: 'float 6s ease-in-out infinite' }}>🎨</div>
      <div style={{ position: 'absolute', top: '20%', right: '10%', fontSize: 50, opacity: 0.25, animation: 'float 7s ease-in-out infinite 1s' }}>💄</div>
      <div style={{ position: 'absolute', bottom: '15%', left: '8%', fontSize: 45, opacity: 0.2, animation: 'float 5s ease-in-out infinite 2s' }}>✨</div>
      <div style={{ position: 'absolute', bottom: '25%', right: '5%', fontSize: 55, opacity: 0.25, animation: 'float 8s ease-in-out infinite 0.5s' }}>🌈</div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes confetti {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* 헤더 */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
          animation: 'slideIn 0.6s ease-out'
        }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ff4d88, #a855f7, #3b82f6)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite',
            marginBottom: 12
          }}>
            🎨 퍼스널컬러 테스트
          </h1>
          <p style={{ color: '#666', fontSize: 16 }}>
            나에게 어울리는 컬러를 찾아보세요!
          </p>
        </div>

        {!showResult ? (
          <>
            {/* 진행 바 */}
            <div style={{
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 20,
              height: 12,
              marginBottom: 30,
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff4d88, #a855f7)',
                borderRadius: 20,
                transition: 'width 0.5s ease'
              }} />
            </div>

            {/* 질문 카드 */}
            <div
              key={currentQuestion}
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                padding: '40px 30px',
                boxShadow: '0 20px 60px rgba(255,77,136,0.15)',
                animation: 'pop 0.4s ease-out'
              }}
            >
              <div style={{
                fontSize: 14,
                color: '#ff4d88',
                fontWeight: 700,
                marginBottom: 16
              }}>
                Q{currentQuestion + 1} / {questions.length}
              </div>

              <h2 style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#333',
                marginBottom: 30,
                lineHeight: 1.5
              }}>
                {questions[currentQuestion].question}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.type)}
                    style={{
                      padding: '18px 24px',
                      borderRadius: 16,
                      border: '2px solid rgba(255,77,136,0.2)',
                      background: 'white',
                      fontSize: 16,
                      fontWeight: 500,
                      color: '#333',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#ff4d88';
                      e.target.style.background = 'linear-gradient(135deg, rgba(255,77,136,0.1), rgba(168,85,247,0.1))';
                      e.target.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(255,77,136,0.2)';
                      e.target.style.background = 'white';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* 결과 화면 */
          <div style={{ animation: 'pop 0.5s ease-out' }}>
            {/* 컨페티 효과 */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'fixed',
                  left: `${Math.random() * 100}%`,
                  top: -20,
                  width: 10,
                  height: 10,
                  background: result.colors[i % result.colors.length],
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  animation: `confetti ${2 + Math.random() * 2}s linear forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  zIndex: 0
                }}
              />
            ))}

            <div style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              padding: '40px 30px',
              boxShadow: '0 20px 60px rgba(255,77,136,0.15)',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>
                {result.emoji}
              </div>

              <h2 style={{
                fontSize: 28,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 16
              }}>
                {result.title}
              </h2>

              <p style={{
                fontSize: 16,
                color: '#666',
                marginBottom: 24,
                lineHeight: 1.6
              }}>
                {result.description}
              </p>

              {/* 컬러 팔레트 */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#333', marginBottom: 12 }}>
                  🎨 나의 베스트 컬러
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {result.colors.map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 12,
                        background: color,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: '3px solid white'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* 추천/비추천 */}
              <div style={{
                background: 'rgba(255,77,136,0.05)',
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                textAlign: 'left'
              }}>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: '#ff4d88' }}>✅ 추천 컬러: </span>
                  <span style={{ color: '#555' }}>{result.bestColors}</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: '#a855f7' }}>❌ 피할 컬러: </span>
                  <span style={{ color: '#555' }}>{result.avoidColors}</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, color: '#3b82f6' }}>⭐ 같은 톤 연예인: </span>
                  <span style={{ color: '#555' }}>{result.celebs}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>💄 메이크업 팁: </span>
                  <span style={{ color: '#555' }}>{result.makeupTip}</span>
                </div>
              </div>

              {/* 버튼들 */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={resetTest}
                  style={{
                    padding: '14px 28px',
                    borderRadius: 30,
                    border: 'none',
                    background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255,77,136,0.3)'
                  }}
                >
                  🔄 다시 테스트하기
                </button>
                <button
                  onClick={() => navigate('/feed')}
                  style={{
                    padding: '14px 28px',
                    borderRadius: 30,
                    border: '2px solid #a855f7',
                    background: 'white',
                    color: '#a855f7',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  💄 리뷰 보러가기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 뒤로가기 */}
        {!showResult && currentQuestion > 0 && (
          <button
            onClick={() => {
              setCurrentQuestion(currentQuestion - 1);
              setAnswers(answers.slice(0, -1));
            }}
            style={{
              marginTop: 20,
              padding: '12px 24px',
              borderRadius: 20,
              border: 'none',
              background: 'rgba(255,255,255,0.8)',
              color: '#666',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            ← 이전 질문
          </button>
        )}
      </div>
    </div>
  );
}

export default PersonalColor;

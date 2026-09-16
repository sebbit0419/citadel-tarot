import React, { useState } from 'react';
import { citadelCards } from './data/cards';

function App() {
  const [charA, setCharA] = useState('');
  const [charB, setCharB] = useState('');
  const [relation, setRelation] = useState('');
  const [apiKey, setApiKey] = useState(''); // 사용자가 직접 OpenAI API 키 입력 (보안상 권장)
  const [selectedCard, setSelectedCard] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // 카드 무작위 뽑기
  const drawCard = () => {
    const randomIndex = Math.floor(Math.random() * citadelCards.length);
    setSelectedCard(citadelCards[randomIndex]);
  };

  // OpenAI API 직접 호출 (서버 없이 프론트엔드에서 처리)
  const handleTarotReading = async () => {
    if (!charA || !charB || !selectedCard || !apiKey) {
      alert('캐릭터 정보, API 키, 카드를 모두 입력/선택해주세요!');
      return;
    }

    setLoading(true);
    setResult('');

    const prompt = `
[역할]
당신은 어둡고 탐미적인 분위기의 '시타델 타로'를 해석하는 타로 마스터입니다.

[입력 정보]
- 캐릭터 A: ${charA}
- 캐릭터 B: ${charB}
- 관계성: ${relation}
- 뽑힌 카드: ${selectedCard.name} (키워드: ${selectedCard.keywords.join(', ')})

[출력 양식]
아래 항목별로 감각적이고 매혹적인 문체로 작성해주세요. (단순 노골적 표현보다는 분위기, 주도권, 은밀한 감각 연출에 집중하세요)

1. 💋 키스 & 애무 성향
2. 🔥 흥분 포인트 (자극 요소)
3. 📐 선호하는 체위 & 템포
4. 🗝️ 삽입 및 분위기 (주도권 양상)
5. 🔮 시타델 카드가 암시하는 두 사람의 총평
`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.85
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setResult(data.choices[0].message.content);
      } else {
        alert('API 응답에 오류가 있습니다. API 키를 확인해주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('타로 점을 읽는 도중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0d0d0d', color: '#e0d8c3', minHeight: '100vh', padding: '30px', fontFamily: 'serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #4a3b2c', padding: '25px', borderRadius: '8px', backgroundColor: '#141210' }}>
        <h1 style={{ textAlign: 'center', color: '#c9a86b' }}>🏰 시타델 수위 타로</h1>
        <p style={{ textAlign: 'center', fontSize: '0.9em', color: '#8c8275' }}>은밀한 두 사람의 운명과 성향을 읽어드립니다.</p>
        
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="password" placeholder="OpenAI API Key (sk-...)" value={apiKey} onChange={e => setApiKey(e.target.value)} style={inputStyle} />
          <input placeholder="캐릭터 A 이름" value={charA} onChange={e => setCharA(e.target.value)} style={inputStyle} />
          <input placeholder="캐릭터 B 이름" value={charB} onChange={e => setCharB(e.target.value)} style={inputStyle} />
          <input placeholder="관계성 (예: 연인, 주종, 앙숙)" value={relation} onChange={e => setRelation(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={drawCard} style={buttonStyle}>🔮 시타델 카드 뽑기</button>
        </div>

        {selectedCard && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #c9a86b', borderRadius: '5px', textAlign: 'center' }}>
            <h3 style={{ color: '#c9a86b', margin: '5px 0' }}>{selectedCard.name}</h3>
            <p style={{ fontSize: '0.85em', color: '#a39887' }}>{selectedCard.description}</p>
            <button onClick={handleTarotReading} disabled={loading} style={{ ...buttonStyle, marginTop: '10px', backgroundColor: '#5a1e1e' }}>
              {loading ? '운명의 실타래를 푸는 중...' : '결과 보기'}
            </button>
          </div>
        )}

        {result && (
          <div style={{ marginTop: '25px', whiteSpace: 'pre-wrap', borderTop: '1px solid #4a3b2c', paddingTop: '15px', lineHeight: '1.7' }}>
            <h2 style={{ color: '#c9a86b', textAlign: 'center' }}>📜 해석 결과</h2>
            <div>{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px', backgroundColor: '#1f1c18', border: '1px solid #3d352b', color: '#fff', borderRadius: '4px' };
const buttonStyle = { padding: '10px 20px', backgroundColor: '#3d2e1e', color: '#c9a86b', border: '1px solid #c9a86b', cursor: 'pointer', borderRadius: '4px' };

export default App;
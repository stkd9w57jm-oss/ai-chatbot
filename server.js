require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const OpenAI = require('openai');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const SYSTEM = `당신은 Café Claude라는 에스프레소 바의 AI 바리스타 어시스턴트입니다. 친절하고 따뜻한 톤으로 답변하세요.
장소·카페·맛집·관광지 등 특정 위치를 언급할 때는 반드시 네이버 지도 링크를 포함하세요.
링크 형식 (마크다운): [장소명](https://map.naver.com/p/search/장소명)
예: [스타벅스 강남점](https://map.naver.com/p/search/스타벅스 강남점)`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: 'messages array is required' });

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'system', content: SYSTEM }, ...messages],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { text, language } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });

  const prompt = language && language.startsWith('zh')
    ? `请为下列中文文本加上合适的标点符号，只返回加好标点的文本，不要解释：${text}`
    : `Add proper punctuation to this text and return only the punctuated text, nothing else:\n${text}`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.2,
    }),
  });
  const data = await response.json();
  if (data.choices && data.choices[0]?.message?.content) {
    let result = data.choices[0].message.content.trim();
    // Remove surrounding quotes if present
    if ((result.startsWith('"') && result.endsWith('"')) || (result.startsWith('"') && result.endsWith('"')) || (result.startsWith('"') && result.endsWith('"'))) {
      result = result.slice(1, -1);
    }
    return res.status(200).json({ result });
  }
  return res.status(500).json({ error: data.error?.message || 'Unknown error' });
} 
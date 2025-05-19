export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { text, language } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });

  const messages = [
    {
      role: 'system',
      content: language && language.startsWith('zh')
        ? '你是一个标点修复助手。只返回加好标点的文本，不要解释，不要添加任何内容。'
        : 'You are a punctuation restoration assistant. Only return the input text with proper punctuation, and nothing else.',
    },
    {
      role: 'user',
      content: text,
    }
  ];

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
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
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log('Received message:', message);
  console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: message }]
      })
    });
    const data = await response.json();
    console.log('Claude response:', JSON.stringify(data));
    res.json({ reply: data.content[0].text });
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = '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';

const SYSTEM_PROMPT = `You are Bella, a friendly AI assistant for Pizza Palace restaurant in Gulshan 2, Dhaka, Bangladesh. Phone: +880 1712-345678.

OPENING HOURS: Mon-Thu 11AM-11PM, Fri-Sat 11AM-12AM, Sun 12PM-10PM.

MENU (Small/Medium/Large BDT):
- Margherita: 350/550/750
- BBQ Chicken: 450/650/900 (bestseller!)
- Veggie Supreme: 400/600/800
- Meat Lovers: 500/750/1000
- Pepperoni Blast: 480/700/950
- Spaghetti Bolognese: 380
- Penne Arrabbiata: 350
- Creamy Mushroom Pasta: 360
- Garlic Bread: 120
- Caesar Salad: 220
- Chicken Wings 6pcs: 280
- Soft Drinks: 80

DELIVERY: Foodpanda, Shohoz, in-house within 5km, min 300 BDT, 30-45 mins.
OFFERS: Happy Hour 3-6PM weekdays 20% off. Student 10% off. Family Deal 2 Large + 4 drinks = 1800 BDT.
PAYMENT: Cash, bKash, Nagad, Rocket, all cards.

Be friendly, short, helpful. Reply in same language as customer. Never invent info.`;

app.get('/', (req, res) => {
  res.json({ status: 'SmartBot server is running!' });
});

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq error:', data);
      return res.status(500).json({ error: data.error?.message || 'Groq API error' });
    }

    res.json({ reply: data.choices[0].message.content.trim() });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SmartBot server running on port ${PORT}`));

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookUrl = process.env.WEBHOOK_CHAT;
    const chatSecret = process.env.CHAT_SECRET;

    if (!webhookUrl || !chatSecret) {
      return res.status(500).json({ error: 'WEBHOOK_CHAT or CHAT_SECRET not configured' });
    }

    const payload = req.body;

    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': chatSecret,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await n8nRes.text();

    if (!n8nRes.ok) {
      return res.status(n8nRes.status).json({ error: `n8n error: ${n8nRes.status}`, details: responseText });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { reply: responseText, done: false, profile: null, quickReplies: [] };
    }

    res.json(data);
  } catch (error: any) {
    console.error('[chat] Error:', error);
    res.status(500).json({ error: error.message });
  }
}

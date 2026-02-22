import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookUrl = process.env.WEBHOOK_VPS;
    const vpsSecret = process.env.VPS_SECRET;

    if (!webhookUrl || !vpsSecret) {
      return res.status(500).json({ error: 'WEBHOOK_VPS or VPS_SECRET not configured' });
    }

    const { sessionId, email, stripeSessionId, agentName, channel, selectedScenarios, personality } = req.body;

    if (!sessionId || !email) {
      return res.status(400).json({ error: 'sessionId and email are required' });
    }

    const payload = {
      sessionId,
      email,
      stripeSessionId: stripeSessionId || null,
      agentName: agentName || null,
      channel: channel || null,
      selectedScenarios: selectedScenarios || [],
      personality: personality || [],
    };

    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': vpsSecret,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await n8nRes.text();

    if (!n8nRes.ok) {
      return res.status(n8nRes.status).json({ error: `VPS webhook error: ${n8nRes.status}`, details: responseText });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { success: true };
    }

    res.json(data);
  } catch (error: any) {
    console.error('[vps] Error:', error);
    res.status(500).json({ error: error.message });
  }
}

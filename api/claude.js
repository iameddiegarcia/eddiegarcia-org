const ALLOWED_MODELS = new Set([
  'claude-sonnet-4-20250514',
  'claude-haiku-4-5-20251001',
  'claude-3-5-sonnet-20241022',
  'claude-3-haiku-20240307',
]);
const MAX_TOKENS_CAP = 4096;
const MAX_BODY_BYTES = 32_000;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Validate model
    if (!body.model || !ALLOWED_MODELS.has(body.model)) {
      return res.status(400).json({ error: `Model not allowed. Use: ${[...ALLOWED_MODELS].join(', ')}` });
    }

    // Cap max_tokens
    if (body.max_tokens && body.max_tokens > MAX_TOKENS_CAP) {
      body.max_tokens = MAX_TOKENS_CAP;
    }
    if (!body.max_tokens) {
      body.max_tokens = 2048;
    }

    // Reject if body is suspiciously large
    const payload = JSON.stringify(body);
    if (payload.length > MAX_BODY_BYTES) {
      return res.status(413).json({ error: 'Request too large' });
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: payload,
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

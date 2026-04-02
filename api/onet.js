const VALID_PATH = /^\/online\/[a-zA-Z0-9\/_.\-]+$/;
const ALLOWED_PARAMS = new Set(['keyword', 'start', 'end', 'sort', 'order']);

module.exports = async function handler(req, res) {
  const { path, ...rest } = req.query;

  if (!path || !VALID_PATH.test(path)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  // Only allow known query parameters
  const sanitized = {};
  for (const [k, v] of Object.entries(rest)) {
    if (ALLOWED_PARAMS.has(k) && typeof v === 'string' && v.length < 200) {
      sanitized[k] = v;
    }
  }

  const qs = new URLSearchParams(sanitized).toString();
  const url = `https://api-v2.onetcenter.org${path}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(url, {
      headers: {
        'X-API-Key': process.env.ONET_API_KEY,
        Accept: 'application/json',
        'User-Agent': 'eddiegarcia.org/1.0 (info@eddiegarcia.org)',
      },
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: `O*NET error: ${r.status}` });
    }

    const data = await r.json();

    // Cache for 24 hours — O*NET data is stable
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

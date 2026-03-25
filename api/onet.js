module.exports = async function handler(req, res) {
  const { path, ...rest } = req.query;

  if (!path || !path.startsWith('/online/')) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const qs = new URLSearchParams(rest).toString();
  const url = `https://api-v2.onetcenter.org${path}${qs ? '?' + qs : ''}`;

  console.log('[onet] key defined:', !!process.env.ONET_API_KEY, '| url:', url);

  try {
    const r = await fetch(url, {
      headers: {
        'X-API-Key': process.env.ONET_API_KEY,
        Accept: 'application/json',
        'User-Agent': 'eddiegarcia.org/1.0 (info@eddiegarcia.org)',
      },
    });

    if (!r.ok) {
      const body = await r.text().catch(() => '');
      console.log('[onet] status:', r.status, '| body:', body.slice(0, 200));
      return res.status(r.status).json({ error: `O*NET error: ${r.status}` });
    }

    const data = await r.json();

    // Cache for 24 hours — O*NET data is stable
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = async function handler(req, res) {
  const { path, ...rest } = req.query;

  if (!path || !path.startsWith('/ws/online/')) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const qs = new URLSearchParams(rest).toString();
  const url = `https://services.onetcenter.org${path}${qs ? '?' + qs : ''}`;

  console.log('[onet] user defined:', !!process.env.ONET_USERNAME, '| pass defined:', !!process.env.ONET_PASSWORD);
  console.log('[onet] url:', url);

  const creds = Buffer.from(
    `${process.env.ONET_USERNAME}:${process.env.ONET_PASSWORD}`
  ).toString('base64');

  try {
    const r = await fetch(url, {
      headers: {
        Authorization: `Basic ${creds}`,
        Accept: 'application/json',
        'User-Agent': 'eddiegarcia.org/1.0 (info@eddiegarcia.org)',
      },
    });

    if (!r.ok) {
      console.log('[onet] response status:', r.status);
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

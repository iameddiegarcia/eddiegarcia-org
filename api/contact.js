const MAX_FIELD_LENGTH = { name: 200, email: 254, subject: 300, message: 5000 };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { name, email, subject, message } = req.body || {};

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Validate types and lengths
    for (const [field, max] of Object.entries(MAX_FIELD_LENGTH)) {
      const val = req.body[field];
      if (val && (typeof val !== 'string' || val.length > max)) {
        return res.status(400).json({ error: `${field} is invalid or too long` });
      }
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Forward to Eddie's email via a simple fetch to a mail API
    // For now, log to Vercel's function logs and return success
    // TODO: Integrate with Resend, SendGrid, or Supabase for actual delivery
    console.log('[contact]', JSON.stringify({
      timestamp: new Date().toISOString(),
      name: name.slice(0, 100),
      email: email.slice(0, 100),
      subject: (subject || '').slice(0, 100),
      messageLength: message.length,
    }));

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        groups: [process.env.MAILERLITE_GROUP_ID],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('MailerLite error:', response.status, body);
      return res.status(response.status).json({ error: 'Subscription failed' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('MailerLite request failed:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

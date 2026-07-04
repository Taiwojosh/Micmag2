import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  // ── POST /api/leads ── Submit a new lead
  if (req.method === 'POST') {
    const { customerName, customerEmail, contactNumber, inquiryType, targetBranch, message } = req.body;

    if (!customerName || !contactNumber || !targetBranch) {
      return res.status(400).json({ error: 'Missing required fields: customerName, contactNumber, targetBranch' });
    }

    const newLead = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      customerName,
      customerEmail: customerEmail || '',
      contactNumber,
      inquiryType: inquiryType || 'General',
      targetBranch,
      message: message || '',
    };

    if (!webhookUrl) {
      console.warn('GOOGLE_SHEETS_WEBHOOK_URL is not set. Lead not forwarded.');
      // Still return success so the form doesn't error out on the user
      return res.status(201).json({ success: true, lead: newLead });
    }

    try {
      const gsRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });

      if (!gsRes.ok) {
        const text = await gsRes.text();
        console.error('Google Sheets webhook responded with error:', gsRes.status, text);
        return res.status(502).json({ error: 'Lead forwarding to Google Sheets failed. Please try again.' });
      }

      return res.status(201).json({ success: true, lead: newLead });
    } catch (err: any) {
      console.error('Failed to reach Google Sheets webhook:', err.message);
      return res.status(502).json({ error: 'Could not reach Google Sheets. Please try again.' });
    }
  }

  // ── GET /api/leads ── Fetch leads from Google Sheets via Apps Script
  if (req.method === 'GET') {
    const passcode = (req.headers['x-admin-passcode'] as string) || (req.query.passcode as string);
    const configuredPasscode = process.env.ADMIN_PASSCODE || 'micmag2026';

    if (passcode !== configuredPasscode) {
      return res.status(401).json({ error: 'Invalid admin passcode.' });
    }

    const sheetsReadUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!sheetsReadUrl) {
      return res.status(503).json({ error: 'Google Sheets is not configured.' });
    }

    try {
      const gsRes = await fetch(`${sheetsReadUrl}?passcode=${encodeURIComponent(configuredPasscode)}`);
      if (!gsRes.ok) {
        return res.status(502).json({ error: 'Failed to fetch leads from Google Sheets.' });
      }
      const data = await gsRes.json();
      return res.status(200).json(data);
    } catch (err: any) {
      console.error('Error fetching leads from Google Sheets:', err.message);
      return res.status(502).json({ error: 'Could not reach Google Sheets.' });
    }
  }

  // ── PUT /api/leads ── Update a lead's status/note in Google Sheets
  if (req.method === 'PUT') {
    const passcode = (req.headers['x-admin-passcode'] as string) || (req.query.passcode as string);
    const configuredPasscode = process.env.ADMIN_PASSCODE || 'micmag2026';

    if (passcode !== configuredPasscode) {
      return res.status(401).json({ error: 'Invalid admin passcode.' });
    }

    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: 'Missing lead id.' });

    const { status, note } = req.body;
    if (!webhookUrl) return res.status(503).json({ error: 'Google Sheets not configured.' });

    try {
      const gsRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id, status, note, passcode }),
      });
      if (!gsRes.ok) return res.status(502).json({ error: 'Failed to update lead.' });
      const data = await gsRes.json();
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(502).json({ error: 'Could not reach Google Sheets.' });
    }
  }

  // ── DELETE /api/leads ── Delete a lead from Google Sheets
  if (req.method === 'DELETE') {
    const passcode = (req.headers['x-admin-passcode'] as string) || (req.query.passcode as string);
    const configuredPasscode = process.env.ADMIN_PASSCODE || 'micmag2026';

    if (passcode !== configuredPasscode) {
      return res.status(401).json({ error: 'Invalid admin passcode.' });
    }

    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: 'Missing lead id.' });

    if (!webhookUrl) return res.status(503).json({ error: 'Google Sheets not configured.' });

    try {
      const gsRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, passcode }),
      });
      if (!gsRes.ok) return res.status(502).json({ error: 'Failed to delete lead.' });
      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(502).json({ error: 'Could not reach Google Sheets.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

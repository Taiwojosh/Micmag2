import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── Security: build the valid passcode set from the environment variable ──────
// ADMIN_PASSCODE must be set — server refuses if missing.
// Supports multiple admins via comma-separated values:
//   ADMIN_PASSCODE=alice_secret,bob_secret
const ADMIN_PASSCODE_ENV = process.env.ADMIN_PASSCODE;

const VALID_PASSCODES: Set<string> = ADMIN_PASSCODE_ENV
  ? new Set(ADMIN_PASSCODE_ENV.split(',').map((p) => p.trim()).filter(Boolean))
  : new Set();

/** Returns true only if the submitted passcode is in the configured set */
const isValidPasscode = (code: unknown): boolean =>
  VALID_PASSCODES.size > 0 && typeof code === 'string' && VALID_PASSCODES.has(code);

// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  // ── POST /api/leads ── Submit a new lead (public — no passcode required) ────
  if (req.method === 'POST') {
    const { customerName, customerEmail, contactNumber, inquiryType, targetBranch, message } =
      req.body ?? {};

    if (!customerName || !contactNumber || !targetBranch) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, contactNumber, targetBranch',
      });
    }

    if (!webhookUrl) {
      console.warn('GOOGLE_SHEETS_WEBHOOK_URL is not set. Lead not forwarded to Google Sheets.');
      // Still return success so the user's form submission doesn't break
      return res.status(201).json({ success: true });
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

    try {
      const gsRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });

      if (!gsRes.ok) {
        const text = await gsRes.text();
        console.error('Google Sheets webhook error:', gsRes.status, text);
        return res.status(502).json({
          error: 'Lead forwarding to Google Sheets failed. Please try again.',
        });
      }

      return res.status(201).json({ success: true, lead: newLead });
    } catch (err: any) {
      console.error('Failed to reach Google Sheets webhook:', err.message);
      return res.status(502).json({ error: 'Could not reach Google Sheets. Please try again.' });
    }
  }

  // ── GET /api/leads ── Fetch all leads from Google Sheets (admin only) ───────
  if (req.method === 'GET') {
    // Passcode must come via the x-admin-passcode header — never via URL query
    const passcode = req.headers['x-admin-passcode'];

    if (!isValidPasscode(passcode)) {
      return res.status(401).json({ error: 'Invalid admin passcode.' });
    }

    if (!webhookUrl) {
      return res.status(503).json({ error: 'Google Sheets is not configured on this server.' });
    }

    try {
      // Forward the request to Google Apps Script — Apps Script validates its own
      // internal secret; the admin passcode is NOT forwarded in the URL.
      const gsRes = await fetch(`${webhookUrl}?action=list`);
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

  // ── PUT /api/leads ── Update a lead's status/note (admin only) ───────────
  if (req.method === 'PUT') {
    const passcode = req.headers['x-admin-passcode'];

    if (!isValidPasscode(passcode)) {
      return res.status(401).json({ error: 'Invalid admin passcode.' });
    }

    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: 'Missing lead id.' });

    if (!webhookUrl) return res.status(503).json({ error: 'Google Sheets not configured.' });

    const { status, note } = req.body ?? {};

    try {
      const gsRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Passcode is NOT forwarded — the Apps Script webhook does not need it
        body: JSON.stringify({ action: 'update', id, status, note }),
      });
      if (!gsRes.ok) return res.status(502).json({ error: 'Failed to update lead.' });
      const data = await gsRes.json();
      return res.status(200).json(data);
    } catch (err: any) {
      console.error('Error updating lead:', err.message);
      return res.status(502).json({ error: 'Could not reach Google Sheets.' });
    }
  }

  // ── DELETE /api/leads ── Delete a lead (admin only) ───────────────────────
  if (req.method === 'DELETE') {
    const passcode = req.headers['x-admin-passcode'];

    if (!isValidPasscode(passcode)) {
      return res.status(401).json({ error: 'Invalid admin passcode.' });
    }

    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: 'Missing lead id.' });

    if (!webhookUrl) return res.status(503).json({ error: 'Google Sheets not configured.' });

    try {
      const gsRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      if (!gsRes.ok) return res.status(502).json({ error: 'Failed to delete lead.' });
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error('Error deleting lead:', err.message);
      return res.status(502).json({ error: 'Could not reach Google Sheets.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

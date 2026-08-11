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

// ── In-Memory Rate Limiting (per IP, max 5 submissions per 10 minutes) ────────
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string, maxRequests = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > maxRequests;
}

/** Sanitize input strings: strip dangerous characters, tags and enforce max length */
function sanitizeInput(val: unknown, maxLength = 255): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>]/g, '') // strip direct html tag brackets
    .trim()
    .slice(0, maxLength);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+0-9\s\-().]{7,25}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set security response headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  // ── POST /api/leads ── Submit a new lead (public) ─────────────────────────
  if (req.method === 'POST') {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';

    if (isRateLimited(clientIp, 5, 10 * 60 * 1000)) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a few minutes before submitting another inquiry.',
      });
    }

    const raw = req.body ?? {};
    const customerName = sanitizeInput(raw.customerName, 100);
    const customerEmail = sanitizeInput(raw.customerEmail, 150);
    const contactNumber = sanitizeInput(raw.contactNumber, 30);
    const inquiryType = sanitizeInput(raw.inquiryType, 50) || 'General';
    const targetBranch = sanitizeInput(raw.targetBranch, 100);
    const message = sanitizeInput(raw.message, 2000);

    if (!customerName || !contactNumber || !targetBranch) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, contactNumber, targetBranch',
      });
    }

    if (customerEmail && !EMAIL_REGEX.test(customerEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!PHONE_REGEX.test(contactNumber)) {
      return res.status(400).json({ error: 'Please provide a valid phone number.' });
    }

    if (!webhookUrl) {
      console.warn('GOOGLE_SHEETS_WEBHOOK_URL is not set. Lead not forwarded to Google Sheets.');
      return res.status(201).json({ success: true });
    }

    const newLead = {
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      customerName,
      customerEmail,
      contactNumber,
      inquiryType,
      targetBranch,
      message,
    };

    try {
      const gsRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });

      if (!gsRes.ok) {
        return res.status(502).json({
          error: 'Lead forwarding to Google Sheets failed. Please try again.',
        });
      }

      return res.status(201).json({ success: true, lead: newLead });
    } catch {
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

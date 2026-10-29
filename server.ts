import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // ── Security: require ADMIN_PASSCODE to be explicitly configured ────────────
  const ADMIN_PASSCODE_ENV = process.env.ADMIN_PASSCODE;
  if (!ADMIN_PASSCODE_ENV || !ADMIN_PASSCODE_ENV.trim()) {
    console.error(
      "[FATAL] ADMIN_PASSCODE environment variable is not set.\n" +
      "Set it in your .env file before starting the server.\n" +
      "You can supply multiple passcodes as a comma-separated list:\n" +
      "  ADMIN_PASSCODE=passcode_one,passcode_two"
    );
    process.exit(1);
  }

  // Split on commas to support multiple admin passcodes
  const VALID_PASSCODES: Set<string> = new Set(
    ADMIN_PASSCODE_ENV.split(',').map((p) => p.trim()).filter(Boolean)
  );

  /** Returns true if the supplied passcode is in the valid set */
  const isValidPasscode = (code: unknown): boolean =>
    typeof code === 'string' && VALID_PASSCODES.has(code);

  // Security: disable Express signature and limit payload size
  app.disable('x-powered-by');
  app.use(express.json({ limit: '50kb' }));

  // Security Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // In-Memory Rate Limiting
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

  function sanitizeInput(val: unknown, maxLength = 255): string {
    if (typeof val !== 'string') return '';
    return val.replace(/[<>]/g, '').trim().slice(0, maxLength);
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[+0-9\s\-().]{7,25}$/;

  // API Route FIRST for Lead Submission
  const LEADS_FILE = path.join(process.cwd(), 'leads.json');

  // Initialize leads.json if it doesn't exist
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
  }

  app.post("/api/leads", (req, res) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      if (isRateLimited(clientIp, 5, 10 * 60 * 1000)) {
        return res.status(429).json({
          error: "Too many requests. Please wait a few minutes before submitting another inquiry."
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
        return res.status(400).json({ error: "Missing required fields: customerName, contactNumber, targetBranch" });
      }

      if (customerEmail && !EMAIL_REGEX.test(customerEmail)) {
        return res.status(400).json({ error: "Please provide a valid email address." });
      }

      if (!PHONE_REGEX.test(contactNumber)) {
        return res.status(400).json({ error: "Please provide a valid phone number." });
      }

      const rawLeads = fs.readFileSync(LEADS_FILE, 'utf8');
      const leads = JSON.parse(rawLeads);

      const newLead = {
        id: Date.now().toString(),
        customerName,
        customerEmail,
        contactNumber,
        inquiryType,
        targetBranch,
        message,
        status: "New",
        note: "",
        submittedAt: new Date().toISOString()
      };

      leads.push(newLead);
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');

      // Forward to Google Apps Script Web App — handles Sheet logging + email notifications
      const googleSheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
      if (googleSheetsUrl) {
        fetch(googleSheetsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLead)
        })
          .then(() => console.log("Lead forwarded to Google Sheets successfully."))
          .catch(err => console.error("Google Sheets forwarding failed gracefully:", err.message));
      } else {
        console.warn("GOOGLE_SHEETS_WEBHOOK_URL is not set. Lead saved locally only.");
      }

      res.status(201).json({ success: true, lead: newLead });
    } catch {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // GET API to retrieve all leads (with simple passcode protective check)
  app.get("/api/leads", (req, res) => {
    try {
      const passcode = req.headers["x-admin-passcode"];

      if (!isValidPasscode(passcode)) {
        return res.status(401).json({ error: "Invalid admin passcode provided." });
      }

      if (!fs.existsSync(LEADS_FILE)) {
        return res.json([]);
      }
      const rawLeads = fs.readFileSync(LEADS_FILE, 'utf8');
      const leads = JSON.parse(rawLeads);
      res.json(leads);
    } catch (e) {
      console.error("Error retrieving leads:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // PUT API to update a lead's status/notes (e.g. "Contacted", "Closed", etc.)
  app.put("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      const passcode = req.headers["x-admin-passcode"];

      if (!isValidPasscode(passcode)) {
        return res.status(401).json({ error: "Invalid admin passcode provided." });
      }

      if (!fs.existsSync(LEADS_FILE)) {
        return res.status(404).json({ error: "No leads data exists yet." });
      }

      const rawLeads = fs.readFileSync(LEADS_FILE, 'utf8');
      const leads = JSON.parse(rawLeads);
      const idx = leads.findIndex((l: any) => l.id === id);

      if (idx === -1) {
        return res.status(404).json({ error: "Lead not found." });
      }

      const { status, note } = req.body;
      if (status !== undefined) leads[idx].status = status;
      if (note !== undefined) leads[idx].note = note;

      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
      res.json(leads[idx]);
    } catch (e) {
      console.error("Error updating lead:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // DELETE API to delete/dismiss a lead
  app.delete("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      const passcode = req.headers["x-admin-passcode"];

      if (!isValidPasscode(passcode)) {
        return res.status(401).json({ error: "Invalid admin passcode." });
      }

      if (!fs.existsSync(LEADS_FILE)) {
        return res.status(404).json({ error: "No leads data exists." });
      }

      const rawLeads = fs.readFileSync(LEADS_FILE, 'utf8');
      const leads = JSON.parse(rawLeads);
      const filteredLeads = leads.filter((l: any) => l.id !== id);

      fs.writeFileSync(LEADS_FILE, JSON.stringify(filteredLeads, null, 2), 'utf8');
      res.json({ success: true });
    } catch (e) {
      console.error("Error deleting lead:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // ── Articles / Journal API ──────────────────────────────────────────
  const ARTICLES_FILE = path.join(process.cwd(), 'articles.json');
  if (!fs.existsSync(ARTICLES_FILE)) {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify([], null, 2), 'utf8');
  }

  // GET /api/articles - Public endpoint
  app.get("/api/articles", (_req, res) => {
    try {
      if (!fs.existsSync(ARTICLES_FILE)) return res.json([]);
      const raw = fs.readFileSync(ARTICLES_FILE, 'utf8');
      res.json(JSON.parse(raw));
    } catch (e) {
      console.error("Error reading articles:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // POST /api/articles - Admin protected
  app.post("/api/articles", (req, res) => {
    try {
      const passcode = req.headers["x-admin-passcode"];
      if (!isValidPasscode(passcode)) {
        return res.status(401).json({ error: "Invalid admin passcode." });
      }

      const body = req.body ?? {};
      const title = sanitizeInput(body.title, 200);
      const subtitle = sanitizeInput(body.subtitle, 300);
      const excerpt = sanitizeInput(body.excerpt, 500);
      const category = sanitizeInput(body.category, 50) || 'Paint Systems';
      const coverImage = typeof body.coverImage === 'string' && body.coverImage.trim()
        ? body.coverImage.trim()
        : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200';
      const readTime = sanitizeInput(body.readTime, 30) || '5 min read';
      const content = typeof body.content === 'string' ? body.content.trim() : '';

      if (!title || !excerpt) {
        return res.status(400).json({ error: "Title and excerpt are required." });
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;

      const raw = fs.existsSync(ARTICLES_FILE) ? fs.readFileSync(ARTICLES_FILE, 'utf8') : '[]';
      const articles = JSON.parse(raw);

      const newArticle = {
        id: `custom-${Date.now()}`,
        slug,
        title,
        subtitle: subtitle || excerpt,
        excerpt,
        category,
        coverImage,
        coverImageAlt: title,
        author: {
          name: sanitizeInput(body.authorName, 100) || 'Micmag Editorial Desk',
          role: sanitizeInput(body.authorRole, 100) || 'Technical Specialist, Micmag Homes',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        },
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime,
        tags: [category, 'Micmag Homes', 'Lagos Construction'],
        metaDescription: excerpt,
        sections: [
          {
            heading: title,
            paragraphs: content ? content.split('\n\n').filter(Boolean) : [excerpt]
          }
        ],
        faqs: [],
        relatedProducts: [
          {
            name: 'Sandtex Matt Emulsion',
            category: 'Interior Architectural',
            image: '/Sandtex MATT.png',
            summary: 'Deep non-reflective luxury finish with superior micro-pores for flawless walls.'
          }
        ]
      };

      articles.unshift(newArticle);
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf8');
      res.status(201).json({ success: true, article: newArticle });
    } catch (e) {
      console.error("Error creating article:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // DELETE /api/articles/:id - Admin protected
  app.delete("/api/articles/:id", (req, res) => {
    try {
      const { id } = req.params;
      const passcode = req.headers["x-admin-passcode"];
      if (!isValidPasscode(passcode)) {
        return res.status(401).json({ error: "Invalid admin passcode." });
      }

      if (!fs.existsSync(ARTICLES_FILE)) {
        return res.status(404).json({ error: "No articles data exists." });
      }

      const raw = fs.readFileSync(ARTICLES_FILE, 'utf8');
      const articles = JSON.parse(raw);
      const filtered = articles.filter((a: any) => a.id !== id);
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(filtered, null, 2), 'utf8');
      res.json({ success: true });
    } catch (e) {
      console.error("Error deleting article:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

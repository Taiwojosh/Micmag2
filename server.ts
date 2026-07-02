import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route FIRST for Lead Submission
  const LEADS_FILE = path.join(process.cwd(), 'leads.json');

  // Initialize leads.json if it doesn't exist
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
  }

  app.post("/api/leads", (req, res) => {
    try {
      const { customerName, customerEmail, contactNumber, inquiryType, targetBranch, message } = req.body;
      
      if (!customerName || !contactNumber || !targetBranch) {
        return res.status(400).json({ error: "Missing required fields: customerName, contactNumber, targetBranch" });
      }

      const rawLeads = fs.readFileSync(LEADS_FILE, 'utf8');
      const leads = JSON.parse(rawLeads);

      const newLead = {
        id: Date.now().toString(),
        customerName,
        customerEmail: customerEmail || "",
        contactNumber,
        inquiryType,
        targetBranch,
        message: message || "",
        status: "New",
        note: "",
        submittedAt: new Date().toISOString()
      };

      leads.push(newLead);
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');

      // Optional helper: Forward directly to Google Sheets Webhook / Apps Script Web App in the background
      const googleSheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
      if (googleSheetsUrl) {
        fetch(googleSheetsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submittedAt: newLead.submittedAt,
            customerName: newLead.customerName,
            customerEmail: newLead.customerEmail,
            contactNumber: newLead.contactNumber,
            inquiryType: newLead.inquiryType,
            targetBranch: newLead.targetBranch,
            message: newLead.message
          })
        }).catch(err => {
          console.error("Optional Google Sheets forwarding failed gracefully:", err.message);
        });
      }

      res.status(201).json({ success: true, lead: newLead });
    } catch (e) {
      console.error("Error saving lead:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // GET API to retrieve all leads (with simple passcode protective check)
  app.get("/api/leads", (req, res) => {
    try {
      const passcode = req.headers["x-admin-passcode"] || req.query.passcode;
      const configuredPasscode = process.env.ADMIN_PASSCODE || "micmag2026";
      
      if (passcode !== configuredPasscode) {
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
      const passcode = req.headers["x-admin-passcode"] || req.query.passcode;
      const configuredPasscode = process.env.ADMIN_PASSCODE || "micmag2026";

      if (passcode !== configuredPasscode) {
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
      const passcode = req.headers["x-admin-passcode"] || req.query.passcode;
      const configuredPasscode = process.env.ADMIN_PASSCODE || "micmag2026";

      if (passcode !== configuredPasscode) {
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

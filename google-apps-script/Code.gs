// =============================================================
// MICMAG HOMES & FITTINGS — Lead Routing via Google Apps Script
// =============================================================
// HOW TO DEPLOY:
//   1. Open your Google Sheet → Extensions → Apps Script
//   2. Paste this entire script (replacing any existing code)
//   3. Click Deploy → New Deployment → Web App
//        - Execute as: Me
//        - Who has access: Anyone
//   4. Copy the deployed Web App URL
//   5. Set it as GOOGLE_SHEETS_WEBHOOK_URL in your Vercel environment variables
//
// SHEET TABS CREATED AUTOMATICALLY:
//   "Leads"  — every submission logged as a row
//   "Config" — manage recipient emails & settings here
//
// CONFIG TAB KEYS (auto-seeded on first run):
//   recipient_emails       → comma-separated emails to notify
//   notifications_enabled  → true / false
//   admin_passcode         → must match ADMIN_PASSCODE on Vercel
// =============================================================

const LEADS_SHEET_NAME  = "Leads";
const CONFIG_SHEET_NAME = "Config";

// ── Entry point: POST (new lead, update, delete) ─────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const config = getConfig(ss);

    // Route by action field
    if (data.action === 'update') {
      return handleUpdate(ss, data, config);
    }
    if (data.action === 'delete') {
      return handleDelete(ss, data, config);
    }

    // Default: new lead submission
    return handleNewLead(ss, data, config);

  } catch (err) {
    console.error("doPost error:", err.toString());
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ── Entry point: GET (fetch leads or health check) ───────────
function doGet(e) {
  try {
    const params = e.parameter || {};

    // Health check
    if (!params.passcode) {
      return jsonResponse({ status: "Micmag Lead Webhook is live." });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const config = getConfig(ss);
    const adminPasscode = config["admin_passcode"] || "micmag2026";

    if (params.passcode !== adminPasscode) {
      return jsonResponse({ error: "Invalid passcode." }, 401);
    }

    const leadsSheet = getOrCreateSheet(ss, LEADS_SHEET_NAME);
    ensureLeadsHeaders(leadsSheet);

    const lastRow = leadsSheet.getLastRow();
    if (lastRow <= 1) return jsonResponse([]);  // No leads yet (only header)

    const rows = leadsSheet.getRange(2, 1, lastRow - 1, 10).getValues();
    const leads = rows.map(row => ({
      id:            row[0],
      submittedAt:   row[1],
      customerName:  row[2],
      customerEmail: row[3],
      contactNumber: row[4],
      inquiryType:   row[5],
      targetBranch:  row[6],
      message:       row[7],
      status:        row[8] || "New",
      note:          row[9] || ""
    }));

    return jsonResponse(leads);
  } catch (err) {
    console.error("doGet error:", err.toString());
    return jsonResponse({ error: err.toString() });
  }
}

// ── Handle new lead submission ────────────────────────────────
function handleNewLead(ss, data, config) {
  const leadsSheet = getOrCreateSheet(ss, LEADS_SHEET_NAME);
  ensureLeadsHeaders(leadsSheet);

  leadsSheet.appendRow([
    data.id           || Date.now().toString(),
    data.submittedAt  || new Date().toISOString(),
    data.customerName  || "",
    data.customerEmail || "",
    data.contactNumber || "",
    data.inquiryType   || "",
    data.targetBranch  || "",
    data.message       || "",
    "New",  // status
    ""      // note
  ]);

  // Send email notification if enabled
  const notificationsEnabled = config["notifications_enabled"];
  if (notificationsEnabled === "true" || notificationsEnabled === true) {
    const recipientEmails = config["recipient_emails"] || "micmaghomesfittings@gmail.com";
    sendLeadEmail(recipientEmails, data);
  }

  return jsonResponse({ success: true });
}

// ── Handle lead update (status / note) ───────────────────────
function handleUpdate(ss, data, config) {
  const adminPasscode = config["admin_passcode"] || "micmag2026";
  if (data.passcode !== adminPasscode) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const leadsSheet = getOrCreateSheet(ss, LEADS_SHEET_NAME);
  const lastRow = leadsSheet.getLastRow();
  if (lastRow <= 1) return jsonResponse({ error: "No leads found." });

  const ids = leadsSheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const rowIndex = ids.indexOf(data.id);
  if (rowIndex === -1) return jsonResponse({ error: "Lead not found." });

  const sheetRow = rowIndex + 2; // +2 for header + 0-index offset
  if (data.status !== undefined) leadsSheet.getRange(sheetRow, 9).setValue(data.status);
  if (data.note   !== undefined) leadsSheet.getRange(sheetRow, 10).setValue(data.note);

  return jsonResponse({ success: true });
}

// ── Handle lead delete ────────────────────────────────────────
function handleDelete(ss, data, config) {
  const adminPasscode = config["admin_passcode"] || "micmag2026";
  if (data.passcode !== adminPasscode) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const leadsSheet = getOrCreateSheet(ss, LEADS_SHEET_NAME);
  const lastRow = leadsSheet.getLastRow();
  if (lastRow <= 1) return jsonResponse({ error: "No leads found." });

  const ids = leadsSheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const rowIndex = ids.indexOf(data.id);
  if (rowIndex === -1) return jsonResponse({ error: "Lead not found." });

  leadsSheet.deleteRow(rowIndex + 2);
  return jsonResponse({ success: true });
}

// ── Get or create a sheet by name ────────────────────────────
function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

// ── Ensure Leads sheet has correct headers ────────────────────
function ensureLeadsHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Lead ID", "Submitted At", "Customer Name", "Email",
      "Phone", "Inquiry Type", "Branch", "Message", "Status", "Note"
    ]);

    const headerRange = sheet.getRange(1, 1, 1, 10);
    headerRange.setBackground("#d32f2f");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(10);
    sheet.setFrozenRows(1);

    const widths = [150, 190, 160, 210, 150, 160, 170, 300, 110, 220];
    widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
  }
}

// ── Read config from Config sheet (auto-seeds defaults) ───────
function getConfig(ss) {
  const configSheet = getOrCreateSheet(ss, CONFIG_SHEET_NAME);
  const config = {};

  if (configSheet.getLastRow() === 0) {
    configSheet.appendRow(["recipient_emails", "micmaghomesfittings@gmail.com,kosimicmag@gmail.com"]);
    configSheet.appendRow(["notifications_enabled", "true"]);
    configSheet.appendRow(["admin_passcode", "micmag2026"]);

    const headerRow = configSheet.getRange(1, 1, 1, 2);
    headerRow.setBackground("#000650");
    headerRow.setFontColor("#ffffff");
    headerRow.setFontWeight("bold");
    configSheet.setColumnWidth(1, 210);
    configSheet.setColumnWidth(2, 420);
  }

  const data = configSheet.getDataRange().getValues();
  for (const row of data) {
    if (row[0]) config[String(row[0])] = row[1];
  }
  return config;
}

// ── Send styled HTML email to configured recipients ───────────
function sendLeadEmail(recipientsCsv, lead) {
  const recipients = recipientsCsv.split(",").map(e => e.trim()).filter(Boolean);
  if (recipients.length === 0) return;

  const subject = `🏠 New Micmag Lead: ${lead.customerName || "Unknown"} — ${lead.inquiryType || "General"}`;

  const htmlBody = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:620px;margin:auto;background:#f9f9f9;border-radius:12px;overflow:hidden;border:1px solid #e0e0e0;">
      <div style="background:#d32f2f;padding:24px 28px;">
        <h2 style="margin:0;color:#fff;font-size:20px;letter-spacing:.5px;">New Business Lead Received</h2>
        <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:12px;">Micmag Homes &amp; Fittings — Lead Routing System</p>
      </div>
      <div style="padding:24px 28px;background:#fff;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 8px;color:#555;font-weight:600;width:35%;">Name</td><td style="padding:10px 8px;color:#111;">${lead.customerName || "—"}</td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;background:#fafafa;"><td style="padding:10px 8px;color:#555;font-weight:600;">Email</td><td style="padding:10px 8px;"><a href="mailto:${lead.customerEmail}" style="color:#d32f2f;">${lead.customerEmail || "—"}</a></td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 8px;color:#555;font-weight:600;">Phone</td><td style="padding:10px 8px;"><a href="tel:${lead.contactNumber}" style="color:#d32f2f;">${lead.contactNumber || "—"}</a></td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;background:#fafafa;"><td style="padding:10px 8px;color:#555;font-weight:600;">Inquiry</td><td style="padding:10px 8px;">${lead.inquiryType || "—"}</td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 8px;color:#555;font-weight:600;">Branch</td><td style="padding:10px 8px;">${lead.targetBranch || "—"}</td></tr>
          <tr style="border-bottom:1px solid #f0f0f0;background:#fafafa;"><td style="padding:10px 8px;color:#555;font-weight:600;vertical-align:top;">Message</td><td style="padding:10px 8px;white-space:pre-wrap;">${lead.message || "—"}</td></tr>
        </table>
      </div>
      <div style="padding:16px 28px;background:#f5f5f5;border-top:1px solid #e8e8e8;text-align:center;">
        <p style="margin:0;font-size:11px;color:#999;font-family:monospace;">Lead ID: ${lead.id || "N/A"} &nbsp;|&nbsp; ${lead.submittedAt || new Date().toISOString()}</p>
        <p style="margin:6px 0 0;font-size:11px;color:#bbb;">Micmag Homes &amp; Fittings — Automated Lead Notification</p>
      </div>
    </div>
  `;

  const plainBody = `New Micmag Lead\n\nName: ${lead.customerName}\nEmail: ${lead.customerEmail}\nPhone: ${lead.contactNumber}\nInquiry: ${lead.inquiryType}\nBranch: ${lead.targetBranch}\nMessage: ${lead.message}\n\nLead ID: ${lead.id}`;

  for (const recipient of recipients) {
    try {
      GmailApp.sendEmail(recipient, subject, plainBody, { htmlBody });
      console.log("Email sent to:", recipient);
    } catch (err) {
      console.error("Failed to email", recipient, ":", err.toString());
    }
  }
}

// ── Utility: return JSON ContentService response ──────────────
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

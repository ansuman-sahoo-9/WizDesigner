# WizDesigner — Sheet setup (the one manual step left)

The app is built and runs on fallback data. To make the Google Sheet the live
system of record, deploy the Apps Script web app below and paste its URL into
`.env.local` as `NEXT_PUBLIC_SHEET_API`, then restart `npm run dev`.

Sheet: https://docs.google.com/spreadsheets/d/1dZNjMi7T4zVNfKYd7ytCtBCNjU-IM1VjmigsZy5Rreo/edit

## Step 1 — Apps Script
In the Sheet: **Extensions → Apps Script**, replace the default code with:

```javascript
// WizDesigner — Sheet API. Deploy as Web App: Execute as Me, Access: Anyone.
const SHEET = SpreadsheetApp.openByUrl(
  'https://docs.google.com/spreadsheets/d/1dZNjMi7T4zVNfKYd7ytCtBCNjU-IM1VjmigsZy5Rreo/edit'
);
function doGet(e) {
  const tab = e.parameter.tab;
  if (!tab) return _json({ error: 'tab parameter required' });
  const sheet = SHEET.getSheetByName(tab);
  if (!sheet) return _json({ error: 'tab not found: ' + tab });
  const values = sheet.getDataRange().getValues();
  if (values.length === 0) return _json({ rows: [] });
  const [headers, ...rows] = values;
  const objects = rows.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
  return _json({ rows: objects });
}
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const { tab, action, row } = body;
  const sheet = SHEET.getSheetByName(tab);
  if (!sheet) return _json({ error: 'tab not found' });
  if (action === 'append') {
    const headers = sheet.getDataRange().getValues()[0];
    sheet.appendRow(headers.map(h => row[h] ?? ''));
    return _json({ ok: true });
  }
  if (action === 'replace') {
    const headers = sheet.getDataRange().getValues()[0];
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
    body.rows.forEach(r => sheet.appendRow(headers.map(h => r[h] ?? '')));
    return _json({ ok: true });
  }
  return _json({ error: 'unknown action' });
}
function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Step 2 — Deploy
**Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.**
Copy the deployment URL.

## Step 3 — Wire it
Put the URL in `wizdesigner/.env.local`:
```
NEXT_PUBLIC_SHEET_API=https://script.google.com/macros/s/XXXX/exec
```
Restart the dev server. The top-bar badge flips from "Fallback data" to "Sheet live".

## Required tabs (headers row 1)
The readers in `lib/SheetService.ts` expect these exact column headers.

- **Section Registry** ⭐ (boot-critical): `Section ID | Section Name | Enabled | Default Variant | Order`
- **Industry Presets**: `Industry | Default Hero Variant | Default Category Variant | Default Product Variant | Default Palette`
- **Products**: `SKU | Product Name | Category | Description | Image URL | MSRP | Wholesale Price`
- **Categories**: `Category ID | Category Name | Parent Category`
- **Brands**: `Brand Name | Industry | Logo URL | Primary Color | Secondary Color | Accent Color | Font Heading | Font Body`
- **Design Decisions** (written to): `Session ID | Section | Variant | Timestamp`
- **Snapshots** (written to): `Snapshot Name | Hero Variant | Category Variant | Product Variant | Palette | Font`
- **Theme Tokens**: `Token | Value`

Set `Enabled = FALSE` on any Section Registry row and that section disappears
from the preview on next load — no code change. `Default Palette` values match
the palette ids in `lib/themes.ts` (heritage, industrial, modern, botanical, luxe, editorial).

## Running locally
This machine has no system Node; a local one lives at `~/.local/node20`. Prefix:
```
export PATH="$HOME/.local/node20/bin:$PATH"
cd wizdesigner && npm run dev   # then add --webpack: next dev --webpack
```
Use **webpack** (`next dev --webpack` / `next build --webpack`) — Turbopack's
PostCSS worker can't find `node` on this machine's PATH and panics. See CLAUDE.md.

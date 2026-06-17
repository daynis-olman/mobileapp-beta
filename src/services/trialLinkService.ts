import type { Platform, TrialLink, TrialMode } from "@/types/trial";

// Sheet ID injected at build time via VITE_SHEET_ID env var (set in GitHub Secrets).
// The sheet must be "Anyone with the link: Viewer".
// Columns: target_url, build_id, variable_url, updated_date, version_build
const SHEET_ID = import.meta.env.VITE_SHEET_ID ?? "";
const GID = import.meta.env.VITE_SHEET_GID ?? "0";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export const SHEET_VIEW_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${GID}`;

// Stable, hardcoded redirect paths (relative). These never change — the QR
// codes encode the absolute URL of these paths, which then resolve to the
// latest variable_url from the sheet.
export const STABLE_PATHS: Record<TrialMode, Record<Platform, string>> = {
  internal: { android: "/r/internal/android", ios: "/r/internal/ios" },
  external: { android: "/r/external/android", ios: "/r/external/ios" },
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else inQuotes = false;
      } else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function parseModeCell(v: string): TrialMode | null {
  const s = v.trim().toLowerCase();
  if (s.startsWith("internal")) return "internal";
  if (s.startsWith("external")) return "external";
  return null;
}

function parsePlatformCell(v: string): Platform | null {
  const s = v.trim().toLowerCase();
  if (s === "android") return "android";
  if (s === "ios") return "ios";
  return null;
}

function normalizeDate(v: string): string {
  const s = v.trim();
  if (!s) return "";
  // Accept M/D/YYYY or YYYY-MM-DD
  const slash = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) {
    const [, m, d, y] = slash;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return s;
}

export const trialLinkService = {
  async list(): Promise<TrialLink[]> {
    const res = await fetch(CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load trial sheet (${res.status})`);
    const text = await res.text();
    const rows = parseCsv(text);
    if (rows.length < 2) return [];
    const header = rows[0].map((h) => h.trim().toLowerCase());
    const idx = {
      mode: header.indexOf("target_url"),
      platform: header.indexOf("build_id"),
      url: header.indexOf("variable_url"),
      date: header.indexOf("updated_date"),
      version: header.indexOf("version_build"),
    };
    const out: TrialLink[] = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const mode = parseModeCell(r[idx.mode] ?? "");
      const platform = parsePlatformCell(r[idx.platform] ?? "");
      if (!mode || !platform) continue;
      out.push({
        mode,
        platform,
        targetUrl: (r[idx.url] ?? "").trim(),
        stableRedirectPath: STABLE_PATHS[mode][platform],
        version: (r[idx.version] ?? "").trim(),
        updatedAt: normalizeDate(r[idx.date] ?? ""),
      });
    }
    return out;
  },

  async get(mode: TrialMode, platform: Platform): Promise<TrialLink | undefined> {
    const all = await this.list();
    return all.find((l) => l.mode === mode && l.platform === platform);
  },
};
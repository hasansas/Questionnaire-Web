/**
 * Convert MM-DD-YYYY → YYYY-MM-DD
 */
export function toYMD(dateStr: string): string {
  const [month, day, year] = dateStr.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Convert YYYY-MM-DD → MM-DD-YYYY
 */
export function toMDY(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${month.padStart(2, "0")}-${day.padStart(2, "0")}-${year}`;
}

/**
 * Normalize a date from YYYY-DD-MM → YYYY-MM-DD
 */
export function normalizeYDMtoYMD(dateStr: string): string {
  if (!dateStr) return "";

  const parts = dateStr.split("-").map((p) => p.trim());
  if (parts.length !== 3) return dateStr;

  const [year, day, month] = parts;

  const y = year.padStart(4, "0");
  const m = month.padStart(2, "0");
  const d = day.padStart(2, "0");

  return `${y}-${m}-${d}`;
}

/**
 * Format time:
 * - Input: "HH:mm:ss" or "HH:mm"
 * - Default output: "HH:mm" (hide seconds)
 * - If showSeconds=true → "HH:mm:ss"
 *
 * Examples:
 *   formatTimeLabel("11:35:00")        -> "11:35"
 *   formatTimeLabel("11:35:00", true)  -> "11:35:00"
 *   formatTimeLabel("11:35")           -> "11:35"
 */
export function formatTimeLabel(
  timeStr: string | null | undefined,
  showSeconds = false
): string {
  if (!timeStr) return "-";

  const s = String(timeStr).trim();
  if (!s) return "-";

  const parts = s.split(":").map((p) => p.trim());
  if (parts.length < 2) return s;

  const [hhRaw, mmRaw, ssRaw] = parts;

  const hh = (hhRaw ?? "").padStart(2, "0");
  const mm = (mmRaw ?? "").padStart(2, "0");
  const ss = (ssRaw ?? "00").padStart(2, "0");

  return showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
}

/**
 * Format a DOB into: "Fri Jan 05 1990" (time handled separately if you want)
 *
 * - Accepts ISO string or anything new Date(...) can parse.
 * - Falls back to original string if parsing fails.
 */
export function formatDobLabel(dob: string | Date | null | undefined): string {
  if (!dob) return "-";

  const date = dob instanceof Date ? dob : new Date(dob);
  if (Number.isNaN(date.getTime())) {
    return typeof dob === "string" ? dob : "-";
  }

  const weekday = date.toLocaleString("en-US", { weekday: "short" }); // Fri
  const month = date.toLocaleString("en-US", { month: "short" }); // Jan
  const day = String(date.getDate()).padStart(2, "0"); // 05
  const year = date.getFullYear(); // 1990

  return `${weekday} ${month} ${day} ${year}`;
}

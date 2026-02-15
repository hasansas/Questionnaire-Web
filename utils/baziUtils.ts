// utils/baziUtils.ts

// ====================
// Date and Time Utils
// ====================

/**
 * Converts ISO date string (UTC) to an object with year, month, day, hour, minute, second (local time).
 * @param isoString Example: "2024-12-31T17:00:00.000Z"
 * @returns Object: { year, month, day, hour, minute, second }
 */
export function parseIsoToDateTimeParts(isoString: string) {
  const date = new Date(isoString);

  return {
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString(), // Months are zero-based
    day: date.getDate().toString(),
    hour: date.getHours().toString().padStart(2, "0"),
    minute: date.getMinutes().toString().padStart(2, "0"),
    second: date.getSeconds().toString().padStart(2, "0"),
  };
}

/**
 * Parse date string "DD-MM-YYYY" to { year, month, day }
 */
export function parseDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return { year, month, day };
}

/**
 * Parse time string "HH:mm" to { hour, minute }
 */
export function parseTime(timeStr: string | null) {
  if (!timeStr) return { hour: "00", minute: "00" };
  const [hour, minute] = timeStr.split(":");
  return { hour, minute };
}

// ====================
// Ger the Ten God from array data
// ==================== 
type PillarRow = { pillar: string; stem: string };

export function findTenGod(data: any, pillar: string, stem: string): any {
  const tenGod = data.find((row: any) => row?.pillar === pillar && row?.stem === stem);
  return tenGod
}

// ====================
// Color Utils
// ====================

/**
 * Get strong color for Five Element.
 */
export function getElementColor(element: string) {
  switch (element.toLowerCase()) {
    case "wood":
      return "#43a047";
    case "fire":
      return "#e65100";
    case "earth":
      return "#bc6c25";
    case "metal":
      return "#6c757d";
    case "water":
      return "#1976d2";
    default:
      return "#232134";
  }
}

/**
 * Get soft (transparent) color for Five Element.
 */
export function getSoftElementColor(element: string) {
  switch (element.toLowerCase()) {
    case "wood":
      return "rgba(67, 160, 71, 0.13)";
    case "fire":
      return "rgba(230, 81, 0, 0.13)";
    case "earth":
      return "rgba(188, 108, 37, 0.13)";
    case "metal":
      return "rgba(96, 125, 139, 0.13)";
    case "water":
      return "rgba(25, 118, 210, 0.13)";
    default:
      return "rgba(150,150,150,0.10)";
  }
}

// ====================
// String & Misc Utils
// ====================

/**
 * Extracts the substring before the first occurrence of an opening parenthesis '('.
 */
export function getContentBeforeParenthesis(inputString: string): string {
  const indexOfParenthesis = inputString.indexOf("(");
  if (indexOfParenthesis === -1) {
    return inputString;
  }
  return inputString.substring(0, indexOfParenthesis);
}

/**
 * Get first content in parentheses from string.
 */
export function getContentInParentheses(input: string) {
  const regex = /\(([^)]+)\)/;
  const match = input.match(regex);
  return match && match[1] ? match[1] : "";
}

/**
 * Get "yang" or "yin" polarity from string.
 */
export function getPolarity(val: string) {
  const lower = val.toLowerCase();
  if (lower.includes("yang")) return "yang";
  if (lower.includes("yin")) return "yin";
  return "";
}

/**
 * Get pillar color based on source.
 */

// Define the type for pillar sources
export type PillarSource = "year" | "month" | "day" | "hour";

// Pillar colors with typed keys
const pillartColor: Record<PillarSource, string> = {
  year: "#673AB7",
  month: "#00BCD4",
  day: "#FF5722",
  hour: "#E91E63",
};

/**
 * Safely get the pillar color based on source
 * This helper method provides type safety when accessing pillar colors
 */
export const getPillarColor = (source: unknown): string => {
  // Check if source is a valid pillar source
  if (
    source === "year" ||
    source === "month" ||
    source === "day" ||
    source === "hour"
  ) {
    return pillartColor[source];
  }
  // Return a default color if source is invalid
  return "#000000";
};

/**
 * Converts a month number (1–12) to its English month name.
 * @param monthNumber Number from 1 (January) to 12 (December)
 * @returns Month name string, or empty string if invalid
 */
export function getMonthName(monthNumber: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthNumber - 1] || "";
}

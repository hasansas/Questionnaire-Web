export function addLeadingZero(num: number): string {
  return num.toString().padStart(2, "0");
}

export const validateInputNumber = (
  event: InputEvent,
  separator: string | null = null
): string => {
  const inputElement = event.target as HTMLInputElement;
  const value = inputElement.value;
  let cleanedValue = "";

  if (separator === "-") {
    // For date (DD-MM-YYYY)
    cleanedValue = value.replace(/[^\d-]/g, "");
    const parts = cleanedValue.split("-");
    if (parts.length > 3) cleanedValue = parts.slice(0, 3).join("-");

    if (parts[0] && parts[0].length > 2) parts[0] = parts[0].substring(0, 2);
    if (parts[1] && parts[1].length > 2) parts[1] = parts[1].substring(0, 2);
    if (parts[2] && parts[2].length > 4) parts[2] = parts[2].substring(0, 4);

    cleanedValue = parts.join("-");
  } else if (separator === ":") {
    // For time (HH:MM)
    cleanedValue = value.replace(/[^\d:]/g, "");
    const parts = cleanedValue.split(":");
    if (parts.length > 2) cleanedValue = parts.slice(0, 2).join(":");

    if (parts[0] && parts[0].length > 2) parts[0] = parts[0].substring(0, 2);
    if (parts[1] && parts[1].length > 2) parts[1] = parts[1].substring(0, 2);

    cleanedValue = parts.join(":");
  } else {
    // Only numbers allowed (default behavior)
    cleanedValue = value.replace(/\D/g, "");
  }

  return cleanedValue;
};

export function getInitials(name: string): string {
  if (!name) return "";

  const initials = name
    .split(" ")
    .filter((word) => word.length > 0) // Filter out empty strings from multiple spaces
    .map((word) => word[0]) // Extract first letter of each non-empty word
    .slice(0, 2) // **Limit the array to the first two initials**
    .join("")
    .toUpperCase(); // Return initials in uppercase

  return initials;
}
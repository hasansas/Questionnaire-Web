// utils/input.ts

/**
 * Prevent non-digit key presses (0–9).
 */
export function onlyDigitsKeydown(evt: KeyboardEvent) {
  const charCode = evt.which ?? evt.keyCode

  // Allow control keys (backspace, tab, arrows, etc.)
  if (charCode <= 31) return

  // Digits 0–9 have charCode 48–57
  if (charCode < 48 || charCode > 57) {
    evt.preventDefault()
  }
}

/**
 * Sanitize a string to contain digits only, with optional max length.
 */
export function sanitizeDigits(value: string, maxLength?: number) {
  let cleaned = value.replace(/\D/g, '')
  if (maxLength && maxLength > 0) {
    cleaned = cleaned.slice(0, maxLength)
  }
  return cleaned
}

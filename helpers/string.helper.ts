/**
 * String Hex helpers (UTF-8 based)
 */

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

/**
 * Convert a string to a hex string (UTF-8 bytes).
 */
function toHex(str: string): string {
  const bytes = textEncoder.encode(str) // UTF-8 bytes
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Convert a hex string (optionally starting with 0x) back to string.
 */
function fromHex(hex: string): string {
  const hexString = hex.startsWith('0x') ? hex.slice(2) : hex

  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string length')
  }

  const bytes = new Uint8Array(hexString.length / 2)

  for (let i = 0; i < hexString.length; i += 2) {
    const hexPair = hexString.slice(i, i + 2)
    const value = parseInt(hexPair, 16)

    if (Number.isNaN(value)) {
      throw new Error(`Invalid hex pair: "${hexPair}" at index ${i}`)
    }

    bytes[i / 2] = value
  }

  return textDecoder.decode(bytes)
}

const stringHex = {
  toHex,
  fromHex
}

export default stringHex

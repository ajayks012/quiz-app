/**
 * Creates a deep clone of an object, array, or primitive.
 * Leverages native structuredClone where available, with a reliable JSON fallback.
 *
 * @param value - Value to clone.
 * @returns Deep copy of the input value.
 */
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Fall through to JSON serialization for non-cloneable objects if possible
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

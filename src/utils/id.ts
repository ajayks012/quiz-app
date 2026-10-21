import { v4 as uuidv4 } from 'uuid'

/**
 * Generates an RFC-compliant UUID v4, with an optional prefix.
 *
 * @param prefix - Optional string prefix (e.g. "quiz", "question").
 * @returns Unique ID string.
 */
export function uniqueId(prefix?: string): string {
  const id = uuidv4()
  return prefix ? `${prefix}_${id}` : id
}

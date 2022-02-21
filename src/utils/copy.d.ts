/**
 * Provites utility methods for object-cloning operations.
 * @module copy
 */
/**
 * Creates a deep copy of a simple JavaScript
 *   object through js's builtin JSON stringify/parse
 *   methods. DO NOT use it for cloning complex
 *   objects.
 *
 * @template T
 * @param {T} obj - The object to be cloned.
 * @returns {T} the object's clone instance
 */
export function deepCopy<T>(obj: T): T;

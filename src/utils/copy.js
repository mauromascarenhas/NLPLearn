"use strict";

/**
 * Creates a deep copy of a simple JavaScript
 *   object through js's builtin JSON stringify/parse
 *   methods. DO NOT use it for cloning complex
 *   objects.
 * 
 * @param {any} obj - The object to be cloned.
 * @returns the object's clone instance
 */
export function deepCopy(obj){
    return JSON.parse(JSON.stringify(obj));
}
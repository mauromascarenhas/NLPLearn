/**
 * Provides distance functions for arrays.
 * @module distance
 */
/**
 * Calculates the cosine distance between the
 *   vectors u and v accordingly to the given
 *   formula:
 *
 *   cos_d(u,v) = 1 - ((u*v) / (|u|*|v|))
 *
 * Note: u and v must have the same size (due
 *   to performance reasons, there is no
 *   systemic check).
 * @param {number[]} u - Numeric array.
 * @param {number[]} v - Numeric array.
 * @returns {number} a number in the interval
 *   [0,1].
 */
export function cosine(u: number[], v: number[]): number;
/**
 * Calculates the jaccard distance between the
 *   sets A and B accordingly to the given
 *   formulae:
 *
 *   A = AS_SET(u)
 *
 *   B = AS_SET(v)
 *
 *   jacc_d(u,v) = 1 - (INTERSECT(A,B) /
 *     (LEN(A) + LEN(B) - LEN(INTERSECT(A,B))))
 *
 * Note: u and v must have the same size (due
 *   to performance reasons, there is no
 *   systemic check).
 * @param {number[]} u - Numeric array.
 * @param {number[]} v - Numeric array.
 * @returns {number} a number in the interval
 *   [0,1].
 */
export function jaccard(u: number[], v: number[]): number;
/**
 * Calculates the euclidean distance between the
 *   vectors u and v accordingly to the given
 *   formula:
 *
 *   eucl_d(u,v) = sqrt(sum((u[i]-v[i])^2)),
 *     for i in [0, len(u)]
 *
 * Note: u and v must have the same size (due
 *   to performance reasons, there is no
 *   systemic check).
 * @param {number[]} u - Numeric array.
 * @param {number[]} v - Numeric array.
 * @returns {number} a real number from interval
 *   [0, infinity[.
 */
export function euclidean(u: number[], v: number[]): number;

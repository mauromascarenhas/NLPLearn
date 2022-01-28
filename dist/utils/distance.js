"use strict";
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cosine = cosine;
exports.euclidean = euclidean;
exports.jaccard = jaccard;

function cosine(u, v) {
  var mod_u = 0,
      mod_v = 0,
      uv_dot = 0;

  for (var i = 0; i < u.length; ++i) {
    mod_u += u[i] * u[i];
    mod_v += v[i] * v[i];
    uv_dot += u[i] * v[i];
  }

  mod_u = Math.sqrt(mod_u);
  mod_v = Math.sqrt(mod_v);
  return 1 - uv_dot / (mod_u * mod_v);
}
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


function euclidean(u, v) {
  var acc = 0;

  for (var i = 0; i < u.length; ++i) {
    acc += Math.pow(u[i] - v[i], 2);
  }

  return Math.sqrt(acc);
}
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


function jaccard(u, v) {
  var a_size = 0,
      b_size = 0,
      ab_size = 0;

  for (var i = 0; i < u.length; ++i) {
    if (u[i] && v[i]) {
      a_size++;
      b_size++;
      ab_size++;
    } else if (u[i]) a_size++;else if (v[i]) b_size++;
  }

  return 1 - ab_size / (a_size + b_size - ab_size);
}
"use strict";
/**
 * Text-tokenization utilities.
 * @module tokenization
 */

/**
 * Basic text tokenizer (word level) based
 *  on regular expression rules.
 * It provides support to number removal
 *  (default setting) and filter for small
 *  words.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NaiveWordTokenizer = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classCheckPrivateStaticFieldDescriptor(descriptor, action) { if (descriptor === undefined) { throw new TypeError("attempted to " + action + " private static field before its declaration"); } }

function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var _minWordLen = /*#__PURE__*/new WeakMap();

var _tokenizerRegex = /*#__PURE__*/new WeakMap();

var NaiveWordTokenizer = /*#__PURE__*/function () {
  /** @type {RegExp} */
  function NaiveWordTokenizer() {
    var removeNumbers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var minWordLen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

    _classCallCheck(this, NaiveWordTokenizer);

    _classPrivateFieldInitSpec(this, _minWordLen, {
      writable: true,
      value: 3
    });

    _classPrivateFieldInitSpec(this, _tokenizerRegex, {
      writable: true,
      value: null
    });

    var DS = _classStaticPrivateFieldSpecGet(NaiveWordTokenizer, NaiveWordTokenizer, _digitSet),
        WS = _classStaticPrivateFieldSpecGet(NaiveWordTokenizer, NaiveWordTokenizer, _wordSet);

    _classPrivateFieldSet(this, _minWordLen, minWordLen - 1);

    _classPrivateFieldSet(this, _tokenizerRegex, new RegExp(removeNumbers ? "([".concat(WS, "]+(['-][").concat(WS, "]+)*)") : "((\\d+([\\.,']\\d+)*)|([".concat(WS + DS, "]+(['-][").concat(WS + DS, "]+)*))"), "g"));
  }
  /**
   * Tokenizes the given text/document in
   *  word level.
   * @param {string} text - Text/document.
   * @returns {Array<string>} the tokenized version
   *  of the given text.
   */


  _createClass(NaiveWordTokenizer, [{
    key: "tokenize",
    value: function tokenize(text) {
      var res = [];
      var mtc = text.match(_classPrivateFieldGet(this, _tokenizerRegex));

      if (mtc) {
        var _iterator = _createForOfIteratorHelper(mtc),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var m = _step.value;
            if (m.length > _classPrivateFieldGet(this, _minWordLen)) res.push(m);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      return res;
    }
  }]);

  return NaiveWordTokenizer;
}();

exports.NaiveWordTokenizer = NaiveWordTokenizer;
var _wordSet = {
  writable: true,
  value: "a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_"
};
var _digitSet = {
  writable: true,
  value: "\\d"
};
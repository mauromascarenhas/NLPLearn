"use strict";
/**
 * Provides text preprocessing utilities for
 *  data-processing pipelines.
 * @module preprocessor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextProcessor = exports.TextCase = exports.StemmerType = void 0;

var _tokenization = require("../preprocessing/tokenization");

var _stemmer = require("../preprocessing/stemmer");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classStaticPrivateMethodGet(receiver, classConstructor, method) { _classCheckPrivateStaticAccess(receiver, classConstructor); return method; }

function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

/**
 * Interface used for variable type checking.
 * @typedef {object} TypeCheck
 * @property {string} name - Variable name.
 * @property {string|any[]} type - Variable type.
 * @property {any} value - Variable value.
 */

/**
 * Enumerator used so as to specify the text case to be applied by TextProcessor
 * @enum {string}
 */
var TextCase = Object.freeze({
  NONE: "NONE",
  LOWERCASE: "LOWERCASE",
  UPPERCASE: "UPPERCASE"
});
/**
 * Enumerator used so as to specify the stemmer to be used by TextProcessor
 * @enum {string}
 */

exports.TextCase = TextCase;
var StemmerType = Object.freeze({
  NONE: "NONE",
  RSLP: "RSLP",
  PORTER: "PORTER"
});
/**
 * Convenience class which provides a text preprocessing pipeline
 *  with predefined (and customizable) steps.
 */

exports.StemmerType = StemmerType;

var _checkPrimitive = /*#__PURE__*/new WeakSet();

var _checkInstance = /*#__PURE__*/new WeakSet();

var TextProcessor = /*#__PURE__*/function () {
  /**
   * Creates an instance of TextProcessor.
   * @param {boolean} normSpacing - Normalize extra spaces.
   * @param {TextCase} normCase - Normalize text case.
   * @param {boolean} trimSpaces - Removes initial and ending spaces.
   * @param {boolean} stripAccents - Removes accents.
   * @param {boolean} tokenize - Tokenize text.
   * @param {boolean} removeNumbers - Ignore numbers.
   * @param {string[]} stopwords - Stoplist.
   * @param {StemmerType} stemmerType - Stemmer type.
   */
  function TextProcessor() {
    var normSpacing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var normCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TextCase.NONE;
    var trimSpaces = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var stripAccents = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var tokenize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var removeNumbers = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var stopwords = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
    var stemmerType = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : StemmerType.NONE;

    _classCallCheck(this, TextProcessor);

    _classPrivateMethodInitSpec(this, _checkInstance);

    _classPrivateMethodInitSpec(this, _checkPrimitive);

    _classPrivateMethodGet(this, _checkPrimitive, _checkPrimitive2).call(this, [{
      name: "normSpacing",
      type: "boolean",
      value: normSpacing
    }, {
      name: "trimSpaces",
      type: "boolean",
      value: trimSpaces
    }, {
      name: "stripAccents",
      type: "boolean",
      value: stripAccents
    }, {
      name: "tokenize",
      type: "boolean",
      value: tokenize
    }, {
      name: "removeNumbers",
      type: "boolean",
      value: removeNumbers
    }]);

    _classPrivateMethodGet(this, _checkInstance, _checkInstance2).call(this, [{
      name: "stopwords",
      type: Array,
      value: stopwords
    }]);

    if (!normCase in TextCase) throw new Error("Invalid value for 'normCase'. It must be one of the object values available at TextCase object.");
    if (!stemmerType in StemmerType) throw new Error("Invalid value for 'normCase'. It must be one of the object values available at StemmerType object.");
    this.normCase = normCase;
    this.tokenize = tokenize;
    this.stopwords = _toConsumableArray(stopwords);
    this.trimSpaces = trimSpaces;
    this.normSpacing = normSpacing;
    this.stemmerType = stemmerType;
    this.stripAccents = stripAccents;
    this.removeNumbers = removeNumbers;
  }
  /**
   * Stub method (for pipeline compatibility purposes)
   * @param {string[]} X - 2d text array.
   * @returns {TextProcessor} current instance.
   */


  _createClass(TextProcessor, [{
    key: "fit",
    value: function fit(X) {
      return this;
    }
    /**
     * Applies the requested transformations to the given document set. 
     * @param {string[]} X - 2d text array.
     * @returns {string[]|string[][]} the transformed text.
     */

  }, {
    key: "transform",
    value: function transform(X) {
      if (!X instanceof Array) throw new TypeError("Invalid value for 'X'. It must be a 2d string array.");
      /** @type {string[]|string[][]} */

      var txts = _toConsumableArray(X);

      if (this.normCase === TextCase.LOWERCASE) txts = txts.map(function (t) {
        return t.toLocaleLowerCase();
      });
      if (this.normSpacing) txts = txts.map(_classStaticPrivateMethodGet(TextProcessor, TextProcessor, _normalizeSpacing));
      if (this.trimSpaces) txts = txts.map(function (t) {
        return t.trim();
      });

      if (this.tokenize) {
        var tokenizer = new _tokenization.NaiveWordTokenizer(this.removeNumbers);

        switch (this.stemmerType) {
          case StemmerType.RSLP:
            txts = txts.map(function (t) {
              return tokenizer.tokenize(t).map(_stemmer.RSLPStemmer.stem);
            });
            break;

          case StemmerType.PORTER:
            txts = txts.map(function (t) {
              return tokenizer.tokenize(t).map(_stemmer.PorterStemmer.stem);
            });
            break;

          default:
            txts = txts.map(tokenizer.tokenize);
            break;
        }

        if (this.normCase === TextCase.UPPERCASE) txts = txts.map(function (t) {
          return t.map(function (s) {
            return s.toLocaleUpperCase();
          });
        });
        if (this.stripAccents) txts = txts.map(function (t) {
          return t.map(_classStaticPrivateMethodGet(TextProcessor, TextProcessor, _removeAccents));
        });
        var stw = this.stopwords;

        if (stw.length) {
          if (this.normCase === TextCase.LOWERCASE) stw = stw.map(function (t) {
            return t.toLocaleLowerCase();
          });
          if (this.stemmerType === StemmerType.RSLP) stw = stw.map(_stemmer.RSLPStemmer.stem);
          if (this.stemmerType === StemmerType.PORTER) stw = stw.map(_stemmer.PorterStemmer.stem);
          if (this.normCase === TextCase.LOWERCASE) stw = stw.map(function (t) {
            return t.toLocaleUpperCase();
          });
          if (this.stripAccents) stw = stw.map(_classStaticPrivateMethodGet(TextProcessor, TextProcessor, _removeAccents));
          txts = txts.map(function (t) {
            return t.filter(function (w) {
              return !stw.includes(w);
            });
          });
        }
      } else {
        if (this.normCase === TextCase.UPPERCASE) txts = txts.map(function (t) {
          return t.toLocaleUpperCase();
        });
        if (this.stripAccents) txts = txts.map(_classStaticPrivateMethodGet(TextProcessor, TextProcessor, _removeAccents));
      }

      return txts;
    }
    /**
     * Ocerloaded stub method (for pipeline compatibility purposes).
     *  Behaves the same as if calling "this.transform()".
     * @param {string[]} X - 2d text array.
     * @returns {string[]|string[][]} the transformed text.
     */

  }, {
    key: "fitTransform",
    value: function fitTransform(X) {
      return this.fit(X).transform(X);
    }
    /**
     * Removes "extra" spaces.
     * @param {string} txt - Text to be normalized.
     * @returns {string} text with normalized spaces.
     */

  }, {
    key: "toModel",
    value:
    /**
     * Exports the current classifer.
     * @returns {TextProcessorModel}
     */
    function toModel() {
      return {
        normCase: this.normCase,
        tokenize: this.tokenize,
        stopwords: _toConsumableArray(this.stopwords),
        trimSpaces: this.trimSpaces,
        normSpacing: this.normSpacing,
        stemmerType: this.stemmerType,
        stripAccents: this.stripAccents,
        removeNumbers: this.removeNumbers
      };
    }
  }], [{
    key: "fromModel",
    value:
    /**
     * @typedef {object} TextProcessorModel
     * @property {boolean} normSpacing - Normalize extra spaces.
     * @property {TextCase} normCase - Normalize text case.
     * @property {boolean} trimSpaces - Removes initial and ending spaces.
     * @property {boolean} stripAccents - Removes accents.
     * @property {boolean} tokenize - Tokenize text.
     * @property {boolean} removeNumbers - Ignore numbers.
     * @property {string[]} stopwords - Stoplist.
     * @property {StemmerType} stemmerType - Stemmer type.
     */

    /**
     * Convenience method for converting a valid TextProcessorModel
     *  into a TextProcessor object instance.
     * @param {TextProcessorModel} model - TextProcessor
     *  exported model.
     * @returns {TextProcessor} a TextProcessor instance.
     */
    function fromModel(model) {
      return new TextProcessor(model.normSpacing, model.normCase, model.trimSpaces, model.stripAccents, model.tokenize, model.removeNumbers, model.stopwords, model.stemmerType);
    }
  }]);

  return TextProcessor;
}();

exports.TextProcessor = TextProcessor;

function _normalizeSpacing(txt) {
  return txt.replace(/\s+/gi, " ");
}

function _removeAccents(txt) {
  return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function _checkPrimitive2(typeChecks) {
  var _iterator = _createForOfIteratorHelper(typeChecks),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var el = _step.value;
      if (_typeof(el.value) != el.type) throw new TypeError("Invalid argument type for '".concat(el.name, "'. Expected '").concat(el.type, "', but '").concat(_typeof(el.value), "' was given."));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function _checkInstance2(typeChecks) {
  var _iterator2 = _createForOfIteratorHelper(typeChecks),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var el = _step2.value;
      if (!el.value instanceof el.type) throw new TypeError("Invalid argument type for '".concat(el.name, "'. Expected '").concat(el.type, "', but '").concat(el.value.constructor.name, "' was given."));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
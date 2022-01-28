"use strict";
/**
 * Text-vectorization utilities.
 * @module vectorizer
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextVectorizer = exports.TFMetrics = exports.IDFMetrics = void 0;

var _copy = require("../utils/copy");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classStaticPrivateMethodGet(receiver, classConstructor, method) { _classCheckPrivateStaticAccess(receiver, classConstructor); return method; }

function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

/**
 * Constants for specifying TF metrics
 * @enum {string}
 */
var TFMetrics = Object.freeze({
  RAW: "RAW",
  LOG: "LOGARITHM",
  BOOL: "BOOLEAN",
  FREQ: "FREQUENCY"
});
/**
 * Constants for specifying IDF metrics
 * @enum {string}
 */

exports.TFMetrics = TFMetrics;
var IDFMetrics = Object.freeze({
  NONE: "NONE",
  SMOOTH: "SMOOTH",
  REGULAR: "REGULAR"
});
/**
 * Utility class used for text vectorization purposes.
 */

exports.IDFMetrics = IDFMetrics;

var _tf = /*#__PURE__*/new WeakMap();

var _idf = /*#__PURE__*/new WeakMap();

var _vocab = /*#__PURE__*/new WeakMap();

var _isFitted = /*#__PURE__*/new WeakMap();

var _vocab_map = /*#__PURE__*/new WeakMap();

var _transformRaw = /*#__PURE__*/new WeakSet();

var _transformLog = /*#__PURE__*/new WeakSet();

var _transformBool = /*#__PURE__*/new WeakSet();

var _transformFreq = /*#__PURE__*/new WeakSet();

var _transformIDF = /*#__PURE__*/new WeakSet();

var TextVectorizer = /*#__PURE__*/function () {
  /** @type {Array<string>} */

  /** @type {object} */

  /**
   * Creates an instance of TextVectorizer class
   * @param {string} tf - Term-Frequency
   * @param {string} idf - Inverse Document-Frequency
   * @param {Array<string>} vocab - Vocabulary
   */
  function TextVectorizer() {
    var _tf2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TFMetrics.RAW;

    var idf = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : IDFMetrics.NONE;
    var vocab = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, TextVectorizer);

    _classPrivateMethodInitSpec(this, _transformIDF);

    _classPrivateMethodInitSpec(this, _transformFreq);

    _classPrivateMethodInitSpec(this, _transformBool);

    _classPrivateMethodInitSpec(this, _transformLog);

    _classPrivateMethodInitSpec(this, _transformRaw);

    _classPrivateFieldInitSpec(this, _tf, {
      writable: true,
      value: TFMetrics.RAW
    });

    _classPrivateFieldInitSpec(this, _idf, {
      writable: true,
      value: IDFMetrics.NONE
    });

    _classPrivateFieldInitSpec(this, _vocab, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec(this, _isFitted, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _vocab_map, {
      writable: true,
      value: null
    });

    if (!_tf2 in TFMetrics) throw new Error("Invalid value for 'tf'.  It must be one of the object values available at TFMetrics object.");
    if (!idf in IDFMetrics) throw new Error("Invalid value for 'idf'.  It must be one of the object values available at IDFMetrics object.");
    if (vocab && !vocab instanceof Array) throw new TypeError("Invalid argument type for 'vocab'. Expected 'Array<string>', but '".concat(_typeof(vocab), "' was given."));

    _classPrivateFieldSet(this, _tf, _tf2);

    _classPrivateFieldSet(this, _idf, idf);

    _classPrivateFieldSet(this, _vocab, vocab);
  }

  _createClass(TextVectorizer, [{
    key: "tfMetrics",
    get: function get() {
      return _classPrivateFieldGet(this, _tf);
    }
  }, {
    key: "idfMetrics",
    get: function get() {
      return _classPrivateFieldGet(this, _idf);
    }
  }, {
    key: "vocabulary",
    get: function get() {
      return _classPrivateFieldGet(this, _vocab);
    }
    /**
     * Builds vocabulary (if not specified) and vocabulary
     *  map
     * @param {Array<Array<string>>} X - Array of
     *  tokenized texts.
     * @returns {TextVectorizer} self instance
     */

  }, {
    key: "fit",
    value: function fit(X) {
      var x = _classStaticPrivateMethodGet(TextVectorizer, TextVectorizer, _checkTokenList).call(TextVectorizer, X);

      _classPrivateFieldSet(this, _vocab, _classPrivateFieldGet(this, _vocab) || _classStaticPrivateMethodGet(TextVectorizer, TextVectorizer, _buildVocabulary).call(TextVectorizer, x));

      _classPrivateFieldSet(this, _vocab_map, {});

      for (var i = 0; i < _classPrivateFieldGet(this, _vocab).length; ++i) {
        _classPrivateFieldGet(this, _vocab_map)[_classPrivateFieldGet(this, _vocab)[i]] = i;
      }

      _classPrivateFieldSet(this, _isFitted, true);

      return this;
    }
    /**
     * Vectorizes the given dataset.
     * @param {Array<Array<string>>} X - Array of
     *  tokenized texts.
     * @returns {Array<Array<number>>} TF-IDF matrix.
     */

  }, {
    key: "transform",
    value: function transform(X) {
      if (!_classPrivateFieldGet(this, _isFitted)) throw new Error("The Vectorizer must be fitted before a transformation request.");

      var X_ = _classStaticPrivateMethodGet(TextVectorizer, TextVectorizer, _checkTokenList).call(TextVectorizer, X);

      var tf;

      switch (_classPrivateFieldGet(this, _tf)) {
        case TFMetrics.RAW:
          tf = _classPrivateMethodGet(this, _transformRaw, _transformRaw2).call(this, X_);
          break;

        case TFMetrics.LOG:
          tf = _classPrivateMethodGet(this, _transformLog, _transformLog2).call(this, X_);
          break;

        case TFMetrics.BOOL:
          tf = _classPrivateMethodGet(this, _transformBool, _transformBool2).call(this, X_);
          break;

        case TFMetrics.FREQ:
          tf = _classPrivateMethodGet(this, _transformFreq, _transformFreq2).call(this, X_);
          break;
      }

      if (_classPrivateFieldGet(this, _idf) === IDFMetrics.NONE) return tf;

      var idf = _classPrivateMethodGet(this, _transformIDF, _transformIDF2).call(this, X_, _classPrivateFieldGet(this, _idf) === IDFMetrics.SMOOTH);

      var tfidf = [];

      var _iterator = _createForOfIteratorHelper(tf),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var row = _step.value;
          var nr = new Array(row.length);

          var _iterator2 = _createForOfIteratorHelper(row.entries()),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _step2$value = _slicedToArray(_step2.value, 2),
                  j = _step2$value[0],
                  el = _step2$value[1];

              nr[j] = el * idf[j];
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          tfidf.push(nr);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return tfidf;
    }
    /**
     * Convenience method for #fit + #transform
     * @param {Array<Array<string>>} X - Array of
     *  tokenized texts.
     * @returns {Array<Array<number>>} TF-IDF matrix.
     */

  }, {
    key: "fitTransform",
    value: function fitTransform(X) {
      return this.fit(X).transform(X);
    }
    /**
     * @param {Array<Array<string>>} X - Array of
     *  tokenized texts.
     * @returns {Array<Array<number>>} TF matrix (raw).
     */

  }, {
    key: "loadModel",
    value:
    /**
     * @typedef {Object} TextVectorizerModel
     * @property {string} tf - TFMetrics value.
     * @property {string} idf - IDFMetrics value.
     * @property {Array<string>|null} vocabulary - Vocabulary.
     * @property {object|null} vocabulary_map - Vocabulary map
     *  object.
     * @property {boolean} isFitted - A property which
     *  specifies whether the vectorizer is fitted or not.
     */

    /**
     * Loads TextVectorizerModel's data into current
     *  instance.
     * @param {TextVectorizerModel} model - TextVectorizer
     *  exported model.
     */
    function loadModel(model) {
      _classPrivateFieldSet(this, _isFitted, model.isFitted);

      _classPrivateFieldSet(this, _vocab_map, model.vocabulary_map);
    }
    /**
     * Convenience method for converting a valid TextVectorizerModel
     *  into a TextVectorizer object instance.
     * @param {TextVectorizerModel} model - TextVectorizer
     *  exported model.
     * @returns {TextVectorizer} a TextVectorizer instance.
     */

  }, {
    key: "toModel",
    value:
    /**
     * Exports the current classifer.
     * @returns {TextVectorizerModel}
     */
    function toModel() {
      return {
        tf: _classPrivateFieldGet(this, _tf),
        idf: _classPrivateFieldGet(this, _idf),
        isFitted: _classPrivateFieldGet(this, _isFitted),
        vocabulary: _classPrivateFieldGet(this, _vocab) ? (0, _copy.deepCopy)(_classPrivateFieldGet(this, _vocab)) : null,
        vocabulary_map: _classPrivateFieldGet(this, _vocab_map) ? (0, _copy.deepCopy)(_classPrivateFieldGet(this, _vocab_map)) : null
      };
    }
  }], [{
    key: "fromModel",
    value: function fromModel(model) {
      var inst = new TextVectorizer(model.tf, model.idf, model.vocabulary);
      inst.fromModel(model);
      return inst;
    }
  }]);

  return TextVectorizer;
}();

exports.TextVectorizer = TextVectorizer;

function _transformRaw2(X) {
  var tf = new Array(X.length);

  for (var i = 0; i < tf.length; ++i) {
    tf[i] = new Array(_classPrivateFieldGet(this, _vocab).length).fill(0);
  }

  for (var _i2 = 0; _i2 < X.length; ++_i2) {
    var _iterator3 = _createForOfIteratorHelper(X[_i2]),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var el = _step3.value;
        if (el in _classPrivateFieldGet(this, _vocab_map)) tf[_i2][_classPrivateFieldGet(this, _vocab_map)[el]]++;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }

  return tf;
}

function _transformLog2(X) {
  var tf = _classPrivateMethodGet(this, _transformRaw, _transformRaw2).call(this, X);

  for (var i = 0; i < tf.length; ++i) {
    for (var j = 0; j < tf[i].length; ++j) {
      tf[i][j] = Math.log(tf[i][j] + 1);
    }
  }

  return tf;
}

function _transformBool2(X) {
  var tf = new Array(X.length);

  for (var i = 0; i < tf.length; ++i) {
    tf[i] = new Array(_classPrivateFieldGet(this, _vocab).length).fill(0);
  }

  for (var _i3 = 0; _i3 < X.length; ++_i3) {
    var _iterator4 = _createForOfIteratorHelper(X[_i3]),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var el = _step4.value;
        if (el in _classPrivateFieldGet(this, _vocab_map)) tf[_i3][_classPrivateFieldGet(this, _vocab_map)[el]] = 1;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  }

  return tf;
}

function _transformFreq2(X) {
  var tf = _classPrivateMethodGet(this, _transformRaw, _transformRaw2).call(this, X);

  for (var i = 0; i < tf.length; ++i) {
    var sum = 0;

    for (var j = 0; j < tf[i].length; ++j) {
      sum += tf[i][j];
    }

    for (var _j = 0; _j < tf[i].length; ++_j) {
      tf[i][_j] = tf[i][_j] / sum;
    }
  }

  return tf;
}

function _transformIDF2(X, smooth) {
  var tf_bool = _classPrivateMethodGet(this, _transformBool, _transformBool2).call(this, X);

  var n_count = new Array(tf_bool[0].length).fill(0);

  for (var i = 0; i < tf_bool.length; ++i) {
    for (var j = 0; j < tf_bool[i].length; ++j) {
      n_count[j] += tf_bool[i][j];
    }
  }

  if (smooth) for (var _i4 = 0; _i4 < n_count.length; ++_i4) {
    n_count[_i4] = Math.log((X.length + 1) / (n_count[_i4] + 1)) + 1;
  } else for (var _i5 = 0; _i5 < n_count.length; ++_i5) {
    n_count[_i5] = Math.log(X.length / n_count[_i5]) + 1;
  }
  return n_count;
}

function _buildVocabulary(X) {
  var vocab = new Set();

  var _iterator5 = _createForOfIteratorHelper(X),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var row = _step5.value;

      var _iterator6 = _createForOfIteratorHelper(row),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var el = _step6.value;
          vocab.add(el);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }

  return Array.from(vocab).sort();
}

function _checkTokenList(arr) {
  try {
    var _iterator7 = _createForOfIteratorHelper(arr),
        _step7;

    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var row = _step7.value;

        var _iterator8 = _createForOfIteratorHelper(row),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var el = _step8.value;
            if (typeof el != "string") throw new TypeError("Expected '2d' string list-like object.");
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }

    return (0, _copy.deepCopy)(arr);
  } catch (_) {
    throw new TypeError("Expected '2d' string list-like object.");
  }
}
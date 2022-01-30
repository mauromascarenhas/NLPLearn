require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/**
 * Provides classification tools for vectorized texts.
 * @module classifier
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NLPClassifier = exports.DistMetrics = exports.CLFMetrics = void 0;

var _copy = require("../utils/copy");

var _distance = require("../utils/distance");

var _vectorizer = require("../preprocessing/vectorizer");

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

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Sums array elements and returns min(sum, 1).
 * @param {number[]} arr - Array of numbers.
 * @returns {number} sum of the array's elements
 *  of 1 if sum <= 0.
 */
function safeSum(arr) {
  var sum = 0;

  for (var i = 0; i < arr.length; ++i) {
    sum += arr[i];
  }

  return sum > 0 ? sum : 1;
}
/**
 * Similar to "cosine" but considering the
 *   possibility of |v1| = 0 or |v2| = 0.
 * @param {number[]} v1 - First vector.
 * @param {number[]} v2 - Second vector.
 * @returns {number} the cosine distance.
 */


function safeCos(v1, v2) {
  var s1 = 0,
      s2 = 0;

  for (var i = 0; i < v1.length; ++i) {
    s1 += v1[i];
  }

  for (var _i = 0; _i < v2.length; ++_i) {
    s2 += v2[_i];
  }

  return s1 && s2 ? (0, _distance.cosine)(v1, v2) : +!!(s1 || s2);
}
/**
 * Constants for specifying distance metrics.
 * @enum {string}
 */


var DistMetrics = Object.freeze({
  COSINE: "COSINE",
  EUCLIDEAN: "EUCLIDEAN"
});
/**
 * Constants for specifying classifier metrics.
 * @enum {string}
 */

exports.DistMetrics = DistMetrics;
var CLFMetrics = Object.freeze(_objectSpread({
  AVG: "AVERAGE"
}, _vectorizer.TFMetrics));
/**
 * A simple heuristics-based NLP classifier.
 */

exports.CLFMetrics = CLFMetrics;

var _idf = /*#__PURE__*/new WeakMap();

var _mtr = /*#__PURE__*/new WeakMap();

var _dist = /*#__PURE__*/new WeakMap();

var _coef = /*#__PURE__*/new WeakMap();

var _classes = /*#__PURE__*/new WeakMap();

var _isFitted = /*#__PURE__*/new WeakMap();

var _fitAvg = /*#__PURE__*/new WeakSet();

var _fitLog = /*#__PURE__*/new WeakSet();

var _fitRaw = /*#__PURE__*/new WeakSet();

var _fitBool = /*#__PURE__*/new WeakSet();

var _fitFreq = /*#__PURE__*/new WeakSet();

var _fitIDF = /*#__PURE__*/new WeakSet();

var _transformTest = /*#__PURE__*/new WeakSet();

var _applyDecision = /*#__PURE__*/new WeakSet();

var NLPClassifier = /*#__PURE__*/function () {
  /** @type {number[][]} */

  /** @type {any[]} */

  /**
   * Creates an instance of NLPClassifier.
   * @param {CLFMetrics} mtr - Term-Frequency metrics
   *  + average.
   * @param {DistMetrics} dist - Similarity metric.
   * @param {IDFMetrics} idf - IDF metric.
   */
  function NLPClassifier() {
    var mtr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : CLFMetrics.AVG;
    var dist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DistMetrics.COSINE;
    var idf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _vectorizer.IDFMetrics.NONE;

    _classCallCheck(this, NLPClassifier);

    _classPrivateMethodInitSpec(this, _applyDecision);

    _classPrivateMethodInitSpec(this, _transformTest);

    _classPrivateMethodInitSpec(this, _fitIDF);

    _classPrivateMethodInitSpec(this, _fitFreq);

    _classPrivateMethodInitSpec(this, _fitBool);

    _classPrivateMethodInitSpec(this, _fitRaw);

    _classPrivateMethodInitSpec(this, _fitLog);

    _classPrivateMethodInitSpec(this, _fitAvg);

    _classPrivateFieldInitSpec(this, _idf, {
      writable: true,
      value: _vectorizer.IDFMetrics.NONE
    });

    _classPrivateFieldInitSpec(this, _mtr, {
      writable: true,
      value: DistMetrics.COSINE
    });

    _classPrivateFieldInitSpec(this, _dist, {
      writable: true,
      value: CLFMetrics.AVG
    });

    _classPrivateFieldInitSpec(this, _coef, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec(this, _classes, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec(this, _isFitted, {
      writable: true,
      value: false
    });

    if (!idf in _vectorizer.IDFMetrics) throw new Error("Invalid value for 'idf'. It must be one of the object values available at IDFMetrics object.");
    if (!mtr in CLFMetrics) throw new Error("Invalid value for 'mtr'. It must be one of the object values available at CLFMetrics object.");
    if (!dist in DistMetrics) throw new Error("Invalid value for 'dist'. It must be one of the object values available at DistMetrics object.");

    _classPrivateFieldSet(this, _idf, idf);

    _classPrivateFieldSet(this, _mtr, mtr);

    _classPrivateFieldSet(this, _dist, dist);
  }

  _createClass(NLPClassifier, [{
    key: "classes",
    get: function get() {
      return _classPrivateFieldGet(this, _classes) ? _toConsumableArray(_classPrivateFieldGet(this, _classes)) : null;
    }
  }, {
    key: "clfMetrics",
    get: function get() {
      return _classPrivateFieldGet(this, _mtr);
    }
  }, {
    key: "idfMetrics",
    get: function get() {
      return _classPrivateFieldGet(this, _idf);
    }
  }, {
    key: "distMetrics",
    get: function get() {
      return _classPrivateFieldGet(this, _dist);
    }
  }, {
    key: "coefficients",
    get: function get() {
      return _classPrivateFieldGet(this, _coef) ? (0, _copy.deepCopy)(_classPrivateFieldGet(this, _coef)) : null;
    }
    /**
     * Generates classification coefficients and classes
     *  for current instance.
     * It must always be called before "predict".
     * @param {number[][]} X - Document-Term matrix
     *  (vectorized text).
     * @param {any[]} Y - Correspondent classification
     *  array.
     * @returns {NLPClassifier} reference to current
     *  classifier.
     */

  }, {
    key: "fit",
    value: function fit(X, Y) {
      if (!(X instanceof Array && X[0] && X[0] instanceof Array && typeof X[0][0] === "number")) throw new TypeError("'X' must be a 2d numeric array.");
      if (!(Y instanceof Array)) throw new TypeError("'Y' must be a 1d array.");
      /** @type {number[][]} */

      var x = (0, _copy.deepCopy)(X);
      /** @type {any[]} */

      var y = (0, _copy.deepCopy)(Y);

      _classPrivateFieldSet(this, _classes, Array.from(new Set(y)));

      for (var i = 0; i < y.length; ++i) {
        y[i] = _classPrivateFieldGet(this, _classes).indexOf(y[i]);
      }
      /** @type {number[][]} */


      var tf;

      switch (_classPrivateFieldGet(this, _mtr)) {
        case CLFMetrics.AVG:
          tf = _classPrivateMethodGet(this, _fitAvg, _fitAvg2).call(this, x, y);
          break;

        case CLFMetrics.LOG:
          tf = _classPrivateMethodGet(this, _fitLog, _fitLog2).call(this, x, y);
          break;

        case CLFMetrics.RAW:
          tf = _classPrivateMethodGet(this, _fitRaw, _fitRaw2).call(this, x, y);
          break;

        case CLFMetrics.BOOL:
          tf = _classPrivateMethodGet(this, _fitBool, _fitBool2).call(this, x, y);
          break;

        case CLFMetrics.FREQ:
          tf = _classPrivateMethodGet(this, _fitFreq, _fitFreq2).call(this, x, y);
          break;
      }

      if (_classPrivateFieldGet(this, _idf) === _vectorizer.IDFMetrics.NONE) _classPrivateFieldSet(this, _coef, tf);else {
        var idf = _classPrivateMethodGet(this, _fitIDF, _fitIDF2).call(this, x, y, _classPrivateFieldGet(this, _idf) === _vectorizer.IDFMetrics.SMOOTH);

        _classPrivateFieldSet(this, _coef, new Array(tf.length));

        for (var _i2 = 0; _i2 < tf.length; ++_i2) {
          _classPrivateFieldGet(this, _coef)[_i2] = new Array(tf[_i2].length);

          for (var j = 0; j < tf[_i2].length; ++j) {
            _classPrivateFieldGet(this, _coef)[_i2][j] = tf[_i2][j] * idf[j];
          }
        }
      }

      _classPrivateFieldSet(this, _isFitted, true);

      return this;
    }
    /**
     * Performs the prediction for the given input.
     * @param {number[][]} X - Document-Term matrix
     *  (vectorized text).
     * @returns {any[]} an array of predicted values (classes).
     */

  }, {
    key: "predict",
    value: function predict(X) {
      if (!_classPrivateFieldGet(this, _isFitted)) throw new Error("The classifier must be fitted before predicting anything.");
      if (!(X instanceof Array && X[0] instanceof Array && typeof X[0][0] === "number")) throw new TypeError("'X' must be a 2d numeric array.");
      if (X[0].length != _classPrivateFieldGet(this, _coef)[0].length) throw new TypeError("'X' must have at least ".concat(_classPrivateFieldGet(this, _coef).length, " features."));

      var decision = _classPrivateMethodGet(this, _applyDecision, _applyDecision2).call(this, _classPrivateMethodGet(this, _transformTest, _transformTest2).call(this, X), _classPrivateFieldGet(this, _dist) === DistMetrics.COSINE ? safeCos : _distance.euclidean);

      for (var i = 0; i < decision.length; ++i) {
        decision[i] = this.classes[decision[i].indexOf(Math.min.apply(Math, _toConsumableArray(decision[i])))];
      }

      return decision;
    }
    /**
     * Behaves similarly to #predict, but instad of returning
     *  an array containing the most similar documents, it
     *  returns a matrix of probability [0,1] for each
     *  document/class.
     * The greater the value, the most similar it is;
     * @param {number[][]} X - Document-Term matrix
     *  (vectorized text).
     * @returns {any[][]} a matrix of match probability
     *  for each document.
     */

  }, {
    key: "predictProba",
    value: function predictProba(X) {
      if (!_classPrivateFieldGet(this, _isFitted)) throw new Error("The classifier must be fitted before predicting anything.");
      if (!(X instanceof Array && X[0] instanceof Array && typeof X[0][0] === "number")) throw new TypeError("'X' must be a 2d numeric array.");
      if (X[0].length != _classPrivateFieldGet(this, _coef)[0].length) throw new TypeError("'X' must have at least ".concat(_classPrivateFieldGet(this, _coef).length, " features."));

      var decision = _classPrivateMethodGet(this, _applyDecision, _applyDecision2).call(this, _classPrivateMethodGet(this, _transformTest, _transformTest2).call(this, X), _classPrivateFieldGet(this, _dist) === DistMetrics.COSINE ? safeCos : _distance.euclidean);

      if (_classPrivateFieldGet(this, _dist) === DistMetrics.COSINE) {
        for (var i = 0; i < decision.length; ++i) {
          for (var j = 0; j < decision[i].length; ++j) {
            decision[i][j] = 1 - decision[i][j];
          }

          var ssum = safeSum(decision[i]);

          for (var _j = 0; _j < decision[i].length; ++_j) {
            decision[i][_j] = decision[i][_j] / ssum;
          }
        }
      } else {
        for (var _i3 = 0; _i3 < decision.length; ++_i3) {
          var _ssum = safeSum(decision[_i3]);

          for (var _j2 = 0; _j2 < decision[_i3].length; ++_j2) {
            decision[_i3][_j2] = 1 - decision[_i3][_j2] / _ssum;
          }
        }
      }

      return decision;
    }
    /**
     * Fits the given document-term matrix to the specified
     *  metric (average).
     * @param {number[][]} x - Document-term matrix.
     * @param {any[]} y - Classes (map).
     * @returns {number[][]} the TF matrix (average).
     * @private
     */

  }, {
    key: "loadModel",
    value:
    /**
     * @typedef {Object} NLPClassifierModel
     * @property {string} idf - IDFMetrics value.
     * @property {string} mtr - CLFMetrics value.
     * @property {number[][]|null} coef - Fitted
     *  classifier coefficients (when available).
     * @property {string} dist - DistMetrics value.
     * @property {any[]|null} classes - Fitted
     *  classifier classes (when available).
     * @property {boolean} isFitted - A property which
     *  specifies whether the classifier is fitted or not.
     */

    /**
     * Loads NLPClassifierModel's data into current
     *  instance.
     * @param {NLPClassifierModel} model - NLPClassifier
     *  exported model.
     */
    function loadModel(model) {
      _classPrivateFieldSet(this, _coef, model.coef);

      _classPrivateFieldSet(this, _classes, model.classes);

      _classPrivateFieldSet(this, _isFitted, model.isFitted);
    }
    /**
     * Convenience method for converting a valid NLPClassifierModel
     *  into a NLPClassifier object instance.
     * @param {NLPClassifierModel} model - NLPClassifier
     *  exported model.
     * @returns {NLPClassifier} a NLPClassifier instance.
     */

  }, {
    key: "toModel",
    value:
    /**
     * Exports the current classifer.
     * @returns {NLPClassifierModel}
     */
    function toModel() {
      return {
        idf: _classPrivateFieldGet(this, _idf),
        mtr: _classPrivateFieldGet(this, _mtr),
        dist: _classPrivateFieldGet(this, _dist),
        coef: _classPrivateFieldGet(this, _coef) ? (0, _copy.deepCopy)(_classPrivateFieldGet(this, _coef)) : null,
        classes: _classPrivateFieldGet(this, _classes) ? (0, _copy.deepCopy)(_classPrivateFieldGet(this, _classes)) : null,
        isFitted: _classPrivateFieldGet(this, _isFitted)
      };
    }
  }], [{
    key: "fromModel",
    value: function fromModel(model) {
      var inst = new NLPClassifier(model.mtr, model.dist, model.idf);
      inst.fromModel(model);
      return inst;
    }
  }]);

  return NLPClassifier;
}();

exports.NLPClassifier = NLPClassifier;

function _fitAvg2(x, y) {
  var count = new Array(_classPrivateFieldGet(this, _classes).length).fill(0);
  var coef = new Array(_classPrivateFieldGet(this, _classes).length);

  for (var i = 0; i < coef.length; ++i) {
    coef[i] = new Array(x[i].length).fill(0);
  }

  for (var _i4 = 0; _i4 < x.length; ++_i4) {
    for (var j = 0; j < x[_i4].length; ++j) {
      coef[y[_i4]][j] = coef[y[_i4]][j] + x[_i4][j];
    }

    count[y[_i4]]++;
  }

  for (var _i5 = 0; _i5 < count.length; ++_i5) {
    for (var _j3 = 0; _j3 < coef[_i5].length; ++_j3) {
      coef[_i5][_j3] = coef[_i5][_j3] / count[_i5];
    }
  }

  return coef;
}

function _fitLog2(x, y) {
  var count = new Array(_classPrivateFieldGet(this, _classes).length).fill(0);
  var coef = new Array(_classPrivateFieldGet(this, _classes).length);

  for (var i = 0; i < coef.length; ++i) {
    coef[i] = new Array(x[i].length).fill(0);
  }

  for (var _i6 = 0; _i6 < x.length; ++_i6) {
    for (var j = 0; j < x[_i6].length; ++j) {
      coef[y[_i6]][j] = coef[y[_i6]][j] + Math.log(x[_i6][j] + 1);
    }

    count[y[_i6]]++;
  }

  for (var _i7 = 0; _i7 < count.length; ++_i7) {
    for (var _j4 = 0; _j4 < coef[_i7].length; ++_j4) {
      coef[_i7][_j4] = coef[_i7][_j4] / count[_i7];
    }
  }

  return coef;
}

function _fitRaw2(x, y) {
  var coef = new Array(_classPrivateFieldGet(this, _classes).length);

  for (var i = 0; i < _classPrivateFieldGet(this, _classes).length; ++i) {
    coef[i] = new Array(x[i].length).fill(0);
  }

  for (var _i8 = 0; _i8 < x.length; ++_i8) {
    for (var j = 0; j < x[_i8].length; ++j) {
      coef[y[_i8]][j] = coef[y[_i8]][j] + x[_i8][j];
    }
  }

  return coef;
}

function _fitBool2(x, y) {
  var coef = new Array(_classPrivateFieldGet(this, _classes).length);

  for (var i = 0; i < _classPrivateFieldGet(this, _classes).length; ++i) {
    coef[i] = new Array(x[i].length).fill(0);
  }

  for (var _i9 = 0; _i9 < x.length; ++_i9) {
    for (var j = 0; j < x[_i9].length; ++j) {
      coef[y[_i9]][j] = +(coef[y[_i9]][j] + x[_i9][j] != 0);
    }
  }

  return coef;
}

function _fitFreq2(x, y) {
  var count = new Array(_classPrivateFieldGet(this, _classes).length).fill(0);
  var coef = new Array(_classPrivateFieldGet(this, _classes).length);

  for (var i = 0; i < coef.length; ++i) {
    coef[i] = new Array(x[i].length).fill(0);
  }

  for (var _i10 = 0; _i10 < x.length; ++_i10) {
    var cSum = safeSum(x[_i10]);

    for (var j = 0; j < x[_i10].length; ++j) {
      coef[y[_i10]][j] = coef[y[_i10]][j] + x[_i10][j] / cSum;
    }

    count[y[_i10]]++;
  }

  for (var _i11 = 0; _i11 < count.length; ++_i11) {
    for (var _j5 = 0; _j5 < coef[_i11].length; ++_j5) {
      coef[_i11][_j5] = coef[_i11][_j5] / count[_i11];
    }
  }

  return coef;
}

function _fitIDF2(x, y) {
  var smooth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var bool_tf = _classPrivateMethodGet(this, _fitBool, _fitBool2).call(this, x, y);

  var n_count = new Array(bool_tf[0].length).fill(0);

  for (var i = 0; i < bool_tf.length; ++i) {
    for (var j = 0; j < bool_tf[i].length; ++j) {
      n_count[j] += bool_tf[i][j];
    }
  }

  if (smooth) for (var _i12 = 0; _i12 < n_count.length; ++_i12) {
    n_count[_i12] = Math.log((bool_tf.length + 1) / (n_count[_i12] + 1)) + 1;
  } else for (var _i13 = 0; _i13 < n_count.length; ++_i13) {
    n_count[_i13] = Math.log(bool_tf.length / n_count[_i13]) + 1;
  }
  return n_count;
}

function _transformTest2(X) {
  var m = new Array(X.length);

  switch (_classPrivateFieldGet(this, _mtr)) {
    case CLFMetrics.LOG:
      for (var i = 0; i < m.length; ++i) {
        var r = _toConsumableArray(X[i]);

        for (var j = 0; j < r.length; ++j) {
          r[j] = Math.log(r[j] + 1);
        }

        m[i] = r;
      }

      break;

    case CLFMetrics.BOOL:
      for (var _i14 = 0; _i14 < m.length; ++_i14) {
        var _r = _toConsumableArray(X[_i14]);

        for (var _j6 = 0; _j6 < _r.length; ++_j6) {
          _r[_j6] = !!_r[_j6];
        }

        m[_i14] = _r;
      }

      break;

    case CLFMetrics.FREQ:
      for (var _i15 = 0; _i15 < m.length; ++_i15) {
        var _r2 = _toConsumableArray(X[_i15]);

        var rs = safeSum(_r2);

        for (var _j7 = 0; _j7 < _r2.length; ++_j7) {
          _r2[_j7] = _r2[_j7] / rs;
        }

        m[_i15] = _r2;
      }

      break;

    default:
      return (0, _copy.deepCopy)(X);
  }

  return m;
}

function _applyDecision2(X, callable) {
  var m = new Array(X.length);

  for (var i = 0; i < m.length; ++i) {
    var r = new Array(_classPrivateFieldGet(this, _coef).length);

    for (var j = 0; j < r.length; ++j) {
      r[j] = callable(X[i], _classPrivateFieldGet(this, _coef)[j]);
    }

    m[i] = r;
  }

  return m;
}
},{"../preprocessing/vectorizer":7,"../utils/copy":8,"../utils/distance":9}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vectorizer = exports.tokenization = exports.stopwords = exports.stemmer = exports.preprocessor = exports.nltksw = exports.distance = exports.copy = exports.classifier = void 0;

var _copy = _interopRequireWildcard(require("./utils/copy"));

exports.copy = _copy;

var _distance = _interopRequireWildcard(require("./utils/distance"));

exports.distance = _distance;

var _preprocessor = _interopRequireWildcard(require("./utils/preprocessor"));

exports.preprocessor = _preprocessor;

var _classifier = _interopRequireWildcard(require("./classifier/nlpclassifier"));

exports.classifier = _classifier;

var _nltksw = _interopRequireWildcard(require("./nltk-data/stopwords.json"));

exports.nltksw = _nltksw;

var _stemmer = _interopRequireWildcard(require("./preprocessing/stemmer"));

exports.stemmer = _stemmer;

var _stopwords = _interopRequireWildcard(require("./preprocessing/stopwords"));

exports.stopwords = _stopwords;

var _vectorizer = _interopRequireWildcard(require("./preprocessing/vectorizer"));

exports.vectorizer = _vectorizer;

var _tokenization = _interopRequireWildcard(require("./preprocessing/tokenization"));

exports.tokenization = _tokenization;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./classifier/nlpclassifier":1,"./nltk-data/stopwords.json":3,"./preprocessing/stemmer":4,"./preprocessing/stopwords":5,"./preprocessing/tokenization":6,"./preprocessing/vectorizer":7,"./utils/copy":8,"./utils/distance":9,"./utils/preprocessor":10}],3:[function(require,module,exports){
module.exports={
  "ar":["إذ","إذا","إذما","إذن","أف","أقل","أكثر","ألا","إلا","التي","الذي","الذين","اللاتي","اللائي","اللتان","اللتيا","اللتين","اللذان","اللذين","اللواتي","إلى","إليك","إليكم","إليكما","إليكن","أم","أما","أما","إما","أن","إن","إنا","أنا","أنت","أنتم","أنتما","أنتن","إنما","إنه","أنى","أنى","آه","آها","أو","أولاء","أولئك","أوه","آي","أي","أيها","إي","أين","أين","أينما","إيه","بخ","بس","بعد","بعض","بك","بكم","بكم","بكما","بكن","بل","بلى","بما","بماذا","بمن","بنا","به","بها","بهم","بهما","بهن","بي","بين","بيد","تلك","تلكم","تلكما","ته","تي","تين","تينك","ثم","ثمة","حاشا","حبذا","حتى","حيث","حيثما","حين","خلا","دون","ذا","ذات","ذاك","ذان","ذانك","ذلك","ذلكم","ذلكما","ذلكن","ذه","ذو","ذوا","ذواتا","ذواتي","ذي","ذين","ذينك","ريث","سوف","سوى","شتان","عدا","عسى","عل","على","عليك","عليه","عما","عن","عند","غير","فإذا","فإن","فلا","فمن","في","فيم","فيما","فيه","فيها","قد","كأن","كأنما","كأي","كأين","كذا","كذلك","كل","كلا","كلاهما","كلتا","كلما","كليكما","كليهما","كم","كم","كما","كي","كيت","كيف","كيفما","لا","لاسيما","لدى","لست","لستم","لستما","لستن","لسن","لسنا","لعل","لك","لكم","لكما","لكن","لكنما","لكي","لكيلا","لم","لما","لن","لنا","له","لها","لهم","لهما","لهن","لو","لولا","لوما","لي","لئن","ليت","ليس","ليسا","ليست","ليستا","ليسوا","ما","ماذا","متى","مذ","مع","مما","ممن","من","منه","منها","منذ","مه","مهما","نحن","نحو","نعم","ها","هاتان","هاته","هاتي","هاتين","هاك","هاهنا","هذا","هذان","هذه","هذي","هذين","هكذا","هل","هلا","هم","هما","هن","هنا","هناك","هنالك","هو","هؤلاء","هي","هيا","هيت","هيهات","والذي","والذين","وإذ","وإذا","وإن","ولا","ولكن","ولو","وما","ومن","وهو","يا"],
  "az":["a","ad","altı","altmış","amma","arasında","artıq","ay","az","bax","belə","bəli","bəlkə","beş","bəy","bəzən","bəzi","bilər","bir","biraz","biri","birşey","biz","bizim","bizlər","bu","buna","bundan","bunların","bunu","bunun","buradan","bütün","ci","cı","çox","cu","cü","çünki","da","daha","də","dedi","dək","dən","dəqiqə","deyil","dir","doqquz","doqsan","dörd","düz","ə","edən","edir","əgər","əlbəttə","elə","əlli","ən","əslində","et","etdi","etmə","etmək","faiz","gilə","görə","ha","haqqında","harada","hə","heç","həm","həmin","həmişə","hər","ı","idi","iki","il","ildə","ilə","ilk","in","indi","isə","istifadə","iyirmi","ki","kim","kimə","kimi","lakin","lap","məhz","mən","mənə","mirşey","nə","nəhayət","niyə","o","obirisi","of","olan","olar","olaraq","oldu","olduğu","olmadı","olmaz","olmuşdur","olsun","olur","on","ona","ondan","onlar","onlardan","onların ","onsuzda","onu","onun","oradan","otuz","öz","özü","qarşı","qədər","qırx","saat","sadəcə","saniyə","səhv","səkkiz","səksən","sən","sənə","sənin","siz","sizin","sizlər","sonra","təəssüf","ü","üç","üçün","var","və","xan","xanım","xeyr","ya","yalnız","yaxşı","yeddi","yenə","yəni","yetmiş","yox","yoxdur","yoxsa","yüz","zaman"],
  "da":["og","i","jeg","det","at","en","den","til","er","som","på","de","med","han","af","for","ikke","der","var","mig","sig","men","et","har","om","vi","min","havde","ham","hun","nu","over","da","fra","du","ud","sin","dem","os","op","man","hans","hvor","eller","hvad","skal","selv","her","alle","vil","blev","kunne","ind","når","være","dog","noget","ville","jo","deres","efter","ned","skulle","denne","end","dette","mit","også","under","have","dig","anden","hende","mine","alt","meget","sit","sine","vor","mod","disse","hvis","din","nogle","hos","blive","mange","ad","bliver","hendes","været","thi","jer","sådan"],
  "de":["aber","alle","allem","allen","aller","alles","als","also","am","an","ander","andere","anderem","anderen","anderer","anderes","anderm","andern","anderr","anders","auch","auf","aus","bei","bin","bis","bist","da","damit","dann","der","den","des","dem","die","das","dass","daß","derselbe","derselben","denselben","desselben","demselben","dieselbe","dieselben","dasselbe","dazu","dein","deine","deinem","deinen","deiner","deines","denn","derer","dessen","dich","dir","du","dies","diese","diesem","diesen","dieser","dieses","doch","dort","durch","ein","eine","einem","einen","einer","eines","einig","einige","einigem","einigen","einiger","einiges","einmal","er","ihn","ihm","es","etwas","euer","eure","eurem","euren","eurer","eures","für","gegen","gewesen","hab","habe","haben","hat","hatte","hatten","hier","hin","hinter","ich","mich","mir","ihr","ihre","ihrem","ihren","ihrer","ihres","euch","im","in","indem","ins","ist","jede","jedem","jeden","jeder","jedes","jene","jenem","jenen","jener","jenes","jetzt","kann","kein","keine","keinem","keinen","keiner","keines","können","könnte","machen","man","manche","manchem","manchen","mancher","manches","mein","meine","meinem","meinen","meiner","meines","mit","muss","musste","nach","nicht","nichts","noch","nun","nur","ob","oder","ohne","sehr","sein","seine","seinem","seinen","seiner","seines","selbst","sich","sie","ihnen","sind","so","solche","solchem","solchen","solcher","solches","soll","sollte","sondern","sonst","über","um","und","uns","unsere","unserem","unseren","unser","unseres","unter","viel","vom","von","vor","während","war","waren","warst","was","weg","weil","weiter","welche","welchem","welchen","welcher","welches","wenn","werde","werden","wie","wieder","will","wir","wird","wirst","wo","wollen","wollte","würde","würden","zu","zum","zur","zwar","zwischen"],
  "en":["i","me","my","myself","we","our","ours","ourselves","you","you're","you've","you'll","you'd","your","yours","yourself","yourselves","he","him","his","himself","she","she's","her","hers","herself","it","it's","its","itself","they","them","their","theirs","themselves","what","which","who","whom","this","that","that'll","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","doing","a","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after","above","below","to","from","up","down","in","out","on","off","over","under","again","further","then","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","s","t","can","will","just","don","don't","should","should've","now","d","ll","m","o","re","ve","y","ain","aren","aren't","couldn","couldn't","didn","didn't","doesn","doesn't","hadn","hadn't","hasn","hasn't","haven","haven't","isn","isn't","ma","mightn","mightn't","mustn","mustn't","needn","needn't","shan","shan't","shouldn","shouldn't","wasn","wasn't","weren","weren't","won","won't","wouldn","wouldn't"],
  "el":["αλλα","αν","αντι","απο","αυτα","αυτεσ","αυτη","αυτο","αυτοι","αυτοσ","αυτουσ","αυτων","αἱ","αἳ","αἵ","αὐτόσ","αὐτὸς","αὖ","γάρ","γα","γα^","γε","για","γοῦν","γὰρ","δ'","δέ","δή","δαί","δαίσ","δαὶ","δαὶς","δε","δεν","δι'","διά","διὰ","δὲ","δὴ","δ’","εαν","ειμαι","ειμαστε","ειναι","εισαι","ειστε","εκεινα","εκεινεσ","εκεινη","εκεινο","εκεινοι","εκεινοσ","εκεινουσ","εκεινων","ενω","επ","επι","εἰ","εἰμί","εἰμὶ","εἰς","εἰσ","εἴ","εἴμι","εἴτε","η","θα","ισωσ","κ","καί","καίτοι","καθ","και","κατ","κατά","κατα","κατὰ","καὶ","κι","κἀν","κἂν","μέν","μή","μήτε","μα","με","μεθ","μετ","μετά","μετα","μετὰ","μη","μην","μἐν","μὲν","μὴ","μὴν","να","ο","οι","ομωσ","οπωσ","οσο","οτι","οἱ","οἳ","οἷς","οὐ","οὐδ","οὐδέ","οὐδείσ","οὐδεὶς","οὐδὲ","οὐδὲν","οὐκ","οὐχ","οὐχὶ","οὓς","οὔτε","οὕτω","οὕτως","οὕτωσ","οὖν","οὗ","οὗτος","οὗτοσ","παρ","παρά","παρα","παρὰ","περί","περὶ","ποια","ποιεσ","ποιο","ποιοι","ποιοσ","ποιουσ","ποιων","ποτε","που","ποῦ","προ","προσ","πρόσ","πρὸ","πρὸς","πως","πωσ","σε","στη","στην","στο","στον","σόσ","σύ","σύν","σὸς","σὺ","σὺν","τά","τήν","τί","τίς","τίσ","τα","ταῖς","τε","την","τησ","τι","τινα","τις","τισ","το","τοί","τοι","τοιοῦτος","τοιοῦτοσ","τον","τοτε","του","τούσ","τοὺς","τοῖς","τοῦ","των","τό","τόν","τότε","τὰ","τὰς","τὴν","τὸ","τὸν","τῆς","τῆσ","τῇ","τῶν","τῷ","ωσ","ἀλλ'","ἀλλά","ἀλλὰ","ἀλλ’","ἀπ","ἀπό","ἀπὸ","ἀφ","ἂν","ἃ","ἄλλος","ἄλλοσ","ἄν","ἄρα","ἅμα","ἐάν","ἐγώ","ἐγὼ","ἐκ","ἐμόσ","ἐμὸς","ἐν","ἐξ","ἐπί","ἐπεὶ","ἐπὶ","ἐστι","ἐφ","ἐὰν","ἑαυτοῦ","ἔτι","ἡ","ἢ","ἣ","ἤ","ἥ","ἧς","ἵνα","ὁ","ὃ","ὃν","ὃς","ὅ","ὅδε","ὅθεν","ὅπερ","ὅς","ὅσ","ὅστις","ὅστισ","ὅτε","ὅτι","ὑμόσ","ὑπ","ὑπέρ","ὑπό","ὑπὲρ","ὑπὸ","ὡς","ὡσ","ὥς","ὥστε","ὦ","ᾧ"],
  "es":["de","la","que","el","en","y","a","los","del","se","las","por","un","para","con","no","una","su","al","lo","como","más","pero","sus","le","ya","o","este","sí","porque","esta","entre","cuando","muy","sin","sobre","también","me","hasta","hay","donde","quien","desde","todo","nos","durante","todos","uno","les","ni","contra","otros","ese","eso","ante","ellos","e","esto","mí","antes","algunos","qué","unos","yo","otro","otras","otra","él","tanto","esa","estos","mucho","quienes","nada","muchos","cual","poco","ella","estar","estas","algunas","algo","nosotros","mi","mis","tú","te","ti","tu","tus","ellas","nosotras","vosotros","vosotras","os","mío","mía","míos","mías","tuyo","tuya","tuyos","tuyas","suyo","suya","suyos","suyas","nuestro","nuestra","nuestros","nuestras","vuestro","vuestra","vuestros","vuestras","esos","esas","estoy","estás","está","estamos","estáis","están","esté","estés","estemos","estéis","estén","estaré","estarás","estará","estaremos","estaréis","estarán","estaría","estarías","estaríamos","estaríais","estarían","estaba","estabas","estábamos","estabais","estaban","estuve","estuviste","estuvo","estuvimos","estuvisteis","estuvieron","estuviera","estuvieras","estuviéramos","estuvierais","estuvieran","estuviese","estuvieses","estuviésemos","estuvieseis","estuviesen","estando","estado","estada","estados","estadas","estad","he","has","ha","hemos","habéis","han","haya","hayas","hayamos","hayáis","hayan","habré","habrás","habrá","habremos","habréis","habrán","habría","habrías","habríamos","habríais","habrían","había","habías","habíamos","habíais","habían","hube","hubiste","hubo","hubimos","hubisteis","hubieron","hubiera","hubieras","hubiéramos","hubierais","hubieran","hubiese","hubieses","hubiésemos","hubieseis","hubiesen","habiendo","habido","habida","habidos","habidas","soy","eres","es","somos","sois","son","sea","seas","seamos","seáis","sean","seré","serás","será","seremos","seréis","serán","sería","serías","seríamos","seríais","serían","era","eras","éramos","erais","eran","fui","fuiste","fue","fuimos","fuisteis","fueron","fuera","fueras","fuéramos","fuerais","fueran","fuese","fueses","fuésemos","fueseis","fuesen","sintiendo","sentido","sentida","sentidos","sentidas","siente","sentid","tengo","tienes","tiene","tenemos","tenéis","tienen","tenga","tengas","tengamos","tengáis","tengan","tendré","tendrás","tendrá","tendremos","tendréis","tendrán","tendría","tendrías","tendríamos","tendríais","tendrían","tenía","tenías","teníamos","teníais","tenían","tuve","tuviste","tuvo","tuvimos","tuvisteis","tuvieron","tuviera","tuvieras","tuviéramos","tuvierais","tuvieran","tuviese","tuvieses","tuviésemos","tuvieseis","tuviesen","teniendo","tenido","tenida","tenidos","tenidas","tened"],
  "fi":["olla","olen","olet","on","olemme","olette","ovat","ole","oli","olisi","olisit","olisin","olisimme","olisitte","olisivat","olit","olin","olimme","olitte","olivat","ollut","olleet","en","et","ei","emme","ette","eivät","minä","minun","minut","minua","minussa","minusta","minuun","minulla","minulta","minulle","sinä","sinun","sinut","sinua","sinussa","sinusta","sinuun","sinulla","sinulta","sinulle","hän","hänen","hänet","häntä","hänessä","hänestä","häneen","hänellä","häneltä","hänelle","me","meidän","meidät","meitä","meissä","meistä","meihin","meillä","meiltä","meille","te","teidän","teidät","teitä","teissä","teistä","teihin","teillä","teiltä","teille","he","heidän","heidät","heitä","heissä","heistä","heihin","heillä","heiltä","heille","tämä","tämän","tätä","tässä","tästä","tähän","tallä","tältä","tälle","tänä","täksi","tuo","tuon","tuotä","tuossa","tuosta","tuohon","tuolla","tuolta","tuolle","tuona","tuoksi","se","sen","sitä","siinä","siitä","siihen","sillä","siltä","sille","sinä","siksi","nämä","näiden","näitä","näissä","näistä","näihin","näillä","näiltä","näille","näinä","näiksi","nuo","noiden","noita","noissa","noista","noihin","noilla","noilta","noille","noina","noiksi","ne","niiden","niitä","niissä","niistä","niihin","niillä","niiltä","niille","niinä","niiksi","kuka","kenen","kenet","ketä","kenessä","kenestä","keneen","kenellä","keneltä","kenelle","kenenä","keneksi","ketkä","keiden","ketkä","keitä","keissä","keistä","keihin","keillä","keiltä","keille","keinä","keiksi","mikä","minkä","minkä","mitä","missä","mistä","mihin","millä","miltä","mille","minä","miksi","mitkä","joka","jonka","jota","jossa","josta","johon","jolla","jolta","jolle","jona","joksi","jotka","joiden","joita","joissa","joista","joihin","joilla","joilta","joille","joina","joiksi","että","ja","jos","koska","kuin","mutta","niin","sekä","sillä","tai","vaan","vai","vaikka","kanssa","mukaan","noin","poikki","yli","kun","niin","nyt","itse"],
  "fr":["au","aux","avec","ce","ces","dans","de","des","du","elle","en","et","eux","il","ils","je","la","le","les","leur","lui","ma","mais","me","même","mes","moi","mon","ne","nos","notre","nous","on","ou","par","pas","pour","qu","que","qui","sa","se","ses","son","sur","ta","te","tes","toi","ton","tu","un","une","vos","votre","vous","c","d","j","l","à","m","n","s","t","y","été","étée","étées","étés","étant","étante","étants","étantes","suis","es","est","sommes","êtes","sont","serai","seras","sera","serons","serez","seront","serais","serait","serions","seriez","seraient","étais","était","étions","étiez","étaient","fus","fut","fûmes","fûtes","furent","sois","soit","soyons","soyez","soient","fusse","fusses","fût","fussions","fussiez","fussent","ayant","ayante","ayantes","ayants","eu","eue","eues","eus","ai","as","avons","avez","ont","aurai","auras","aura","aurons","aurez","auront","aurais","aurait","aurions","auriez","auraient","avais","avait","avions","aviez","avaient","eut","eûmes","eûtes","eurent","aie","aies","ait","ayons","ayez","aient","eusse","eusses","eût","eussions","eussiez","eussent"],
  "hu":["a","ahogy","ahol","aki","akik","akkor","alatt","által","általában","amely","amelyek","amelyekben","amelyeket","amelyet","amelynek","ami","amit","amolyan","amíg","amikor","át","abban","ahhoz","annak","arra","arról","az","azok","azon","azt","azzal","azért","aztán","azután","azonban","bár","be","belül","benne","cikk","cikkek","cikkeket","csak","de","e","eddig","egész","egy","egyes","egyetlen","egyéb","egyik","egyre","ekkor","el","elég","ellen","elõ","elõször","elõtt","elsõ","én","éppen","ebben","ehhez","emilyen","ennek","erre","ez","ezt","ezek","ezen","ezzel","ezért","és","fel","felé","hanem","hiszen","hogy","hogyan","igen","így","illetve","ill.","ill","ilyen","ilyenkor","ison","ismét","itt","jó","jól","jobban","kell","kellett","keresztül","keressünk","ki","kívül","között","közül","legalább","lehet","lehetett","legyen","lenne","lenni","lesz","lett","maga","magát","majd","majd","már","más","másik","meg","még","mellett","mert","mely","melyek","mi","mit","míg","miért","milyen","mikor","minden","mindent","mindenki","mindig","mint","mintha","mivel","most","nagy","nagyobb","nagyon","ne","néha","nekem","neki","nem","néhány","nélkül","nincs","olyan","ott","össze","õ","õk","õket","pedig","persze","rá","s","saját","sem","semmi","sok","sokat","sokkal","számára","szemben","szerint","szinte","talán","tehát","teljes","tovább","továbbá","több","úgy","ugyanis","új","újabb","újra","után","utána","utolsó","vagy","vagyis","valaki","valami","valamint","való","vagyok","van","vannak","volt","voltam","voltak","voltunk","vissza","vele","viszont","volna"],
  "id":["ada","adalah","adanya","adapun","agak","agaknya","agar","akan","akankah","akhir","akhiri","akhirnya","aku","akulah","amat","amatlah","anda","andalah","antar","antara","antaranya","apa","apaan","apabila","apakah","apalagi","apatah","artinya","asal","asalkan","atas","atau","ataukah","ataupun","awal","awalnya","bagai","bagaikan","bagaimana","bagaimanakah","bagaimanapun","bagi","bagian","bahkan","bahwa","bahwasanya","baik","bakal","bakalan","balik","banyak","bapak","baru","bawah","beberapa","begini","beginian","beginikah","beginilah","begitu","begitukah","begitulah","begitupun","bekerja","belakang","belakangan","belum","belumlah","benar","benarkah","benarlah","berada","berakhir","berakhirlah","berakhirnya","berapa","berapakah","berapalah","berapapun","berarti","berawal","berbagai","berdatangan","beri","berikan","berikut","berikutnya","berjumlah","berkali-kali","berkata","berkehendak","berkeinginan","berkenaan","berlainan","berlalu","berlangsung","berlebihan","bermacam","bermacam-macam","bermaksud","bermula","bersama","bersama-sama","bersiap","bersiap-siap","bertanya","bertanya-tanya","berturut","berturut-turut","bertutur","berujar","berupa","besar","betul","betulkah","biasa","biasanya","bila","bilakah","bisa","bisakah","boleh","bolehkah","bolehlah","buat","bukan","bukankah","bukanlah","bukannya","bulan","bung","cara","caranya","cukup","cukupkah","cukuplah","cuma","dahulu","dalam","dan","dapat","dari","daripada","datang","dekat","demi","demikian","demikianlah","dengan","depan","di","dia","diakhiri","diakhirinya","dialah","diantara","diantaranya","diberi","diberikan","diberikannya","dibuat","dibuatnya","didapat","didatangkan","digunakan","diibaratkan","diibaratkannya","diingat","diingatkan","diinginkan","dijawab","dijelaskan","dijelaskannya","dikarenakan","dikatakan","dikatakannya","dikerjakan","diketahui","diketahuinya","dikira","dilakukan","dilalui","dilihat","dimaksud","dimaksudkan","dimaksudkannya","dimaksudnya","diminta","dimintai","dimisalkan","dimulai","dimulailah","dimulainya","dimungkinkan","dini","dipastikan","diperbuat","diperbuatnya","dipergunakan","diperkirakan","diperlihatkan","diperlukan","diperlukannya","dipersoalkan","dipertanyakan","dipunyai","diri","dirinya","disampaikan","disebut","disebutkan","disebutkannya","disini","disinilah","ditambahkan","ditandaskan","ditanya","ditanyai","ditanyakan","ditegaskan","ditujukan","ditunjuk","ditunjuki","ditunjukkan","ditunjukkannya","ditunjuknya","dituturkan","dituturkannya","diucapkan","diucapkannya","diungkapkan","dong","dua","dulu","empat","enggak","enggaknya","entah","entahlah","guna","gunakan","hal","hampir","hanya","hanyalah","hari","harus","haruslah","harusnya","hendak","hendaklah","hendaknya","hingga","ia","ialah","ibarat","ibaratkan","ibaratnya","ibu","ikut","ingat","ingat-ingat","ingin","inginkah","inginkan","ini","inikah","inilah","itu","itukah","itulah","jadi","jadilah","jadinya","jangan","jangankan","janganlah","jauh","jawab","jawaban","jawabnya","jelas","jelaskan","jelaslah","jelasnya","jika","jikalau","juga","jumlah","jumlahnya","justru","kala","kalau","kalaulah","kalaupun","kalian","kami","kamilah","kamu","kamulah","kan","kapan","kapankah","kapanpun","karena","karenanya","kasus","kata","katakan","katakanlah","katanya","ke","keadaan","kebetulan","kecil","kedua","keduanya","keinginan","kelamaan","kelihatan","kelihatannya","kelima","keluar","kembali","kemudian","kemungkinan","kemungkinannya","kenapa","kepada","kepadanya","kesampaian","keseluruhan","keseluruhannya","keterlaluan","ketika","khususnya","kini","kinilah","kira","kira-kira","kiranya","kita","kitalah","kok","kurang","lagi","lagian","lah","lain","lainnya","lalu","lama","lamanya","lanjut","lanjutnya","lebih","lewat","lima","luar","macam","maka","makanya","makin","malah","malahan","mampu","mampukah","mana","manakala","manalagi","masa","masalah","masalahnya","masih","masihkah","masing","masing-masing","mau","maupun","melainkan","melakukan","melalui","melihat","melihatnya","memang","memastikan","memberi","memberikan","membuat","memerlukan","memihak","meminta","memintakan","memisalkan","memperbuat","mempergunakan","memperkirakan","memperlihatkan","mempersiapkan","mempersoalkan","mempertanyakan","mempunyai","memulai","memungkinkan","menaiki","menambahkan","menandaskan","menanti","menanti-nanti","menantikan","menanya","menanyai","menanyakan","mendapat","mendapatkan","mendatang","mendatangi","mendatangkan","menegaskan","mengakhiri","mengapa","mengatakan","mengatakannya","mengenai","mengerjakan","mengetahui","menggunakan","menghendaki","mengibaratkan","mengibaratkannya","mengingat","mengingatkan","menginginkan","mengira","mengucapkan","mengucapkannya","mengungkapkan","menjadi","menjawab","menjelaskan","menuju","menunjuk","menunjuki","menunjukkan","menunjuknya","menurut","menuturkan","menyampaikan","menyangkut","menyatakan","menyebutkan","menyeluruh","menyiapkan","merasa","mereka","merekalah","merupakan","meski","meskipun","meyakini","meyakinkan","minta","mirip","misal","misalkan","misalnya","mula","mulai","mulailah","mulanya","mungkin","mungkinkah","nah","naik","namun","nanti","nantinya","nyaris","nyatanya","oleh","olehnya","pada","padahal","padanya","pak","paling","panjang","pantas","para","pasti","pastilah","penting","pentingnya","per","percuma","perlu","perlukah","perlunya","pernah","persoalan","pertama","pertama-tama","pertanyaan","pertanyakan","pihak","pihaknya","pukul","pula","pun","punya","rasa","rasanya","rata","rupanya","saat","saatnya","saja","sajalah","saling","sama","sama-sama","sambil","sampai","sampai-sampai","sampaikan","sana","sangat","sangatlah","satu","saya","sayalah","se","sebab","sebabnya","sebagai","sebagaimana","sebagainya","sebagian","sebaik","sebaik-baiknya","sebaiknya","sebaliknya","sebanyak","sebegini","sebegitu","sebelum","sebelumnya","sebenarnya","seberapa","sebesar","sebetulnya","sebisanya","sebuah","sebut","sebutlah","sebutnya","secara","secukupnya","sedang","sedangkan","sedemikian","sedikit","sedikitnya","seenaknya","segala","segalanya","segera","seharusnya","sehingga","seingat","sejak","sejauh","sejenak","sejumlah","sekadar","sekadarnya","sekali","sekali-kali","sekalian","sekaligus","sekalipun","sekarang","sekarang","sekecil","seketika","sekiranya","sekitar","sekitarnya","sekurang-kurangnya","sekurangnya","sela","selain","selaku","selalu","selama","selama-lamanya","selamanya","selanjutnya","seluruh","seluruhnya","semacam","semakin","semampu","semampunya","semasa","semasih","semata","semata-mata","semaunya","sementara","semisal","semisalnya","sempat","semua","semuanya","semula","sendiri","sendirian","sendirinya","seolah","seolah-olah","seorang","sepanjang","sepantasnya","sepantasnyalah","seperlunya","seperti","sepertinya","sepihak","sering","seringnya","serta","serupa","sesaat","sesama","sesampai","sesegera","sesekali","seseorang","sesuatu","sesuatunya","sesudah","sesudahnya","setelah","setempat","setengah","seterusnya","setiap","setiba","setibanya","setidak-tidaknya","setidaknya","setinggi","seusai","sewaktu","siap","siapa","siapakah","siapapun","sini","sinilah","soal","soalnya","suatu","sudah","sudahkah","sudahlah","supaya","tadi","tadinya","tahu","tahun","tak","tambah","tambahnya","tampak","tampaknya","tandas","tandasnya","tanpa","tanya","tanyakan","tanyanya","tapi","tegas","tegasnya","telah","tempat","tengah","tentang","tentu","tentulah","tentunya","tepat","terakhir","terasa","terbanyak","terdahulu","terdapat","terdiri","terhadap","terhadapnya","teringat","teringat-ingat","terjadi","terjadilah","terjadinya","terkira","terlalu","terlebih","terlihat","termasuk","ternyata","tersampaikan","tersebut","tersebutlah","tertentu","tertuju","terus","terutama","tetap","tetapi","tiap","tiba","tiba-tiba","tidak","tidakkah","tidaklah","tiga","tinggi","toh","tunjuk","turut","tutur","tuturnya","ucap","ucapnya","ujar","ujarnya","umum","umumnya","ungkap","ungkapnya","untuk","usah","usai","waduh","wah","wahai","waktu","waktunya","walau","walaupun","wong","yaitu","yakin","yakni","yang"],
  "it":["ad","al","allo","ai","agli","all","agl","alla","alle","con","col","coi","da","dal","dallo","dai","dagli","dall","dagl","dalla","dalle","di","del","dello","dei","degli","dell","degl","della","delle","in","nel","nello","nei","negli","nell","negl","nella","nelle","su","sul","sullo","sui","sugli","sull","sugl","sulla","sulle","per","tra","contro","io","tu","lui","lei","noi","voi","loro","mio","mia","miei","mie","tuo","tua","tuoi","tue","suo","sua","suoi","sue","nostro","nostra","nostri","nostre","vostro","vostra","vostri","vostre","mi","ti","ci","vi","lo","la","li","le","gli","ne","il","un","uno","una","ma","ed","se","perché","anche","come","dov","dove","che","chi","cui","non","più","quale","quanto","quanti","quanta","quante","quello","quelli","quella","quelle","questo","questi","questa","queste","si","tutto","tutti","a","c","e","i","l","o","ho","hai","ha","abbiamo","avete","hanno","abbia","abbiate","abbiano","avrò","avrai","avrà","avremo","avrete","avranno","avrei","avresti","avrebbe","avremmo","avreste","avrebbero","avevo","avevi","aveva","avevamo","avevate","avevano","ebbi","avesti","ebbe","avemmo","aveste","ebbero","avessi","avesse","avessimo","avessero","avendo","avuto","avuta","avuti","avute","sono","sei","è","siamo","siete","sia","siate","siano","sarò","sarai","sarà","saremo","sarete","saranno","sarei","saresti","sarebbe","saremmo","sareste","sarebbero","ero","eri","era","eravamo","eravate","erano","fui","fosti","fu","fummo","foste","furono","fossi","fosse","fossimo","fossero","essendo","faccio","fai","facciamo","fanno","faccia","facciate","facciano","farò","farai","farà","faremo","farete","faranno","farei","faresti","farebbe","faremmo","fareste","farebbero","facevo","facevi","faceva","facevamo","facevate","facevano","feci","facesti","fece","facemmo","faceste","fecero","facessi","facesse","facessimo","facessero","facendo","sto","stai","sta","stiamo","stanno","stia","stiate","stiano","starò","starai","starà","staremo","starete","staranno","starei","staresti","starebbe","staremmo","stareste","starebbero","stavo","stavi","stava","stavamo","stavate","stavano","stetti","stesti","stette","stemmo","steste","stettero","stessi","stesse","stessimo","stessero","stando"],
  "kk":["ах","ох","эх","ай","эй","ой","тағы","тағыда","әрине","жоқ","сондай","осындай","осылай","солай","мұндай","бұндай","мен","сен","ол","біз","біздер","олар","сіз","сіздер","маған","оған","саған","біздің","сіздің","оның","бізге","сізге","оларға","біздерге","сіздерге","оларға","менімен","сенімен","онымен","бізбен","сізбен","олармен","біздермен","сіздермен","менің","сенің","біздің","сіздің","оның","біздердің","сіздердің","олардың","маған","саған","оған","менен","сенен","одан","бізден","сізден","олардан","біздерден","сіздерден","олардан","айтпақшы","сонымен","сондықтан","бұл","осы","сол","анау","мынау","сонау","осынау","ана","мына","сона","әні","міне","өй","үйт","бүйт","біреу","кейбіреу","кейбір","қайсыбір","әрбір","бірнеше","бірдеме","бірнеше","әркім","әрне","әрқайсы","әрқалай","әлдекім","әлдене","әлдеқайдан","әлденеше","әлдеқалай","әлдеқашан","алдақашан","еш","ешкім","ешбір","ештеме","дәнеңе","ешқашан","ешқандай","ешқайсы","емес","бәрі","барлық","барша","бар","күллі","бүкіл","түгел","өз","өзім","өзің","өзінің","өзіме","өзіне","өзімнің","өзі","өзге","менде","сенде","онда","менен","сенен\tонан","одан","ау","па","ей","әй","е","уа","уау","уай","я","пай","ә","о","оһо","ой","ие","аһа","ау","беу","мәссаған","бәрекелді","әттегенай","жаракімалла","масқарай","астапыралла","япырмай","ойпырмай","кәне","кәнеки","ал","әйда","кәні","міне","әні","сорап","қош-қош","пфша","пішә","құрау-құрау","шәйт","шек","моһ","тәк","құрау","құр","кә","кәһ","күшім","күшім","мышы","пырс","әукім","алақай","паһ-паһ","бәрекелді","ура","әттең","әттеген-ай","қап","түге","пішту","шіркін","алатау","пай-пай","үшін","сайын","сияқты","туралы","арқылы","бойы","бойымен","шамалы","шақты","қаралы","ғұрлы","ғұрлым","шейін","дейін","қарай","таман","салым","тарта","жуық","таяу","гөрі","бері","кейін","соң","бұрын","бетер","қатар","бірге","қоса","арс","гүрс","дүрс","қорс","тарс","тырс","ырс","барқ","борт","күрт","кірт","морт","сарт","шырт","дүңк","күңк","қыңқ","мыңқ","маңқ","саңқ","шаңқ","шіңк","сыңқ","таңқ","тыңқ","ыңқ","болп","былп","жалп","желп","қолп","ірк","ырқ","сарт-сұрт","тарс-тұрс","арс-ұрс","жалт-жалт","жалт-жұлт","қалт-қалт","қалт-құлт","қаңқ-қаңқ","қаңқ-құңқ","шаңқ-шаңқ","шаңқ-шұңқ","арбаң-арбаң","бүгжең-бүгжең","арсалаң-арсалаң","ербелең-ербелең","батыр-бұтыр","далаң-далаң","тарбаң-тарбаң","қызараң-қызараң","қаңғыр-күңгір","қайқаң-құйқаң","митың-митың","салаң-сұлаң","ыржың-тыржың","бірақ","алайда","дегенмен","әйтпесе","әйткенмен","себебі","өйткені","сондықтан","үшін","сайын","сияқты","туралы","арқылы","бойы","бойымен","шамалы","шақты","қаралы","ғұрлы","ғұрлым","гөрі","бері","кейін","соң","бұрын","бетер","қатар","бірге","қоса","шейін","дейін","қарай","таман","салым","тарта","жуық","таяу","арнайы","осындай","ғана","қана","тек","әншейін"],
  "ne":["छ","र","पनि","छन्","लागि","भएको","गरेको","भने","गर्न","गर्ने","हो","तथा","यो","रहेको","उनले","थियो","हुने","गरेका","थिए","गर्दै","तर","नै","को","मा","हुन्","भन्ने","हुन","गरी","त","हुन्छ","अब","के","रहेका","गरेर","छैन","दिए","भए","यस","ले","गर्नु","औं","सो","त्यो","कि","जुन","यी","का","गरि","ती","न","छु","छौं","लाई","नि","उप","अक्सर","आदि","कसरी","क्रमशः","चाले","अगाडी","अझै","अनुसार","अन्तर्गत","अन्य","अन्यत्र","अन्यथा","अरु","अरुलाई","अर्को","अर्थात","अर्थात्","अलग","आए","आजको","ओठ","आत्म","आफू","आफूलाई","आफ्नै","आफ्नो","आयो","उदाहरण","उनको","उहालाई","एउटै","एक","एकदम","कतै","कम से कम","कसै","कसैले","कहाँबाट","कहिलेकाहीं","का","किन","किनभने","कुनै","कुरा","कृपया","केही","कोही","गए","गरौं","गर्छ","गर्छु","गर्नुपर्छ","गयौ","गैर","चार","चाहनुहुन्छ","चाहन्छु","चाहिए","छू","जताततै","जब","जबकि","जसको","जसबाट","जसमा","जसलाई","जसले","जस्तै","जस्तो","जस्तोसुकै","जहाँ","जान","जाहिर","जे","जो","ठीक","तत्काल","तदनुसार","तपाईको","तपाई","पर्याप्त","पहिले","पहिलो","पहिल्यै","पाँच","पाँचौं","तल","तापनी","तिनी","तिनीहरू","तिनीहरुको","तिनिहरुलाई","तिमी","तिर","तीन","तुरुन्तै","तेस्रो","तेस्कारण","पूर्व","प्रति","प्रतेक","प्लस","फेरी","बने","त्सपछि","त्सैले","त्यहाँ","थिएन","दिनुभएको","दिनुहुन्छ","दुई","देखि","बरु","बारे","बाहिर","देखिन्छ","देखियो","देखे","देखेको","देखेर","दोस्रो","धेरै","नजिकै","नत्र","नयाँ","निम्ति","बाहेक","बीच","बीचमा","भन","निम्न","निम्नानुसार","निर्दिष्ट","नौ","पक्का","पक्कै","पछि","पछिल्लो","पटक","पर्छ","पर्थ्यो","भन्छन्","भन्","भन्छु","भन्दा","भन्नुभयो","भर","भित्र","भित्री","म","मलाई","मात्र","माथि","मुख्य","मेरो","यति","यथोचित","यदि","यद्यपि","यसको","यसपछि","यसबाहेक","यसरी","यसो","यस्तो","यहाँ","यहाँसम्म","या","रही","राखे","राख्छ","राम्रो","रूप","लगभग","वरीपरी","वास्तवमा","बिरुद्ध","बिशेष","सायद","शायद","संग","संगै","सक्छ","सट्टा","सधै","सबै","सबैलाई","समय","सम्भव","सम्म","सही","साँच्चै","सात","साथ","साथै","सारा","सोही","स्पष्ट","हरे","हरेक"],
  "nl":["de","en","van","ik","te","dat","die","in","een","hij","het","niet","zijn","is","was","op","aan","met","als","voor","had","er","maar","om","hem","dan","zou","of","wat","mijn","men","dit","zo","door","over","ze","zich","bij","ook","tot","je","mij","uit","der","daar","haar","naar","heb","hoe","heeft","hebben","deze","u","want","nog","zal","me","zij","nu","ge","geen","omdat","iets","worden","toch","al","waren","veel","meer","doen","toen","moet","ben","zonder","kan","hun","dus","alles","onder","ja","eens","hier","wie","werd","altijd","doch","wordt","wezen","kunnen","ons","zelf","tegen","na","reeds","wil","kon","niets","uw","iemand","geweest","andere"],
  "no":["og","i","jeg","det","at","en","et","den","til","er","som","på","de","med","han","av","ikke","ikkje","der","så","var","meg","seg","men","ett","har","om","vi","min","mitt","ha","hadde","hun","nå","over","da","ved","fra","du","ut","sin","dem","oss","opp","man","kan","hans","hvor","eller","hva","skal","selv","sjøl","her","alle","vil","bli","ble","blei","blitt","kunne","inn","når","være","kom","noen","noe","ville","dere","som","deres","kun","ja","etter","ned","skulle","denne","for","deg","si","sine","sitt","mot","å","meget","hvorfor","dette","disse","uten","hvordan","ingen","din","ditt","blir","samme","hvilken","hvilke","sånn","inni","mellom","vår","hver","hvem","vors","hvis","både","bare","enn","fordi","før","mange","også","slik","vært","være","båe","begge","siden","dykk","dykkar","dei","deira","deires","deim","di","då","eg","ein","eit","eitt","elles","honom","hjå","ho","hoe","henne","hennar","hennes","hoss","hossen","ikkje","ingi","inkje","korleis","korso","kva","kvar","kvarhelst","kven","kvi","kvifor","me","medan","mi","mine","mykje","no","nokon","noka","nokor","noko","nokre","si","sia","sidan","so","somt","somme","um","upp","vere","vore","verte","vort","varte","vart"],
  "pt":["de","a","o","que","e","é","do","da","em","um","para","com","não","uma","os","no","se","na","por","mais","as","dos","como","mas","ao","ele","das","à","seu","sua","ou","quando","muito","nos","já","eu","também","só","pelo","pela","até","isso","ela","entre","depois","sem","mesmo","aos","seus","quem","nas","me","esse","eles","você","essa","num","nem","suas","meu","às","minha","numa","pelos","elas","qual","nós","lhe","deles","essas","esses","pelas","este","dele","tu","te","vocês","vos","lhes","meus","minhas","teu","tua","teus","tuas","nosso","nossa","nossos","nossas","dela","delas","esta","estes","estas","aquele","aquela","aqueles","aquelas","isto","aquilo","estou","está","estamos","estão","estive","esteve","estivemos","estiveram","estava","estávamos","estavam","estivera","estivéramos","esteja","estejamos","estejam","estivesse","estivéssemos","estivessem","estiver","estivermos","estiverem","hei","há","havemos","hão","houve","houvemos","houveram","houvera","houvéramos","haja","hajamos","hajam","houvesse","houvéssemos","houvessem","houver","houvermos","houverem","houverei","houverá","houveremos","houverão","houveria","houveríamos","houveriam","sou","somos","são","era","éramos","eram","fui","foi","fomos","foram","fora","fôramos","seja","sejamos","sejam","fosse","fôssemos","fossem","for","formos","forem","serei","será","seremos","serão","seria","seríamos","seriam","tenho","tem","temos","tém","tinha","tínhamos","tinham","tive","teve","tivemos","tiveram","tivera","tivéramos","tenha","tenhamos","tenham","tivesse","tivéssemos","tivessem","tiver","tivermos","tiverem","terei","terá","teremos","terão","teria","teríamos","teriam"],
  "ro":["a","abia","acea","aceasta","această","aceea","aceeasi","acei","aceia","acel","acela","acelasi","acele","acelea","acest","acesta","aceste","acestea","acestei","acestia","acestui","aceşti","aceştia","adica","ai","aia","aibă","aici","al","ala","ale","alea","alt","alta","altceva","altcineva","alte","altfel","alti","altii","altul","am","anume","apoi","ar","are","as","asa","asta","astea","astfel","asupra","atare","atat","atata","atatea","atatia","ati","atit","atita","atitea","atitia","atunci","au","avea","avem","aveţi","avut","aş","aţi","ba","ca","cam","cand","care","careia","carora","caruia","cat","catre","ce","cea","ceea","cei","ceilalti","cel","cele","celor","ceva","chiar","ci","cind","cine","cineva","cit","cita","cite","citeva","citi","citiva","cu","cui","cum","cumva","cât","câte","câtva","câţi","cînd","cît","cîte","cîtva","cîţi","că","căci","cărei","căror","cărui","către","da","daca","dacă","dar","dat","dată","dau","de","deasupra","deci","decit","deja","desi","despre","deşi","din","dintr","dintr-","dintre","doar","doi","doilea","două","drept","dupa","după","dă","e","ea","ei","el","ele","era","eram","este","eu","eşti","face","fara","fata","fel","fi","fie","fiecare","fii","fim","fiu","fiţi","foarte","fost","fără","i","ia","iar","ii","il","imi","in","inainte","inapoi","inca","incit","insa","intr","intre","isi","iti","la","le","li","lor","lui","lângă","lîngă","m","ma","mai","mea","mei","mele","mereu","meu","mi","mie","mine","mod","mult","multa","multe","multi","multă","mulţi","mâine","mîine","mă","ne","ni","nici","nimeni","nimic","niste","nişte","noastre","noastră","noi","nostri","nostru","nou","noua","nouă","noştri","nu","numai","o","or","ori","oricare","orice","oricine","oricum","oricând","oricât","oricînd","oricît","oriunde","pai","parca","patra","patru","pe","pentru","peste","pic","pina","poate","pot","prea","prima","primul","prin","printr-","putini","puţin","puţina","puţină","până","pînă","sa","sa-mi","sa-ti","sai","sale","sau","se","si","sint","sintem","spate","spre","sub","sunt","suntem","sunteţi","sus","să","săi","său","t","ta","tale","te","ti","tine","toata","toate","toată","tocmai","tot","toti","totul","totusi","totuşi","toţi","trei","treia","treilea","tu","tuturor","tăi","tău","u","ul","ului","un","una","unde","undeva","unei","uneia","unele","uneori","unii","unor","unora","unu","unui","unuia","unul","v","va","vi","voastre","voastră","voi","vom","vor","vostru","vouă","voştri","vreo","vreun","vă","zi","zice","îi","îl","îmi","în","îţi","ăla","ălea","ăsta","ăstea","ăştia","şi","ţi","ţie"],
  "ru":["и","в","во","не","что","он","на","я","с","со","как","а","то","все","она","так","его","но","да","ты","к","у","же","вы","за","бы","по","только","ее","мне","было","вот","от","меня","еще","нет","о","из","ему","теперь","когда","даже","ну","вдруг","ли","если","уже","или","ни","быть","был","него","до","вас","нибудь","опять","уж","вам","ведь","там","потом","себя","ничего","ей","может","они","тут","где","есть","надо","ней","для","мы","тебя","их","чем","была","сам","чтоб","без","будто","чего","раз","тоже","себе","под","будет","ж","тогда","кто","этот","того","потому","этого","какой","совсем","ним","здесь","этом","один","почти","мой","тем","чтобы","нее","сейчас","были","куда","зачем","всех","никогда","можно","при","наконец","два","об","другой","хоть","после","над","больше","тот","через","эти","нас","про","всего","них","какая","много","разве","три","эту","моя","впрочем","хорошо","свою","этой","перед","иногда","лучше","чуть","том","нельзя","такой","им","более","всегда","конечно","всю","между"],
  "sl":["ali","ampak","bodisi","in","kajti","marveč","namreč","ne","niti","oziroma","pa","saj","sicer","temveč","ter","toda","torej","vendar","vendarle","zakaj","če","čeprav","čeravno","četudi","čim","da","kadar","kakor","ker","ki","ko","kot","naj","najsi","odkar","preden","dve","dvema","dveh","šest","šestdeset","šestindvajset","šestintrideset","šestnajst","šeststo","štiri","štirideset","štiriindvajset","štirinajst","štiristo","deset","devet","devetdeset","devetintrideset","devetnajst","devetsto","dvainšestdeset","dvaindvajset","dvajset","dvanajst","dvesto","enaindvajset","enaintrideset","enajst","nič","osem","osemdeset","oseminštirideset","osemindevetdeset","osemnajst","pet","petdeset","petinštirideset","petindevetdeset","petindvajset","petinosemdeset","petinpetdeset","petinsedemdeset","petintrideset","petnajst","petsto","sedem","sedemdeset","sedeminšestdeset","sedemindvajset","sedeminpetdeset","sedemnajst","sedemsto","sto","tisoč","tri","trideset","triinšestdeset","triindvajset","triinpetdeset","trinajst","tristo","šestdesetim","šestim","šestindvajsetim","šestintridesetim","šestnajstim","šeststotim","štiridesetim","štiriindvajsetim","štirim","štirinajstim","štiristotim","desetim","devetdesetim","devetim","devetintridesetim","devetnajstim","devetstotim","dvainšestdesetim","dvaindvajsetim","dvajsetim","dvanajstim","dvestotim","enaindvajsetim","enaintridesetim","enajstim","osemdesetim","oseminštiridesetim","osemindevetdesetim","osemnajstim","osmim","petdesetim","petim","petinštiridesetim","petindevetdesetim","petindvajsetim","petinosemdesetim","petinpetdesetim","petinsedemdesetim","petintridesetim","petnajstim","petstotim","sedemdesetim","sedeminšestdesetim","sedemindvajsetim","sedeminpetdesetim","sedemnajstim","sedemstotim","sedmim","stotim","tisočim","trem","tridesetim","triinšestdesetim","triindvajsetim","triinpetdesetim","trinajstim","tristotim","šestdesetih","šestih","šestindvajsetih","šestintridesetih","šestnajstih","šeststotih","štiridesetih","štirih","štiriindvajsetih","štirinajstih","štiristotih","desetih","devetdesetih","devetih","devetintridesetih","devetnajstih","devetstotih","dvainšestdesetih","dvaindvajsetih","dvajsetih","dvanajstih","dvestotih","enaindvajsetih","enaintridesetih","enajstih","osemdesetih","oseminštiridesetih","osemindevetdesetih","osemnajstih","osmih","petdesetih","petih","petinštiridesetih","petindevetdesetih","petindvajsetih","petinosemdesetih","petinpetdesetih","petinsedemdesetih","petintridesetih","petnajstih","petstotih","sedemdesetih","sedeminšestdesetih","sedemindvajsetih","sedeminpetdesetih","sedemnajstih","sedemstotih","sedmih","stotih","tisočih","treh","tridesetih","triinšestdesetih","triindvajsetih","triinpetdesetih","trinajstih","tristotih","šestdesetimi","šestimi","šestindvajsetimi","šestintridesetimi","šestnajstimi","šeststotimi","štiridesetimi","štiriindvajsetimi","štirimi","štirinajstimi","štiristotimi","desetimi","devetdesetimi","devetimi","devetintridesetimi","devetnajstimi","devetstotimi","dvainšestdesetimi","dvaindvajsetimi","dvajsetimi","dvanajstimi","dvestotimi","enaindvajsetimi","enaintridesetimi","enajstimi","osemdesetimi","oseminštiridesetimi","osemindevetdesetimi","osemnajstimi","osmimi","petdesetimi","petimi","petinštiridesetimi","petindevetdesetimi","petindvajsetimi","petinosemdesetimi","petinpetdesetimi","petinsedemdesetimi","petintridesetimi","petnajstimi","petstotimi","sedemdesetimi","sedeminšestdesetimi","sedemindvajsetimi","sedeminpetdesetimi","sedemnajstimi","sedemstotimi","sedmimi","stotimi","tisočimi","tremi","tridesetimi","triinšestdesetimi","triindvajsetimi","triinpetdesetimi","trinajstimi","tristotimi","eno","eni","ene","ena","dva","štirje","trije","en","enega","enemu","enim","enem","eden","dvojni","trojni","dvojnima","trojnima","dvojnih","trojnih","dvojne","trojne","dvojnim","trojnim","dvojnimi","trojnimi","dvojno","trojno","dvojna","trojna","dvojnega","trojnega","dvojen","trojen","dvojnemu","trojnemu","dvojnem","trojnem","četrti","šestdeseti","šesti","šestnajsti","štirideseti","štiriindvajseti","štirinajsti","deseti","devetdeseti","deveti","devetnajsti","drugi","dvaindevetdeseti","dvajseti","dvanajsti","dvestoti","enaindvajseti","enajsti","osemdeseti","osemnajsti","osmi","petdeseti","peti","petinštirideseti","petindvajseti","petinosemdeseti","petintrideseti","petnajsti","prvi","sedemdeseti","sedemindvajseti","sedemnajsti","sedmi","stoti","tisoči","tretji","trideseti","triindvajseti","triintrideseti","trinajsti","tristoti","četrtima","šestdesetima","šestima","šestnajstima","štiridesetima","štiriindvajsetima","štirinajstima","desetima","devetdesetima","devetima","devetnajstima","drugima","dvaindevetdesetima","dvajsetima","dvanajstima","dvestotima","enaindvajsetima","enajstima","osemdesetima","osemnajstima","osmima","petdesetima","petima","petinštiridesetima","petindvajsetima","petinosemdesetima","petintridesetima","petnajstima","prvima","sedemdesetima","sedemindvajsetima","sedemnajstima","sedmima","stotima","tisočima","tretjima","tridesetima","triindvajsetima","triintridesetima","trinajstima","tristotima","četrtih","drugih","dvaindevetdesetih","prvih","tretjih","triintridesetih","četrte","šestdesete","šeste","šestnajste","štiridesete","štiriindvajsete","štirinajste","desete","devetdesete","devete","devetnajste","druge","dvaindevetdesete","dvajsete","dvanajste","dvestote","enaindvajsete","enajste","osemdesete","osemnajste","osme","petdesete","pete","petinštiridesete","petindvajsete","petinosemdesete","petintridesete","petnajste","prve","sedemdesete","sedemindvajsete","sedemnajste","sedme","stote","tisoče","tretje","tridesete","triindvajsete","triintridesete","trinajste","tristote","četrtim","drugim","dvaindevetdesetim","prvim","tretjim","triintridesetim","četrtimi","drugimi","dvaindevetdesetimi","prvimi","tretjimi","triintridesetimi","četrto","šestdeseto","šestnajsto","šesto","štirideseto","štiriindvajseto","štirinajsto","deseto","devetdeseto","devetnajsto","deveto","drugo","dvaindevetdeseto","dvajseto","dvanajsto","dvestoto","enaindvajseto","enajsto","osemdeseto","osemnajsto","osmo","petdeseto","petinštirideseto","petindvajseto","petinosemdeseto","petintrideseto","petnajsto","peto","prvo","sedemdeseto","sedemindvajseto","sedemnajsto","sedmo","stoto","tisočo","tretjo","trideseto","triindvajseto","triintrideseto","trinajsto","tristoto","četrta","šesta","šestdeseta","šestnajsta","štirideseta","štiriindvajseta","štirinajsta","deseta","deveta","devetdeseta","devetnajsta","druga","dvaindevetdeseta","dvajseta","dvanajsta","dvestota","enaindvajseta","enajsta","osemdeseta","osemnajsta","osma","peta","petdeseta","petinštirideseta","petindvajseta","petinosemdeseta","petintrideseta","petnajsta","prva","sedemdeseta","sedemindvajseta","sedemnajsta","sedma","stota","tisoča","tretja","trideseta","triindvajseta","triintrideseta","trinajsta","tristota","četrtega","šestdesetega","šestega","šestnajstega","štiridesetega","štiriindvajsetega","štirinajstega","desetega","devetdesetega","devetega","devetnajstega","drugega","dvaindevetdesetega","dvajsetega","dvanajstega","dvestotega","enaindvajsetega","enajstega","osemdesetega","osemnajstega","osmega","petdesetega","petega","petinštiridesetega","petindvajsetega","petinosemdesetega","petintridesetega","petnajstega","prvega","sedemdesetega","sedemindvajsetega","sedemnajstega","sedmega","stotega","tisočega","tretjega","tridesetega","triindvajsetega","triintridesetega","trinajstega","tristotega","četrtemu","šestdesetemu","šestemu","šestnajstemu","štiridesetemu","štiriindvajsetemu","štirinajstemu","desetemu","devetdesetemu","devetemu","devetnajstemu","drugemu","dvaindevetdesetemu","dvajsetemu","dvanajstemu","dvestotemu","enaindvajsetemu","enajstemu","osemdesetemu","osemnajstemu","osmemu","petdesetemu","petemu","petinštiridesetemu","petindvajsetemu","petinosemdesetemu","petintridesetemu","petnajstemu","prvemu","sedemdesetemu","sedemindvajsetemu","sedemnajstemu","sedmemu","stotemu","tisočemu","tretjemu","tridesetemu","triindvajsetemu","triintridesetemu","trinajstemu","tristotemu","četrtem","šestdesetem","šestem","šestnajstem","štiridesetem","štiriindvajsetem","štirinajstem","desetem","devetdesetem","devetem","devetnajstem","drugem","dvaindevetdesetem","dvajsetem","dvanajstem","dvestotem","enaindvajsetem","enajstem","osemdesetem","osemnajstem","osmem","petdesetem","petem","petinštiridesetem","petindvajsetem","petinosemdesetem","petintridesetem","petnajstem","prvem","sedemdesetem","sedemindvajsetem","sedemnajstem","sedmem","stotem","tisočem","tretjem","tridesetem","triindvajsetem","triintridesetem","trinajstem","tristotem","deseteri","dvakratni","dvoji","enkratni","peteri","stoteri","tisočeri","trikratni","troji","deseterima","dvakratnima","dvojima","enkratnima","peterima","stoterima","tisočerima","trikratnima","trojima","deseterih","dvakratnih","dvojih","enkratnih","peterih","stoterih","tisočerih","trikratnih","trojih","desetere","dvakratne","dvoje","enkratne","petere","stotere","tisočere","trikratne","troje","deseterim","dvakratnim","dvojim","enkratnim","peterim","stoterim","tisočerim","trikratnim","trojim","deseterimi","dvakratnimi","dvojimi","enkratnimi","peterimi","stoterimi","tisočerimi","trikratnimi","trojimi","desetero","dvakratno","dvojo","enkratno","petero","stotero","tisočero","trikratno","trojo","desetera","dvakratna","dvoja","enkratna","petera","stotera","tisočera","trikratna","troja","deseterega","dvakratnega","dvojega","enkratnega","peterega","stoterega","tisočerega","trikratnega","trojega","deseter","dvakraten","dvoj","enkraten","peter","stoter","tisočer","trikraten","troj","deseteremu","dvakratnemu","dvojemu","enkratnemu","peteremu","stoteremu","tisočeremu","trikratnemu","trojemu","deseterem","dvakratnem","dvojem","enkratnem","peterem","stoterem","tisočerem","trikratnem","trojem","le-onega","le-tega","le-tistega","le-toliko","onega","tega","tistega","toliko","le-oni","le-takšni","le-taki","le-te","le-ti","le-tisti","oni","takšni","taki","te","ti","tisti","le-onima","le-takšnima","le-takima","le-tema","le-tistima","onima","takšnima","takima","tema","tistima","le-onih","le-takšnih","le-takih","le-teh","le-tistih","onih","takšnih","takih","teh","tistih","le-one","le-takšne","le-take","le-tiste","one","takšne","take","tiste","le-onim","le-takšnim","le-takim","le-tem","le-tistim","onim","takšnim","takim","tem","tistim","le-onimi","le-takšnimi","le-takimi","le-temi","le-tistimi","onimi","takšnimi","takimi","temi","tistimi","le-ono","le-takšno","le-tako","le-tisto","le-to","ono","takšno","tako","tisto","to","le-tej","tej","le-ona","le-ta","le-takšna","le-taka","le-tista","ona","ta","takšna","taka","tista","le-tak","le-takšen","tak","takšen","le-takšnega","le-takega","takšnega","takega","le-onemu","le-takšnemu","le-takemu","le-temu","le-tistemu","onemu","takšnemu","takemu","temu","temuintemu","tistemu","le-onem","le-takšnem","le-takem","le-tistem","onem","takšnem","takem","tistem","vsakogar","vsakomur","vsakomer","vsakdo","obe","vsaki","vsakršni","vsi","obema","vsakima","vsakršnima","vsema","obeh","vsakih","vsakršnih","vseh","vsake","vsakršne","vse","vsakim","vsakršnim","vsem","vsakimi","vsakršnimi","vsemi","vsako","vsakršno","vso","vsej","vsa","vsaka","vsakršna","oba","ves","vsak","vsakršen","vsakega","vsakršnega","vsega","vsakemu","vsakršnemu","vsemu","vsakem","vsakršnem","enako","istega","koliko","mnogo","nekoga","nekoliko","precej","kaj","koga","marsikaj","marsikoga","nekaj","čemu","komu","marsičemu","marsikomu","nečemu","nekomu","česa","marsičesa","nečesa","kom","marsičim","marsikom","nečim","nekom","čem","marsičem","nečem","kdo","marsikdo","nekdo","čigavi","drugačni","enaki","isti","kakšni","kaki","kakršnikoli","kateri","katerikoli","kolikšni","koliki","marsikateri","nekakšni","nekaki","nekateri","neki","takile","tele","tile","tolikšni","toliki","čigavima","drugačnima","enakima","enima","istima","kakšnima","kakima","kakršnimakoli","katerima","katerimakoli","kolikšnima","kolikima","marsikaterima","nekakšnima","nekakima","nekaterima","nekima","takimale","temale","tolikšnima","tolikima","čigavih","drugačnih","enakih","enih","istih","kakšnih","kakih","kakršnihkoli","katerih","katerihkoli","kolikšnih","kolikih","marsikaterih","nekakšnih","nekakih","nekaterih","nekih","takihle","tehle","tolikšnih","tolikih","čigave","drugačne","enake","iste","kakšne","kake","kakršnekoli","katere","katerekoli","kolikšne","kolike","marsikatere","nekakšne","nekake","nekatere","neke","takele","tolikšne","tolike","čigavim","drugačnim","enakim","istim","kakšnim","kakim","kakršnimkoli","katerim","katerimkoli","kolikšnim","kolikim","marsikaterim","nekakšnim","nekakim","nekaterim","nekim","takimle","temle","tolikšnim","tolikim","čigavimi","drugačnimi","enakimi","enimi","istimi","kakšnimi","kakimi","kakršnimikoli","katerimi","katerimikoli","kolikšnimi","kolikimi","marsikaterimi","nekakšnimi","nekakimi","nekaterimi","nekimi","takimile","temile","tolikšnimi","tolikimi","čigavo","drugačno","isto","kakšno","kako","kakršnokoli","katero","katerokoli","kolikšno","marsikatero","nekakšno","nekako","nekatero","neko","takole","tole","tolikšno","tejle","čigava","drugačna","enaka","ista","kakšna","kaka","kakršnakoli","katera","katerakoli","kolikšna","kolika","marsikatera","neka","nekakšna","nekaka","nekatera","takale","tale","tolikšna","tolika","čigav","drug","drugačen","enak","kak","kakšen","kakršenkoli","kakršnegakoli","kateregakoli","kolik","kolikšen","nek","nekak","nekakšen","takegale","takle","tegale","tolik","tolikšen","čigavega","drugačnega","enakega","kakšnega","kakega","katerega","kolikšnega","kolikega","marsikaterega","nekakšnega","nekakega","nekaterega","nekega","tolikšnega","tolikega","čigavemu","drugačnemu","enakemu","istemu","kakšnemu","kakemu","kakršnemukoli","kateremu","kateremukoli","kolikšnemu","kolikemu","marsikateremu","nekakšnemu","nekakemu","nekateremu","nekemu","takemule","temule","tolikšnemu","tolikemu","čigavem","drugačnem","enakem","istem","kakšnem","kakem","kakršnemkoli","katerem","kateremkoli","kolikšnem","kolikem","marsikaterem","nekakšnem","nekakem","nekaterem","nekem","takemle","tolikšnem","tolikem","naju","nama","midva","nas","nam","nami","mi","mene","me","meni","mano","menoj","jaz","vaju","vama","vidva","vas","vam","vami","vi","tebe","tebi","tabo","teboj","njiju","jih","ju","njima","jima","onedve","onidve","nje","njih","njim","jim","njimi","njo","jo","njej","nji","ji","je","onadva","njega","ga","njemu","mu","njem","on","čigar","kolikor","kar","karkoli","kogar","kogarkoli","čemur","čemurkoli","komur","komurkoli","česar","česarkoli","čimer","čimerkoli","komer","komerkoli","čemer","čemerkoli","kdor","kdorkoli","kakršni","kakršnima","kakršnih","kakršne","kakršnim","kakršnimi","kakršno","kakršna","kakršen","kakršnega","kakršnemu","kakršnem","najini","naši","moji","najinima","našima","mojima","najinih","naših","mojih","najine","naše","moje","najinim","našim","mojim","najinimi","našimi","mojimi","najino","našo","mojo","najina","naša","moja","najin","najinega","naš","našega","moj","mojega","najinemu","našemu","mojemu","najinem","našem","mojem","vajini","vaši","tvoji","vajinima","vašima","tvojima","vajinih","vaših","tvojih","vajine","vaše","tvoje","vajinim","vašim","tvojim","vajinimi","vašimi","tvojimi","vajino","vašo","tvojo","vajina","vaša","tvoja","vajin","vajinega","vaš","vašega","tvoj","tvojega","vajinemu","vašemu","tvojemu","vajinem","vašem","tvojem","njuni","njihovi","njeni","njegovi","njunima","njihovima","njenima","njegovima","njunih","njihovih","njenih","njegovih","njune","njihove","njene","njegove","njunim","njihovim","njenim","njegovim","njunimi","njihovimi","njenimi","njegovimi","njuno","njihovo","njeno","njegovo","njuna","njihova","njena","njegova","njun","njunega","njihov","njihovega","njen","njenega","njegov","njegovega","njunemu","njihovemu","njenemu","njegovemu","njunem","njihovem","njenem","njegovem","se","si","sebe","sebi","sabo","seboj","svoji","svojima","svojih","svoje","svojim","svojimi","svojo","svoja","svoj","svojega","svojemu","svojem","nikogar","noben","ničemur","nikomur","ničesar","ničimer","nikomer","ničemer","nihče","nikakršni","nobeni","nikakršnima","nobenima","nikakršnih","nobenih","nikakršne","nobene","nikakršnim","nobenim","nikakršnimi","nobenimi","nikakršno","nobeno","nikakršna","nobena","nikakršen","nikakršnega","nobenega","nikakršnemu","nobenemu","nikakršnem","nobenem","še","šele","žal","že","baje","bojda","bržčas","bržkone","celo","dobesedno","domala","edinole","gotovo","itak","ja","kajne","kajpada","kajpak","koli","komaj","le","malone","mar","menda","morda","morebiti","nadvse","najbrž","nemara","nerad","neradi","nikar","pač","pogodu","prav","pravzaprav","predvsem","preprosto","rad","rada","rade","radi","ravno","res","resda","samo","seveda","skoraj","skorajda","spet","sploh","tudi","všeč","verjetno","vnovič","vred","vsaj","zadosti","zapored","zares","zgolj","zlasti","zopet","čezenj","čeznje","mednje","mednju","medse","nadenj","nadme","nadnje","name","nanj","nanje","nanjo","nanju","nase","nate","obenj","podnjo","pome","ponj","ponje","ponjo","pote","predenj","predme","prednje","predse","skozenj","skoznje","skoznjo","skozte","vame","vanj","vanje","vanjo","vanju","vase","vate","zame","zanj","zanje","zanjo","zanju","zase","zate","čez","med","na","nad","ob","po","pod","pred","raz","skoz","skozi","v","za","zoper","h","k","kljub","nasproti","navkljub","navzlic","proti","ž","blizu","brez","dno","do","iz","izmed","iznad","izpod","izpred","izven","izza","krog","mimo","namesto","naokoli","naproti","od","okoli","okrog","onkraj","onstran","poleg","povrh","povrhu","prek","preko","razen","s","spod","spričo","sredi","vštric","vpričo","vrh","vrhu","vzdolž","z","zaradi","zavoljo","zraven","zunaj","o","pri","bi","bova","bomo","bom","bosta","boste","boš","bodo","bojo","bo","sva","nisva","smo","nismo","sem","nisem","sta","nista","ste","niste","nisi","so","niso","ni","bodiva","bodimo","bodita","bodite","bodi","biti","bili","bila","bile","bil","bilo","želiva","dovoliva","hočeva","marava","morava","moreva","smeva","zmoreva","nočeva","želimo","dovolimo","hočemo","maramo","moramo","moremo","smemo","zmoremo","nočemo","želim","dovolim","hočem","maram","moram","morem","smem","zmorem","nočem","želita","dovolita","hočeta","marata","morata","moreta","smeta","zmoreta","nočeta","želite","dovolite","hočete","marate","morate","morete","smete","zmorete","nočete","želiš","dovoliš","hočeš","maraš","moraš","moreš","smeš","zmoreš","nočeš","želijo","dovolijo","hočejo","marajo","morajo","morejo","smejo","zmorejo","nočejo","želi","dovoli","hoče","mara","mora","more","sme","zmore","noče","hotiva","marajva","hotimo","marajmo","hotita","marajta","hotite","marajte","hoti","maraj","želeti","dovoliti","hoteti","marati","moči","morati","smeti","zmoči","želeni","dovoljeni","želena","dovoljena","želene","dovoljene","želen","dovoljen","želeno","dovoljeno","želeli","dovolili","hoteli","marali","mogli","morali","smeli","zmogli","želela","dovolila","hotela","marala","mogla","morala","smela","zmogla","želele","dovolile","hotele","marale","mogle","morale","smele","zmogle","želel","dovolil","hotel","maral","mogel","moral","smel","zmogel","želelo","dovolilo","hotelo","maralo","moglo","moralo","smelo","zmogl"],
  "sv":["och","det","att","i","en","jag","hon","som","han","på","den","med","var","sig","för","så","till","är","men","ett","om","hade","de","av","icke","mig","du","henne","då","sin","nu","har","inte","hans","honom","skulle","hennes","där","min","man","ej","vid","kunde","något","från","ut","när","efter","upp","vi","dem","vara","vad","över","än","dig","kan","sina","här","ha","mot","alla","under","någon","eller","allt","mycket","sedan","ju","denna","själv","detta","åt","utan","varit","hur","ingen","mitt","ni","bli","blev","oss","din","dessa","några","deras","blir","mina","samma","vilken","er","sådan","vår","blivit","dess","inom","mellan","sådant","varför","varje","vilka","ditt","vem","vilket","sitta","sådana","vart","dina","vars","vårt","våra","ert","era","vilkas"],
  "tg":["аз","дар","ба","бо","барои","бе","то","ҷуз","пеши","назди","рӯйи","болои ","паси","ғайри","ҳамон","ҳамоно","инҷониб","замон","замоно","эътиборан","пеш","қабл","дида","сар карда","агар ","агар ки","валекин ","ки","лекин","аммо","вале","балки","ва","ҳарчанд","чунки","зеро","зеро ки","вақте ки","то вақте ки","барои он ки","бо нияти он ки","лекин ва ҳол он ки","ё","ё ин ки  ","бе он ки ","дар ҳолате ки","то даме ки ","баъд аз он ки","даме ки","ба тразе ки ","аз баҳри он ки","гар ","ар","ба шарте","азбаски ","модоме ки","агар чи","гарчанде ки ","бо вуҷуди он ки","гӯё","аз-баски ","чун-ки","агар-чанд","агар-чи ","гар-чи","то ки","чунон ки","то даме ки","ҳар қадар ки","магар ","оё","наход","ҳатто ","ҳам ","бале ","оре ","хуб ","хуш","хайр","не","на","мана","э","фақат","танҳо","кошки ","мабодо","ҳтимол","ана ҳамин","наход ки","ҳатто ки","аз афташ","майлаш куя","ана","ҳа","канӣ","гӯё ки","ҳо ана","на ин ки","ваҳ","ҳой","и","а","о","эҳ","ҳе","ҳу","аҳа","оҳе","уҳа","ҳм","нм","оббо","ӯббо","ҳой-ҳой ","вой-вой","ту-ту","ҳмм","эҳа","тавба","ӯҳӯ","аҷабо","ало","аё","ой","ӯим ","ором","хом?ш","ҳай-ҳай ","бай-бай","аз ","он","баъд","азбаски","ӯ","ҳангоми","чӣ","кадом","ин","ҷо","ҳам","ё ки","бояд","аст","чанд","ҳар","бар","чаро ки","агар","то кӣ","бинобар","бинобар ин","ҳаргиз","асло","нахот","нахот ки","кошкӣ","шояд","шояд ки","охир","аз рӯи","аз рӯйи ","рӯ"],
  "tr":["acaba","ama","aslında","az","bazı","belki","biri","birkaç","birşey","biz","bu","çok","çünkü","da","daha","de","defa","diye","eğer","en","gibi","hem","hep","hepsi","her","hiç","için","ile","ise","kez","ki","kim","mı","mu","mü","nasıl","ne","neden","nerde","nerede","nereye","niçin","niye","o","sanki","şey","siz","şu","tüm","ve","veya","ya","yani"]
}
},{}],4:[function(require,module,exports){
"use strict";
/**
 * Tools for word truncation (stemming).
 * @module stemmer
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RSLPStemmer = exports.PorterStemmer = void 0;

var _porterStemmer = require("porter-stemmer");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classCheckPrivateStaticFieldDescriptor(descriptor, action) { if (descriptor === undefined) { throw new TypeError("attempted to " + action + " private static field before its declaration"); } }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classStaticPrivateMethodGet(receiver, classConstructor, method) { _classCheckPrivateStaticAccess(receiver, classConstructor); return method; }

function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }

/**
 * Implementation fo the algorithm for the RSLP Stemmer, as
 *  described in the "A Stemming Algorithm for the Portuguese
 *  Language" paper.
 * 
 * In Proceedings of the SPIRE conference, Laguna de Sal Raphael,
 *  Chile, November 13-15, 2001, written by Viviane Moreira
 *  Orengo and Christian Huyck
 * 
 * More info: {@link http://www.inf.ufrgs.br/~viviane/rslp/index.htm}.
 * 
 * Datasets from: {@link https://www.kaggle.com/nltkdata/rslp-stemmer}.
 * 
 * Source: {@link https://www.andrewsaguiar.com/blog/2019/09/12/text-search-implementing-portuguese-stemmer}.
 */
var RSLPStemmer = /*#__PURE__*/function () {
  function RSLPStemmer() {
    _classCallCheck(this, RSLPStemmer);
  }

  _createClass(RSLPStemmer, null, [{
    key: "stem",
    value:
    /**
     * Performs the stemming operation for the given word.
     * @param {string} word - The word to be stemmed.
     * @returns {string} a stem.
     */
    function stem(word) {
      var wrd = word;
      if (wrd.endsWith('s')) wrd = _classStaticPrivateMethodGet(RSLPStemmer, RSLPStemmer, _applyRule).call(RSLPStemmer, wrd, _classStaticPrivateFieldSpecGet(RSLPStemmer, RSLPStemmer, _plural_reduction));
      if (wrd.endsWith('a')) wrd = _classStaticPrivateMethodGet(RSLPStemmer, RSLPStemmer, _applyRule).call(RSLPStemmer, wrd, _classStaticPrivateFieldSpecGet(RSLPStemmer, RSLPStemmer, _feminine_reduction));
      wrd = _classStaticPrivateMethodGet(RSLPStemmer, RSLPStemmer, _applyRule).call(RSLPStemmer, wrd, _classStaticPrivateFieldSpecGet(RSLPStemmer, RSLPStemmer, _argumentative_diminutive_reduction));
      wrd = _classStaticPrivateMethodGet(RSLPStemmer, RSLPStemmer, _applyRule).call(RSLPStemmer, wrd, _classStaticPrivateFieldSpecGet(RSLPStemmer, RSLPStemmer, _adverb_reduction));
      var prev = wrd;
      wrd = _classStaticPrivateMethodGet(RSLPStemmer, RSLPStemmer, _applyRule).call(RSLPStemmer, wrd, _classStaticPrivateFieldSpecGet(RSLPStemmer, RSLPStemmer, _noun_suffix_reduction));

      if (prev === wrd) {
        wrd = _classStaticPrivateMethodGet(RSLPStemmer, RSLPStemmer, _applyRule).call(RSLPStemmer, wrd, _classStaticPrivateFieldSpecGet(RSLPStemmer, RSLPStemmer, _verb_suffix_reduction));
        if (prev === wrd) wrd = _classStaticPrivateMethodGet(RSLPStemmer, RSLPStemmer, _applyRule).call(RSLPStemmer, wrd, _classStaticPrivateFieldSpecGet(RSLPStemmer, RSLPStemmer, _vowel_removal));
      }

      return wrd;
    }
    /**
     * Applies rule for the given word
     * @param {string} word - word (or part) to be stemmed.
     * @param {any[][]} rules - Array of rules.
     * @returns {string} word part (after applying rule).
     * @private
     */

  }]);

  return RSLPStemmer;
}();
/**
 * Wrapper class for Porter Stemmer implementation
 *  available at: {@link https://www.npmjs.com/package/porter-stemmer}
 */


exports.RSLPStemmer = RSLPStemmer;

function _applyRule(word, rules) {
  var _iterator = _createForOfIteratorHelper(rules),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var rule = _step.value;
      if (word.endsWith(rule[0]) && word.length >= rule[0].length + rule[1] && !rule[3].includes(word)) return word.substring(0, word.length - rule[0].length) + rule[2];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return word;
}

var _plural_reduction = {
  writable: true,
  value: [["ns", 1, "m", []], ["ões", 3, "ão", []], ["ães", 1, "ão", ["mães", "mamães"]], ["ais", 1, "al", ["cais", "mais"]], ["éis", 2, "el", []], ["eis", 2, "el", []], ["óis", 2, "ol", []], ["is", 2, "il", ["lápis", "cais", "mais", "crúcis", "biquínis", "pois", "depois", "dois", "leis"]], ["les", 3, "l", []], ["res", 3, "r", ["árvores"]], ["s", 2, "", ["aliás", "pires", "lápis", "cais", "mais", "mas", "menos", "férias", "fezes", "pêsames", "crúcis", "gás", "atrás", "moisés", "através", "convés", "ês", "país", "após", "ambas", "ambos", "messias", "depois"]]]
};
var _feminine_reduction = {
  writable: true,
  value: [["ona", 3, "ão", ["abandona", "lona", "iona", "cortisona", "monótona", "maratona", "acetona", "detona", "carona"]], ["ora", 3, "or", []], ["na", 4, "no", ["carona", "abandona", "lona", "iona", "cortisona", "monótona", "maratona", "acetona", "detona", "guiana", "campana", "grana", "caravana", "banana", "paisana"]], ["inha", 3, "inho", ["rainha", "linha", "minha"]], ["esa", 3, "ês", ["mesa", "obesa", "princesa", "turquesa", "ilesa", "pesa", "presa"]], ["osa", 3, "oso", ["mucosa", "prosa"]], ["íaca", 3, "íaco", []], ["ica", 3, "ico", ["dica"]], ["ada", 2, "ado", ["pitada"]], ["ida", 3, "ido", ["vida"]], ["ída", 3, "ido", ["recaída", "saída", "dúvida"]], ["ima", 3, "imo", ["vítima"]], ["iva", 3, "ivo", ["saliva", "oliva"]], ["eira", 3, "eiro", ["beira", "cadeira", "frigideira", "bandeira", "feira", "capoeira", "barreira", "fronteira", "besteira", "poeira"]], ["ã", 2, "ão", ["amanhã", "arapuã", "fã", "divã"]]]
};
var _adverb_reduction = {
  writable: true,
  value: [["mente", 4, "", ["experimente"]]]
};
var _argumentative_diminutive_reduction = {
  writable: true,
  value: [["díssimo", 5, "", []], ["abilíssimo", 5, "", []], ["íssimo", 3, "", []], ["ésimo", 3, "", []], ["érrimo", 4, "", []], ["zinho", 2, "", []], ["quinho", 4, "c", []], ["uinho", 4, "", []], ["adinho", 3, "", []], ["inho", 3, "", ["caminho", "cominho"]], ["alhão", 4, "", []], ["uça", 4, "", []], ["aço", 4, "", ["antebraço"]], ["aça", 4, "", []], ["adão", 4, "", []], ["idão", 4, "", []], ["ázio", 3, "", ["topázio"]], ["arraz", 4, "", []], ["zarrão", 3, "", []], ["arrão", 4, "", []], ["arra", 3, "", []], ["zão", 2, "", ["coalizão"]], ["ão", 3, "", ["camarão", "chimarrão", "canção", "coração", "embrião", "grotão", "glutão", "ficção", "fogão", "feição", "furacão", "gamão", "lampião", "leão", "macacão", "nação", "órfão", "orgão", "patrão", "portão", "quinhão", "rincão", "tração", "falcão", "espião", "mamão", "folião", "cordão", "aptidão", "campeão", "colchão", "limão", "leilão", "melão", "barão", "milhão", "bilhão", "fusão", "cristão", "ilusão", "capitão", "estação", "senão"]]]
};
var _noun_suffix_reduction = {
  writable: true,
  value: [["encialista", 4, "", []], ["alista", 5, "", []], ["agem", 3, "", ["coragem", "chantagem", "vantagem", "carruagem"]], ["iamento", 4, "", []], ["amento", 3, "", ["firmamento", "fundamento", "departamento"]], ["imento", 3, "", []], ["mento", 6, "", ["firmamento", "elemento", "complemento", "instrumento", "departamento"]], ["alizado", 4, "", []], ["atizado", 4, "", []], ["tizado", 4, "", ["alfabetizado"]], ["izado", 5, "", ["organizado", "pulverizado"]], ["ativo", 4, "", ["pejorativo", "relativo"]], ["tivo", 4, "", ["relativo"]], ["ivo", 4, "", ["passivo", "possessivo", "pejorativo", "positivo"]], ["ado", 2, "", ["grado"]], ["ido", 3, "", ["cândido", "consolido", "rápido", "decido", "tímido", "duvido", "marido"]], ["ador", 3, "", []], ["edor", 3, "", []], ["idor", 4, "", ["ouvidor"]], ["dor", 4, "", ["ouvidor"]], ["sor", 4, "", ["assessor"]], ["atoria", 5, "", []], ["tor", 3, "", ["benfeitor", "leitor", "editor", "pastor", "produtor", "promotor", "consultor"]], ["or", 2, "", ["motor", "melhor", "redor", "rigor", "sensor", "tambor", "tumor", "assessor", "benfeitor", "pastor", "terior", "favor", "autor"]], ["abilidade", 5, "", []], ["icionista", 4, "", []], ["cionista", 5, "", []], ["ionista", 5, "", []], ["ionar", 5, "", []], ["ional", 4, "", []], ["ência", 3, "", []], ["ância", 4, "", ["ambulância"]], ["edouro", 3, "", []], ["queiro", 3, "c", []], ["adeiro", 4, "", ["desfiladeiro"]], ["eiro", 3, "", ["desfiladeiro", "pioneiro", "mosteiro"]], ["uoso", 3, "", []], ["oso", 3, "", ["precioso"]], ["alizaç", 5, "", []], ["atizaç", 5, "", []], ["tizaç", 5, "", []], ["izaç", 5, "", ["organizaç"]], ["aç", 3, "", ["equaç", "relaç"]], ["iç", 3, "", ["eleição"]], ["ário", 3, "", ["voluntário", "salário", "aniversário", "diário", "lionário", "armário", "aleatório", "voluntário", "salário", "aniversário", "diário", "compulsório", "lionário", "próprio", "stério", "armário"]], ["ério", 6, "", []], ["ês", 4, "", []], ["eza", 3, "", []], ["ez", 4, "", []], ["esco", 4, "", []], ["ante", 2, "", ["gigante", "elefante", "adiante", "possante", "instante", "restaurante"]], ["ástico", 4, "", ["eclesiástico"]], ["alístico", 3, "", []], ["áutico", 4, "", []], ["êutico", 4, "", []], ["tico", 3, "", ["político", "eclesiástico", "diagnostico", "prático", "doméstico", "diagnóstico", "idêntico", "alopático", "artístico", "autêntico", "eclético", "crítico", "critico"]], ["ico", 4, "", ["tico", "público", "explico"]], ["ividade", 5, "", []], ["idade", 4, "", ["autoridade", "comunidade"]], ["oria", 4, "", ["categoria"]], ["encial", 5, "", []], ["ista", 4, "", []], ["auta", 5, "", []], ["quice", 4, "c", []], ["ice", 4, "", ["cúmplice"]], ["íaco", 3, "", []], ["ente", 4, "", ["freqüente", "alimente", "acrescente", "permanente", "oriente", "aparente"]], ["ense", 5, "", []], ["inal", 3, "", []], ["ano", 4, "", []], ["ável", 2, "", ["afável", "razoável", "potável", "vulnerável"]], ["ível", 3, "", ["possível"]], ["vel", 5, "", ["possível", "vulnerável", "solúvel"]], ["bil", 3, "vel", []], ["ura", 4, "", ["imatura", "acupuntura", "costura"]], ["ural", 4, "", []], ["ual", 3, "", ["bissexual", "virtual", "visual", "pontual"]], ["ial", 3, "", []], ["al", 4, "", ["afinal", "animal", "estatal", "bissexual", "desleal", "fiscal", "formal", "pessoal", "liberal", "postal", "virtual", "visual", "pontual", "sideral", "sucursal"]], ["alismo", 4, "", []], ["ivismo", 4, "", []], ["ismo", 3, "", ["cinismo"]]]
};
var _verb_suffix_reduction = {
  writable: true,
  value: [["aríamo", 2, "", []], ["ássemo", 2, "", []], ["eríamo", 2, "", []], ["êssemo", 2, "", []], ["iríamo", 3, "", []], ["íssemo", 3, "", []], ["áramo", 2, "", []], ["árei", 2, "", []], ["aremo", 2, "", []], ["ariam", 2, "", []], ["aríei", 2, "", []], ["ássei", 2, "", []], ["assem", 2, "", []], ["ávamo", 2, "", []], ["êramo", 3, "", []], ["eremo", 3, "", []], ["eriam", 3, "", []], ["eríei", 3, "", []], ["êssei", 3, "", []], ["essem", 3, "", []], ["íramo", 3, "", []], ["iremo", 3, "", []], ["iriam", 3, "", []], ["iríei", 3, "", []], ["íssei", 3, "", []], ["issem", 3, "", []], ["ando", 2, "", []], ["endo", 3, "", []], ["indo", 3, "", []], ["ondo", 3, "", []], ["aram", 2, "", []], ["arão", 2, "", []], ["arde", 2, "", []], ["arei", 2, "", []], ["arem", 2, "", []], ["aria", 2, "", []], ["armo", 2, "", []], ["asse", 2, "", []], ["aste", 2, "", []], ["avam", 2, "", ["agravam"]], ["ávei", 2, "", []], ["eram", 3, "", []], ["erão", 3, "", []], ["erde", 3, "", []], ["erei", 3, "", []], ["êrei", 3, "", []], ["erem", 3, "", []], ["eria", 3, "", []], ["ermo", 3, "", []], ["esse", 3, "", []], ["este", 3, "", ["faroeste", "agreste"]], ["íamo", 3, "", []], ["iram", 3, "", []], ["íram", 3, "", []], ["irão", 2, "", []], ["irde", 2, "", []], ["irei", 3, "", ["admirei"]], ["irem", 3, "", ["adquirem"]], ["iria", 3, "", []], ["irmo", 3, "", []], ["isse", 3, "", []], ["iste", 4, "", []], ["iava", 4, "", ["ampliava"]], ["amo", 2, "", []], ["iona", 3, "", []], ["ara", 2, "", ["arara", "prepara"]], ["ará", 2, "", ["alvará"]], ["are", 2, "", ["prepare"]], ["ava", 2, "", ["agrava"]], ["emo", 2, "", []], ["era", 3, "", ["acelera", "espera"]], ["erá", 3, "", []], ["ere", 3, "", ["espere"]], ["iam", 3, "", ["enfiam", "ampliam", "elogiam", "ensaiam"]], ["íei", 3, "", []], ["imo", 3, "", ["reprimo", "intimo", "íntimo", "nimo", "queimo", "ximo"]], ["ira", 3, "", ["fronteira", "sátira"]], ["ído", 3, "", ["irá"]], ["tizar", 4, "", ["alfabetizar"]], ["izar", 5, "", ["organizar"]], ["itar", 5, "", ["acreditar", "explicitar", "estreitar"]], ["ire", 3, "", ["adquire"]], ["omo", 3, "", []], ["ai", 2, "", []], ["am", 2, "", []], ["ear", 4, "", ["alardear", "nuclear"]], ["ar", 2, "", ["azar", "bazaar", "patamar"]], ["uei", 3, "", []], ["uía", 5, "u", []], ["ei", 3, "", []], ["guem", 3, "g", []], ["em", 2, "", ["alem", "virgem"]], ["er", 2, "", ["éter", "pier"]], ["eu", 3, "", ["chapeu"]], ["ia", 3, "", ["estória", "fatia", "acia", "praia", "elogia", "mania", "lábia", "aprecia", "polícia", "arredia", "cheia", "ásia"]], ["ir", 3, "", ["freir"]], ["iu", 3, "", []], ["eou", 5, "", []], ["ou", 3, "", []], ["i", 3, "", []]]
};
var _vowel_removal = {
  writable: true,
  value: [["bil", 2, "vel", []], ["gue", 2, "g", ["gangue", "jegue"]], ["á", 3, "", []], ["ê", 3, "", ["bebê"]], ["a", 3, "", ["ásia"]], ["e", 3, "", []], ["o", 3, "", ["ão"]]]
};

var PorterStemmer = /*#__PURE__*/function () {
  function PorterStemmer() {
    _classCallCheck(this, PorterStemmer);
  }

  _createClass(PorterStemmer, null, [{
    key: "stem",
    value:
    /**
     * Performs the stemming operation for the given word.
     *  this is the same as "stemmer(word)" function from
     *  "porter-stemmer" package.
     * @param {string} word - The word to be stemmed.
     * @returns {string} a stem.
     */
    function stem(word) {
      return (0, _porterStemmer.stemmer)(word);
    }
  }]);

  return PorterStemmer;
}();

exports.PorterStemmer = PorterStemmer;
},{"porter-stemmer":11}],5:[function(require,module,exports){
"use strict";
/**
 * Stopwords datasets.
 * @module stopwords
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StopWords = void 0;

var _stopwordsIso = _interopRequireDefault(require("stopwords-iso"));

var _stopwords = _interopRequireDefault(require("../nltk-data/stopwords.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * Class which aggregates methods related
 *   to stop words retrieval.
 */
var StopWords = /*#__PURE__*/function () {
  function StopWords() {
    _classCallCheck(this, StopWords);
  }

  _createClass(StopWords, null, [{
    key: "get",
    value:
    /**
     * Retrieves the stop words for the specified
     *   language.
     * Check NLTK's and stopword-iso's documentation
     *   so as to check for supported languages.
     * 
     * @param {string} lang - ISO language code.
     * @param {string} source - Stop list source. Valid
     *   values are either "NLTK" (default) or "ISO".
     * @returns {string[]} the stop words array
     *   for the given language, or undefined, if not
     *   found.
     */
    function get(lang) {
      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "NLTK";
      return source === "NLTK" ? _stopwords["default"][lang] : _stopwordsIso["default"][lang];
    }
  }]);

  return StopWords;
}();

exports.StopWords = StopWords;
},{"../nltk-data/stopwords.json":3,"stopwords-iso":12}],6:[function(require,module,exports){
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
   * @returns {string[]} the tokenized version
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
},{}],7:[function(require,module,exports){
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
  /** @type {string[]} */

  /** @type {object} */

  /**
   * Creates an instance of TextVectorizer class
   * @param {string} tf - Term-Frequency
   * @param {string} idf - Inverse Document-Frequency
   * @param {string[]} vocab - Vocabulary
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
    if (vocab && !vocab instanceof Array) throw new TypeError("Invalid argument type for 'vocab'. Expected 'string[]', but '".concat(_typeof(vocab), "' was given."));

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
     * @param {string[][]} X - Array of
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
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF-IDF matrix.
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
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF-IDF matrix.
     */

  }, {
    key: "fitTransform",
    value: function fitTransform(X) {
      return this.fit(X).transform(X);
    }
    /**
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF matrix (raw).
     * @private
     */

  }, {
    key: "loadModel",
    value:
    /**
     * @typedef {Object} TextVectorizerModel
     * @property {string} tf - TFMetrics value.
     * @property {string} idf - IDFMetrics value.
     * @property {string[]|null} vocabulary - Vocabulary.
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
},{"../utils/copy":8}],8:[function(require,module,exports){
"use strict";
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepCopy = deepCopy;

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
     * @private
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
},{"../preprocessing/stemmer":4,"../preprocessing/tokenization":6}],11:[function(require,module,exports){
// Porter stemmer in Javascript. Few comments, but it's easy to follow against
// the rules in the original paper, in
//
//  Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14, no. 3,
//  pp 130-137,
//
// see also http://www.tartarus.org/~martin/PorterStemmer

// Release 1 be 'andargor', Jul 2004
// Release 2 (substantially revised) by Christopher McKenzie, Aug 2009
//
// CommonJS tweak by jedp

(function() {
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    };

  var step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    };

  var c = "[^aeiou]";          // consonant
  var v = "[aeiouy]";          // vowel
  var C = c + "[^aeiouy]*";    // consonant sequence
  var V = v + "[aeiou]*";      // vowel sequence

  var mgr0 = "^(" + C + ")?" + V + C;               // [C]VC... is m>0
  var meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$";  // [C]VC[V] is m=1
  var mgr1 = "^(" + C + ")?" + V + C + V + C;       // [C]VCVC... is m>1
  var s_v = "^(" + C + ")?" + v;                   // vowel in stem

  function stemmer(w) {
    var stem;
    var suffix;
    var firstch;
    var re;
    var re2;
    var re3;
    var re4;
    var origword = w;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = /^(.+?)(ss|i)es$/;
    re2 = /^(.+?)([^s])s$/;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) {  w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = /^(.+?)eed$/;
    re2 = /^(.+?)(ed|ing)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = new RegExp(mgr0);
      if (re.test(fp[1])) {
        re = /.$/;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = new RegExp(s_v);
      if (re2.test(stem)) {
        w = stem;
        re2 = /(at|bl|iz)$/;
        re3 = new RegExp("([^aeiouylsz])\\1$");
        re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
        if (re2.test(w)) { w = w + "e"; }
        else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c
    re = /^(.+?)y$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(s_v);
      if (re.test(stem)) { w = stem + "i"; }
    }

    // Step 2
    re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    re2 = /^(.+?)(s|t)(ion)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = new RegExp(mgr1);
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = /^(.+?)e$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      re2 = new RegExp(meq1);
      re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = /ll$/;
    re2 = new RegExp(mgr1);
    if (re.test(w) && re2.test(w)) {
      re = /.$/;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  }

  // memoize at the module level
  var memo = {};
  var memoizingStemmer = function(w) {
    if (!memo[w]) {
      memo[w] = stemmer(w);
    }
    return memo[w];
  }

  if (typeof exports != 'undefined' && exports != null) {
    exports.stemmer = stemmer;
    exports.memoizingStemmer = memoizingStemmer;
  }

})();

},{}],12:[function(require,module,exports){
module.exports={"af":["'n","aan","af","al","as","baie","by","daar","dag","dat","die","dit","een","ek","en","gaan","gesê","haar","het","hom","hulle","hy","in","is","jou","jy","kan","kom","ma","maar","met","my","na","nie","om","ons","op","saam","sal","se","sien","so","sy","te","toe","uit","van","vir","was","wat","ŉ"],"ar":["،","آض","آمينَ","آه","آهاً","آي","أ","أب","أجل","أجمع","أخ","أخذ","أصبح","أضحى","أقبل","أقل","أكثر","ألا","أم","أما","أمامك","أمامكَ","أمسى","أمّا","أن","أنا","أنت","أنتم","أنتما","أنتن","أنتِ","أنشأ","أنّى","أو","أوشك","أولئك","أولئكم","أولاء","أولالك","أوّهْ","أي","أيا","أين","أينما","أيّ","أَنَّ","أََيُّ","أُفٍّ","إذ","إذا","إذاً","إذما","إذن","إلى","إليكم","إليكما","إليكنّ","إليكَ","إلَيْكَ","إلّا","إمّا","إن","إنّما","إي","إياك","إياكم","إياكما","إياكن","إيانا","إياه","إياها","إياهم","إياهما","إياهن","إياي","إيهٍ","إِنَّ","ا","ابتدأ","اثر","اجل","احد","اخرى","اخلولق","اذا","اربعة","ارتدّ","استحال","اطار","اعادة","اعلنت","اف","اكثر","اكد","الألاء","الألى","الا","الاخيرة","الان","الاول","الاولى","التى","التي","الثاني","الثانية","الذاتي","الذى","الذي","الذين","السابق","الف","اللائي","اللاتي","اللتان","اللتيا","اللتين","اللذان","اللذين","اللواتي","الماضي","المقبل","الوقت","الى","اليوم","اما","امام","امس","ان","انبرى","انقلب","انه","انها","او","اول","اي","ايار","ايام","ايضا","ب","بات","باسم","بان","بخٍ","برس","بسبب","بسّ","بشكل","بضع","بطآن","بعد","بعض","بك","بكم","بكما","بكن","بل","بلى","بما","بماذا","بمن","بن","بنا","به","بها","بي","بيد","بين","بَسْ","بَلْهَ","بِئْسَ","تانِ","تانِك","تبدّل","تجاه","تحوّل","تلقاء","تلك","تلكم","تلكما","تم","تينك","تَيْنِ","تِه","تِي","ثلاثة","ثم","ثمّ","ثمّة","ثُمَّ","جعل","جلل","جميع","جير","حار","حاشا","حاليا","حاي","حتى","حرى","حسب","حم","حوالى","حول","حيث","حيثما","حين","حيَّ","حَبَّذَا","حَتَّى","حَذارِ","خلا","خلال","دون","دونك","ذا","ذات","ذاك","ذانك","ذانِ","ذلك","ذلكم","ذلكما","ذلكن","ذو","ذوا","ذواتا","ذواتي","ذيت","ذينك","ذَيْنِ","ذِه","ذِي","راح","رجع","رويدك","ريث","رُبَّ","زيارة","سبحان","سرعان","سنة","سنوات","سوف","سوى","سَاءَ","سَاءَمَا","شبه","شخصا","شرع","شَتَّانَ","صار","صباح","صفر","صهٍ","صهْ","ضد","ضمن","طاق","طالما","طفق","طَق","ظلّ","عاد","عام","عاما","عامة","عدا","عدة","عدد","عدم","عسى","عشر","عشرة","علق","على","عليك","عليه","عليها","علًّ","عن","عند","عندما","عوض","عين","عَدَسْ","عَمَّا","غدا","غير","ـ","ف","فان","فلان","فو","فى","في","فيم","فيما","فيه","فيها","قال","قام","قبل","قد","قطّ","قلما","قوة","كأنّما","كأين","كأيّ","كأيّن","كاد","كان","كانت","كذا","كذلك","كرب","كل","كلا","كلاهما","كلتا","كلم","كليكما","كليهما","كلّما","كلَّا","كم","كما","كي","كيت","كيف","كيفما","كَأَنَّ","كِخ","لئن","لا","لات","لاسيما","لدن","لدى","لعمر","لقاء","لك","لكم","لكما","لكن","لكنَّما","لكي","لكيلا","للامم","لم","لما","لمّا","لن","لنا","له","لها","لو","لوكالة","لولا","لوما","لي","لَسْتَ","لَسْتُ","لَسْتُم","لَسْتُمَا","لَسْتُنَّ","لَسْتِ","لَسْنَ","لَعَلَّ","لَكِنَّ","لَيْتَ","لَيْسَ","لَيْسَا","لَيْسَتَا","لَيْسَتْ","لَيْسُوا","لَِسْنَا","ما","ماانفك","مابرح","مادام","ماذا","مازال","مافتئ","مايو","متى","مثل","مذ","مساء","مع","معاذ","مقابل","مكانكم","مكانكما","مكانكنّ","مكانَك","مليار","مليون","مما","ممن","من","منذ","منها","مه","مهما","مَنْ","مِن","نحن","نحو","نعم","نفس","نفسه","نهاية","نَخْ","نِعِمّا","نِعْمَ","ها","هاؤم","هاكَ","هاهنا","هبّ","هذا","هذه","هكذا","هل","هلمَّ","هلّا","هم","هما","هن","هنا","هناك","هنالك","هو","هي","هيا","هيت","هيّا","هَؤلاء","هَاتانِ","هَاتَيْنِ","هَاتِه","هَاتِي","هَجْ","هَذا","هَذانِ","هَذَيْنِ","هَذِه","هَذِي","هَيْهَاتَ","و","و6","وا","واحد","واضاف","واضافت","واكد","وان","واهاً","واوضح","وراءَك","وفي","وقال","وقالت","وقد","وقف","وكان","وكانت","ولا","ولم","ومن","وهو","وهي","ويكأنّ","وَيْ","وُشْكَانََ","يكون","يمكن","يوم","ّأيّان"],"hy":["այդ","այլ","այն","այս","դու","դուք","եմ","են","ենք","ես","եք","է","էի","էին","էինք","էիր","էիք","էր","ըստ","թ","ի","ին","իսկ","իր","կամ","համար","հետ","հետո","մենք","մեջ","մի","ն","նա","նաև","նրա","նրանք","որ","որը","որոնք","որպես","ու","ում","պիտի","վրա","և"],"eu":["al","anitz","arabera","asko","baina","bat","batean","batek","bati","batzuei","batzuek","batzuetan","batzuk","bera","beraiek","berau","berauek","bere","berori","beroriek","beste","bezala","da","dago","dira","ditu","du","dute","edo","egin","ere","eta","eurak","ez","gainera","gu","gutxi","guzti","haiei","haiek","haietan","hainbeste","hala","han","handik","hango","hara","hari","hark","hartan","hau","hauei","hauek","hauetan","hemen","hemendik","hemengo","hi","hona","honek","honela","honetan","honi","hor","hori","horiei","horiek","horietan","horko","horra","horrek","horrela","horretan","horri","hortik","hura","izan","ni","noiz","nola","non","nondik","nongo","nor","nora","ze","zein","zen","zenbait","zenbat","zer","zergatik","ziren","zituen","zu","zuek","zuen","zuten"],"bn":["অতএব","অথচ","অথবা","অনুযায়ী","অনেক","অনেকে","অনেকেই","অন্তত","অন্য","অবধি","অবশ্য","অর্থাত","আই","আগামী","আগে","আগেই","আছে","আজ","আদ্যভাগে","আপনার","আপনি","আবার","আমরা","আমাকে","আমাদের","আমার","আমি","আর","আরও","ই","ইত্যাদি","ইহা","উচিত","উত্তর","উনি","উপর","উপরে","এ","এঁদের","এঁরা","এই","একই","একটি","একবার","একে","এক্","এখন","এখনও","এখানে","এখানেই","এটা","এটাই","এটি","এত","এতটাই","এতে","এদের","এব","এবং","এবার","এমন","এমনকী","এমনি","এর","এরা","এল","এস","এসে","ঐ","ও","ওঁদের","ওঁর","ওঁরা","ওই","ওকে","ওখানে","ওদের","ওর","ওরা","কখনও","কত","কবে","কমনে","কয়েক","কয়েকটি","করছে","করছেন","করতে","করবে","করবেন","করলে","করলেন","করা","করাই","করায়","করার","করি","করিতে","করিয়া","করিয়ে","করে","করেই","করেছিলেন","করেছে","করেছেন","করেন","কাউকে","কাছ","কাছে","কাজ","কাজে","কারও","কারণ","কি","কিংবা","কিছু","কিছুই","কিন্তু","কী","কে","কেউ","কেউই","কেখা","কেন","কোটি","কোন","কোনও","কোনো","ক্ষেত্রে","কয়েক","খুব","গিয়ে","গিয়েছে","গিয়ে","গুলি","গেছে","গেল","গেলে","গোটা","চলে","চান","চায়","চার","চালু","চেয়ে","চেষ্টা","ছাড়া","ছাড়াও","ছিল","ছিলেন","জন","জনকে","জনের","জন্য","জন্যওজে","জানতে","জানা","জানানো","জানায়","জানিয়ে","জানিয়েছে","জে","জ্নজন","টি","ঠিক","তখন","তত","তথা","তবু","তবে","তা","তাঁকে","তাঁদের","তাঁর","তাঁরা","তাঁাহারা","তাই","তাও","তাকে","তাতে","তাদের","তার","তারপর","তারা","তারৈ","তাহলে","তাহা","তাহাতে","তাহার","তিনঐ","তিনি","তিনিও","তুমি","তুলে","তেমন","তো","তোমার","থাকবে","থাকবেন","থাকা","থাকায়","থাকে","থাকেন","থেকে","থেকেই","থেকেও","দিকে","দিতে","দিন","দিয়ে","দিয়েছে","দিয়েছেন","দিলেন","দু","দুই","দুটি","দুটো","দেওয়া","দেওয়ার","দেওয়া","দেখতে","দেখা","দেখে","দেন","দেয়","দ্বারা","ধরা","ধরে","ধামার","নতুন","নয়","না","নাই","নাকি","নাগাদ","নানা","নিজে","নিজেই","নিজেদের","নিজের","নিতে","নিয়ে","নিয়ে","নেই","নেওয়া","নেওয়ার","নেওয়া","নয়","পক্ষে","পর","পরে","পরেই","পরেও","পর্যন্ত","পাওয়া","পাচ","পারি","পারে","পারেন","পি","পেয়ে","পেয়্র্","প্রতি","প্রথম","প্রভৃতি","প্রযন্ত","প্রাথমিক","প্রায়","প্রায়","ফলে","ফিরে","ফের","বক্তব্য","বদলে","বন","বরং","বলতে","বলল","বললেন","বলা","বলে","বলেছেন","বলেন","বসে","বহু","বা","বাদে","বার","বি","বিনা","বিভিন্ন","বিশেষ","বিষয়টি","বেশ","বেশি","ব্যবহার","ব্যাপারে","ভাবে","ভাবেই","মতো","মতোই","মধ্যভাগে","মধ্যে","মধ্যেই","মধ্যেও","মনে","মাত্র","মাধ্যমে","মোট","মোটেই","যখন","যত","যতটা","যথেষ্ট","যদি","যদিও","যা","যাঁর","যাঁরা","যাওয়া","যাওয়ার","যাওয়া","যাকে","যাচ্ছে","যাতে","যাদের","যান","যাবে","যায়","যার","যারা","যিনি","যে","যেখানে","যেতে","যেন","যেমন","র","রকম","রয়েছে","রাখা","রেখে","লক্ষ","শুধু","শুরু","সঙ্গে","সঙ্গেও","সব","সবার","সমস্ত","সম্প্রতি","সহ","সহিত","সাধারণ","সামনে","সি","সুতরাং","সে","সেই","সেখান","সেখানে","সেটা","সেটাই","সেটাও","সেটি","স্পষ্ট","স্বয়ং","হইতে","হইবে","হইয়া","হওয়া","হওয়ায়","হওয়ার","হচ্ছে","হত","হতে","হতেই","হন","হবে","হবেন","হয়","হয়তো","হয়নি","হয়ে","হয়েই","হয়েছিল","হয়েছে","হয়েছেন","হল","হলে","হলেই","হলেও","হলো","হাজার","হিসাবে","হৈলে","হোক","হয়"],"br":["'blam","'d","'m","'r","'ta","'vat","'z","'zo","a","a:","aba","abalamour","abaoe","ac'hane","ac'hanoc'h","ac'hanomp","ac'hanon","ac'hanout","adal","adalek","adarre","ae","aec'h","aed","aemp","aen","aent","aes","afe","afec'h","afed","afemp","afen","afent","afes","ag","ah","aimp","aint","aio","aiou","aje","ajec'h","ajed","ajemp","ajen","ajent","ajes","al","alato","alies","aliesañ","alkent","all","allas","allo","allô","am","amañ","amzer","an","anezhañ","anezhe","anezhi","anezho","anvet","aon","aotren","ar","arall","araok","araoki","araozañ","araozo","araozoc'h","araozomp","araozon","araozor","araozout","arbenn","arre","atalek","atav","az","azalek","azirazañ","azirazi","azirazo","azirazoc'h","azirazomp","azirazon","azirazor","azirazout","b:","ba","ba'l","ba'n","ba'r","bad","bah","bal","ban","bar","bastañ","befe","bell","benaos","benn","bennag","bennak","bennozh","bep","bepred","berr","berzh","bet","betek","betra","bev","bevet","bez","bezañ","beze","bezent","bezet","bezh","bezit","bezomp","bihan","bije","biou","biskoazh","blam","bo","boa","bominapl","boudoudom","bouez","boull","boum","bout","bras","brasañ","brav","bravo","bremañ","bres","brokenn","bronn","brrr","brutal","buhezek","c'h:","c'haout","c'he","c'hem","c'herz","c'heñver","c'hichen","c'hiz","c'hoazh","c'horre","c'houde","c'houst","c'hreiz","c'hwec'h","c'hwec'hvet","c'hwezek","c'hwi","ch:","chaous","chik","chit","chom","chut","d'","d'al","d'an","d'ar","d'az","d'e","d'he","d'ho","d'hol","d'hon","d'hor","d'o","d'ober","d'ul","d'un","d'ur","d:","da","dak","daka","dal","dalbezh","dalc'hmat","dalit","damdost","damheñvel","damm","dan","danvez","dao","daol","daonet","daou","daoust","daouzek","daouzekvet","darn","dastrewiñ","dav","davedoc'h","davedomp","davedon","davedor","davedout","davet","davetañ","davete","daveti","daveto","defe","dehou","dek","dekvet","den","deoc'h","deomp","deor","derc'hel","deus","dez","deze","dezhañ","dezhe","dezhi","dezho","di","diabarzh","diagent","diar","diaraok","diavaez","dibaoe","dibaot","dibar","dic'halañ","didiac'h","dienn","difer","diganeoc'h","diganeomp","diganeor","diganimp","diganin","diganit","digant","digantañ","digante","diganti","diganto","digemmesk","diget","digor","digoret","dija","dije","dimp","din","dinaou","dindan","dindanañ","dindani","dindano","dindanoc'h","dindanomp","dindanon","dindanor","dindanout","dioutañ","dioute","diouti","diouto","diouzh","diouzhin","diouzhit","diouzhoc'h","diouzhomp","diouzhor","dirak","dirazañ","dirazi","dirazo","dirazoc'h","dirazomp","dirazon","dirazor","dirazout","disheñvel","dispar","distank","dister","disterañ","disterig","distro","dit","divaez","diwar","diwezhat","diwezhañ","do","doa","doare","dont","dost","doue","douetus","douez","doug","draou","draoñ","dre","drede","dreist","dreistañ","dreisti","dreisto","dreistoc'h","dreistomp","dreiston","dreistor","dreistout","drek","dreñv","dring","dro","du","e","e:","eas","ebet","ec'h","edo","edoc'h","edod","edomp","edon","edont","edos","eer","eeun","efed","egedoc'h","egedomp","egedon","egedor","egedout","eget","egetañ","egete","egeti","egeto","eh","eil","eilvet","eizh","eizhvet","ejoc'h","ejod","ejomp","ejont","ejout","el","em","emaint","emaoc'h","emaomp","emaon","emaout","emañ","eme","emeur","emezañ","emezi","emezo","emezoc'h","emezomp","emezon","emezout","emporzhiañ","en","end","endan","endra","enep","ennañ","enni","enno","ennoc'h","ennomp","ennon","ennor","ennout","enta","eo","eomp","eont","eor","eot","er","erbet","erfin","esa","esae","espar","estlamm","estrañj","eta","etre","etreoc'h","etrezo","etrezoc'h","etrezomp","etrezor","euh","eur","eus","evel","evelato","eveldoc'h","eveldomp","eveldon","eveldor","eveldout","evelkent","eveltañ","evelte","evelti","evelto","evidoc'h","evidomp","evidon","evidor","evidout","evit","evitañ","evite","eviti","evito","ez","eñ","f:","fac'h","fall","fed","feiz","fenn","fezh","fin","finsalvet","foei","fouilhezañ","g:","gallout","ganeoc'h","ganeomp","ganin","ganit","gant","gantañ","ganti","ganto","gaout","gast","gein","gellout","genndost","gentañ","ger","gerz","get","geñver","gichen","gin","giz","glan","gloev","goll","gorre","goude","gouez","gouezit","gouezomp","goulz","gounnar","gour","goust","gouze","gouzout","gra","grak","grec'h","greiz","grenn","greomp","grit","groñs","gutez","gwall","gwashoc'h","gwazh","gwech","gwechall","gwechoù","gwell","gwezh","gwezhall","gwezharall","gwezhoù","gwig","gwirionez","gwitibunan","gêr","h:","ha","hag","han","hanter","hanterc'hantad","hanterkantved","harz","hañ","hañval","he","hebioù","hec'h","hei","hein","hem","hemañ","hen","hend","henhont","henn","hennezh","hent","hep","hervez","hervezañ","hervezi","hervezo","hervezoc'h","hervezomp","hervezon","hervezor","hervezout","heul","heuliañ","hevelep","heverk","heñvel","heñvelat","heñvelañ","heñveliñ","heñveloc'h","heñvelout","hi","hilh","hini","hirie","hirio","hiziv","hiziviken","ho","hoaliñ","hoc'h","hogen","hogos","hogozik","hol","holl","holà","homañ","hon","honhont","honnezh","hont","hop","hopala","hor","hou","houp","hudu","hue","hui","hum","hurrah","i","i:","in","int","is","ispisial","isurzhiet","it","ivez","izelañ","j:","just","k:","kae","kaer","kalon","kalz","kant","kaout","kar","kazi","keid","kein","keit","kel","kellies","keloù","kement","ken","kenkent","kenkoulz","kenment","kent","kentañ","kentizh","kentoc'h","kentre","ker","kerkent","kerz","kerzh","ket","keta","keñver","keñverel","keñverius","kichen","kichenik","kit","kiz","klak","klek","klik","komprenet","komz","kont","korf","korre","koulskoude","koulz","koust","krak","krampouezh","krec'h","kreiz","kuit","kwir","l:","la","laez","laoskel","laouen","lavar","lavaret","lavarout","lec'h","lein","leizh","lerc'h","leun","leuskel","lew","lies","liesañ","lod","lusk","lâr","lârout","m:","ma","ma'z","mac'h","mac'hat","mac'hañ","mac'hoc'h","mad","maez","maksimal","mann","mar","mard","marg","marzh","mat","mañ","me","memes","memestra","merkapl","mersi","mes","mesk","met","meur","mil","minimal","moan","moaniaat","mod","mont","mout","mui","muiañ","muioc'h","n","n'","n:","na","nag","naontek","naturel","nav","navet","ne","nebeudig","nebeut","nebeutañ","nebeutoc'h","neketa","nemedoc'h","nemedomp","nemedon","nemedor","nemedout","nemet","nemetañ","nemete","nemeti","nemeto","nemeur","neoac'h","nepell","nerzh","nes","neseser","netra","neubeudoù","neuhe","neuze","nevez","newazh","nez","ni","nikun","niverus","nul","o","o:","oa","oac'h","oad","oamp","oan","oant","oar","oas","ober","oc'h","oc'ho","oc'hola","oc'hpenn","oh","ohe","ollé","olole","olé","omp","on","ordin","ordinal","ouejoc'h","ouejod","ouejomp","ouejont","ouejout","ouek","ouezas","ouezi","ouezimp","ouezin","ouezint","ouezis","ouezo","ouezoc'h","ouezor","ouf","oufe","oufec'h","oufed","oufemp","oufen","oufent","oufes","ouie","ouiec'h","ouied","ouiemp","ouien","ouient","ouies","ouije","ouijec'h","ouijed","ouijemp","ouijen","ouijent","ouijes","out","outañ","outi","outo","ouzer","ouzh","ouzhin","ouzhit","ouzhoc'h","ouzhomp","ouzhor","ouzhpenn","ouzhpennik","ouzoc'h","ouzomp","ouzon","ouzont","ouzout","p'","p:","pa","pad","padal","paf","pan","panevedeoc'h","panevedo","panevedomp","panevedon","panevedout","panevet","panevetañ","paneveti","pas","paseet","pe","peadra","peder","pedervet","pedervetvet","pefe","pegeit","pegement","pegen","pegiz","pegoulz","pehini","pelec'h","pell","pemod","pemp","pempved","pemzek","penaos","penn","peogwir","peotramant","pep","perak","perc'hennañ","pergen","permetiñ","peseurt","pet","petiaoul","petoare","petra","peur","peurgetket","peurheñvel","peurliesañ","peurvuiañ","peus","peustost","peuz","pevar","pevare","pevarevet","pevarzek","pez","peze","pezh","pff","pfft","pfut","picher","pif","pife","pign","pije","pikol","pitiaoul","piv","plaouf","plok","plouf","po","poa","poelladus","pof","pok","posupl","pouah","pourc'henn","prest","prestik","prim","prin","provostapl","pst","pu","pur","r:","ra","rae","raec'h","raed","raemp","raen","raent","raes","rafe","rafec'h","rafed","rafemp","rafen","rafent","rafes","rag","raimp","raint","raio","raje","rajec'h","rajed","rajemp","rajen","rajent","rajes","rak","ral","ran","rankout","raok","razh","re","reas","reer","regennoù","reiñ","rejoc'h","rejod","rejomp","rejont","rejout","rener","rentañ","reoc'h","reomp","reont","reor","reot","resis","ret","reve","rez","ri","rik","rin","ris","rit","rouez","s:","sac'h","sant","sav","sañset","se","sed","seitek","seizh","seizhvet","sell","sellit","ser","setu","seul","seurt","siwazh","skignañ","skoaz","skouer","sort","souden","souvitañ","soñj","speriañ","spririñ","stad","stlabezañ","stop","stranañ","strewiñ","strishaat","stumm","sujed","surtoud","t:","ta","taer","tailh","tak","tal","talvoudegezh","tamm","tanav","taol","te","techet","teir","teirvet","telt","teltenn","teus","teut","teuteu","ti","tik","toa","tok","tost","tostig","toud","touesk","touez","toull","tra","trantenn","traoñ","trawalc'h","tre","trede","tregont","tremenet","tri","trivet","triwec'h","trizek","tro","trugarez","trumm","tsoin","tsouin","tu","tud","u:","ugent","uhel","uhelañ","ul","un","unan","unanez","unanig","unnek","unnekvet","ur","urzh","us","v:","va","vale","van","vare","vat","vefe","vefec'h","vefed","vefemp","vefen","vefent","vefes","vesk","vete","vez","vezan","vezañ","veze","vezec'h","vezed","vezemp","vezen","vezent","vezer","vezes","vezez","vezit","vezomp","vezont","vi","vihan","vihanañ","vije","vijec'h","vijed","vijemp","vijen","vijent","vijes","viken","vimp","vin","vint","vior","viot","virviken","viskoazh","vlan","vlaou","vo","vod","voe","voec'h","voed","voemp","voen","voent","voes","vont","vostapl","vrac'h","vrasañ","vremañ","w:","walc'h","war","warnañ","warni","warno","warnoc'h","warnomp","warnon","warnor","warnout","wazh","wech","wechoù","well","y:","you","youadenn","youc'hadenn","youc'hou","z:","za","zan","zaw","zeu","zi","ziar","zigarez","ziget","zindan","zioc'h","ziouzh","zirak","zivout","ziwar","ziwezhañ","zo","zoken","zokenoc'h","zouesk","zouez","zro","zu"],"bg":["а","автентичен","аз","ако","ала","бе","без","беше","би","бивш","бивша","бившо","бил","била","били","било","благодаря","близо","бъдат","бъде","бяха","в","вас","ваш","ваша","вероятно","вече","взема","ви","вие","винаги","внимава","време","все","всеки","всички","всичко","всяка","във","въпреки","върху","г","ги","главен","главна","главно","глас","го","година","години","годишен","д","да","дали","два","двама","двамата","две","двете","ден","днес","дни","до","добра","добре","добро","добър","докато","докога","дори","досега","доста","друг","друга","други","е","евтин","едва","един","една","еднаква","еднакви","еднакъв","едно","екип","ето","живот","за","забавям","зад","заедно","заради","засега","заспал","затова","защо","защото","и","из","или","им","има","имат","иска","й","каза","как","каква","какво","както","какъв","като","кога","когато","което","които","кой","който","колко","която","къде","където","към","лесен","лесно","ли","лош","м","май","малко","ме","между","мек","мен","месец","ми","много","мнозина","мога","могат","може","мокър","моля","момента","му","н","на","над","назад","най","направи","напред","например","нас","не","него","нещо","нея","ни","ние","никой","нито","нищо","но","нов","нова","нови","новина","някои","някой","няколко","няма","обаче","около","освен","особено","от","отгоре","отново","още","пак","по","повече","повечето","под","поне","поради","после","почти","прави","пред","преди","през","при","пък","първата","първи","първо","пъти","равен","равна","с","са","сам","само","се","сега","си","син","скоро","след","следващ","сме","смях","според","сред","срещу","сте","съм","със","също","т","т.н.","тази","така","такива","такъв","там","твой","те","тези","ти","то","това","тогава","този","той","толкова","точно","три","трябва","тук","тъй","тя","тях","у","утре","харесва","хиляди","ч","часа","че","често","чрез","ще","щом","юмрук","я","як"],"ca":["a","abans","ací","ah","així","això","al","aleshores","algun","alguna","algunes","alguns","alhora","allà","allí","allò","als","altra","altre","altres","amb","ambdues","ambdós","anar","ans","apa","aquell","aquella","aquelles","aquells","aquest","aquesta","aquestes","aquests","aquí","baix","bastant","bé","cada","cadascuna","cadascunes","cadascuns","cadascú","com","consegueixo","conseguim","conseguir","consigueix","consigueixen","consigueixes","contra","d'un","d'una","d'unes","d'uns","dalt","de","del","dels","des","des de","després","dins","dintre","donat","doncs","durant","e","eh","el","elles","ells","els","em","en","encara","ens","entre","era","erem","eren","eres","es","esta","estan","estat","estava","estaven","estem","esteu","estic","està","estàvem","estàveu","et","etc","ets","fa","faig","fan","fas","fem","fer","feu","fi","fins","fora","gairebé","ha","han","has","haver","havia","he","hem","heu","hi","ho","i","igual","iguals","inclòs","ja","jo","l'hi","la","les","li","li'n","llarg","llavors","m'he","ma","mal","malgrat","mateix","mateixa","mateixes","mateixos","me","mentre","meu","meus","meva","meves","mode","molt","molta","moltes","molts","mon","mons","més","n'he","n'hi","ne","ni","no","nogensmenys","només","nosaltres","nostra","nostre","nostres","o","oh","oi","on","pas","pel","pels","per","per que","perquè","però","poc","poca","pocs","podem","poden","poder","podeu","poques","potser","primer","propi","puc","qual","quals","quan","quant","que","quelcom","qui","quin","quina","quines","quins","què","s'ha","s'han","sa","sabem","saben","saber","sabeu","sap","saps","semblant","semblants","sense","ser","ses","seu","seus","seva","seves","si","sobre","sobretot","soc","solament","sols","som","son","sons","sota","sou","sóc","són","t'ha","t'han","t'he","ta","tal","també","tampoc","tan","tant","tanta","tantes","te","tene","tenim","tenir","teniu","teu","teus","teva","teves","tinc","ton","tons","tot","tota","totes","tots","un","una","unes","uns","us","va","vaig","vam","van","vas","veu","vosaltres","vostra","vostre","vostres","érem","éreu","és","éssent","últim","ús"],"zh":["、","。","〈","〉","《","》","一","一个","一些","一何","一切","一则","一方面","一旦","一来","一样","一种","一般","一转眼","七","万一","三","上","上下","下","不","不仅","不但","不光","不单","不只","不外乎","不如","不妨","不尽","不尽然","不得","不怕","不惟","不成","不拘","不料","不是","不比","不然","不特","不独","不管","不至于","不若","不论","不过","不问","与","与其","与其说","与否","与此同时","且","且不说","且说","两者","个","个别","中","临","为","为了","为什么","为何","为止","为此","为着","乃","乃至","乃至于","么","之","之一","之所以","之类","乌乎","乎","乘","九","也","也好","也罢","了","二","二来","于","于是","于是乎","云云","云尔","五","些","亦","人","人们","人家","什","什么","什么样","今","介于","仍","仍旧","从","从此","从而","他","他人","他们","他们们","以","以上","以为","以便","以免","以及","以故","以期","以来","以至","以至于","以致","们","任","任何","任凭","会","似的","但","但凡","但是","何","何以","何况","何处","何时","余外","作为","你","你们","使","使得","例如","依","依据","依照","便于","俺","俺们","倘","倘使","倘或","倘然","倘若","借","借傥然","假使","假如","假若","做","像","儿","先不先","光","光是","全体","全部","八","六","兮","共","关于","关于具体地说","其","其一","其中","其二","其他","其余","其它","其次","具体地说","具体说来","兼之","内","再","再其次","再则","再有","再者","再者说","再说","冒","冲","况且","几","几时","凡","凡是","凭","凭借","出于","出来","分","分别","则","则甚","别","别人","别处","别是","别的","别管","别说","到","前后","前此","前者","加之","加以","区","即","即令","即使","即便","即如","即或","即若","却","去","又","又及","及","及其","及至","反之","反而","反过来","反过来说","受到","另","另一方面","另外","另悉","只","只当","只怕","只是","只有","只消","只要","只限","叫","叮咚","可","可以","可是","可见","各","各个","各位","各种","各自","同","同时","后","后者","向","向使","向着","吓","吗","否则","吧","吧哒","含","吱","呀","呃","呕","呗","呜","呜呼","呢","呵","呵呵","呸","呼哧","咋","和","咚","咦","咧","咱","咱们","咳","哇","哈","哈哈","哉","哎","哎呀","哎哟","哗","哟","哦","哩","哪","哪个","哪些","哪儿","哪天","哪年","哪怕","哪样","哪边","哪里","哼","哼唷","唉","唯有","啊","啐","啥","啦","啪达","啷当","喂","喏","喔唷","喽","嗡","嗡嗡","嗬","嗯","嗳","嘎","嘎登","嘘","嘛","嘻","嘿","嘿嘿","四","因","因为","因了","因此","因着","因而","固然","在","在下","在于","地","基于","处在","多","多么","多少","大","大家","她","她们","好","如","如上","如上所述","如下","如何","如其","如同","如是","如果","如此","如若","始而","孰料","孰知","宁","宁可","宁愿","宁肯","它","它们","对","对于","对待","对方","对比","将","小","尔","尔后","尔尔","尚且","就","就是","就是了","就是说","就算","就要","尽","尽管","尽管如此","岂但","己","已","已矣","巴","巴巴","年","并","并且","庶乎","庶几","开外","开始","归","归齐","当","当地","当然","当着","彼","彼时","彼此","往","待","很","得","得了","怎","怎么","怎么办","怎么样","怎奈","怎样","总之","总的来看","总的来说","总的说来","总而言之","恰恰相反","您","惟其","慢说","我","我们","或","或则","或是","或曰","或者","截至","所","所以","所在","所幸","所有","才","才能","打","打从","把","抑或","拿","按","按照","换句话说","换言之","据","据此","接着","故","故此","故而","旁人","无","无宁","无论","既","既往","既是","既然","日","时","时候","是","是以","是的","更","曾","替","替代","最","月","有","有些","有关","有及","有时","有的","望","朝","朝着","本","本人","本地","本着","本身","来","来着","来自","来说","极了","果然","果真","某","某个","某些","某某","根据","欤","正值","正如","正巧","正是","此","此地","此处","此外","此时","此次","此间","毋宁","每","每当","比","比及","比如","比方","没奈何","沿","沿着","漫说","点","焉","然则","然后","然而","照","照着","犹且","犹自","甚且","甚么","甚或","甚而","甚至","甚至于","用","用来","由","由于","由是","由此","由此可见","的","的确","的话","直到","相对而言","省得","看","眨眼","着","着呢","矣","矣乎","矣哉","离","秒","称","竟而","第","等","等到","等等","简言之","管","类如","紧接着","纵","纵令","纵使","纵然","经","经过","结果","给","继之","继后","继而","综上所述","罢了","者","而","而且","而况","而后","而外","而已","而是","而言","能","能否","腾","自","自个儿","自从","自各儿","自后","自家","自己","自打","自身","至","至于","至今","至若","致","般的","若","若夫","若是","若果","若非","莫不然","莫如","莫若","虽","虽则","虽然","虽说","被","要","要不","要不是","要不然","要么","要是","譬喻","譬如","让","许多","论","设使","设或","设若","诚如","诚然","该","说","说来","请","诸","诸位","诸如","谁","谁人","谁料","谁知","贼死","赖以","赶","起","起见","趁","趁着","越是","距","跟","较","较之","边","过","还","还是","还有","还要","这","这一来","这个","这么","这么些","这么样","这么点儿","这些","这会儿","这儿","这就是说","这时","这样","这次","这般","这边","这里","进而","连","连同","逐步","通过","遵循","遵照","那","那个","那么","那么些","那么样","那些","那会儿","那儿","那时","那样","那般","那边","那里","都","鄙人","鉴于","针对","阿","除","除了","除外","除开","除此之外","除非","随","随后","随时","随着","难道说","零","非","非但","非徒","非特","非独","靠","顺","顺着","首先","︿","！","＃","＄","％","＆","（","）","＊","＋","，","０","１","２","３","４","５","６","７","８","９","：","；","＜","＞","？","＠","［","］","｛","｜","｝","～","￥"],"hr":["a","ako","ali","bi","bih","bila","bili","bilo","bio","bismo","biste","biti","bumo","da","do","duž","ga","hoće","hoćemo","hoćete","hoćeš","hoću","i","iako","ih","ili","iz","ja","je","jedna","jedne","jedno","jer","jesam","jesi","jesmo","jest","jeste","jesu","jim","joj","još","ju","kada","kako","kao","koja","koje","koji","kojima","koju","kroz","li","me","mene","meni","mi","mimo","moj","moja","moje","mu","na","nad","nakon","nam","nama","nas","naš","naša","naše","našeg","ne","nego","neka","neki","nekog","neku","nema","netko","neće","nećemo","nećete","nećeš","neću","nešto","ni","nije","nikoga","nikoje","nikoju","nisam","nisi","nismo","niste","nisu","njega","njegov","njegova","njegovo","njemu","njezin","njezina","njezino","njih","njihov","njihova","njihovo","njim","njima","njoj","nju","no","o","od","odmah","on","ona","oni","ono","ova","pa","pak","po","pod","pored","prije","s","sa","sam","samo","se","sebe","sebi","si","smo","ste","su","sve","svi","svog","svoj","svoja","svoje","svom","ta","tada","taj","tako","te","tebe","tebi","ti","to","toj","tome","tu","tvoj","tvoja","tvoje","u","uz","vam","vama","vas","vaš","vaša","vaše","već","vi","vrlo","za","zar","će","ćemo","ćete","ćeš","ću","što"],"cs":["a","aby","ahoj","aj","ale","anebo","ani","aniž","ano","asi","aspoň","atd","atp","az","ačkoli","až","bez","beze","blízko","bohužel","brzo","bude","budem","budeme","budes","budete","budeš","budou","budu","by","byl","byla","byli","bylo","byly","bys","byt","být","během","chce","chceme","chcete","chceš","chci","chtít","chtějí","chut'","chuti","ci","clanek","clanku","clanky","co","coz","což","cz","daleko","dalsi","další","den","deset","design","devatenáct","devět","dnes","do","dobrý","docela","dva","dvacet","dvanáct","dvě","dál","dále","děkovat","děkujeme","děkuji","email","ho","hodně","i","jak","jakmile","jako","jakož","jde","je","jeden","jedenáct","jedna","jedno","jednou","jedou","jeho","jehož","jej","jeji","jejich","její","jelikož","jemu","jen","jenom","jenž","jeste","jestli","jestliže","ještě","jež","ji","jich","jimi","jinak","jine","jiné","jiz","již","jsem","jses","jseš","jsi","jsme","jsou","jste","já","jí","jím","jíž","jšte","k","kam","každý","kde","kdo","kdy","kdyz","když","ke","kolik","kromě","ktera","ktere","kteri","kterou","ktery","která","které","který","kteři","kteří","ku","kvůli","ma","mají","mate","me","mezi","mi","mit","mne","mnou","mně","moc","mohl","mohou","moje","moji","možná","muj","musí","muze","my","má","málo","mám","máme","máte","máš","mé","mí","mít","mě","můj","může","na","nad","nade","nam","napiste","napište","naproti","nas","nasi","načež","naše","naši","ne","nebo","nebyl","nebyla","nebyli","nebyly","nechť","nedělají","nedělá","nedělám","neděláme","neděláte","neděláš","neg","nejsi","nejsou","nemají","nemáme","nemáte","neměl","neni","není","nestačí","nevadí","nez","než","nic","nich","nimi","nove","novy","nové","nový","nula","ná","nám","námi","nás","náš","ní","ním","ně","něco","nějak","někde","někdo","němu","němuž","o","od","ode","on","ona","oni","ono","ony","osm","osmnáct","pak","patnáct","po","pod","podle","pokud","potom","pouze","pozdě","pořád","prave","pravé","pred","pres","pri","pro","proc","prostě","prosím","proti","proto","protoze","protože","proč","prvni","první","práve","pta","pět","před","přede","přes","přese","při","přičemž","re","rovně","s","se","sedm","sedmnáct","si","sice","skoro","smí","smějí","snad","spolu","sta","sto","strana","sté","sve","svych","svym","svymi","své","svých","svým","svými","svůj","ta","tady","tak","take","takhle","taky","takze","také","takže","tam","tamhle","tamhleto","tamto","tato","te","tebe","tebou","ted'","tedy","tema","ten","tento","teto","ti","tim","timto","tipy","tisíc","tisíce","to","tobě","tohle","toho","tohoto","tom","tomto","tomu","tomuto","toto","trošku","tu","tuto","tvoje","tvá","tvé","tvůj","ty","tyto","téma","této","tím","tímto","tě","těm","těma","těmu","třeba","tři","třináct","u","určitě","uz","už","v","vam","vas","vase","vaše","vaši","ve","vedle","večer","vice","vlastně","vsak","vy","vám","vámi","vás","váš","více","však","všechen","všechno","všichni","vůbec","vždy","z","za","zatímco","zač","zda","zde","ze","zpet","zpravy","zprávy","zpět","čau","či","článek","článku","články","čtrnáct","čtyři","šest","šestnáct","že"],"da":["ad","af","aldrig","alle","alt","anden","andet","andre","at","bare","begge","blev","blive","bliver","da","de","dem","den","denne","der","deres","det","dette","dig","din","dine","disse","dit","dog","du","efter","ej","eller","en","end","ene","eneste","enhver","er","et","far","fem","fik","fire","flere","fleste","for","fordi","forrige","fra","få","får","før","god","godt","ham","han","hans","har","havde","have","hej","helt","hende","hendes","her","hos","hun","hvad","hvem","hver","hvilken","hvis","hvor","hvordan","hvorfor","hvornår","i","ikke","ind","ingen","intet","ja","jeg","jer","jeres","jo","kan","kom","komme","kommer","kun","kunne","lad","lav","lidt","lige","lille","man","mand","mange","med","meget","men","mens","mere","mig","min","mine","mit","mod","må","ned","nej","ni","nogen","noget","nogle","nu","ny","nyt","når","nær","næste","næsten","og","også","okay","om","op","os","otte","over","på","se","seks","selv","ser","ses","sig","sige","sin","sine","sit","skal","skulle","som","stor","store","syv","så","sådan","tag","tage","thi","ti","til","to","tre","ud","under","var","ved","vi","vil","ville","vor","vores","være","været"],"nl":["aan","aangaande","aangezien","achte","achter","achterna","af","afgelopen","al","aldaar","aldus","alhoewel","alias","alle","allebei","alleen","alles","als","alsnog","altijd","altoos","ander","andere","anders","anderszins","beetje","behalve","behoudens","beide","beiden","ben","beneden","bent","bepaald","betreffende","bij","bijna","bijv","binnen","binnenin","blijkbaar","blijken","boven","bovenal","bovendien","bovengenoemd","bovenstaand","bovenvermeld","buiten","bv","daar","daardoor","daarheen","daarin","daarna","daarnet","daarom","daarop","daaruit","daarvanlangs","dan","dat","de","deden","deed","der","derde","derhalve","dertig","deze","dhr","die","dikwijls","dit","doch","doe","doen","doet","door","doorgaand","drie","duizend","dus","echter","een","eens","eer","eerdat","eerder","eerlang","eerst","eerste","eigen","eigenlijk","elk","elke","en","enig","enige","enigszins","enkel","er","erdoor","erg","ergens","etc","etcetera","even","eveneens","evenwel","gauw","ge","gedurende","geen","gehad","gekund","geleden","gelijk","gemoeten","gemogen","genoeg","geweest","gewoon","gewoonweg","haar","haarzelf","had","hadden","hare","heb","hebben","hebt","hedden","heeft","heel","hem","hemzelf","hen","het","hetzelfde","hier","hierbeneden","hierboven","hierin","hierna","hierom","hij","hijzelf","hoe","hoewel","honderd","hun","hunne","ieder","iedere","iedereen","iemand","iets","ik","ikzelf","in","inderdaad","inmiddels","intussen","inzake","is","ja","je","jezelf","jij","jijzelf","jou","jouw","jouwe","juist","jullie","kan","klaar","kon","konden","krachtens","kun","kunnen","kunt","laatst","later","liever","lijken","lijkt","maak","maakt","maakte","maakten","maar","mag","maken","me","meer","meest","meestal","men","met","mevr","mezelf","mij","mijn","mijnent","mijner","mijzelf","minder","miss","misschien","missen","mits","mocht","mochten","moest","moesten","moet","moeten","mogen","mr","mrs","mw","na","naar","nadat","nam","namelijk","nee","neem","negen","nemen","nergens","net","niemand","niet","niets","niks","noch","nochtans","nog","nogal","nooit","nu","nv","of","ofschoon","om","omdat","omhoog","omlaag","omstreeks","omtrent","omver","ondanks","onder","ondertussen","ongeveer","ons","onszelf","onze","onzeker","ooit","ook","op","opnieuw","opzij","over","overal","overeind","overige","overigens","paar","pas","per","precies","recent","redelijk","reeds","rond","rondom","samen","sedert","sinds","sindsdien","slechts","sommige","spoedig","steeds","tamelijk","te","tegen","tegenover","tenzij","terwijl","thans","tien","tiende","tijdens","tja","toch","toe","toen","toenmaals","toenmalig","tot","totdat","tussen","twee","tweede","u","uit","uitgezonderd","uw","vaak","vaakwat","van","vanaf","vandaan","vanuit","vanwege","veel","veeleer","veertig","verder","verscheidene","verschillende","vervolgens","via","vier","vierde","vijf","vijfde","vijftig","vol","volgend","volgens","voor","vooraf","vooral","vooralsnog","voorbij","voordat","voordezen","voordien","voorheen","voorop","voorts","vooruit","vrij","vroeg","waar","waarom","waarschijnlijk","wanneer","want","waren","was","wat","we","wederom","weer","weg","wegens","weinig","wel","weldra","welk","welke","werd","werden","werder","wezen","whatever","wie","wiens","wier","wij","wijzelf","wil","wilden","willen","word","worden","wordt","zal","ze","zei","zeker","zelf","zelfde","zelfs","zes","zeven","zich","zichzelf","zij","zijn","zijne","zijzelf","zo","zoals","zodat","zodra","zonder","zou","zouden","zowat","zulk","zulke","zullen","zult"],"en":["'ll","'tis","'twas","'ve","10","39","a","a's","able","ableabout","about","above","abroad","abst","accordance","according","accordingly","across","act","actually","ad","added","adj","adopted","ae","af","affected","affecting","affects","after","afterwards","ag","again","against","ago","ah","ahead","ai","ain't","aint","al","all","allow","allows","almost","alone","along","alongside","already","also","although","always","am","amid","amidst","among","amongst","amoungst","amount","an","and","announce","another","any","anybody","anyhow","anymore","anyone","anything","anyway","anyways","anywhere","ao","apart","apparently","appear","appreciate","appropriate","approximately","aq","ar","are","area","areas","aren","aren't","arent","arise","around","arpa","as","aside","ask","asked","asking","asks","associated","at","au","auth","available","aw","away","awfully","az","b","ba","back","backed","backing","backs","backward","backwards","bb","bd","be","became","because","become","becomes","becoming","been","before","beforehand","began","begin","beginning","beginnings","begins","behind","being","beings","believe","below","beside","besides","best","better","between","beyond","bf","bg","bh","bi","big","bill","billion","biol","bj","bm","bn","bo","both","bottom","br","brief","briefly","bs","bt","but","buy","bv","bw","by","bz","c","c'mon","c's","ca","call","came","can","can't","cannot","cant","caption","case","cases","cause","causes","cc","cd","certain","certainly","cf","cg","ch","changes","ci","ck","cl","clear","clearly","click","cm","cmon","cn","co","co.","com","come","comes","computer","con","concerning","consequently","consider","considering","contain","containing","contains","copy","corresponding","could","could've","couldn","couldn't","couldnt","course","cr","cry","cs","cu","currently","cv","cx","cy","cz","d","dare","daren't","darent","date","de","dear","definitely","describe","described","despite","detail","did","didn","didn't","didnt","differ","different","differently","directly","dj","dk","dm","do","does","doesn","doesn't","doesnt","doing","don","don't","done","dont","doubtful","down","downed","downing","downs","downwards","due","during","dz","e","each","early","ec","ed","edu","ee","effect","eg","eh","eight","eighty","either","eleven","else","elsewhere","empty","end","ended","ending","ends","enough","entirely","er","es","especially","et","et-al","etc","even","evenly","ever","evermore","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","f","face","faces","fact","facts","fairly","far","farther","felt","few","fewer","ff","fi","fifteen","fifth","fifty","fify","fill","find","finds","fire","first","five","fix","fj","fk","fm","fo","followed","following","follows","for","forever","former","formerly","forth","forty","forward","found","four","fr","free","from","front","full","fully","further","furthered","furthering","furthermore","furthers","fx","g","ga","gave","gb","gd","ge","general","generally","get","gets","getting","gf","gg","gh","gi","give","given","gives","giving","gl","gm","gmt","gn","go","goes","going","gone","good","goods","got","gotten","gov","gp","gq","gr","great","greater","greatest","greetings","group","grouped","grouping","groups","gs","gt","gu","gw","gy","h","had","hadn't","hadnt","half","happens","hardly","has","hasn","hasn't","hasnt","have","haven","haven't","havent","having","he","he'd","he'll","he's","hed","hell","hello","help","hence","her","here","here's","hereafter","hereby","herein","heres","hereupon","hers","herself","herse”","hes","hi","hid","high","higher","highest","him","himself","himse”","his","hither","hk","hm","hn","home","homepage","hopefully","how","how'd","how'll","how's","howbeit","however","hr","ht","htm","html","http","hu","hundred","i","i'd","i'll","i'm","i've","i.e.","id","ie","if","ignored","ii","il","ill","im","immediate","immediately","importance","important","in","inasmuch","inc","inc.","indeed","index","indicate","indicated","indicates","information","inner","inside","insofar","instead","int","interest","interested","interesting","interests","into","invention","inward","io","iq","ir","is","isn","isn't","isnt","it","it'd","it'll","it's","itd","itll","its","itself","itse”","ive","j","je","jm","jo","join","jp","just","k","ke","keep","keeps","kept","keys","kg","kh","ki","kind","km","kn","knew","know","known","knows","kp","kr","kw","ky","kz","l","la","large","largely","last","lately","later","latest","latter","latterly","lb","lc","least","length","less","lest","let","let's","lets","li","like","liked","likely","likewise","line","little","lk","ll","long","longer","longest","look","looking","looks","low","lower","lr","ls","lt","ltd","lu","lv","ly","m","ma","made","mainly","make","makes","making","man","many","may","maybe","mayn't","maynt","mc","md","me","mean","means","meantime","meanwhile","member","members","men","merely","mg","mh","microsoft","might","might've","mightn't","mightnt","mil","mill","million","mine","minus","miss","mk","ml","mm","mn","mo","more","moreover","most","mostly","move","mp","mq","mr","mrs","ms","msie","mt","mu","much","mug","must","must've","mustn't","mustnt","mv","mw","mx","my","myself","myse”","mz","n","na","name","namely","nay","nc","nd","ne","near","nearly","necessarily","necessary","need","needed","needing","needn't","neednt","needs","neither","net","netscape","never","neverf","neverless","nevertheless","new","newer","newest","next","nf","ng","ni","nine","ninety","nl","no","no-one","nobody","non","none","nonetheless","noone","nor","normally","nos","not","noted","nothing","notwithstanding","novel","now","nowhere","np","nr","nu","null","number","numbers","nz","o","obtain","obtained","obviously","of","off","often","oh","ok","okay","old","older","oldest","om","omitted","on","once","one","one's","ones","only","onto","open","opened","opening","opens","opposite","or","ord","order","ordered","ordering","orders","org","other","others","otherwise","ought","oughtn't","oughtnt","our","ours","ourselves","out","outside","over","overall","owing","own","p","pa","page","pages","part","parted","particular","particularly","parting","parts","past","pe","per","perhaps","pf","pg","ph","pk","pl","place","placed","places","please","plus","pm","pmid","pn","point","pointed","pointing","points","poorly","possible","possibly","potentially","pp","pr","predominantly","present","presented","presenting","presents","presumably","previously","primarily","probably","problem","problems","promptly","proud","provided","provides","pt","put","puts","pw","py","q","qa","que","quickly","quite","qv","r","ran","rather","rd","re","readily","really","reasonably","recent","recently","ref","refs","regarding","regardless","regards","related","relatively","research","reserved","respectively","resulted","resulting","results","right","ring","ro","room","rooms","round","ru","run","rw","s","sa","said","same","saw","say","saying","says","sb","sc","sd","se","sec","second","secondly","seconds","section","see","seeing","seem","seemed","seeming","seems","seen","sees","self","selves","sensible","sent","serious","seriously","seven","seventy","several","sg","sh","shall","shan't","shant","she","she'd","she'll","she's","shed","shell","shes","should","should've","shouldn","shouldn't","shouldnt","show","showed","showing","shown","showns","shows","si","side","sides","significant","significantly","similar","similarly","since","sincere","site","six","sixty","sj","sk","sl","slightly","sm","small","smaller","smallest","sn","so","some","somebody","someday","somehow","someone","somethan","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specifically","specified","specify","specifying","sr","st","state","states","still","stop","strongly","su","sub","substantially","successfully","such","sufficiently","suggest","sup","sure","sv","sy","system","sz","t","t's","take","taken","taking","tc","td","tell","ten","tends","test","text","tf","tg","th","than","thank","thanks","thanx","that","that'll","that's","that've","thatll","thats","thatve","the","their","theirs","them","themselves","then","thence","there","there'd","there'll","there're","there's","there've","thereafter","thereby","thered","therefore","therein","therell","thereof","therere","theres","thereto","thereupon","thereve","these","they","they'd","they'll","they're","they've","theyd","theyll","theyre","theyve","thick","thin","thing","things","think","thinks","third","thirty","this","thorough","thoroughly","those","thou","though","thoughh","thought","thoughts","thousand","three","throug","through","throughout","thru","thus","til","till","tip","tis","tj","tk","tm","tn","to","today","together","too","took","top","toward","towards","tp","tr","tried","tries","trillion","truly","try","trying","ts","tt","turn","turned","turning","turns","tv","tw","twas","twelve","twenty","twice","two","tz","u","ua","ug","uk","um","un","under","underneath","undoing","unfortunately","unless","unlike","unlikely","until","unto","up","upon","ups","upwards","us","use","used","useful","usefully","usefulness","uses","using","usually","uucp","uy","uz","v","va","value","various","vc","ve","versus","very","vg","vi","via","viz","vn","vol","vols","vs","vu","w","want","wanted","wanting","wants","was","wasn","wasn't","wasnt","way","ways","we","we'd","we'll","we're","we've","web","webpage","website","wed","welcome","well","wells","went","were","weren","weren't","werent","weve","wf","what","what'd","what'll","what's","what've","whatever","whatll","whats","whatve","when","when'd","when'll","when's","whence","whenever","where","where'd","where'll","where's","whereafter","whereas","whereby","wherein","wheres","whereupon","wherever","whether","which","whichever","while","whilst","whim","whither","who","who'd","who'll","who's","whod","whoever","whole","wholl","whom","whomever","whos","whose","why","why'd","why'll","why's","widely","width","will","willing","wish","with","within","without","won","won't","wonder","wont","words","work","worked","working","works","world","would","would've","wouldn","wouldn't","wouldnt","ws","www","x","y","ye","year","years","yes","yet","you","you'd","you'll","you're","you've","youd","youll","young","younger","youngest","your","youre","yours","yourself","yourselves","youve","yt","yu","z","za","zero","zm","zr"],"eo":["adiaŭ","ajn","al","ankoraŭ","antaŭ","aŭ","bonan","bonvole","bonvolu","bv","ci","cia","cian","cin","d-ro","da","de","dek","deka","do","doktor'","doktoro","du","dua","dum","eble","ekz","ekzemple","en","estas","estis","estos","estu","estus","eĉ","f-no","feliĉan","for","fraŭlino","ha","havas","havis","havos","havu","havus","he","ho","hu","ili","ilia","ilian","ilin","inter","io","ion","iu","iujn","iun","ja","jam","je","jes","k","kaj","ke","kio","kion","kiu","kiujn","kiun","kvankam","kvar","kvara","kvazaŭ","kvin","kvina","la","li","lia","lian","lin","malantaŭ","male","malgraŭ","mem","mi","mia","mian","min","minus","naŭ","naŭa","ne","nek","nenio","nenion","neniu","neniun","nepre","ni","nia","nian","nin","nu","nun","nur","ok","oka","oni","onia","onian","onin","plej","pli","plu","plus","por","post","preter","s-no","s-ro","se","sed","sep","sepa","ses","sesa","si","sia","sian","sin","sinjor'","sinjorino","sinjoro","sub","super","supren","sur","tamen","tio","tion","tiu","tiujn","tiun","tra","tri","tria","tuj","tute","unu","unua","ve","verŝajne","vi","via","vian","vin","ĉi","ĉio","ĉion","ĉiu","ĉiujn","ĉiun","ĉu","ĝi","ĝia","ĝian","ĝin","ĝis","ĵus","ŝi","ŝia","ŝin"],"et":["aga","ei","et","ja","jah","kas","kui","kõik","ma","me","mida","midagi","mind","minu","mis","mu","mul","mulle","nad","nii","oled","olen","oli","oma","on","pole","sa","seda","see","selle","siin","siis","ta","te","ära"],"fi":["aiemmin","aika","aikaa","aikaan","aikaisemmin","aikaisin","aikajen","aikana","aikoina","aikoo","aikovat","aina","ainakaan","ainakin","ainoa","ainoat","aiomme","aion","aiotte","aist","aivan","ajan","alas","alemmas","alkuisin","alkuun","alla","alle","aloitamme","aloitan","aloitat","aloitatte","aloitattivat","aloitettava","aloitettevaksi","aloitettu","aloitimme","aloitin","aloitit","aloititte","aloittaa","aloittamatta","aloitti","aloittivat","alta","aluksi","alussa","alusta","annettavaksi","annetteva","annettu","ansiosta","antaa","antamatta","antoi","aoua","apu","asia","asiaa","asian","asiasta","asiat","asioiden","asioihin","asioita","asti","avuksi","avulla","avun","avutta","edelle","edelleen","edellä","edeltä","edemmäs","edes","edessä","edestä","ehkä","ei","eikä","eilen","eivät","eli","ellei","elleivät","ellemme","ellen","ellet","ellette","emme","en","enemmän","eniten","ennen","ensi","ensimmäinen","ensimmäiseksi","ensimmäisen","ensimmäisenä","ensimmäiset","ensimmäisiksi","ensimmäisinä","ensimmäisiä","ensimmäistä","ensin","entinen","entisen","entisiä","entisten","entistä","enää","eri","erittäin","erityisesti","eräiden","eräs","eräät","esi","esiin","esillä","esimerkiksi","et","eteen","etenkin","etessa","ette","ettei","että","haikki","halua","haluaa","haluamatta","haluamme","haluan","haluat","haluatte","haluavat","halunnut","halusi","halusimme","halusin","halusit","halusitte","halusivat","halutessa","haluton","he","hei","heidän","heidät","heihin","heille","heillä","heiltä","heissä","heistä","heitä","helposti","heti","hetkellä","hieman","hitaasti","hoikein","huolimatta","huomenna","hyvien","hyviin","hyviksi","hyville","hyviltä","hyvin","hyvinä","hyvissä","hyvistä","hyviä","hyvä","hyvät","hyvää","hän","häneen","hänelle","hänellä","häneltä","hänen","hänessä","hänestä","hänet","häntä","ihan","ilman","ilmeisesti","itse","itsensä","itseään","ja","jo","johon","joiden","joihin","joiksi","joilla","joille","joilta","joina","joissa","joista","joita","joka","jokainen","jokin","joko","joksi","joku","jolla","jolle","jolloin","jolta","jompikumpi","jona","jonka","jonkin","jonne","joo","jopa","jos","joskus","jossa","josta","jota","jotain","joten","jotenkin","jotenkuten","jotka","jotta","jouduimme","jouduin","jouduit","jouduitte","joudumme","joudun","joudutte","joukkoon","joukossa","joukosta","joutua","joutui","joutuivat","joutumaan","joutuu","joutuvat","juuri","jälkeen","jälleen","jää","kahdeksan","kahdeksannen","kahdella","kahdelle","kahdelta","kahden","kahdessa","kahdesta","kahta","kahteen","kai","kaiken","kaikille","kaikilta","kaikkea","kaikki","kaikkia","kaikkiaan","kaikkialla","kaikkialle","kaikkialta","kaikkien","kaikkin","kaksi","kannalta","kannattaa","kanssa","kanssaan","kanssamme","kanssani","kanssanne","kanssasi","kauan","kauemmas","kaukana","kautta","kehen","keiden","keihin","keiksi","keille","keillä","keiltä","keinä","keissä","keistä","keitten","keittä","keitä","keneen","keneksi","kenelle","kenellä","keneltä","kenen","kenenä","kenessä","kenestä","kenet","kenettä","kennessästä","kenties","kerran","kerta","kertaa","keskellä","kesken","keskimäärin","ketkä","ketä","kiitos","kohti","koko","kokonaan","kolmas","kolme","kolmen","kolmesti","koska","koskaan","kovin","kuin","kuinka","kuinkan","kuitenkaan","kuitenkin","kuka","kukaan","kukin","kukka","kumpainen","kumpainenkaan","kumpi","kumpikaan","kumpikin","kun","kuten","kuuden","kuusi","kuutta","kylliksi","kyllä","kymmenen","kyse","liian","liki","lisäksi","lisää","lla","luo","luona","lähekkäin","lähelle","lähellä","läheltä","lähemmäs","lähes","lähinnä","lähtien","läpi","mahdollisimman","mahdollista","me","meidän","meidät","meihin","meille","meillä","meiltä","meissä","meistä","meitä","melkein","melko","menee","meneet","menemme","menen","menet","menette","menevät","meni","menimme","menin","menit","menivät","mennessä","mennyt","menossa","mihin","mikin","miksi","mikä","mikäli","mikään","mille","milloin","milloinkan","millä","miltä","minkä","minne","minua","minulla","minulle","minulta","minun","minussa","minusta","minut","minuun","minä","missä","mistä","miten","mitkä","mitä","mitään","moi","molemmat","mones","monesti","monet","moni","moniaalla","moniaalle","moniaalta","monta","muassa","muiden","muita","muka","mukaan","mukaansa","mukana","mutta","muu","muualla","muualle","muualta","muuanne","muulloin","muun","muut","muuta","muutama","muutaman","muuten","myöhemmin","myös","myöskin","myöskään","myötä","ne","neljä","neljän","neljää","niiden","niihin","niiksi","niille","niillä","niiltä","niin","niinä","niissä","niistä","niitä","noiden","noihin","noiksi","noilla","noille","noilta","noin","noina","noissa","noista","noita","nopeammin","nopeasti","nopeiten","nro","nuo","nyt","näiden","näihin","näiksi","näille","näillä","näiltä","näin","näinä","näissä","näissähin","näissälle","näissältä","näissästä","näistä","näitä","nämä","ohi","oikea","oikealla","oikein","ole","olemme","olen","olet","olette","oleva","olevan","olevat","oli","olimme","olin","olisi","olisimme","olisin","olisit","olisitte","olisivat","olit","olitte","olivat","olla","olleet","olli","ollut","oma","omaa","omaan","omaksi","omalle","omalta","oman","omassa","omat","omia","omien","omiin","omiksi","omille","omilta","omissa","omista","on","onkin","onko","ovat","paikoittain","paitsi","pakosti","paljon","paremmin","parempi","parhaillaan","parhaiten","perusteella","peräti","pian","pieneen","pieneksi","pienelle","pienellä","pieneltä","pienempi","pienestä","pieni","pienin","poikki","puolesta","puolestaan","päälle","runsaasti","saakka","sadam","sama","samaa","samaan","samalla","samallalta","samallassa","samallasta","saman","samat","samoin","sata","sataa","satojen","se","seitsemän","sekä","sen","seuraavat","siellä","sieltä","siihen","siinä","siis","siitä","sijaan","siksi","sille","silloin","sillä","silti","siltä","sinne","sinua","sinulla","sinulle","sinulta","sinun","sinussa","sinusta","sinut","sinuun","sinä","sisäkkäin","sisällä","siten","sitten","sitä","ssa","sta","suoraan","suuntaan","suuren","suuret","suuri","suuria","suurin","suurten","taa","taas","taemmas","tahansa","tai","takaa","takaisin","takana","takia","tallä","tapauksessa","tarpeeksi","tavalla","tavoitteena","te","teidän","teidät","teihin","teille","teillä","teiltä","teissä","teistä","teitä","tietysti","todella","toinen","toisaalla","toisaalle","toisaalta","toiseen","toiseksi","toisella","toiselle","toiselta","toisemme","toisen","toisensa","toisessa","toisesta","toista","toistaiseksi","toki","tosin","tuhannen","tuhat","tule","tulee","tulemme","tulen","tulet","tulette","tulevat","tulimme","tulin","tulisi","tulisimme","tulisin","tulisit","tulisitte","tulisivat","tulit","tulitte","tulivat","tulla","tulleet","tullut","tuntuu","tuo","tuohon","tuoksi","tuolla","tuolle","tuolloin","tuolta","tuon","tuona","tuonne","tuossa","tuosta","tuota","tuotä","tuskin","tykö","tähän","täksi","tälle","tällä","tällöin","tältä","tämä","tämän","tänne","tänä","tänään","tässä","tästä","täten","tätä","täysin","täytyvät","täytyy","täällä","täältä","ulkopuolella","usea","useasti","useimmiten","usein","useita","uudeksi","uudelleen","uuden","uudet","uusi","uusia","uusien","uusinta","uuteen","uutta","vaan","vahemmän","vai","vaiheessa","vaikea","vaikean","vaikeat","vaikeilla","vaikeille","vaikeilta","vaikeissa","vaikeista","vaikka","vain","varmasti","varsin","varsinkin","varten","vasen","vasenmalla","vasta","vastaan","vastakkain","vastan","verran","vielä","vierekkäin","vieressä","vieri","viiden","viime","viimeinen","viimeisen","viimeksi","viisi","voi","voidaan","voimme","voin","voisi","voit","voitte","voivat","vuoden","vuoksi","vuosi","vuosien","vuosina","vuotta","vähemmän","vähintään","vähiten","vähän","välillä","yhdeksän","yhden","yhdessä","yhteen","yhteensä","yhteydessä","yhteyteen","yhtä","yhtäälle","yhtäällä","yhtäältä","yhtään","yhä","yksi","yksin","yksittäin","yleensä","ylemmäs","yli","ylös","ympäri","älköön","älä"],"fr":["a","abord","absolument","afin","ah","ai","aie","aient","aies","ailleurs","ainsi","ait","allaient","allo","allons","allô","alors","anterieur","anterieure","anterieures","apres","après","as","assez","attendu","au","aucun","aucune","aucuns","aujourd","aujourd'hui","aupres","auquel","aura","aurai","auraient","aurais","aurait","auras","aurez","auriez","aurions","aurons","auront","aussi","autant","autre","autrefois","autrement","autres","autrui","aux","auxquelles","auxquels","avaient","avais","avait","avant","avec","avez","aviez","avions","avoir","avons","ayant","ayez","ayons","b","bah","bas","basee","bat","beau","beaucoup","bien","bigre","bon","boum","bravo","brrr","c","car","ce","ceci","cela","celle","celle-ci","celle-là","celles","celles-ci","celles-là","celui","celui-ci","celui-là","celà","cent","cependant","certain","certaine","certaines","certains","certes","ces","cet","cette","ceux","ceux-ci","ceux-là","chacun","chacune","chaque","cher","chers","chez","chiche","chut","chère","chères","ci","cinq","cinquantaine","cinquante","cinquantième","cinquième","clac","clic","combien","comme","comment","comparable","comparables","compris","concernant","contre","couic","crac","d","da","dans","de","debout","dedans","dehors","deja","delà","depuis","dernier","derniere","derriere","derrière","des","desormais","desquelles","desquels","dessous","dessus","deux","deuxième","deuxièmement","devant","devers","devra","devrait","different","differentes","differents","différent","différente","différentes","différents","dire","directe","directement","dit","dite","dits","divers","diverse","diverses","dix","dix-huit","dix-neuf","dix-sept","dixième","doit","doivent","donc","dont","dos","douze","douzième","dring","droite","du","duquel","durant","dès","début","désormais","e","effet","egale","egalement","egales","eh","elle","elle-même","elles","elles-mêmes","en","encore","enfin","entre","envers","environ","es","essai","est","et","etant","etc","etre","eu","eue","eues","euh","eurent","eus","eusse","eussent","eusses","eussiez","eussions","eut","eux","eux-mêmes","exactement","excepté","extenso","exterieur","eûmes","eût","eûtes","f","fais","faisaient","faisant","fait","faites","façon","feront","fi","flac","floc","fois","font","force","furent","fus","fusse","fussent","fusses","fussiez","fussions","fut","fûmes","fût","fûtes","g","gens","h","ha","haut","hein","hem","hep","hi","ho","holà","hop","hormis","hors","hou","houp","hue","hui","huit","huitième","hum","hurrah","hé","hélas","i","ici","il","ils","importe","j","je","jusqu","jusque","juste","k","l","la","laisser","laquelle","las","le","lequel","les","lesquelles","lesquels","leur","leurs","longtemps","lors","lorsque","lui","lui-meme","lui-même","là","lès","m","ma","maint","maintenant","mais","malgre","malgré","maximale","me","meme","memes","merci","mes","mien","mienne","miennes","miens","mille","mince","mine","minimale","moi","moi-meme","moi-même","moindres","moins","mon","mot","moyennant","multiple","multiples","même","mêmes","n","na","naturel","naturelle","naturelles","ne","neanmoins","necessaire","necessairement","neuf","neuvième","ni","nombreuses","nombreux","nommés","non","nos","notamment","notre","nous","nous-mêmes","nouveau","nouveaux","nul","néanmoins","nôtre","nôtres","o","oh","ohé","ollé","olé","on","ont","onze","onzième","ore","ou","ouf","ouias","oust","ouste","outre","ouvert","ouverte","ouverts","o|","où","p","paf","pan","par","parce","parfois","parle","parlent","parler","parmi","parole","parseme","partant","particulier","particulière","particulièrement","pas","passé","pendant","pense","permet","personne","personnes","peu","peut","peuvent","peux","pff","pfft","pfut","pif","pire","pièce","plein","plouf","plupart","plus","plusieurs","plutôt","possessif","possessifs","possible","possibles","pouah","pour","pourquoi","pourrais","pourrait","pouvait","prealable","precisement","premier","première","premièrement","pres","probable","probante","procedant","proche","près","psitt","pu","puis","puisque","pur","pure","q","qu","quand","quant","quant-à-soi","quanta","quarante","quatorze","quatre","quatre-vingt","quatrième","quatrièmement","que","quel","quelconque","quelle","quelles","quelqu'un","quelque","quelques","quels","qui","quiconque","quinze","quoi","quoique","r","rare","rarement","rares","relative","relativement","remarquable","rend","rendre","restant","reste","restent","restrictif","retour","revoici","revoilà","rien","s","sa","sacrebleu","sait","sans","sapristi","sauf","se","sein","seize","selon","semblable","semblaient","semble","semblent","sent","sept","septième","sera","serai","seraient","serais","serait","seras","serez","seriez","serions","serons","seront","ses","seul","seule","seulement","si","sien","sienne","siennes","siens","sinon","six","sixième","soi","soi-même","soient","sois","soit","soixante","sommes","son","sont","sous","souvent","soyez","soyons","specifique","specifiques","speculatif","stop","strictement","subtiles","suffisant","suffisante","suffit","suis","suit","suivant","suivante","suivantes","suivants","suivre","sujet","superpose","sur","surtout","t","ta","tac","tandis","tant","tardive","te","tel","telle","tellement","telles","tels","tenant","tend","tenir","tente","tes","tic","tien","tienne","tiennes","tiens","toc","toi","toi-même","ton","touchant","toujours","tous","tout","toute","toutefois","toutes","treize","trente","tres","trois","troisième","troisièmement","trop","très","tsoin","tsouin","tu","té","u","un","une","unes","uniformement","unique","uniques","uns","v","va","vais","valeur","vas","vers","via","vif","vifs","vingt","vivat","vive","vives","vlan","voici","voie","voient","voilà","voire","vont","vos","votre","vous","vous-mêmes","vu","vé","vôtre","vôtres","w","x","y","z","zut","à","â","ça","ès","étaient","étais","était","étant","état","étiez","étions","été","étée","étées","étés","êtes","être","ô"],"gl":["a","alí","ao","aos","aquel","aquela","aquelas","aqueles","aquilo","aquí","as","así","aínda","ben","cando","che","co","coa","coas","comigo","con","connosco","contigo","convosco","cos","cun","cunha","cunhas","cuns","da","dalgunha","dalgunhas","dalgún","dalgúns","das","de","del","dela","delas","deles","desde","deste","do","dos","dun","dunha","dunhas","duns","e","el","ela","elas","eles","en","era","eran","esa","esas","ese","eses","esta","estaba","estar","este","estes","estiven","estou","está","están","eu","facer","foi","foron","fun","había","hai","iso","isto","la","las","lle","lles","lo","los","mais","me","meu","meus","min","miña","miñas","moi","na","nas","neste","nin","no","non","nos","nosa","nosas","noso","nosos","nun","nunha","nunhas","nuns","nós","o","os","ou","para","pero","pode","pois","pola","polas","polo","polos","por","que","se","senón","ser","seu","seus","sexa","sido","sobre","súa","súas","tamén","tan","te","ten","ter","teu","teus","teñen","teño","ti","tido","tiven","tiña","túa","túas","un","unha","unhas","uns","vos","vosa","vosas","voso","vosos","vós","á","é","ó","ós"],"de":["a","ab","aber","ach","acht","achte","achten","achter","achtes","ag","alle","allein","allem","allen","aller","allerdings","alles","allgemeinen","als","also","am","an","ander","andere","anderem","anderen","anderer","anderes","anderm","andern","anderr","anders","au","auch","auf","aus","ausser","ausserdem","außer","außerdem","b","bald","bei","beide","beiden","beim","beispiel","bekannt","bereits","besonders","besser","besten","bin","bis","bisher","bist","c","d","d.h","da","dabei","dadurch","dafür","dagegen","daher","dahin","dahinter","damals","damit","danach","daneben","dank","dann","daran","darauf","daraus","darf","darfst","darin","darum","darunter","darüber","das","dasein","daselbst","dass","dasselbe","davon","davor","dazu","dazwischen","daß","dein","deine","deinem","deinen","deiner","deines","dem","dementsprechend","demgegenüber","demgemäss","demgemäß","demselben","demzufolge","den","denen","denn","denselben","der","deren","derer","derjenige","derjenigen","dermassen","dermaßen","derselbe","derselben","des","deshalb","desselben","dessen","deswegen","dich","die","diejenige","diejenigen","dies","diese","dieselbe","dieselben","diesem","diesen","dieser","dieses","dir","doch","dort","drei","drin","dritte","dritten","dritter","drittes","du","durch","durchaus","durfte","durften","dürfen","dürft","e","eben","ebenso","ehrlich","ei","ei,","eigen","eigene","eigenen","eigener","eigenes","ein","einander","eine","einem","einen","einer","eines","einig","einige","einigem","einigen","einiger","einiges","einmal","eins","elf","en","ende","endlich","entweder","er","ernst","erst","erste","ersten","erster","erstes","es","etwa","etwas","euch","euer","eure","eurem","euren","eurer","eures","f","folgende","früher","fünf","fünfte","fünften","fünfter","fünftes","für","g","gab","ganz","ganze","ganzen","ganzer","ganzes","gar","gedurft","gegen","gegenüber","gehabt","gehen","geht","gekannt","gekonnt","gemacht","gemocht","gemusst","genug","gerade","gern","gesagt","geschweige","gewesen","gewollt","geworden","gibt","ging","gleich","gott","gross","grosse","grossen","grosser","grosses","groß","große","großen","großer","großes","gut","gute","guter","gutes","h","hab","habe","haben","habt","hast","hat","hatte","hatten","hattest","hattet","heisst","her","heute","hier","hin","hinter","hoch","hätte","hätten","i","ich","ihm","ihn","ihnen","ihr","ihre","ihrem","ihren","ihrer","ihres","im","immer","in","indem","infolgedessen","ins","irgend","ist","j","ja","jahr","jahre","jahren","je","jede","jedem","jeden","jeder","jedermann","jedermanns","jedes","jedoch","jemand","jemandem","jemanden","jene","jenem","jenen","jener","jenes","jetzt","k","kam","kann","kannst","kaum","kein","keine","keinem","keinen","keiner","keines","kleine","kleinen","kleiner","kleines","kommen","kommt","konnte","konnten","kurz","können","könnt","könnte","l","lang","lange","leicht","leide","lieber","los","m","machen","macht","machte","mag","magst","mahn","mal","man","manche","manchem","manchen","mancher","manches","mann","mehr","mein","meine","meinem","meinen","meiner","meines","mensch","menschen","mich","mir","mit","mittel","mochte","mochten","morgen","muss","musst","musste","mussten","muß","mußt","möchte","mögen","möglich","mögt","müssen","müsst","müßt","n","na","nach","nachdem","nahm","natürlich","neben","nein","neue","neuen","neun","neunte","neunten","neunter","neuntes","nicht","nichts","nie","niemand","niemandem","niemanden","noch","nun","nur","o","ob","oben","oder","offen","oft","ohne","ordnung","p","q","r","recht","rechte","rechten","rechter","rechtes","richtig","rund","s","sa","sache","sagt","sagte","sah","satt","schlecht","schluss","schon","sechs","sechste","sechsten","sechster","sechstes","sehr","sei","seid","seien","sein","seine","seinem","seinen","seiner","seines","seit","seitdem","selbst","sich","sie","sieben","siebente","siebenten","siebenter","siebentes","sind","so","solang","solche","solchem","solchen","solcher","solches","soll","sollen","sollst","sollt","sollte","sollten","sondern","sonst","soweit","sowie","später","startseite","statt","steht","suche","t","tag","tage","tagen","tat","teil","tel","tritt","trotzdem","tun","u","uhr","um","und","uns","unse","unsem","unsen","unser","unsere","unserer","unses","unter","v","vergangenen","viel","viele","vielem","vielen","vielleicht","vier","vierte","vierten","vierter","viertes","vom","von","vor","w","wahr","wann","war","waren","warst","wart","warum","was","weg","wegen","weil","weit","weiter","weitere","weiteren","weiteres","welche","welchem","welchen","welcher","welches","wem","wen","wenig","wenige","weniger","weniges","wenigstens","wenn","wer","werde","werden","werdet","weshalb","wessen","wie","wieder","wieso","will","willst","wir","wird","wirklich","wirst","wissen","wo","woher","wohin","wohl","wollen","wollt","wollte","wollten","worden","wurde","wurden","während","währenddem","währenddessen","wäre","würde","würden","x","y","z","z.b","zehn","zehnte","zehnten","zehnter","zehntes","zeit","zu","zuerst","zugleich","zum","zunächst","zur","zurück","zusammen","zwanzig","zwar","zwei","zweite","zweiten","zweiter","zweites","zwischen","zwölf","über","überhaupt","übrigens"],"el":["ένα","έναν","ένας","αι","ακομα","ακομη","ακριβως","αληθεια","αληθινα","αλλα","αλλαχου","αλλες","αλλη","αλλην","αλλης","αλλιως","αλλιωτικα","αλλο","αλλοι","αλλοιως","αλλοιωτικα","αλλον","αλλος","αλλοτε","αλλου","αλλους","αλλων","αμα","αμεσα","αμεσως","αν","ανα","αναμεσα","αναμεταξυ","ανευ","αντι","αντιπερα","αντις","ανω","ανωτερω","αξαφνα","απ","απεναντι","απο","αποψε","από","αρα","αραγε","αργα","αργοτερο","αριστερα","αρκετα","αρχικα","ας","αυριο","αυτα","αυτες","αυτεσ","αυτη","αυτην","αυτης","αυτο","αυτοι","αυτον","αυτος","αυτοσ","αυτου","αυτους","αυτουσ","αυτων","αφοτου","αφου","αἱ","αἳ","αἵ","αὐτόσ","αὐτὸς","αὖ","α∆ιακοπα","βεβαια","βεβαιοτατα","γάρ","γα","γα^","γε","γι","για","γοῦν","γρηγορα","γυρω","γὰρ","δ'","δέ","δή","δαί","δαίσ","δαὶ","δαὶς","δε","δεν","δι","δι'","διά","δια","διὰ","δὲ","δὴ","δ’","εαν","εαυτο","εαυτον","εαυτου","εαυτους","εαυτων","εγκαιρα","εγκαιρως","εγω","ειθε","ειμαι","ειμαστε","ειναι","εις","εισαι","εισαστε","ειστε","ειτε","ειχα","ειχαμε","ειχαν","ειχατε","ειχε","ειχες","ει∆εμη","εκ","εκαστα","εκαστες","εκαστη","εκαστην","εκαστης","εκαστο","εκαστοι","εκαστον","εκαστος","εκαστου","εκαστους","εκαστων","εκει","εκεινα","εκεινες","εκεινεσ","εκεινη","εκεινην","εκεινης","εκεινο","εκεινοι","εκεινον","εκεινος","εκεινοσ","εκεινου","εκεινους","εκεινουσ","εκεινων","εκτος","εμας","εμεις","εμενα","εμπρος","εν","ενα","εναν","ενας","ενος","εντελως","εντος","εντωμεταξυ","ενω","ενός","εξ","εξαφνα","εξης","εξισου","εξω","επ","επί","επανω","επειτα","επει∆η","επι","επισης","επομενως","εσας","εσεις","εσενα","εστω","εσυ","ετερα","ετεραι","ετερας","ετερες","ετερη","ετερης","ετερο","ετεροι","ετερον","ετερος","ετερου","ετερους","ετερων","ετουτα","ετουτες","ετουτη","ετουτην","ετουτης","ετουτο","ετουτοι","ετουτον","ετουτος","ετουτου","ετουτους","ετουτων","ετσι","ευγε","ευθυς","ευτυχως","εφεξης","εχει","εχεις","εχετε","εχθες","εχομε","εχουμε","εχουν","εχτες","εχω","εως","εἰ","εἰμί","εἰμὶ","εἰς","εἰσ","εἴ","εἴμι","εἴτε","ε∆ω","η","ημασταν","ημαστε","ημουν","ησασταν","ησαστε","ησουν","ηταν","ητανε","ητοι","ηττον","η∆η","θα","ι","ιι","ιιι","ισαμε","ισια","ισως","ισωσ","ι∆ια","ι∆ιαν","ι∆ιας","ι∆ιες","ι∆ιο","ι∆ιοι","ι∆ιον","ι∆ιος","ι∆ιου","ι∆ιους","ι∆ιων","ι∆ιως","κ","καί","καίτοι","καθ","καθε","καθεμια","καθεμιας","καθενα","καθενας","καθενος","καθετι","καθολου","καθως","και","κακα","κακως","καλα","καλως","καμια","καμιαν","καμιας","καμποσα","καμποσες","καμποση","καμποσην","καμποσης","καμποσο","καμποσοι","καμποσον","καμποσος","καμποσου","καμποσους","καμποσων","κανεις","κανεν","κανενα","κανεναν","κανενας","κανενος","καποια","καποιαν","καποιας","καποιες","καποιο","καποιοι","καποιον","καποιος","καποιου","καποιους","καποιων","καποτε","καπου","καπως","κατ","κατά","κατα","κατι","κατιτι","κατοπιν","κατω","κατὰ","καὶ","κι","κιολας","κλπ","κοντα","κτλ","κυριως","κἀν","κἂν","λιγακι","λιγο","λιγωτερο","λογω","λοιπα","λοιπον","μέν","μέσα","μή","μήτε","μία","μα","μαζι","μακαρι","μακρυα","μαλιστα","μαλλον","μας","με","μεθ","μεθαυριο","μειον","μελει","μελλεται","μεμιας","μεν","μερικα","μερικες","μερικοι","μερικους","μερικων","μεσα","μετ","μετά","μετα","μεταξυ","μετὰ","μεχρι","μη","μην","μηπως","μητε","μη∆ε","μιά","μια","μιαν","μιας","μολις","μολονοτι","μοναχα","μονες","μονη","μονην","μονης","μονο","μονοι","μονομιας","μονος","μονου","μονους","μονων","μου","μπορει","μπορουν","μπραβο","μπρος","μἐν","μὲν","μὴ","μὴν","να","ναι","νωρις","ξανα","ξαφνικα","ο","οι","ολα","ολες","ολη","ολην","ολης","ολο","ολογυρα","ολοι","ολον","ολονεν","ολος","ολοτελα","ολου","ολους","ολων","ολως","ολως∆ιολου","ομως","ομωσ","οποια","οποιαν","οποιαν∆ηποτε","οποιας","οποιας∆ηποτε","οποια∆ηποτε","οποιες","οποιες∆ηποτε","οποιο","οποιοι","οποιον","οποιον∆ηποτε","οποιος","οποιος∆ηποτε","οποιου","οποιους","οποιους∆ηποτε","οποιου∆ηποτε","οποιο∆ηποτε","οποιων","οποιων∆ηποτε","οποι∆ηποτε","οποτε","οποτε∆ηποτε","οπου","οπου∆ηποτε","οπως","οπωσ","ορισμενα","ορισμενες","ορισμενων","ορισμενως","οσα","οσα∆ηποτε","οσες","οσες∆ηποτε","οση","οσην","οσην∆ηποτε","οσης","οσης∆ηποτε","οση∆ηποτε","οσο","οσοι","οσοι∆ηποτε","οσον","οσον∆ηποτε","οσος","οσος∆ηποτε","οσου","οσους","οσους∆ηποτε","οσου∆ηποτε","οσο∆ηποτε","οσων","οσων∆ηποτε","οταν","οτι","οτι∆ηποτε","οτου","ου","ουτε","ου∆ε","οχι","οἱ","οἳ","οἷς","οὐ","οὐδ","οὐδέ","οὐδείσ","οὐδεὶς","οὐδὲ","οὐδὲν","οὐκ","οὐχ","οὐχὶ","οὓς","οὔτε","οὕτω","οὕτως","οὕτωσ","οὖν","οὗ","οὗτος","οὗτοσ","παλι","παντοτε","παντου","παντως","παρ","παρά","παρα","παρὰ","περί","περα","περι","περιπου","περισσοτερο","περσι","περυσι","περὶ","πια","πιθανον","πιο","πισω","πλαι","πλεον","πλην","ποια","ποιαν","ποιας","ποιες","ποιεσ","ποιο","ποιοι","ποιον","ποιος","ποιοσ","ποιου","ποιους","ποιουσ","ποιων","πολυ","ποσες","ποση","ποσην","ποσης","ποσοι","ποσος","ποσους","ποτε","που","πουθε","πουθενα","ποῦ","πρεπει","πριν","προ","προκειμενου","προκειται","προπερσι","προς","προσ","προτου","προχθες","προχτες","πρωτυτερα","πρόσ","πρὸ","πρὸς","πως","πωσ","σαν","σας","σε","σεις","σημερα","σιγα","σου","στα","στη","στην","στης","στις","στο","στον","στου","στους","στων","συγχρονως","συν","συναμα","συνεπως","συνηθως","συχνα","συχνας","συχνες","συχνη","συχνην","συχνης","συχνο","συχνοι","συχνον","συχνος","συχνου","συχνους","συχνων","συχνως","σχε∆ον","σωστα","σόσ","σύ","σύν","σὸς","σὺ","σὺν","τά","τήν","τί","τίς","τίσ","τα","ταυτα","ταυτες","ταυτη","ταυτην","ταυτης","ταυτο,ταυτον","ταυτος","ταυτου","ταυτων","ταχα","ταχατε","ταῖς","τα∆ε","τε","τελικα","τελικως","τες","τετοια","τετοιαν","τετοιας","τετοιες","τετοιο","τετοιοι","τετοιον","τετοιος","τετοιου","τετοιους","τετοιων","τη","την","της","τησ","τι","τινα","τιποτα","τιποτε","τις","τισ","το","τοί","τοι","τοιοῦτος","τοιοῦτοσ","τον","τος","τοσα","τοσες","τοση","τοσην","τοσης","τοσο","τοσοι","τοσον","τοσος","τοσου","τοσους","τοσων","τοτε","του","τουλαχιστο","τουλαχιστον","τους","τουτα","τουτες","τουτη","τουτην","τουτης","τουτο","τουτοι","τουτοις","τουτον","τουτος","τουτου","τουτους","τουτων","τούσ","τοὺς","τοῖς","τοῦ","τυχον","των","τωρα","τό","τόν","τότε","τὰ","τὰς","τὴν","τὸ","τὸν","τῆς","τῆσ","τῇ","τῶν","τῷ","υπ","υπερ","υπο","υποψη","υποψιν","υπό","υστερα","φετος","χαμηλα","χθες","χτες","χωρις","χωριστα","ψηλα","ω","ωραια","ως","ωσ","ωσαν","ωσοτου","ωσπου","ωστε","ωστοσο","ωχ","ἀλλ'","ἀλλά","ἀλλὰ","ἀλλ’","ἀπ","ἀπό","ἀπὸ","ἀφ","ἂν","ἃ","ἄλλος","ἄλλοσ","ἄν","ἄρα","ἅμα","ἐάν","ἐγώ","ἐγὼ","ἐκ","ἐμόσ","ἐμὸς","ἐν","ἐξ","ἐπί","ἐπεὶ","ἐπὶ","ἐστι","ἐφ","ἐὰν","ἑαυτοῦ","ἔτι","ἡ","ἢ","ἣ","ἤ","ἥ","ἧς","ἵνα","ὁ","ὃ","ὃν","ὃς","ὅ","ὅδε","ὅθεν","ὅπερ","ὅς","ὅσ","ὅστις","ὅστισ","ὅτε","ὅτι","ὑμόσ","ὑπ","ὑπέρ","ὑπό","ὑπὲρ","ὑπὸ","ὡς","ὡσ","ὥς","ὥστε","ὦ","ᾧ","∆α","∆ε","∆εινα","∆εν","∆εξια","∆ηθεν","∆ηλα∆η","∆ι","∆ια","∆ιαρκως","∆ικα","∆ικο","∆ικοι","∆ικος","∆ικου","∆ικους","∆ιολου","∆ιπλα","∆ιχως"],"gu":["અંગે","અંદર","અથવા","અને","અમને","અમારું","અમે","અહીં","આ","આગળ","આથી","આનું","આને","આપણને","આપણું","આપણે","આપી","આર","આવી","આવે","ઉપર","ઉભા","ઊંચે","ઊભું","એ","એક","એન","એના","એનાં","એની","એનું","એને","એનો","એમ","એવા","એવાં","એવી","એવું","એવો","ઓછું","કંઈક","કઈ","કયું","કયો","કરતાં","કરવું","કરી","કરીએ","કરું","કરે","કરેલું","કર્યા","કર્યાં","કર્યું","કર્યો","કાંઈ","કે","કેટલું","કેમ","કેવી","કેવું","કોઈ","કોઈક","કોણ","કોણે","કોને","ક્યાં","ક્યારે","ખૂબ","ગઈ","ગયા","ગયાં","ગયું","ગયો","ઘણું","છ","છતાં","છીએ","છું","છે","છેક","છો","જ","જાય","જી","જે","જેટલું","જેને","જેમ","જેવી","જેવું","જેવો","જો","જોઈએ","જ્યાં","જ્યારે","ઝાઝું","તને","તમને","તમારું","તમે","તા","તારાથી","તારામાં","તારું","તું","તે","તેં","તેઓ","તેણે","તેથી","તેના","તેની","તેનું","તેને","તેમ","તેમનું","તેમને","તેવી","તેવું","તો","ત્યાં","ત્યારે","થઇ","થઈ","થઈએ","થતા","થતાં","થતી","થતું","થતો","થયા","થયાં","થયું","થયેલું","થયો","થવું","થાઉં","થાઓ","થાય","થી","થોડું","દરેક","ન","નં","નં.","નથી","નહિ","નહી","નહીં","ના","ની","નીચે","નું","ને","નો","પછી","પણ","પર","પરંતુ","પહેલાં","પાછળ","પાસે","પોતાનું","પ્રત્યેક","ફક્ત","ફરી","ફરીથી","બંને","બધા","બધું","બની","બહાર","બહુ","બાદ","બે","મને","મા","માં","માટે","માત્ર","મારું","મી","મૂકવું","મૂકી","મૂક્યા","મૂક્યાં","મૂક્યું","મેં","રહી","રહે","રહેવું","રહ્યા","રહ્યાં","રહ્યો","રીતે","રૂ.","રૂા","લેતા","લેતું","લેવા","વગેરે","વધુ","શકે","શા","શું","સરખું","સામે","સુધી","હતા","હતાં","હતી","હતું","હવે","હશે","હશો","હા","હું","હો","હોઈ","હોઈશ","હોઈશું","હોય","હોવા"],"ha":["a","amma","ba","ban","ce","cikin","da","don","ga","in","ina","ita","ji","ka","ko","kuma","lokacin","ma","mai","na","ne","ni","sai","shi","su","suka","sun","ta","tafi","take","tana","wani","wannan","wata","ya","yake","yana","yi","za"],"he":["אבל","או","אולי","אותה","אותו","אותי","אותך","אותם","אותן","אותנו","אז","אחר","אחרות","אחרי","אחריכן","אחרים","אחרת","אי","איזה","איך","אין","איפה","איתה","איתו","איתי","איתך","איתכם","איתכן","איתם","איתן","איתנו","אך","אל","אלה","אלו","אם","אנחנו","אני","אס","אף","אצל","אשר","את","אתה","אתכם","אתכן","אתם","אתן","באיזומידה","באמצע","באמצעות","בגלל","בין","בלי","במידה","במקוםשבו","ברם","בשביל","בשעהש","בתוך","גם","דרך","הוא","היא","היה","היכן","היתה","היתי","הם","הן","הנה","הסיבהשבגללה","הרי","ואילו","ואת","זאת","זה","זות","יהיה","יוכל","יוכלו","יותרמדי","יכול","יכולה","יכולות","יכולים","יכל","יכלה","יכלו","יש","כאן","כאשר","כולם","כולן","כזה","כי","כיצד","כך","ככה","כל","כלל","כמו","כן","כפי","כש","לא","לאו","לאיזותכלית","לאן","לבין","לה","להיות","להם","להן","לו","לי","לכם","לכן","למה","למטה","למעלה","למקוםשבו","למרות","לנו","לעבר","לעיכן","לפיכך","לפני","מאד","מאחורי","מאיזוסיבה","מאין","מאיפה","מבלי","מבעד","מדוע","מה","מהיכן","מול","מחוץ","מי","מכאן","מכיוון","מלבד","מן","מנין","מסוגל","מעט","מעטים","מעל","מצד","מקוםבו","מתחת","מתי","נגד","נגר","נו","עד","עז","על","עלי","עליה","עליהם","עליהן","עליו","עליך","עליכם","עלינו","עם","עצמה","עצמהם","עצמהן","עצמו","עצמי","עצמם","עצמן","עצמנו","פה","רק","שוב","של","שלה","שלהם","שלהן","שלו","שלי","שלך","שלכה","שלכם","שלכן","שלנו","שם","תהיה","תחת"],"hi":["अंदर","अत","अदि","अप","अपना","अपनि","अपनी","अपने","अभि","अभी","आदि","आप","इंहिं","इंहें","इंहों","इतयादि","इत्यादि","इन","इनका","इन्हीं","इन्हें","इन्हों","इस","इसका","इसकि","इसकी","इसके","इसमें","इसि","इसी","इसे","उंहिं","उंहें","उंहों","उन","उनका","उनकि","उनकी","उनके","उनको","उन्हीं","उन्हें","उन्हों","उस","उसके","उसि","उसी","उसे","एक","एवं","एस","एसे","ऐसे","ओर","और","कइ","कई","कर","करता","करते","करना","करने","करें","कहते","कहा","का","काफि","काफ़ी","कि","किंहें","किंहों","कितना","किन्हें","किन्हों","किया","किर","किस","किसि","किसी","किसे","की","कुछ","कुल","के","को","कोइ","कोई","कोन","कोनसा","कौन","कौनसा","गया","घर","जब","जहाँ","जहां","जा","जिंहें","जिंहों","जितना","जिधर","जिन","जिन्हें","जिन्हों","जिस","जिसे","जीधर","जेसा","जेसे","जैसा","जैसे","जो","तक","तब","तरह","तिंहें","तिंहों","तिन","तिन्हें","तिन्हों","तिस","तिसे","तो","था","थि","थी","थे","दबारा","दवारा","दिया","दुसरा","दुसरे","दूसरे","दो","द्वारा","न","नहिं","नहीं","ना","निचे","निहायत","नीचे","ने","पर","पहले","पुरा","पूरा","पे","फिर","बनि","बनी","बहि","बही","बहुत","बाद","बाला","बिलकुल","भि","भितर","भी","भीतर","मगर","मानो","मे","में","यदि","यह","यहाँ","यहां","यहि","यही","या","यिह","ये","रखें","रवासा","रहा","रहे","ऱ्वासा","लिए","लिये","लेकिन","व","वगेरह","वरग","वर्ग","वह","वहाँ","वहां","वहिं","वहीं","वाले","वुह","वे","वग़ैरह","संग","सकता","सकते","सबसे","सभि","सभी","साथ","साबुत","साभ","सारा","से","सो","हि","ही","हुअ","हुआ","हुइ","हुई","हुए","हे","हें","है","हैं","हो","होता","होति","होती","होते","होना","होने"],"hu":["a","abba","abban","abból","addig","ahhoz","ahogy","ahol","aki","akik","akkor","akár","alapján","alatt","alatta","alattad","alattam","alattatok","alattuk","alattunk","alá","alád","alájuk","alám","alánk","alátok","alól","alóla","alólad","alólam","alólatok","alóluk","alólunk","amely","amelybol","amelyek","amelyekben","amelyeket","amelyet","amelyik","amelynek","ami","amikor","amit","amolyan","amott","amíg","annak","annál","arra","arról","attól","az","aznap","azok","azokat","azokba","azokban","azokból","azokhoz","azokig","azokkal","azokká","azoknak","azoknál","azokon","azokra","azokról","azoktól","azokért","azon","azonban","azonnal","azt","aztán","azután","azzal","azzá","azért","bal","balra","ban","be","belé","beléd","beléjük","belém","belénk","belétek","belül","belőle","belőled","belőlem","belőletek","belőlük","belőlünk","ben","benne","benned","bennem","bennetek","bennük","bennünk","bár","bárcsak","bármilyen","búcsú","cikk","cikkek","cikkeket","csak","csakhogy","csupán","de","dehogy","e","ebbe","ebben","ebből","eddig","egy","egyebek","egyebet","egyedül","egyelőre","egyes","egyet","egyetlen","egyik","egymás","egyre","egyszerre","egyéb","együtt","egész","egészen","ehhez","ekkor","el","eleinte","ellen","ellenes","elleni","ellenére","elmondta","elsõ","első","elsők","elsősorban","elsőt","elé","eléd","elég","eléjük","elém","elénk","elétek","elõ","elõször","elõtt","elő","előbb","elől","előle","előled","előlem","előletek","előlük","előlünk","először","előtt","előtte","előtted","előttem","előttetek","előttük","előttünk","előző","emilyen","engem","ennek","ennyi","ennél","enyém","erre","erről","esetben","ettől","ez","ezek","ezekbe","ezekben","ezekből","ezeken","ezeket","ezekhez","ezekig","ezekkel","ezekké","ezeknek","ezeknél","ezekre","ezekről","ezektől","ezekért","ezen","ezentúl","ezer","ezret","ezt","ezután","ezzel","ezzé","ezért","fel","fele","felek","felet","felett","felé","fent","fenti","fél","fölé","gyakran","ha","halló","hamar","hanem","harmadik","harmadikat","harminc","hat","hatodik","hatodikat","hatot","hatvan","helyett","hetedik","hetediket","hetet","hetven","hirtelen","hiszen","hiába","hogy","hogyan","hol","holnap","holnapot","honnan","hova","hozzá","hozzád","hozzájuk","hozzám","hozzánk","hozzátok","hurrá","huszadik","hány","hányszor","hármat","három","hát","hátha","hátulsó","hét","húsz","ide","ide-оda","idén","igazán","igen","ill","ill.","illetve","ilyen","ilyenkor","immár","inkább","is","ismét","ison","itt","jelenleg","jobban","jobbra","jó","jól","jólesik","jóval","jövőre","kell","kellene","kellett","kelljen","keressünk","keresztül","ketten","kettő","kettőt","kevés","ki","kiben","kiből","kicsit","kicsoda","kihez","kik","kikbe","kikben","kikből","kiken","kiket","kikhez","kikkel","kikké","kiknek","kiknél","kikre","kikről","kiktől","kikért","kilenc","kilencedik","kilencediket","kilencet","kilencven","kin","kinek","kinél","kire","kiről","kit","kitől","kivel","kivé","kié","kiért","korábban","képest","kérem","kérlek","kész","késő","később","későn","két","kétszer","kívül","körül","köszönhetően","köszönöm","közben","közel","közepesen","közepén","közé","között","közül","külön","különben","különböző","különbözőbb","különbözőek","lassan","le","legalább","legyen","lehet","lehetetlen","lehetett","lehetőleg","lehetőség","lenne","lenni","lennék","lennének","lesz","leszek","lesznek","leszünk","lett","lettek","lettem","lettünk","lévő","ma","maga","magad","magam","magatokat","magukat","magunkat","magát","mai","majd","majdnem","manapság","meg","megcsinál","megcsinálnak","megint","megvan","mellett","mellette","melletted","mellettem","mellettetek","mellettük","mellettünk","mellé","melléd","melléjük","mellém","mellénk","mellétek","mellől","mellőle","mellőled","mellőlem","mellőletek","mellőlük","mellőlünk","mely","melyek","melyik","mennyi","mert","mi","miatt","miatta","miattad","miattam","miattatok","miattuk","miattunk","mibe","miben","miből","mihez","mik","mikbe","mikben","mikből","miken","miket","mikhez","mikkel","mikké","miknek","miknél","mikor","mikre","mikről","miktől","mikért","milyen","min","mind","mindegyik","mindegyiket","minden","mindenesetre","mindenki","mindent","mindenütt","mindig","mindketten","minek","minket","mint","mintha","minél","mire","miről","mit","mitől","mivel","mivé","miért","mondta","most","mostanáig","már","más","másik","másikat","másnap","második","másodszor","mások","másokat","mást","még","mégis","míg","mögé","mögéd","mögéjük","mögém","mögénk","mögétek","mögött","mögötte","mögötted","mögöttem","mögöttetek","mögöttük","mögöttünk","mögül","mögüle","mögüled","mögülem","mögületek","mögülük","mögülünk","múltkor","múlva","na","nagy","nagyobb","nagyon","naponta","napot","ne","negyedik","negyediket","negyven","neked","nekem","neki","nekik","nektek","nekünk","nem","nemcsak","nemrég","nincs","nyolc","nyolcadik","nyolcadikat","nyolcat","nyolcvan","nála","nálad","nálam","nálatok","náluk","nálunk","négy","négyet","néha","néhány","nélkül","o","oda","ok","olyan","onnan","ott","pedig","persze","pár","például","rajta","rajtad","rajtam","rajtatok","rajtuk","rajtunk","rendben","rosszul","rá","rád","rájuk","rám","ránk","rátok","régen","régóta","részére","róla","rólad","rólam","rólatok","róluk","rólunk","rögtön","s","saját","se","sem","semmi","semmilyen","semmiség","senki","soha","sok","sokan","sokat","sokkal","sokszor","sokáig","során","stb.","szemben","szerbusz","szerint","szerinte","szerinted","szerintem","szerintetek","szerintük","szerintünk","szervusz","szinte","számára","száz","századik","százat","szépen","szét","szíves","szívesen","szíveskedjék","sőt","talán","tavaly","te","tegnap","tegnapelőtt","tehát","tele","teljes","tessék","ti","tied","titeket","tizedik","tizediket","tizenegy","tizenegyedik","tizenhat","tizenhárom","tizenhét","tizenkettedik","tizenkettő","tizenkilenc","tizenkét","tizennyolc","tizennégy","tizenöt","tizet","tovább","további","továbbá","távol","téged","tényleg","tíz","több","többi","többször","túl","tőle","tőled","tőlem","tőletek","tőlük","tőlünk","ugyanakkor","ugyanez","ugyanis","ugye","urak","uram","urat","utoljára","utolsó","után","utána","vagy","vagyis","vagyok","vagytok","vagyunk","vajon","valahol","valaki","valakit","valamelyik","valami","valamint","való","van","vannak","vele","veled","velem","veletek","velük","velünk","vissza","viszlát","viszont","viszontlátásra","volna","volnának","volnék","volt","voltak","voltam","voltunk","végre","végén","végül","által","általában","ám","át","éljen","én","éppen","érte","érted","értem","értetek","értük","értünk","és","év","évben","éve","évek","éves","évi","évvel","így","óta","õ","õk","õket","ön","önbe","önben","önből","önhöz","önnek","önnel","önnél","önre","önről","önt","öntől","önért","önök","önökbe","önökben","önökből","önöket","önökhöz","önökkel","önöknek","önöknél","önökre","önökről","önöktől","önökért","önökön","önön","össze","öt","ötven","ötödik","ötödiket","ötöt","úgy","úgyis","úgynevezett","új","újabb","újra","úr","ő","ők","őket","őt"],"id":["ada","adalah","adanya","adapun","agak","agaknya","agar","akan","akankah","akhir","akhiri","akhirnya","aku","akulah","amat","amatlah","anda","andalah","antar","antara","antaranya","apa","apaan","apabila","apakah","apalagi","apatah","artinya","asal","asalkan","atas","atau","ataukah","ataupun","awal","awalnya","bagai","bagaikan","bagaimana","bagaimanakah","bagaimanapun","bagi","bagian","bahkan","bahwa","bahwasanya","baik","bakal","bakalan","balik","banyak","bapak","baru","bawah","beberapa","begini","beginian","beginikah","beginilah","begitu","begitukah","begitulah","begitupun","bekerja","belakang","belakangan","belum","belumlah","benar","benarkah","benarlah","berada","berakhir","berakhirlah","berakhirnya","berapa","berapakah","berapalah","berapapun","berarti","berawal","berbagai","berdatangan","beri","berikan","berikut","berikutnya","berjumlah","berkali-kali","berkata","berkehendak","berkeinginan","berkenaan","berlainan","berlalu","berlangsung","berlebihan","bermacam","bermacam-macam","bermaksud","bermula","bersama","bersama-sama","bersiap","bersiap-siap","bertanya","bertanya-tanya","berturut","berturut-turut","bertutur","berujar","berupa","besar","betul","betulkah","biasa","biasanya","bila","bilakah","bisa","bisakah","boleh","bolehkah","bolehlah","buat","bukan","bukankah","bukanlah","bukannya","bulan","bung","cara","caranya","cukup","cukupkah","cukuplah","cuma","dahulu","dalam","dan","dapat","dari","daripada","datang","dekat","demi","demikian","demikianlah","dengan","depan","di","dia","diakhiri","diakhirinya","dialah","diantara","diantaranya","diberi","diberikan","diberikannya","dibuat","dibuatnya","didapat","didatangkan","digunakan","diibaratkan","diibaratkannya","diingat","diingatkan","diinginkan","dijawab","dijelaskan","dijelaskannya","dikarenakan","dikatakan","dikatakannya","dikerjakan","diketahui","diketahuinya","dikira","dilakukan","dilalui","dilihat","dimaksud","dimaksudkan","dimaksudkannya","dimaksudnya","diminta","dimintai","dimisalkan","dimulai","dimulailah","dimulainya","dimungkinkan","dini","dipastikan","diperbuat","diperbuatnya","dipergunakan","diperkirakan","diperlihatkan","diperlukan","diperlukannya","dipersoalkan","dipertanyakan","dipunyai","diri","dirinya","disampaikan","disebut","disebutkan","disebutkannya","disini","disinilah","ditambahkan","ditandaskan","ditanya","ditanyai","ditanyakan","ditegaskan","ditujukan","ditunjuk","ditunjuki","ditunjukkan","ditunjukkannya","ditunjuknya","dituturkan","dituturkannya","diucapkan","diucapkannya","diungkapkan","dong","dua","dulu","empat","enggak","enggaknya","entah","entahlah","guna","gunakan","hal","hampir","hanya","hanyalah","hari","harus","haruslah","harusnya","hendak","hendaklah","hendaknya","hingga","ia","ialah","ibarat","ibaratkan","ibaratnya","ibu","ikut","ingat","ingat-ingat","ingin","inginkah","inginkan","ini","inikah","inilah","itu","itukah","itulah","jadi","jadilah","jadinya","jangan","jangankan","janganlah","jauh","jawab","jawaban","jawabnya","jelas","jelaskan","jelaslah","jelasnya","jika","jikalau","juga","jumlah","jumlahnya","justru","kala","kalau","kalaulah","kalaupun","kalian","kami","kamilah","kamu","kamulah","kan","kapan","kapankah","kapanpun","karena","karenanya","kasus","kata","katakan","katakanlah","katanya","ke","keadaan","kebetulan","kecil","kedua","keduanya","keinginan","kelamaan","kelihatan","kelihatannya","kelima","keluar","kembali","kemudian","kemungkinan","kemungkinannya","kenapa","kepada","kepadanya","kesampaian","keseluruhan","keseluruhannya","keterlaluan","ketika","khususnya","kini","kinilah","kira","kira-kira","kiranya","kita","kitalah","kok","kurang","lagi","lagian","lah","lain","lainnya","lalu","lama","lamanya","lanjut","lanjutnya","lebih","lewat","lima","luar","macam","maka","makanya","makin","malah","malahan","mampu","mampukah","mana","manakala","manalagi","masa","masalah","masalahnya","masih","masihkah","masing","masing-masing","mau","maupun","melainkan","melakukan","melalui","melihat","melihatnya","memang","memastikan","memberi","memberikan","membuat","memerlukan","memihak","meminta","memintakan","memisalkan","memperbuat","mempergunakan","memperkirakan","memperlihatkan","mempersiapkan","mempersoalkan","mempertanyakan","mempunyai","memulai","memungkinkan","menaiki","menambahkan","menandaskan","menanti","menanti-nanti","menantikan","menanya","menanyai","menanyakan","mendapat","mendapatkan","mendatang","mendatangi","mendatangkan","menegaskan","mengakhiri","mengapa","mengatakan","mengatakannya","mengenai","mengerjakan","mengetahui","menggunakan","menghendaki","mengibaratkan","mengibaratkannya","mengingat","mengingatkan","menginginkan","mengira","mengucapkan","mengucapkannya","mengungkapkan","menjadi","menjawab","menjelaskan","menuju","menunjuk","menunjuki","menunjukkan","menunjuknya","menurut","menuturkan","menyampaikan","menyangkut","menyatakan","menyebutkan","menyeluruh","menyiapkan","merasa","mereka","merekalah","merupakan","meski","meskipun","meyakini","meyakinkan","minta","mirip","misal","misalkan","misalnya","mula","mulai","mulailah","mulanya","mungkin","mungkinkah","nah","naik","namun","nanti","nantinya","nyaris","nyatanya","oleh","olehnya","pada","padahal","padanya","pak","paling","panjang","pantas","para","pasti","pastilah","penting","pentingnya","per","percuma","perlu","perlukah","perlunya","pernah","persoalan","pertama","pertama-tama","pertanyaan","pertanyakan","pihak","pihaknya","pukul","pula","pun","punya","rasa","rasanya","rata","rupanya","saat","saatnya","saja","sajalah","saling","sama","sama-sama","sambil","sampai","sampai-sampai","sampaikan","sana","sangat","sangatlah","satu","saya","sayalah","se","sebab","sebabnya","sebagai","sebagaimana","sebagainya","sebagian","sebaik","sebaik-baiknya","sebaiknya","sebaliknya","sebanyak","sebegini","sebegitu","sebelum","sebelumnya","sebenarnya","seberapa","sebesar","sebetulnya","sebisanya","sebuah","sebut","sebutlah","sebutnya","secara","secukupnya","sedang","sedangkan","sedemikian","sedikit","sedikitnya","seenaknya","segala","segalanya","segera","seharusnya","sehingga","seingat","sejak","sejauh","sejenak","sejumlah","sekadar","sekadarnya","sekali","sekali-kali","sekalian","sekaligus","sekalipun","sekarang","sekecil","seketika","sekiranya","sekitar","sekitarnya","sekurang-kurangnya","sekurangnya","sela","selagi","selain","selaku","selalu","selama","selama-lamanya","selamanya","selanjutnya","seluruh","seluruhnya","semacam","semakin","semampu","semampunya","semasa","semasih","semata","semata-mata","semaunya","sementara","semisal","semisalnya","sempat","semua","semuanya","semula","sendiri","sendirian","sendirinya","seolah","seolah-olah","seorang","sepanjang","sepantasnya","sepantasnyalah","seperlunya","seperti","sepertinya","sepihak","sering","seringnya","serta","serupa","sesaat","sesama","sesampai","sesegera","sesekali","seseorang","sesuatu","sesuatunya","sesudah","sesudahnya","setelah","setempat","setengah","seterusnya","setiap","setiba","setibanya","setidak-tidaknya","setidaknya","setinggi","seusai","sewaktu","siap","siapa","siapakah","siapapun","sini","sinilah","soal","soalnya","suatu","sudah","sudahkah","sudahlah","supaya","tadi","tadinya","tahu","tahun","tak","tambah","tambahnya","tampak","tampaknya","tandas","tandasnya","tanpa","tanya","tanyakan","tanyanya","tapi","tegas","tegasnya","telah","tempat","tengah","tentang","tentu","tentulah","tentunya","tepat","terakhir","terasa","terbanyak","terdahulu","terdapat","terdiri","terhadap","terhadapnya","teringat","teringat-ingat","terjadi","terjadilah","terjadinya","terkira","terlalu","terlebih","terlihat","termasuk","ternyata","tersampaikan","tersebut","tersebutlah","tertentu","tertuju","terus","terutama","tetap","tetapi","tiap","tiba","tiba-tiba","tidak","tidakkah","tidaklah","tiga","tinggi","toh","tunjuk","turut","tutur","tuturnya","ucap","ucapnya","ujar","ujarnya","umum","umumnya","ungkap","ungkapnya","untuk","usah","usai","waduh","wah","wahai","waktu","waktunya","walau","walaupun","wong","yaitu","yakin","yakni","yang"],"ga":["a","ach","ag","agus","an","aon","ar","arna","as","b'","ba","beirt","bhúr","caoga","ceathair","ceathrar","chomh","chtó","chuig","chun","cois","céad","cúig","cúigear","d'","daichead","dar","de","deich","deichniúr","den","dhá","do","don","dtí","dá","dár","dó","faoi","faoin","faoina","faoinár","fara","fiche","gach","gan","go","gur","haon","hocht","i","iad","idir","in","ina","ins","inár","is","le","leis","lena","lenár","m'","mar","mo","mé","na","nach","naoi","naonúr","ná","ní","níor","nó","nócha","ocht","ochtar","os","roimh","sa","seacht","seachtar","seachtó","seasca","seisear","siad","sibh","sinn","sna","sé","sí","tar","thar","thú","triúr","trí","trína","trínár","tríocha","tú","um","ár","é","éis","í","ó","ón","óna","ónár"],"it":["a","abbastanza","abbia","abbiamo","abbiano","abbiate","accidenti","ad","adesso","affinché","agl","agli","ahime","ahimè","ai","al","alcuna","alcuni","alcuno","all","alla","alle","allo","allora","altre","altri","altrimenti","altro","altrove","altrui","anche","ancora","anni","anno","ansa","anticipo","assai","attesa","attraverso","avanti","avemmo","avendo","avente","aver","avere","averlo","avesse","avessero","avessi","avessimo","aveste","avesti","avete","aveva","avevamo","avevano","avevate","avevi","avevo","avrai","avranno","avrebbe","avrebbero","avrei","avremmo","avremo","avreste","avresti","avrete","avrà","avrò","avuta","avute","avuti","avuto","basta","ben","bene","benissimo","brava","bravo","buono","c","caso","cento","certa","certe","certi","certo","che","chi","chicchessia","chiunque","ci","ciascuna","ciascuno","cima","cinque","cio","cioe","cioè","circa","citta","città","ciò","co","codesta","codesti","codesto","cogli","coi","col","colei","coll","coloro","colui","come","cominci","comprare","comunque","con","concernente","conclusione","consecutivi","consecutivo","consiglio","contro","cortesia","cos","cosa","cosi","così","cui","d","da","dagl","dagli","dai","dal","dall","dalla","dalle","dallo","dappertutto","davanti","degl","degli","dei","del","dell","della","delle","dello","dentro","detto","deve","devo","di","dice","dietro","dire","dirimpetto","diventa","diventare","diventato","dopo","doppio","dov","dove","dovra","dovrà","dovunque","due","dunque","durante","e","ebbe","ebbero","ebbi","ecc","ecco","ed","effettivamente","egli","ella","entrambi","eppure","era","erano","eravamo","eravate","eri","ero","esempio","esse","essendo","esser","essere","essi","ex","fa","faccia","facciamo","facciano","facciate","faccio","facemmo","facendo","facesse","facessero","facessi","facessimo","faceste","facesti","faceva","facevamo","facevano","facevate","facevi","facevo","fai","fanno","farai","faranno","fare","farebbe","farebbero","farei","faremmo","faremo","fareste","faresti","farete","farà","farò","fatto","favore","fece","fecero","feci","fin","finalmente","finche","fine","fino","forse","forza","fosse","fossero","fossi","fossimo","foste","fosti","fra","frattempo","fu","fui","fummo","fuori","furono","futuro","generale","gente","gia","giacche","giorni","giorno","giu","già","gli","gliela","gliele","glieli","glielo","gliene","grande","grazie","gruppo","ha","haha","hai","hanno","ho","i","ie","ieri","il","improvviso","in","inc","indietro","infatti","inoltre","insieme","intanto","intorno","invece","io","l","la","lasciato","lato","le","lei","li","lo","lontano","loro","lui","lungo","luogo","là","ma","macche","magari","maggior","mai","male","malgrado","malissimo","me","medesimo","mediante","meglio","meno","mentre","mesi","mezzo","mi","mia","mie","miei","mila","miliardi","milioni","minimi","mio","modo","molta","molti","moltissimo","molto","momento","mondo","ne","negl","negli","nei","nel","nell","nella","nelle","nello","nemmeno","neppure","nessun","nessuna","nessuno","niente","no","noi","nome","non","nondimeno","nonostante","nonsia","nostra","nostre","nostri","nostro","novanta","nove","nulla","nuovi","nuovo","o","od","oggi","ogni","ognuna","ognuno","oltre","oppure","ora","ore","osi","ossia","ottanta","otto","paese","parecchi","parecchie","parecchio","parte","partendo","peccato","peggio","per","perche","perchè","perché","percio","perciò","perfino","pero","persino","persone","però","piedi","pieno","piglia","piu","piuttosto","più","po","pochissimo","poco","poi","poiche","possa","possedere","posteriore","posto","potrebbe","preferibilmente","presa","press","prima","primo","principalmente","probabilmente","promesso","proprio","puo","pure","purtroppo","può","qua","qualche","qualcosa","qualcuna","qualcuno","quale","quali","qualunque","quando","quanta","quante","quanti","quanto","quantunque","quarto","quasi","quattro","quel","quella","quelle","quelli","quello","quest","questa","queste","questi","questo","qui","quindi","quinto","realmente","recente","recentemente","registrazione","relativo","riecco","rispetto","salvo","sara","sarai","saranno","sarebbe","sarebbero","sarei","saremmo","saremo","sareste","saresti","sarete","sarà","sarò","scola","scopo","scorso","se","secondo","seguente","seguito","sei","sembra","sembrare","sembrato","sembrava","sembri","sempre","senza","sette","si","sia","siamo","siano","siate","siete","sig","solito","solo","soltanto","sono","sopra","soprattutto","sotto","spesso","sta","stai","stando","stanno","starai","staranno","starebbe","starebbero","starei","staremmo","staremo","stareste","staresti","starete","starà","starò","stata","state","stati","stato","stava","stavamo","stavano","stavate","stavi","stavo","stemmo","stessa","stesse","stessero","stessi","stessimo","stesso","steste","stesti","stette","stettero","stetti","stia","stiamo","stiano","stiate","sto","su","sua","subito","successivamente","successivo","sue","sugl","sugli","sui","sul","sull","sulla","sulle","sullo","suo","suoi","tale","tali","talvolta","tanto","te","tempo","terzo","th","ti","titolo","tra","tranne","tre","trenta","triplo","troppo","trovato","tu","tua","tue","tuo","tuoi","tutta","tuttavia","tutte","tutti","tutto","uguali","ulteriore","ultimo","un","una","uno","uomo","va","vai","vale","vari","varia","varie","vario","verso","vi","vicino","visto","vita","voi","volta","volte","vostra","vostre","vostri","vostro","è"],"ja":["あそこ","あっ","あの","あのかた","あの人","あり","あります","ある","あれ","い","いう","います","いる","う","うち","え","お","および","おり","おります","か","かつて","から","が","き","ここ","こちら","こと","この","これ","これら","さ","さらに","し","しかし","する","ず","せ","せる","そこ","そして","その","その他","その後","それ","それぞれ","それで","た","ただし","たち","ため","たり","だ","だっ","だれ","つ","て","で","でき","できる","です","では","でも","と","という","といった","とき","ところ","として","とともに","とも","と共に","どこ","どの","な","ない","なお","なかっ","ながら","なく","なっ","など","なに","なら","なり","なる","なん","に","において","における","について","にて","によって","により","による","に対して","に対する","に関する","の","ので","のみ","は","ば","へ","ほか","ほとんど","ほど","ます","また","または","まで","も","もの","ものの","や","よう","より","ら","られ","られる","れ","れる","を","ん","何","及び","彼","彼女","我々","特に","私","私達","貴方","貴方方"],"ko":["!","\"","$","%","&","'","(",")","*","+",",","-",".","...","0","1","2","3","4","5","6","7","8","9",";","<","=",">","?","@","\\","^","_","`","|","~","·","—","——","‘","’","“","”","…","、","。","〈","〉","《","》","가","가까스로","가령","각","각각","각자","각종","갖고말하자면","같다","같이","개의치않고","거니와","거바","거의","것","것과 같이","것들","게다가","게우다","겨우","견지에서","결과에 이르다","결국","결론을 낼 수 있다","겸사겸사","고려하면","고로","곧","공동으로","과","과연","관계가 있다","관계없이","관련이 있다","관하여","관한","관해서는","구","구체적으로","구토하다","그","그들","그때","그래","그래도","그래서","그러나","그러니","그러니까","그러면","그러므로","그러한즉","그런 까닭에","그런데","그런즉","그럼","그럼에도 불구하고","그렇게 함으로써","그렇지","그렇지 않다면","그렇지 않으면","그렇지만","그렇지않으면","그리고","그리하여","그만이다","그에 따르는","그위에","그저","그중에서","그치지 않다","근거로","근거하여","기대여","기점으로","기준으로","기타","까닭으로","까악","까지","까지 미치다","까지도","꽈당","끙끙","끼익","나","나머지는","남들","남짓","너","너희","너희들","네","넷","년","논하지 않다","놀라다","누가 알겠는가","누구","다른","다른 방면으로","다만","다섯","다소","다수","다시 말하자면","다시말하면","다음","다음에","다음으로","단지","답다","당신","당장","대로 하다","대하면","대하여","대해 말하자면","대해서","댕그","더구나","더군다나","더라도","더불어","더욱더","더욱이는","도달하다","도착하다","동시에","동안","된바에야","된이상","두번째로","둘","둥둥","뒤따라","뒤이어","든간에","들","등","등등","딩동","따라","따라서","따위","따지지 않다","딱","때","때가 되어","때문에","또","또한","뚝뚝","라 해도","령","로","로 인하여","로부터","로써","륙","를","마음대로","마저","마저도","마치","막론하고","만 못하다","만약","만약에","만은 아니다","만이 아니다","만일","만큼","말하자면","말할것도 없고","매","매번","메쓰겁다","몇","모","모두","무렵","무릎쓰고","무슨","무엇","무엇때문에","물론","및","바꾸어말하면","바꾸어말하자면","바꾸어서 말하면","바꾸어서 한다면","바꿔 말하면","바로","바와같이","밖에 안된다","반대로","반대로 말하자면","반드시","버금","보는데서","보다더","보드득","본대로","봐","봐라","부류의 사람들","부터","불구하고","불문하고","붕붕","비걱거리다","비교적","비길수 없다","비로소","비록","비슷하다","비추어 보아","비하면","뿐만 아니라","뿐만아니라","뿐이다","삐걱","삐걱거리다","사","삼","상대적으로 말하자면","생각한대로","설령","설마","설사","셋","소생","소인","솨","쉿","습니까","습니다","시각","시간","시작하여","시초에","시키다","실로","심지어","아","아니","아니나다를가","아니라면","아니면","아니었다면","아래윗","아무거나","아무도","아야","아울러","아이","아이고","아이구","아이야","아이쿠","아하","아홉","안 그러면","않기 위하여","않기 위해서","알 수 있다","알았어","앗","앞에서","앞의것","야","약간","양자","어","어기여차","어느","어느 년도","어느것","어느곳","어느때","어느쪽","어느해","어디","어때","어떠한","어떤","어떤것","어떤것들","어떻게","어떻해","어이","어째서","어쨋든","어쩔수 없다","어찌","어찌됏든","어찌됏어","어찌하든지","어찌하여","언제","언젠가","얼마","얼마 안 되는 것","얼마간","얼마나","얼마든지","얼마만큼","얼마큼","엉엉","에","에 가서","에 달려 있다","에 대해","에 있다","에 한하다","에게","에서","여","여기","여덟","여러분","여보시오","여부","여섯","여전히","여차","연관되다","연이서","영","영차","옆사람","예","예를 들면","예를 들자면","예컨대","예하면","오","오로지","오르다","오자마자","오직","오호","오히려","와","와 같은 사람들","와르르","와아","왜","왜냐하면","외에도","요만큼","요만한 것","요만한걸","요컨대","우르르","우리","우리들","우선","우에 종합한것과같이","운운","월","위에서 서술한바와같이","위하여","위해서","윙윙","육","으로","으로 인하여","으로서","으로써","을","응","응당","의","의거하여","의지하여","의해","의해되다","의해서","이","이 되다","이 때문에","이 밖에","이 외에","이 정도의","이것","이곳","이때","이라면","이래","이러이러하다","이러한","이런","이럴정도로","이렇게 많은 것","이렇게되면","이렇게말하자면","이렇구나","이로 인하여","이르기까지","이리하여","이만큼","이번","이봐","이상","이어서","이었다","이와 같다","이와 같은","이와 반대로","이와같다면","이외에도","이용하여","이유만으로","이젠","이지만","이쪽","이천구","이천육","이천칠","이천팔","인 듯하다","인젠","일","일것이다","일곱","일단","일때","일반적으로","일지라도","임에 틀림없다","입각하여","입장에서","잇따라","있다","자","자기","자기집","자마자","자신","잠깐","잠시","저","저것","저것만큼","저기","저쪽","저희","전부","전자","전후","점에서 보아","정도에 이르다","제","제각기","제외하고","조금","조차","조차도","졸졸","좀","좋아","좍좍","주룩주룩","주저하지 않고","줄은 몰랏다","줄은모른다","중에서","중의하나","즈음하여","즉","즉시","지든지","지만","지말고","진짜로","쪽으로","차라리","참","참나","첫번째로","쳇","총적으로","총적으로 말하면","총적으로 보면","칠","콸콸","쾅쾅","쿵","타다","타인","탕탕","토하다","통하여","툭","퉤","틈타","팍","팔","퍽","펄렁","하","하게될것이다","하게하다","하겠는가","하고 있다","하고있었다","하곤하였다","하구나","하기 때문에","하기 위하여","하기는한데","하기만 하면","하기보다는","하기에","하나","하느니","하는 김에","하는 편이 낫다","하는것도","하는것만 못하다","하는것이 낫다","하는바","하더라도","하도다","하도록시키다","하도록하다","하든지","하려고하다","하마터면","하면 할수록","하면된다","하면서","하물며","하여금","하여야","하자마자","하지 않는다면","하지 않도록","하지마","하지마라","하지만","하하","한 까닭에","한 이유는","한 후","한다면","한다면 몰라도","한데","한마디","한적이있다","한켠으로는","한항목","할 따름이다","할 생각이다","할 줄 안다","할 지경이다","할 힘이 있다","할때","할만하다","할망정","할뿐","할수있다","할수있어","할줄알다","할지라도","할지언정","함께","해도된다","해도좋다","해봐요","해서는 안된다","해야한다","해요","했어요","향하다","향하여","향해서","허","허걱","허허","헉","헉헉","헐떡헐떡","형식으로 쓰여","혹시","혹은","혼자","훨씬","휘익","휴","흐흐","흥","힘입어","︿","！","＃","＄","％","＆","（","）","＊","＋","，","０","１","２","３","４","５","６","７","８","９","：","；","＜","＞","？","＠","［","］","｛","｜","｝","～","￥"],"ku":["ئێمە","ئێوە","ئەم","ئەو","ئەوان","ئەوەی","بۆ","بێ","بێجگە","بە","بەبێ","بەدەم","بەردەم","بەرلە","بەرەوی","بەرەوە","بەلای","بەپێی","تۆ","تێ","جگە","دوای","دوو","دە","دەکات","دەگەڵ","سەر","لێ","لە","لەبابەت","لەباتی","لەبارەی","لەبرێتی","لەبن","لەبەر","لەبەینی","لەدەم","لەرێ","لەرێگا","لەرەوی","لەسەر","لەلایەن","لەناو","لەنێو","لەو","لەپێناوی","لەژێر","لەگەڵ","من","ناو","نێوان","هەر","هەروەها","و","وەک","پاش","پێ","پێش","چەند","کرد","کە","ی"],"la":["a","ab","ac","ad","at","atque","aut","autem","cum","de","dum","e","erant","erat","est","et","etiam","ex","haec","hic","hoc","in","ita","me","nec","neque","non","per","qua","quae","quam","qui","quibus","quidem","quo","quod","re","rebus","rem","res","sed","si","sic","sunt","tamen","tandem","te","ut","vel"],"lt":["abi","abidvi","abiejose","abiejuose","abiejø","abiem","abigaliai","abipus","abu","abudu","ai","ana","anaiptol","anaisiais","anajai","anajam","anajame","anapus","anas","anasai","anasis","anei","aniedvi","anieji","aniesiems","anoji","anojo","anojoje","anokia","anoks","anosiomis","anosioms","anosios","anosiose","anot","ant","antai","anuodu","anuoju","anuosiuose","anuosius","anàja","anàjà","anàjá","anàsias","anøjø","apie","aplink","ar","arba","argi","arti","aukðèiau","að","be","bei","beje","bemaþ","bent","bet","betgi","beveik","dar","dargi","daugmaþ","deja","dëka","dël","dëlei","dëlto","ech","et","gal","galbût","galgi","gan","gana","gi","greta","idant","iki","ir","irgi","it","itin","ið","iðilgai","iðvis","jaisiais","jajai","jajam","jajame","jei","jeigu","ji","jiedu","jiedvi","jieji","jiesiems","jinai","jis","jisai","jog","joji","jojo","jojoje","jokia","joks","josiomis","josioms","josios","josiose","judu","judvi","juk","jumis","jums","jumyse","juodu","juoju","juosiuose","juosius","jus","jàja","jàjà","jàsias","jájá","jøjø","jûs","jûsiðkis","jûsiðkë","jûsø","kad","kada","kadangi","kai","kaip","kaipgi","kas","katra","katras","katriedvi","katruodu","kaþin","kaþkas","kaþkatra","kaþkatras","kaþkokia","kaþkoks","kaþkuri","kaþkuris","kiaurai","kiek","kiekvienas","kieno","kita","kitas","kitokia","kitoks","kodël","kokia","koks","kol","kolei","kone","kuomet","kur","kurgi","kuri","kuriedvi","kuris","kuriuodu","lai","lig","ligi","link","lyg","man","manaisiais","manajai","manajam","manajame","manas","manasai","manasis","mane","manieji","maniesiems","manim","manimi","maniðkis","maniðkë","mano","manoji","manojo","manojoje","manosiomis","manosioms","manosios","manosiose","manuoju","manuosiuose","manuosius","manyje","manàja","manàjà","manàjá","manàsias","manæs","manøjø","mat","maþdaug","maþne","mes","mudu","mudvi","mumis","mums","mumyse","mus","mûsiðkis","mûsiðkë","mûsø","na","nagi","ne","nebe","nebent","negi","negu","nei","nejau","nejaugi","nekaip","nelyginant","nes","net","netgi","netoli","neva","nors","nuo","në","o","ogi","oi","paeiliui","pagal","pakeliui","palaipsniui","palei","pas","pasak","paskos","paskui","paskum","pat","pati","patiems","paties","pats","patys","patá","paèiais","paèiam","paèiame","paèiu","paèiuose","paèius","paèiø","per","pernelyg","pirm","pirma","pirmiau","po","prie","prieð","prieðais","pro","pusiau","rasi","rodos","sau","savaisiais","savajai","savajam","savajame","savas","savasai","savasis","save","savieji","saviesiems","savimi","saviðkis","saviðkë","savo","savoji","savojo","savojoje","savosiomis","savosioms","savosios","savosiose","savuoju","savuosiuose","savuosius","savyje","savàja","savàjà","savàjá","savàsias","savæs","savøjø","skersai","skradþiai","staèiai","su","sulig","ta","tad","tai","taigi","taip","taipogi","taisiais","tajai","tajam","tajame","tamsta","tarp","tarsi","tartum","tarytum","tas","tasai","tau","tavaisiais","tavajai","tavajam","tavajame","tavas","tavasai","tavasis","tave","tavieji","taviesiems","tavimi","taviðkis","taviðkë","tavo","tavoji","tavojo","tavojoje","tavosiomis","tavosioms","tavosios","tavosiose","tavuoju","tavuosiuose","tavuosius","tavyje","tavàja","tavàjà","tavàjá","tavàsias","tavæs","tavøjø","taèiau","te","tegu","tegul","tiedvi","tieji","ties","tiesiems","tiesiog","tik","tikriausiai","tiktai","toji","tojo","tojoje","tokia","toks","tol","tolei","toliau","tosiomis","tosioms","tosios","tosiose","tu","tuodu","tuoju","tuosiuose","tuosius","turbût","tàja","tàjà","tàjá","tàsias","tøjø","tûlas","uþ","uþtat","uþvis","va","vai","viduj","vidury","vien","vienas","vienokia","vienoks","vietoj","virð","virðuj","virðum","vis","vis dëlto","visa","visas","visgi","visokia","visoks","vos","vël","vëlgi","ypaè","á","ákypai","ástriþai","ðalia","ðe","ði","ðiaisiais","ðiajai","ðiajam","ðiajame","ðiapus","ðiedvi","ðieji","ðiesiems","ðioji","ðiojo","ðiojoje","ðiokia","ðioks","ðiosiomis","ðiosioms","ðiosios","ðiosiose","ðis","ðisai","ðit","ðita","ðitas","ðitiedvi","ðitokia","ðitoks","ðituodu","ðiuodu","ðiuoju","ðiuosiuose","ðiuosius","ðiàja","ðiàjà","ðiàsias","ðiøjø","ðtai","ðájá","þemiau"],"lv":["aiz","ap","apakš","apakšpus","ar","arī","augšpus","bet","bez","bija","biji","biju","bijām","bijāt","būs","būsi","būsiet","būsim","būt","būšu","caur","diemžēl","diezin","droši","dēļ","esam","esat","esi","esmu","gan","gar","iekam","iekams","iekām","iekāms","iekš","iekšpus","ik","ir","it","itin","iz","ja","jau","jeb","jebšu","jel","jo","jā","ka","kamēr","kaut","kolīdz","kopš","kā","kļuva","kļuvi","kļuvu","kļuvām","kļuvāt","kļūs","kļūsi","kļūsiet","kļūsim","kļūst","kļūstam","kļūstat","kļūsti","kļūstu","kļūt","kļūšu","labad","lai","lejpus","līdz","līdzko","ne","nebūt","nedz","nekā","nevis","nezin","no","nu","nē","otrpus","pa","par","pat","pie","pirms","pret","priekš","pār","pēc","starp","tad","tak","tapi","taps","tapsi","tapsiet","tapsim","tapt","tapāt","tapšu","taču","te","tiec","tiek","tiekam","tiekat","tieku","tik","tika","tikai","tiki","tikko","tiklab","tiklīdz","tiks","tiksiet","tiksim","tikt","tiku","tikvien","tikām","tikāt","tikšu","tomēr","topat","turpretim","turpretī","tā","tādēļ","tālab","tāpēc","un","uz","vai","var","varat","varēja","varēji","varēju","varējām","varējāt","varēs","varēsi","varēsiet","varēsim","varēt","varēšu","vien","virs","virspus","vis","viņpus","zem","ārpus","šaipus"],"ms":["abdul","abdullah","acara","ada","adalah","ahmad","air","akan","akhbar","akhir","aktiviti","alam","amat","amerika","anak","anggota","antara","antarabangsa","apa","apabila","april","as","asas","asean","asia","asing","atas","atau","australia","awal","awam","bagaimanapun","bagi","bahagian","bahan","baharu","bahawa","baik","bandar","bank","banyak","barangan","baru","baru-baru","bawah","beberapa","bekas","beliau","belum","berada","berakhir","berbanding","berdasarkan","berharap","berikutan","berjaya","berjumlah","berkaitan","berkata","berkenaan","berlaku","bermula","bernama","bernilai","bersama","berubah","besar","bhd","bidang","bilion","bn","boleh","bukan","bulan","bursa","cadangan","china","dagangan","dalam","dan","dana","dapat","dari","daripada","dasar","datang","datuk","demikian","dengan","depan","derivatives","dewan","di","diadakan","dibuka","dicatatkan","dijangka","diniagakan","dis","disember","ditutup","dolar","dr","dua","dunia","ekonomi","eksekutif","eksport","empat","enam","faedah","feb","global","hadapan","hanya","harga","hari","hasil","hingga","hubungan","ia","iaitu","ialah","indeks","india","indonesia","industri","ini","islam","isnin","isu","itu","jabatan","jalan","jan","jawatan","jawatankuasa","jepun","jika","jualan","juga","julai","jumaat","jumlah","jun","juta","kadar","kalangan","kali","kami","kata","katanya","kaunter","kawasan","ke","keadaan","kecil","kedua","kedua-dua","kedudukan","kekal","kementerian","kemudahan","kenaikan","kenyataan","kepada","kepentingan","keputusan","kerajaan","kerana","kereta","kerja","kerjasama","kes","keselamatan","keseluruhan","kesihatan","ketika","ketua","keuntungan","kewangan","khamis","kini","kira-kira","kita","klci","klibor","komposit","kontrak","kos","kuala","kuasa","kukuh","kumpulan","lagi","lain","langkah","laporan","lebih","lepas","lima","lot","luar","lumpur","mac","mahkamah","mahu","majlis","makanan","maklumat","malam","malaysia","mana","manakala","masa","masalah","masih","masing-masing","masyarakat","mata","media","mei","melalui","melihat","memandangkan","memastikan","membantu","membawa","memberi","memberikan","membolehkan","membuat","mempunyai","menambah","menarik","menawarkan","mencapai","mencatatkan","mendapat","mendapatkan","menerima","menerusi","mengadakan","mengambil","mengenai","menggalakkan","menggunakan","mengikut","mengumumkan","mengurangkan","meningkat","meningkatkan","menjadi","menjelang","menokok","menteri","menunjukkan","menurut","menyaksikan","menyediakan","mereka","merosot","merupakan","mesyuarat","minat","minggu","minyak","modal","mohd","mudah","mungkin","naik","najib","nasional","negara","negara-negara","negeri","niaga","nilai","nov","ogos","okt","oleh","operasi","orang","pada","pagi","paling","pameran","papan","para","paras","parlimen","parti","pasaran","pasukan","pegawai","pejabat","pekerja","pelabur","pelaburan","pelancongan","pelanggan","pelbagai","peluang","pembangunan","pemberita","pembinaan","pemimpin","pendapatan","pendidikan","penduduk","penerbangan","pengarah","pengeluaran","pengerusi","pengguna","pengurusan","peniaga","peningkatan","penting","peratus","perdagangan","perdana","peringkat","perjanjian","perkara","perkhidmatan","perladangan","perlu","permintaan","perniagaan","persekutuan","persidangan","pertama","pertubuhan","pertumbuhan","perusahaan","peserta","petang","pihak","pilihan","pinjaman","polis","politik","presiden","prestasi","produk","program","projek","proses","proton","pukul","pula","pusat","rabu","rakan","rakyat","ramai","rantau","raya","rendah","ringgit","rumah","sabah","sahaja","saham","sama","sarawak","satu","sawit","saya","sdn","sebagai","sebahagian","sebanyak","sebarang","sebelum","sebelumnya","sebuah","secara","sedang","segi","sehingga","sejak","sekarang","sektor","sekuriti","selain","selama","selasa","selatan","selepas","seluruh","semakin","semalam","semasa","sementara","semua","semula","sen","sendiri","seorang","sepanjang","seperti","sept","september","serantau","seri","serta","sesi","setiap","setiausaha","sidang","singapura","sini","sistem","sokongan","sri","sudah","sukan","suku","sumber","supaya","susut","syarikat","syed","tahap","tahun","tan","tanah","tanpa","tawaran","teknologi","telah","tempat","tempatan","tempoh","tenaga","tengah","tentang","terbaik","terbang","terbesar","terbuka","terdapat","terhadap","termasuk","tersebut","terus","tetapi","thailand","tiada","tidak","tiga","timbalan","timur","tindakan","tinggi","tun","tunai","turun","turut","umno","unit","untuk","untung","urus","usaha","utama","walaupun","wang","wanita","wilayah","yang"],"mr":["अधिक","अनेक","अशी","असलयाचे","असलेल्या","असा","असून","असे","आज","आणि","आता","आपल्या","आला","आली","आले","आहे","आहेत","एक","एका","कमी","करणयात","करून","का","काम","काय","काही","किवा","की","केला","केली","केले","कोटी","गेल्या","घेऊन","जात","झाला","झाली","झाले","झालेल्या","टा","डॉ","तर","तरी","तसेच","ता","ती","तीन","ते","तो","त्या","त्याचा","त्याची","त्याच्या","त्याना","त्यानी","त्यामुळे","त्री","दिली","दोन","न","नाही","निर्ण्य","पण","पम","परयतन","पाटील","म","मात्र","माहिती","मी","मुबी","म्हणजे","म्हणाले","म्हणून","या","याचा","याची","याच्या","याना","यानी","येणार","येत","येथील","येथे","लाख","व","व्यकत","सर्व","सागित्ले","सुरू","हजार","हा","ही","हे","होणार","होत","होता","होती","होते"],"no":["alle","andre","arbeid","at","av","bare","begge","ble","blei","bli","blir","blitt","bort","bra","bruke","både","båe","da","de","deg","dei","deim","deira","deires","dem","den","denne","der","dere","deres","det","dette","di","din","disse","ditt","du","dykk","dykkar","då","eg","ein","eit","eitt","eller","elles","en","ene","eneste","enhver","enn","er","et","ett","etter","folk","for","fordi","forsûke","fra","få","før","fûr","fûrst","gjorde","gjûre","god","gå","ha","hadde","han","hans","har","hennar","henne","hennes","her","hjå","ho","hoe","honom","hoss","hossen","hun","hva","hvem","hver","hvilke","hvilken","hvis","hvor","hvordan","hvorfor","i","ikke","ikkje","ingen","ingi","inkje","inn","innen","inni","ja","jeg","kan","kom","korleis","korso","kun","kunne","kva","kvar","kvarhelst","kven","kvi","kvifor","lage","lang","lik","like","makt","man","mange","me","med","medan","meg","meget","mellom","men","mens","mer","mest","mi","min","mine","mitt","mot","mye","mykje","må","måte","navn","ned","nei","no","noe","noen","noka","noko","nokon","nokor","nokre","ny","nå","når","og","også","om","opp","oss","over","part","punkt","på","rett","riktig","samme","sant","seg","selv","si","sia","sidan","siden","sin","sine","sist","sitt","sjøl","skal","skulle","slik","slutt","so","som","somme","somt","start","stille","så","sånn","tid","til","tilbake","tilstand","um","under","upp","ut","uten","var","vart","varte","ved","verdi","vere","verte","vi","vil","ville","vite","vore","vors","vort","vår","være","vært","vöre","vört","å"],"fa":["!",",",".",":",";","،","؛","؟","آباد","آره","آری","آمد","آمده","آن","آنان","آنجا","آنطور","آنقدر","آنكه","آنها","آنچه","آنکه","آورد","آورده","آيد","آی","آیا","آیند","اتفاقا","اثرِ","احتراما","احتمالا","اخیر","اری","از","ازجمله","اساسا","است","استفاد","استفاده","اش","اشکارا","اصلا","اصولا","اعلام","اغلب","اكنون","الان","البته","البتّه","ام","اما","امروز","امروزه","امسال","امشب","امور","ان","انجام","اند","انشاالله","انصافا","انطور","انقدر","انها","انچنان","انکه","انگار","او","اول","اولا","اي","ايشان","ايم","اين","اينكه","اکثرا","اکنون","اگر","ای","ایا","اید","ایشان","ایم","این","اینجا","ایند","اینطور","اینقدر","اینها","اینچنین","اینک","اینکه","اینگونه","با","بار","بارة","باره","بارها","باز","بازهم","باش","باشد","باشم","باشند","باشيم","باشی","باشید","باشیم","بالا","بالاخره","بالایِ","بالطبع","بايد","باید","بتوان","بتواند","بتوانی","بتوانیم","بخش","بخشی","بخواه","بخواهد","بخواهم","بخواهند","بخواهی","بخواهید","بخواهیم","بد","بدون","بر","برابر","برابرِ","براحتی","براساس","براستی","براي","برای","برایِ","برخوردار","برخي","برخی","برداري","برعکس","بروز","بزرگ","بزودی","بسا","بسيار","بسياري","بسیار","بسیاری","بطور","بعد","بعدا","بعدها","بعری","بعضا","بعضي","بلافاصله","بلكه","بله","بلکه","بلی","بنابراين","بنابراین","بندي","به","بهتر","بهترين","بود","بودم","بودن","بودند","بوده","بودی","بودید","بودیم","بویژه","بي","بيست","بيش","بيشتر","بيشتري","بين","بکن","بکند","بکنم","بکنند","بکنی","بکنید","بکنیم","بگو","بگوید","بگویم","بگویند","بگویی","بگویید","بگوییم","بگیر","بگیرد","بگیرم","بگیرند","بگیری","بگیرید","بگیریم","بی","بیا","بیاب","بیابد","بیابم","بیابند","بیابی","بیابید","بیابیم","بیاور","بیاورد","بیاورم","بیاورند","بیاوری","بیاورید","بیاوریم","بیاید","بیایم","بیایند","بیایی","بیایید","بیاییم","بیرون","بیرونِ","بیش","بیشتر","بیشتری","بین","ت","تا","تازه","تاكنون","تان","تاکنون","تحت","تر","تر  براساس","ترين","تقریبا","تلویحا","تمام","تماما","تمامي","تنها","تو","تواند","توانست","توانستم","توانستن","توانستند","توانسته","توانستی","توانستیم","توانم","توانند","توانی","توانید","توانیم","توسط","تولِ","تویِ","ثانیا","جا","جاي","جايي","جای","جدا","جديد","جدید","جريان","جریان","جز","جلوگيري","جلویِ","جمعا","جناح","جهت","حاضر","حال","حالا","حتما","حتي","حتی","حداکثر","حدودا","حدودِ","حق","خارجِ","خب","خدمات","خصوصا","خلاصه","خواست","خواستم","خواستن","خواستند","خواسته","خواستی","خواستید","خواستیم","خواهد","خواهم","خواهند","خواهيم","خواهی","خواهید","خواهیم","خوب","خود","خودت","خودتان","خودش","خودشان","خودم","خودمان","خوشبختانه","خويش","خویش","خویشتن","خیاه","خیر","خیلی","داد","دادم","دادن","دادند","داده","دادی","دادید","دادیم","دار","دارد","دارم","دارند","داريم","داری","دارید","داریم","داشت","داشتم","داشتن","داشتند","داشته","داشتی","داشتید","داشتیم","دانست","دانند","دایم","دایما","در","درباره","درمجموع","درون","دریغ","دقیقا","دنبالِ","ده","دهد","دهم","دهند","دهی","دهید","دهیم","دو","دوباره","دوم","ديده","ديروز","ديگر","ديگران","ديگري","دیر","دیروز","دیگر","دیگران","دیگری","را","راحت","راسا","راستی","راه","رسما","رسید","رفت","رفته","رو","روب","روز","روزانه","روزهاي","روي","روی","رویِ","ريزي","زمان","زمانی","زمینه","زود","زياد","زير","زيرا","زیر","زیرِ","سابق","ساخته","سازي","سالانه","سالیانه","سایر","سراسر","سرانجام","سریعا","سریِ","سعي","سمتِ","سوم","سوي","سوی","سویِ","سپس","شان","شايد","شاید","شخصا","شد","شدم","شدن","شدند","شده","شدی","شدید","شدیدا","شدیم","شش","شش  نداشته","شما","شناسي","شود","شوم","شوند","شونده","شوی","شوید","شویم","صرفا","صورت","ضدِّ","ضدِّ","ضمن","طبعا","طبقِ","طبیعتا","طرف","طريق","طریق","طور","طي","طی","ظاهرا","عدم","عقبِ","علّتِ","علیه","عمدا","عمدتا","عمل","عملا","عنوان","عنوانِ","غالبا","غير","غیر","فردا","فعلا","فقط","فكر","فوق","قابل","قبل","قبلا","قدری","قصدِ","قطعا","كرد","كردم","كردن","كردند","كرده","كسي","كل","كمتر","كند","كنم","كنند","كنيد","كنيم","كه","لااقل","لطفا","لطفاً","ما","مان","مانند","مانندِ","مبادا","متاسفانه","متعاقبا","مثل","مثلا","مثلِ","مجانی","مجددا","مجموعا","مختلف","مدام","مدت","مدّتی","مردم","مرسی","مستقیما","مسلما","مطمینا","معمولا","مقابل","ممکن","من","موارد","مورد","موقتا","مي","ميليارد","ميليون","مگر","می","می شود","میان","می‌رسد","می‌رود","می‌شود","می‌کنیم","ناشي","نام","ناگاه","ناگهان","ناگهانی","نبايد","نباید","نبود","نخست","نخستين","نخواهد","نخواهم","نخواهند","نخواهی","نخواهید","نخواهیم","ندارد","ندارم","ندارند","نداری","ندارید","نداریم","نداشت","نداشتم","نداشتند","نداشته","نداشتی","نداشتید","نداشتیم","نزديك","نزدِ","نزدیکِ","نسبتا","نشان","نشده","نظير","نظیر","نكرده","نمايد","نمي","نمی","نمی‌شود","نه","نهایتا","نوع","نوعي","نوعی","نيز","نيست","نگاه","نیز","نیست","ها","هاي","هايي","های","هایی","هبچ","هر","هرچه","هرگز","هزار","هست","هستم","هستند","هستيم","هستی","هستید","هستیم","هفت","هم","همان","همه","همواره","همين","همچنان","همچنين","همچنین","همچون","همیشه","همین","هنوز","هنگام","هنگامِ","هنگامی","هيچ","هیچ","هیچگاه","و","واقعا","واقعی","وجود","وسطِ","وضع","وقتي","وقتی","وقتیکه","ولی","وي","وگو","وی","ویژه","يا","يابد","يك","يكديگر","يكي","ّه","٪","پارسال","پاعینِ","پس","پنج","پيش","پیدا","پیش","پیشاپیش","پیشتر","پیشِ","چرا","چطور","چقدر","چنان","چنانچه","چنانکه","چند","چندین","چنين","چنین","چه","چهار","چو","چون","چيزي","چگونه","چیز","چیزی","چیست","کاش","کامل","کاملا","کتبا","کجا","کجاست","کدام","کرد","کردم","کردن","کردند","کرده","کردی","کردید","کردیم","کس","کسانی","کسی","کل","کلا","کم","کماکان","کمتر","کمتری","کمی","کن","کنار","کنارِ","کند","کنم","کنند","کننده","کنون","کنونی","کنی","کنید","کنیم","که","کو","کَی","کی","گاه","گاهی","گذاري","گذاشته","گذشته","گردد","گرفت","گرفتم","گرفتن","گرفتند","گرفته","گرفتی","گرفتید","گرفتیم","گروهي","گفت","گفتم","گفتن","گفتند","گفته","گفتی","گفتید","گفتیم","گه","گهگاه","گو","گويد","گويند","گویا","گوید","گویم","گویند","گویی","گویید","گوییم","گيرد","گيري","گیرد","گیرم","گیرند","گیری","گیرید","گیریم","ی","یا","یابد","یابم","یابند","یابی","یابید","یابیم","یافت","یافتم","یافتن","یافته","یافتی","یافتید","یافتیم","یعنی","یقینا","یه","یک","یکی","۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"],"pl":["a","aby","ach","acz","aczkolwiek","aj","albo","ale","ależ","ani","aż","bardziej","bardzo","bez","bo","bowiem","by","byli","bym","bynajmniej","być","był","była","było","były","będzie","będą","cali","cała","cały","chce","choć","ci","ciebie","cię","co","cokolwiek","coraz","coś","czasami","czasem","czemu","czy","czyli","często","daleko","dla","dlaczego","dlatego","do","dobrze","dokąd","dość","dr","dużo","dwa","dwaj","dwie","dwoje","dzisiaj","dziś","gdy","gdyby","gdyż","gdzie","gdziekolwiek","gdzieś","go","godz","hab","i","ich","ii","iii","ile","im","inna","inne","inny","innych","inż","iv","ix","iż","ja","jak","jakaś","jakby","jaki","jakichś","jakie","jakiś","jakiż","jakkolwiek","jako","jakoś","je","jeden","jedna","jednak","jednakże","jedno","jednym","jedynie","jego","jej","jemu","jest","jestem","jeszcze","jeśli","jeżeli","już","ją","każdy","kiedy","kierunku","kilka","kilku","kimś","kto","ktokolwiek","ktoś","która","które","którego","której","który","których","którym","którzy","ku","lat","lecz","lub","ma","mają","mam","mamy","mało","mgr","mi","miał","mimo","między","mnie","mną","mogą","moi","moim","moja","moje","może","możliwe","można","mu","musi","my","mój","na","nad","nam","nami","nas","nasi","nasz","nasza","nasze","naszego","naszych","natomiast","natychmiast","nawet","nic","nich","nie","niech","niego","niej","niemu","nigdy","nim","nimi","nią","niż","no","nowe","np","nr","o","o.o.","obok","od","ok","około","on","ona","one","oni","ono","oraz","oto","owszem","pan","pana","pani","pl","po","pod","podczas","pomimo","ponad","ponieważ","powinien","powinna","powinni","powinno","poza","prawie","prof","przecież","przed","przede","przedtem","przez","przy","raz","razie","roku","również","sam","sama","się","skąd","sobie","sobą","sposób","swoje","są","ta","tak","taka","taki","takich","takie","także","tam","te","tego","tej","tel","temu","ten","teraz","też","to","tobie","tobą","toteż","totobą","trzeba","tu","tutaj","twoi","twoim","twoja","twoje","twym","twój","ty","tych","tylko","tym","tys","tzw","tę","u","ul","vi","vii","viii","vol","w","wam","wami","was","wasi","wasz","wasza","wasze","we","według","wie","wiele","wielu","więc","więcej","wszyscy","wszystkich","wszystkie","wszystkim","wszystko","wtedy","www","wy","właśnie","wśród","xi","xii","xiii","xiv","xv","z","za","zapewne","zawsze","zaś","ze","zeznowu","znowu","znów","został","zł","żaden","żadna","żadne","żadnych","że","żeby"],"pt":["a","acerca","adeus","agora","ainda","alem","algmas","algo","algumas","alguns","ali","além","ambas","ambos","ano","anos","antes","ao","aonde","aos","apenas","apoio","apontar","apos","após","aquela","aquelas","aquele","aqueles","aqui","aquilo","as","assim","através","atrás","até","aí","baixo","bastante","bem","boa","boas","bom","bons","breve","cada","caminho","catorze","cedo","cento","certamente","certeza","cima","cinco","coisa","com","como","comprido","conhecido","conselho","contra","contudo","corrente","cuja","cujas","cujo","cujos","custa","cá","da","daquela","daquelas","daquele","daqueles","dar","das","de","debaixo","dela","delas","dele","deles","demais","dentro","depois","desde","desligado","dessa","dessas","desse","desses","desta","destas","deste","destes","deve","devem","deverá","dez","dezanove","dezasseis","dezassete","dezoito","dia","diante","direita","dispoe","dispoem","diversa","diversas","diversos","diz","dizem","dizer","do","dois","dos","doze","duas","durante","dá","dão","dúvida","e","ela","elas","ele","eles","em","embora","enquanto","entao","entre","então","era","eram","essa","essas","esse","esses","esta","estado","estamos","estar","estará","estas","estava","estavam","este","esteja","estejam","estejamos","estes","esteve","estive","estivemos","estiver","estivera","estiveram","estiverem","estivermos","estivesse","estivessem","estiveste","estivestes","estivéramos","estivéssemos","estou","está","estás","estávamos","estão","eu","exemplo","falta","fará","favor","faz","fazeis","fazem","fazemos","fazer","fazes","fazia","faço","fez","fim","final","foi","fomos","for","fora","foram","forem","forma","formos","fosse","fossem","foste","fostes","fui","fôramos","fôssemos","geral","grande","grandes","grupo","ha","haja","hajam","hajamos","havemos","havia","hei","hoje","hora","horas","houve","houvemos","houver","houvera","houveram","houverei","houverem","houveremos","houveria","houveriam","houvermos","houverá","houverão","houveríamos","houvesse","houvessem","houvéramos","houvéssemos","há","hão","iniciar","inicio","ir","irá","isso","ista","iste","isto","já","lado","lhe","lhes","ligado","local","logo","longe","lugar","lá","maior","maioria","maiorias","mais","mal","mas","me","mediante","meio","menor","menos","meses","mesma","mesmas","mesmo","mesmos","meu","meus","mil","minha","minhas","momento","muito","muitos","máximo","mês","na","nada","nao","naquela","naquelas","naquele","naqueles","nas","nem","nenhuma","nessa","nessas","nesse","nesses","nesta","nestas","neste","nestes","no","noite","nome","nos","nossa","nossas","nosso","nossos","nova","novas","nove","novo","novos","num","numa","numas","nunca","nuns","não","nível","nós","número","o","obra","obrigada","obrigado","oitava","oitavo","oito","onde","ontem","onze","os","ou","outra","outras","outro","outros","para","parece","parte","partir","paucas","pegar","pela","pelas","pelo","pelos","perante","perto","pessoas","pode","podem","poder","poderá","podia","pois","ponto","pontos","por","porque","porquê","portanto","posição","possivelmente","posso","possível","pouca","pouco","poucos","povo","primeira","primeiras","primeiro","primeiros","promeiro","propios","proprio","própria","próprias","próprio","próprios","próxima","próximas","próximo","próximos","puderam","pôde","põe","põem","quais","qual","qualquer","quando","quanto","quarta","quarto","quatro","que","quem","quer","quereis","querem","queremas","queres","quero","questão","quieto","quinta","quinto","quinze","quáis","quê","relação","sabe","sabem","saber","se","segunda","segundo","sei","seis","seja","sejam","sejamos","sem","sempre","sendo","ser","serei","seremos","seria","seriam","será","serão","seríamos","sete","seu","seus","sexta","sexto","sim","sistema","sob","sobre","sois","somente","somos","sou","sua","suas","são","sétima","sétimo","só","tal","talvez","tambem","também","tanta","tantas","tanto","tarde","te","tem","temos","tempo","tendes","tenha","tenham","tenhamos","tenho","tens","tentar","tentaram","tente","tentei","ter","terceira","terceiro","terei","teremos","teria","teriam","terá","terão","teríamos","teu","teus","teve","tinha","tinham","tipo","tive","tivemos","tiver","tivera","tiveram","tiverem","tivermos","tivesse","tivessem","tiveste","tivestes","tivéramos","tivéssemos","toda","todas","todo","todos","trabalhar","trabalho","treze","três","tu","tua","tuas","tudo","tão","tém","têm","tínhamos","um","uma","umas","uns","usa","usar","vai","vais","valor","veja","vem","vens","ver","verdade","verdadeiro","vez","vezes","viagem","vindo","vinte","você","vocês","vos","vossa","vossas","vosso","vossos","vários","vão","vêm","vós","zero","à","às","área","é","éramos","és","último"],"ro":["a","abia","acea","aceasta","această","aceea","aceeasi","acei","aceia","acel","acela","acelasi","acele","acelea","acest","acesta","aceste","acestea","acestei","acestia","acestui","aceşti","aceştia","acolo","acord","acum","adica","ai","aia","aibă","aici","aiurea","al","ala","alaturi","ale","alea","alt","alta","altceva","altcineva","alte","altfel","alti","altii","altul","am","anume","apoi","ar","are","as","asa","asemenea","asta","astazi","astea","astfel","astăzi","asupra","atare","atat","atata","atatea","atatia","ati","atit","atita","atitea","atitia","atunci","au","avea","avem","aveţi","avut","azi","aş","aşadar","aţi","b","ba","bine","bucur","bună","c","ca","cam","cand","capat","care","careia","carora","caruia","cat","catre","caut","ce","cea","ceea","cei","ceilalti","cel","cele","celor","ceva","chiar","ci","cinci","cind","cine","cineva","cit","cita","cite","citeva","citi","citiva","conform","contra","cu","cui","cum","cumva","curând","curînd","când","cât","câte","câtva","câţi","cînd","cît","cîte","cîtva","cîţi","că","căci","cărei","căror","cărui","către","d","da","daca","dacă","dar","dat","datorită","dată","dau","de","deasupra","deci","decit","degraba","deja","deoarece","departe","desi","despre","deşi","din","dinaintea","dintr","dintr-","dintre","doar","doi","doilea","două","drept","dupa","după","dă","e","ea","ei","el","ele","era","eram","este","eu","exact","eşti","f","face","fara","fata","fel","fi","fie","fiecare","fii","fim","fiu","fiţi","foarte","fost","frumos","fără","g","geaba","graţie","h","halbă","i","ia","iar","ieri","ii","il","imi","in","inainte","inapoi","inca","incit","insa","intr","intre","isi","iti","j","k","l","la","le","li","lor","lui","lângă","lîngă","m","ma","mai","mare","mea","mei","mele","mereu","meu","mi","mie","mine","mod","mult","multa","multe","multi","multă","mulţi","mulţumesc","mâine","mîine","mă","n","ne","nevoie","ni","nici","niciodata","nicăieri","nimeni","nimeri","nimic","niste","nişte","noastre","noastră","noi","noroc","nostri","nostru","nou","noua","nouă","noştri","nu","numai","o","opt","or","ori","oricare","orice","oricine","oricum","oricând","oricât","oricînd","oricît","oriunde","p","pai","parca","patra","patru","patrulea","pe","pentru","peste","pic","pina","plus","poate","pot","prea","prima","primul","prin","printr-","putini","puţin","puţina","puţină","până","pînă","r","rog","s","sa","sa-mi","sa-ti","sai","sale","sau","se","si","sint","sintem","spate","spre","sub","sunt","suntem","sunteţi","sus","sută","sînt","sîntem","sînteţi","să","săi","său","t","ta","tale","te","ti","timp","tine","toata","toate","toată","tocmai","tot","toti","totul","totusi","totuşi","toţi","trei","treia","treilea","tu","tuturor","tăi","tău","u","ul","ului","un","una","unde","undeva","unei","uneia","unele","uneori","unii","unor","unora","unu","unui","unuia","unul","v","va","vi","voastre","voastră","voi","vom","vor","vostru","vouă","voştri","vreme","vreo","vreun","vă","x","z","zece","zero","zi","zice","îi","îl","îmi","împotriva","în","înainte","înaintea","încotro","încât","încît","între","întrucât","întrucît","îţi","ăla","ălea","ăsta","ăstea","ăştia","şapte","şase","şi","ştiu","ţi","ţie"],"ru":["c","а","алло","без","белый","близко","более","больше","большой","будем","будет","будете","будешь","будто","буду","будут","будь","бы","бывает","бывь","был","была","были","было","быть","в","важная","важное","важные","важный","вам","вами","вас","ваш","ваша","ваше","ваши","вверх","вдали","вдруг","ведь","везде","вернуться","весь","вечер","взгляд","взять","вид","видел","видеть","вместе","вне","вниз","внизу","во","вода","война","вокруг","вон","вообще","вопрос","восемнадцатый","восемнадцать","восемь","восьмой","вот","впрочем","времени","время","все","все еще","всегда","всего","всем","всеми","всему","всех","всею","всю","всюду","вся","всё","второй","вы","выйти","г","где","главный","глаз","говорил","говорит","говорить","год","года","году","голова","голос","город","да","давать","давно","даже","далекий","далеко","дальше","даром","дать","два","двадцатый","двадцать","две","двенадцатый","двенадцать","дверь","двух","девятнадцатый","девятнадцать","девятый","девять","действительно","дел","делал","делать","делаю","дело","день","деньги","десятый","десять","для","до","довольно","долго","должен","должно","должный","дом","дорога","друг","другая","другие","других","друго","другое","другой","думать","душа","е","его","ее","ей","ему","если","есть","еще","ещё","ею","её","ж","ждать","же","жена","женщина","жизнь","жить","за","занят","занята","занято","заняты","затем","зато","зачем","здесь","земля","знать","значит","значить","и","иди","идти","из","или","им","имеет","имел","именно","иметь","ими","имя","иногда","их","к","каждая","каждое","каждые","каждый","кажется","казаться","как","какая","какой","кем","книга","когда","кого","ком","комната","кому","конец","конечно","которая","которого","которой","которые","который","которых","кроме","кругом","кто","куда","лежать","лет","ли","лицо","лишь","лучше","любить","люди","м","маленький","мало","мать","машина","между","меля","менее","меньше","меня","место","миллионов","мимо","минута","мир","мира","мне","много","многочисленная","многочисленное","многочисленные","многочисленный","мной","мною","мог","могу","могут","мож","может","может быть","можно","можхо","мои","мой","мор","москва","мочь","моя","моё","мы","на","наверху","над","надо","назад","наиболее","найти","наконец","нам","нами","народ","нас","начала","начать","наш","наша","наше","наши","не","него","недавно","недалеко","нее","ней","некоторый","нельзя","нем","немного","нему","непрерывно","нередко","несколько","нет","нею","неё","ни","нибудь","ниже","низко","никакой","никогда","никто","никуда","ним","ними","них","ничего","ничто","но","новый","нога","ночь","ну","нужно","нужный","нх","о","об","оба","обычно","один","одиннадцатый","одиннадцать","однажды","однако","одного","одной","оказаться","окно","около","он","она","они","оно","опять","особенно","остаться","от","ответить","отец","откуда","отовсюду","отсюда","очень","первый","перед","писать","плечо","по","под","подойди","подумать","пожалуйста","позже","пойти","пока","пол","получить","помнить","понимать","понять","пор","пора","после","последний","посмотреть","посреди","потом","потому","почему","почти","правда","прекрасно","при","про","просто","против","процентов","путь","пятнадцатый","пятнадцать","пятый","пять","работа","работать","раз","разве","рано","раньше","ребенок","решить","россия","рука","русский","ряд","рядом","с","с кем","сам","сама","сами","самим","самими","самих","само","самого","самой","самом","самому","саму","самый","свет","свое","своего","своей","свои","своих","свой","свою","сделать","сеаой","себе","себя","сегодня","седьмой","сейчас","семнадцатый","семнадцать","семь","сидеть","сила","сих","сказал","сказала","сказать","сколько","слишком","слово","случай","смотреть","сначала","снова","со","собой","собою","советский","совсем","спасибо","спросить","сразу","стал","старый","стать","стол","сторона","стоять","страна","суть","считать","т","та","так","такая","также","таки","такие","такое","такой","там","твои","твой","твоя","твоё","те","тебе","тебя","тем","теми","теперь","тех","то","тобой","тобою","товарищ","тогда","того","тоже","только","том","тому","тот","тою","третий","три","тринадцатый","тринадцать","ту","туда","тут","ты","тысяч","у","увидеть","уж","уже","улица","уметь","утро","хороший","хорошо","хотел бы","хотеть","хоть","хотя","хочешь","час","часто","часть","чаще","чего","человек","чем","чему","через","четвертый","четыре","четырнадцатый","четырнадцать","что","чтоб","чтобы","чуть","шестнадцатый","шестнадцать","шестой","шесть","эта","эти","этим","этими","этих","это","этого","этой","этом","этому","этот","эту","я","являюсь"],"sk":["a","aby","aj","ak","akej","akejže","ako","akom","akomže","akou","akouže","akože","aká","akáže","aké","akého","akéhože","akému","akémuže","akéže","akú","akúže","aký","akých","akýchže","akým","akými","akýmiže","akýmže","akýže","ale","alebo","ani","asi","avšak","až","ba","bez","bezo","bol","bola","boli","bolo","bude","budem","budeme","budete","budeš","budú","buď","by","byť","cez","cezo","dnes","do","ešte","ho","hoci","i","iba","ich","im","inej","inom","iná","iné","iného","inému","iní","inú","iný","iných","iným","inými","ja","je","jeho","jej","jemu","ju","k","kam","kamže","každou","každá","každé","každého","každému","každí","každú","každý","každých","každým","každými","kde","kej","kejže","keď","keďže","kie","kieho","kiehože","kiemu","kiemuže","kieže","koho","kom","komu","kou","kouže","kto","ktorej","ktorou","ktorá","ktoré","ktorí","ktorú","ktorý","ktorých","ktorým","ktorými","ku","ká","káže","ké","kéže","kú","kúže","ký","kýho","kýhože","kým","kýmu","kýmuže","kýže","lebo","leda","ledaže","len","ma","majú","mal","mala","mali","mať","medzi","mi","mne","mnou","moja","moje","mojej","mojich","mojim","mojimi","mojou","moju","možno","mu","musia","musieť","musí","musím","musíme","musíte","musíš","my","má","mám","máme","máte","máš","môcť","môj","môjho","môže","môžem","môžeme","môžete","môžeš","môžu","mňa","na","nad","nado","najmä","nami","naša","naše","našej","naši","našich","našim","našimi","našou","ne","nech","neho","nej","nejakej","nejakom","nejakou","nejaká","nejaké","nejakého","nejakému","nejakú","nejaký","nejakých","nejakým","nejakými","nemu","než","nich","nie","niektorej","niektorom","niektorou","niektorá","niektoré","niektorého","niektorému","niektorú","niektorý","niektorých","niektorým","niektorými","nielen","niečo","nim","nimi","nič","ničoho","ničom","ničomu","ničím","no","nám","nás","náš","nášho","ním","o","od","odo","on","ona","oni","ono","ony","oň","oňho","po","pod","podo","podľa","pokiaľ","popod","popri","potom","poza","pre","pred","predo","preto","pretože","prečo","pri","práve","s","sa","seba","sebe","sebou","sem","si","sme","so","som","ste","svoj","svoja","svoje","svojho","svojich","svojim","svojimi","svojou","svoju","svojím","sú","ta","tak","takej","takejto","taká","takáto","také","takého","takéhoto","takému","takémuto","takéto","takí","takú","takúto","taký","takýto","takže","tam","teba","tebe","tebou","teda","tej","tejto","ten","tento","ti","tie","tieto","tiež","to","toho","tohoto","tohto","tom","tomto","tomu","tomuto","toto","tou","touto","tu","tvoj","tvoja","tvoje","tvojej","tvojho","tvoji","tvojich","tvojim","tvojimi","tvojím","ty","tá","táto","tí","títo","tú","túto","tých","tým","tými","týmto","u","už","v","vami","vaša","vaše","vašej","vaši","vašich","vašim","vaším","veď","viac","vo","vy","vám","vás","váš","vášho","však","všetci","všetka","všetko","všetky","všetok","z","za","začo","začože","zo","áno","čej","či","čia","čie","čieho","čiemu","čiu","čo","čoho","čom","čomu","čou","čože","čí","čím","čími","ďalšia","ďalšie","ďalšieho","ďalšiemu","ďalšiu","ďalšom","ďalšou","ďalší","ďalších","ďalším","ďalšími","ňom","ňou","ňu","že"],"sl":["a","ali","april","avgust","b","bi","bil","bila","bile","bili","bilo","biti","blizu","bo","bodo","bojo","bolj","bom","bomo","boste","bova","boš","brez","c","cel","cela","celi","celo","d","da","daleč","dan","danes","datum","december","deset","deseta","deseti","deseto","devet","deveta","deveti","deveto","do","dober","dobra","dobri","dobro","dokler","dol","dolg","dolga","dolgi","dovolj","drug","druga","drugi","drugo","dva","dve","e","eden","en","ena","ene","eni","enkrat","eno","etc.","f","februar","g","g.","ga","ga.","gor","gospa","gospod","h","halo","i","idr.","ii","iii","in","iv","ix","iz","j","januar","jaz","je","ji","jih","jim","jo","julij","junij","jutri","k","kadarkoli","kaj","kajti","kako","kakor","kamor","kamorkoli","kar","karkoli","katerikoli","kdaj","kdo","kdorkoli","ker","ki","kje","kjer","kjerkoli","ko","koder","koderkoli","koga","komu","kot","kratek","kratka","kratke","kratki","l","lahka","lahke","lahki","lahko","le","lep","lepa","lepe","lepi","lepo","leto","m","maj","majhen","majhna","majhni","malce","malo","manj","marec","me","med","medtem","mene","mesec","mi","midva","midve","mnogo","moj","moja","moje","mora","morajo","moram","moramo","morate","moraš","morem","mu","n","na","nad","naj","najina","najino","najmanj","naju","največ","nam","narobe","nas","nato","nazaj","naš","naša","naše","ne","nedavno","nedelja","nek","neka","nekaj","nekatere","nekateri","nekatero","nekdo","neke","nekega","neki","nekje","neko","nekoga","nekoč","ni","nikamor","nikdar","nikjer","nikoli","nič","nje","njega","njegov","njegova","njegovo","njej","njemu","njen","njena","njeno","nji","njih","njihov","njihova","njihovo","njiju","njim","njo","njun","njuna","njuno","no","nocoj","november","npr.","o","ob","oba","obe","oboje","od","odprt","odprta","odprti","okoli","oktober","on","onadva","one","oni","onidve","osem","osma","osmi","osmo","oz.","p","pa","pet","peta","petek","peti","peto","po","pod","pogosto","poleg","poln","polna","polni","polno","ponavadi","ponedeljek","ponovno","potem","povsod","pozdravljen","pozdravljeni","prav","prava","prave","pravi","pravo","prazen","prazna","prazno","prbl.","precej","pred","prej","preko","pri","pribl.","približno","primer","pripravljen","pripravljena","pripravljeni","proti","prva","prvi","prvo","r","ravno","redko","res","reč","s","saj","sam","sama","same","sami","samo","se","sebe","sebi","sedaj","sedem","sedma","sedmi","sedmo","sem","september","seveda","si","sicer","skoraj","skozi","slab","smo","so","sobota","spet","sreda","srednja","srednji","sta","ste","stran","stvar","sva","t","ta","tak","taka","take","taki","tako","takoj","tam","te","tebe","tebi","tega","težak","težka","težki","težko","ti","tista","tiste","tisti","tisto","tj.","tja","to","toda","torek","tretja","tretje","tretji","tri","tu","tudi","tukaj","tvoj","tvoja","tvoje","u","v","vaju","vam","vas","vaš","vaša","vaše","ve","vedno","velik","velika","veliki","veliko","vendar","ves","več","vi","vidva","vii","viii","visok","visoka","visoke","visoki","vsa","vsaj","vsak","vsaka","vsakdo","vsake","vsaki","vsakomur","vse","vsega","vsi","vso","včasih","včeraj","x","z","za","zadaj","zadnji","zakaj","zaprta","zaprti","zaprto","zdaj","zelo","zunaj","č","če","često","četrta","četrtek","četrti","četrto","čez","čigav","š","šest","šesta","šesti","šesto","štiri","ž","že"],"so":["aad","albaabkii","atabo","ay","ayaa","ayee","ayuu","dhan","hadana","in","inuu","isku","jiray","jirtay","ka","kale","kasoo","ku","kuu","lakin","markii","oo","si","soo","uga","ugu","uu","waa","waxa","waxuu"],"st":["a","ba","bane","bona","e","ea","eaba","empa","ena","ha","hae","hape","ho","hore","ka","ke","la","le","li","me","mo","moo","ne","o","oa","re","sa","se","tloha","tsa","tse"],"es":["0","1","2","3","4","5","6","7","8","9","_","a","actualmente","acuerdo","adelante","ademas","además","adrede","afirmó","agregó","ahi","ahora","ahí","al","algo","alguna","algunas","alguno","algunos","algún","alli","allí","alrededor","ambos","ampleamos","antano","antaño","ante","anterior","antes","apenas","aproximadamente","aquel","aquella","aquellas","aquello","aquellos","aqui","aquél","aquélla","aquéllas","aquéllos","aquí","arriba","arribaabajo","aseguró","asi","así","atras","aun","aunque","ayer","añadió","aún","b","bajo","bastante","bien","breve","buen","buena","buenas","bueno","buenos","c","cada","casi","cerca","cierta","ciertas","cierto","ciertos","cinco","claro","comentó","como","con","conmigo","conocer","conseguimos","conseguir","considera","consideró","consigo","consigue","consiguen","consigues","contigo","contra","cosas","creo","cual","cuales","cualquier","cuando","cuanta","cuantas","cuanto","cuantos","cuatro","cuenta","cuál","cuáles","cuándo","cuánta","cuántas","cuánto","cuántos","cómo","d","da","dado","dan","dar","de","debajo","debe","deben","debido","decir","dejó","del","delante","demasiado","demás","dentro","deprisa","desde","despacio","despues","después","detras","detrás","dia","dias","dice","dicen","dicho","dieron","diferente","diferentes","dijeron","dijo","dio","donde","dos","durante","día","días","dónde","e","ejemplo","el","ella","ellas","ello","ellos","embargo","empleais","emplean","emplear","empleas","empleo","en","encima","encuentra","enfrente","enseguida","entonces","entre","era","erais","eramos","eran","eras","eres","es","esa","esas","ese","eso","esos","esta","estaba","estabais","estaban","estabas","estad","estada","estadas","estado","estados","estais","estamos","estan","estando","estar","estaremos","estará","estarán","estarás","estaré","estaréis","estaría","estaríais","estaríamos","estarían","estarías","estas","este","estemos","esto","estos","estoy","estuve","estuviera","estuvierais","estuvieran","estuvieras","estuvieron","estuviese","estuvieseis","estuviesen","estuvieses","estuvimos","estuviste","estuvisteis","estuviéramos","estuviésemos","estuvo","está","estábamos","estáis","están","estás","esté","estéis","estén","estés","ex","excepto","existe","existen","explicó","expresó","f","fin","final","fue","fuera","fuerais","fueran","fueras","fueron","fuese","fueseis","fuesen","fueses","fui","fuimos","fuiste","fuisteis","fuéramos","fuésemos","g","general","gran","grandes","gueno","h","ha","haber","habia","habida","habidas","habido","habidos","habiendo","habla","hablan","habremos","habrá","habrán","habrás","habré","habréis","habría","habríais","habríamos","habrían","habrías","habéis","había","habíais","habíamos","habían","habías","hace","haceis","hacemos","hacen","hacer","hacerlo","haces","hacia","haciendo","hago","han","has","hasta","hay","haya","hayamos","hayan","hayas","hayáis","he","hecho","hemos","hicieron","hizo","horas","hoy","hube","hubiera","hubierais","hubieran","hubieras","hubieron","hubiese","hubieseis","hubiesen","hubieses","hubimos","hubiste","hubisteis","hubiéramos","hubiésemos","hubo","i","igual","incluso","indicó","informo","informó","intenta","intentais","intentamos","intentan","intentar","intentas","intento","ir","j","junto","k","l","la","lado","largo","las","le","lejos","les","llegó","lleva","llevar","lo","los","luego","lugar","m","mal","manera","manifestó","mas","mayor","me","mediante","medio","mejor","mencionó","menos","menudo","mi","mia","mias","mientras","mio","mios","mis","misma","mismas","mismo","mismos","modo","momento","mucha","muchas","mucho","muchos","muy","más","mí","mía","mías","mío","míos","n","nada","nadie","ni","ninguna","ningunas","ninguno","ningunos","ningún","no","nos","nosotras","nosotros","nuestra","nuestras","nuestro","nuestros","nueva","nuevas","nuevo","nuevos","nunca","o","ocho","os","otra","otras","otro","otros","p","pais","para","parece","parte","partir","pasada","pasado","paìs","peor","pero","pesar","poca","pocas","poco","pocos","podeis","podemos","poder","podria","podriais","podriamos","podrian","podrias","podrá","podrán","podría","podrían","poner","por","por qué","porque","posible","primer","primera","primero","primeros","principalmente","pronto","propia","propias","propio","propios","proximo","próximo","próximos","pudo","pueda","puede","pueden","puedo","pues","q","qeu","que","quedó","queremos","quien","quienes","quiere","quiza","quizas","quizá","quizás","quién","quiénes","qué","r","raras","realizado","realizar","realizó","repente","respecto","s","sabe","sabeis","sabemos","saben","saber","sabes","sal","salvo","se","sea","seamos","sean","seas","segun","segunda","segundo","según","seis","ser","sera","seremos","será","serán","serás","seré","seréis","sería","seríais","seríamos","serían","serías","seáis","señaló","si","sido","siempre","siendo","siete","sigue","siguiente","sin","sino","sobre","sois","sola","solamente","solas","solo","solos","somos","son","soy","soyos","su","supuesto","sus","suya","suyas","suyo","suyos","sé","sí","sólo","t","tal","tambien","también","tampoco","tan","tanto","tarde","te","temprano","tendremos","tendrá","tendrán","tendrás","tendré","tendréis","tendría","tendríais","tendríamos","tendrían","tendrías","tened","teneis","tenemos","tener","tenga","tengamos","tengan","tengas","tengo","tengáis","tenida","tenidas","tenido","tenidos","teniendo","tenéis","tenía","teníais","teníamos","tenían","tenías","tercera","ti","tiempo","tiene","tienen","tienes","toda","todas","todavia","todavía","todo","todos","total","trabaja","trabajais","trabajamos","trabajan","trabajar","trabajas","trabajo","tras","trata","través","tres","tu","tus","tuve","tuviera","tuvierais","tuvieran","tuvieras","tuvieron","tuviese","tuvieseis","tuviesen","tuvieses","tuvimos","tuviste","tuvisteis","tuviéramos","tuviésemos","tuvo","tuya","tuyas","tuyo","tuyos","tú","u","ultimo","un","una","unas","uno","unos","usa","usais","usamos","usan","usar","usas","uso","usted","ustedes","v","va","vais","valor","vamos","van","varias","varios","vaya","veces","ver","verdad","verdadera","verdadero","vez","vosotras","vosotros","voy","vuestra","vuestras","vuestro","vuestros","w","x","y","ya","yo","z","él","éramos","ésa","ésas","ése","ésos","ésta","éstas","éste","éstos","última","últimas","último","últimos"],"sw":["akasema","alikuwa","alisema","baada","basi","bila","cha","chini","hadi","hapo","hata","hivyo","hiyo","huku","huo","ili","ilikuwa","juu","kama","karibu","katika","kila","kima","kisha","kubwa","kutoka","kuwa","kwa","kwamba","kwenda","kwenye","la","lakini","mara","mdogo","mimi","mkubwa","mmoja","moja","muda","mwenye","na","naye","ndani","ng","ni","nini","nonkungu","pamoja","pia","sana","sasa","sauti","tafadhali","tena","tu","vile","wa","wakati","wake","walikuwa","wao","watu","wengine","wote","ya","yake","yangu","yao","yeye","yule","za","zaidi","zake"],"sv":["aderton","adertonde","adjö","aldrig","alla","allas","allt","alltid","alltså","andra","andras","annan","annat","artonde","artonn","att","av","bakom","bara","behöva","behövas","behövde","behövt","beslut","beslutat","beslutit","bland","blev","bli","blir","blivit","bort","borta","bra","bäst","bättre","båda","bådas","dag","dagar","dagarna","dagen","de","del","delen","dem","den","denna","deras","dess","dessa","det","detta","dig","din","dina","dit","ditt","dock","dom","du","där","därför","då","e","efter","eftersom","ej","elfte","eller","elva","emot","en","enkel","enkelt","enkla","enligt","ens","er","era","ers","ert","ett","ettusen","fanns","fem","femte","femtio","femtionde","femton","femtonde","fick","fin","finnas","finns","fjorton","fjortonde","fjärde","fler","flera","flesta","fram","framför","från","fyra","fyrtio","fyrtionde","få","får","fått","följande","för","före","förlåt","förra","första","genast","genom","gick","gjorde","gjort","god","goda","godare","godast","gott","gälla","gäller","gällt","gärna","gå","går","gått","gör","göra","ha","hade","haft","han","hans","har","heller","hellre","helst","helt","henne","hennes","hit","hon","honom","hundra","hundraen","hundraett","hur","här","hög","höger","högre","högst","i","ibland","icke","idag","igen","igår","imorgon","in","inför","inga","ingen","ingenting","inget","innan","inne","inom","inte","inuti","ja","jag","jo","ju","just","jämfört","kan","kanske","knappast","kom","komma","kommer","kommit","kr","kunde","kunna","kunnat","kvar","legat","ligga","ligger","lika","likställd","likställda","lilla","lite","liten","litet","länge","längre","längst","lätt","lättare","lättast","långsam","långsammare","långsammast","långsamt","långt","låt","man","med","mej","mellan","men","mer","mera","mest","mig","min","mina","mindre","minst","mitt","mittemot","mot","mycket","många","måste","möjlig","möjligen","möjligt","möjligtvis","ned","nederst","nedersta","nedre","nej","ner","ni","nio","nionde","nittio","nittionde","nitton","nittonde","nog","noll","nr","nu","nummer","när","nästa","någon","någonting","något","några","nån","nånting","nåt","nödvändig","nödvändiga","nödvändigt","nödvändigtvis","och","också","ofta","oftast","olika","olikt","om","oss","på","rakt","redan","rätt","sa","sade","sagt","samma","sedan","senare","senast","sent","sex","sextio","sextionde","sexton","sextonde","sig","sin","sina","sist","sista","siste","sitt","sitta","sju","sjunde","sjuttio","sjuttionde","sjutton","sjuttonde","själv","sjätte","ska","skall","skulle","slutligen","små","smått","snart","som","stor","stora","stort","större","störst","säga","säger","sämre","sämst","så","sådan","sådana","sådant","ta","tack","tar","tidig","tidigare","tidigast","tidigt","till","tills","tillsammans","tio","tionde","tjugo","tjugoen","tjugoett","tjugonde","tjugotre","tjugotvå","tjungo","tolfte","tolv","tre","tredje","trettio","trettionde","tretton","trettonde","två","tvåhundra","under","upp","ur","ursäkt","ut","utan","utanför","ute","va","vad","var","vara","varför","varifrån","varit","varje","varken","vars","varsågod","vart","vem","vems","verkligen","vi","vid","vidare","viktig","viktigare","viktigast","viktigt","vilka","vilkas","vilken","vilket","vill","väl","vänster","vänstra","värre","vår","våra","vårt","än","ännu","är","även","åt","åtminstone","åtta","åttio","åttionde","åttonde","över","övermorgon","överst","övre"],"th":["กล่าว","กว่า","กัน","กับ","การ","ก็","ก่อน","ขณะ","ขอ","ของ","ขึ้น","คง","ครั้ง","ความ","คือ","จะ","จัด","จาก","จึง","ช่วง","ซึ่ง","ดัง","ด้วย","ด้าน","ตั้ง","ตั้งแต่","ตาม","ต่อ","ต่าง","ต่างๆ","ต้อง","ถึง","ถูก","ถ้า","ทั้ง","ทั้งนี้","ทาง","ที่","ที่สุด","ทุก","ทํา","ทําให้","นอกจาก","นัก","นั้น","นี้","น่า","นํา","บาง","ผล","ผ่าน","พบ","พร้อม","มา","มาก","มี","ยัง","รวม","ระหว่าง","รับ","ราย","ร่วม","ลง","วัน","ว่า","สุด","ส่ง","ส่วน","สําหรับ","หนึ่ง","หรือ","หลัง","หลังจาก","หลาย","หาก","อยาก","อยู่","อย่าง","ออก","อะไร","อาจ","อีก","เขา","เข้า","เคย","เฉพาะ","เช่น","เดียว","เดียวกัน","เนื่องจาก","เปิด","เปิดเผย","เป็น","เป็นการ","เพราะ","เพื่อ","เมื่อ","เรา","เริ่ม","เลย","เห็น","เอง","แต่","แบบ","แรก","และ","แล้ว","แห่ง","โดย","ใน","ให้","ได้","ไป","ไม่","ไว้","้ง"],"tl":["akin","aking","ako","alin","am","amin","aming","ang","ano","anumang","apat","at","atin","ating","ay","bababa","bago","bakit","bawat","bilang","dahil","dalawa","dapat","din","dito","doon","gagawin","gayunman","ginagawa","ginawa","ginawang","gumawa","gusto","habang","hanggang","hindi","huwag","iba","ibaba","ibabaw","ibig","ikaw","ilagay","ilalim","ilan","inyong","isa","isang","itaas","ito","iyo","iyon","iyong","ka","kahit","kailangan","kailanman","kami","kanila","kanilang","kanino","kanya","kanyang","kapag","kapwa","karamihan","katiyakan","katulad","kaya","kaysa","ko","kong","kulang","kumuha","kung","laban","lahat","lamang","likod","lima","maaari","maaaring","maging","mahusay","makita","marami","marapat","masyado","may","mayroon","mga","minsan","mismo","mula","muli","na","nabanggit","naging","nagkaroon","nais","nakita","namin","napaka","narito","nasaan","ng","ngayon","ni","nila","nilang","nito","niya","niyang","noon","o","pa","paano","pababa","paggawa","pagitan","pagkakaroon","pagkatapos","palabas","pamamagitan","panahon","pangalawa","para","paraan","pareho","pataas","pero","pumunta","pumupunta","sa","saan","sabi","sabihin","sarili","sila","sino","siya","tatlo","tayo","tulad","tungkol","una","walang"],"tr":["acaba","acep","adamakıllı","adeta","ait","altmýþ","altmış","altý","altı","ama","amma","anca","ancak","arada","artýk","aslında","aynen","ayrıca","az","açıkça","açıkçası","bana","bari","bazen","bazý","bazı","başkası","baţka","belki","ben","benden","beni","benim","beri","beriki","beþ","beş","beţ","bilcümle","bile","bin","binaen","binaenaleyh","bir","biraz","birazdan","birbiri","birden","birdenbire","biri","birice","birileri","birisi","birkaç","birkaçı","birkez","birlikte","birçok","birçoğu","birþey","birþeyi","birşey","birşeyi","birţey","bitevi","biteviye","bittabi","biz","bizatihi","bizce","bizcileyin","bizden","bize","bizi","bizim","bizimki","bizzat","boşuna","bu","buna","bunda","bundan","bunlar","bunları","bunların","bunu","bunun","buracıkta","burada","buradan","burası","böyle","böylece","böylecene","böylelikle","böylemesine","böylesine","büsbütün","bütün","cuk","cümlesi","da","daha","dahi","dahil","dahilen","daima","dair","dayanarak","de","defa","dek","demin","demincek","deminden","denli","derakap","derhal","derken","deđil","değil","değin","diye","diđer","diğer","diğeri","doksan","dokuz","dolayı","dolayısıyla","doğru","dört","edecek","eden","ederek","edilecek","ediliyor","edilmesi","ediyor","elbet","elbette","elli","emme","en","enikonu","epey","epeyce","epeyi","esasen","esnasında","etmesi","etraflı","etraflıca","etti","ettiği","ettiğini","evleviyetle","evvel","evvela","evvelce","evvelden","evvelemirde","evveli","eđer","eğer","fakat","filanca","gah","gayet","gayetle","gayri","gayrı","gelgelelim","gene","gerek","gerçi","geçende","geçenlerde","gibi","gibilerden","gibisinden","gine","göre","gırla","hakeza","halbuki","halen","halihazırda","haliyle","handiyse","hangi","hangisi","hani","hariç","hasebiyle","hasılı","hatta","hele","hem","henüz","hep","hepsi","her","herhangi","herkes","herkesin","hiç","hiçbir","hiçbiri","hoş","hulasaten","iken","iki","ila","ile","ilen","ilgili","ilk","illa","illaki","imdi","indinde","inen","insermi","ise","ister","itibaren","itibariyle","itibarıyla","iyi","iyice","iyicene","için","iş","işte","iţte","kadar","kaffesi","kah","kala","kanýmca","karşın","katrilyon","kaynak","kaçı","kelli","kendi","kendilerine","kendini","kendisi","kendisine","kendisini","kere","kez","keza","kezalik","keşke","keţke","ki","kim","kimden","kime","kimi","kimisi","kimse","kimsecik","kimsecikler","külliyen","kýrk","kýsaca","kırk","kısaca","lakin","leh","lütfen","maada","madem","mademki","mamafih","mebni","međer","meğer","meğerki","meğerse","milyar","milyon","mu","mü","mý","mı","nasýl","nasıl","nasılsa","nazaran","naşi","ne","neden","nedeniyle","nedenle","nedense","nerde","nerden","nerdeyse","nere","nerede","nereden","neredeyse","neresi","nereye","netekim","neye","neyi","neyse","nice","nihayet","nihayetinde","nitekim","niye","niçin","o","olan","olarak","oldu","olduklarını","oldukça","olduğu","olduğunu","olmadı","olmadığı","olmak","olması","olmayan","olmaz","olsa","olsun","olup","olur","olursa","oluyor","on","ona","onca","onculayın","onda","ondan","onlar","onlardan","onlari","onlarýn","onları","onların","onu","onun","oracık","oracıkta","orada","oradan","oranca","oranla","oraya","otuz","oysa","oysaki","pek","pekala","peki","pekçe","peyderpey","rağmen","sadece","sahi","sahiden","sana","sanki","sekiz","seksen","sen","senden","seni","senin","siz","sizden","sizi","sizin","sonra","sonradan","sonraları","sonunda","tabii","tam","tamam","tamamen","tamamıyla","tarafından","tek","trilyon","tüm","var","vardı","vasıtasıyla","ve","velev","velhasıl","velhasılıkelam","veya","veyahut","ya","yahut","yakinen","yakında","yakından","yakınlarda","yalnız","yalnızca","yani","yapacak","yapmak","yaptı","yaptıkları","yaptığı","yaptığını","yapılan","yapılması","yapıyor","yedi","yeniden","yenilerde","yerine","yetmiþ","yetmiş","yetmiţ","yine","yirmi","yok","yoksa","yoluyla","yüz","yüzünden","zarfında","zaten","zati","zira","çabuk","çabukça","çeşitli","çok","çokları","çoklarınca","çokluk","çoklukla","çokça","çoğu","çoğun","çoğunca","çoğunlukla","çünkü","öbür","öbürkü","öbürü","önce","önceden","önceleri","öncelikle","öteki","ötekisi","öyle","öylece","öylelikle","öylemesine","öz","üzere","üç","þey","þeyden","þeyi","þeyler","þu","þuna","þunda","þundan","þunu","şayet","şey","şeyden","şeyi","şeyler","şu","şuna","şuncacık","şunda","şundan","şunlar","şunları","şunu","şunun","şura","şuracık","şuracıkta","şurası","şöyle","ţayet","ţimdi","ţu","ţöyle"],"uk":["авжеж","адже","але","б","без","був","була","були","було","бути","більш","вам","вас","весь","вздовж","ви","вниз","внизу","вона","вони","воно","все","всередині","всіх","від","він","да","давай","давати","де","дещо","для","до","з","завжди","замість","й","коли","ледве","майже","ми","навколо","навіть","нам","от","отже","отож","поза","про","під","та","так","такий","також","те","ти","тобто","тож","тощо","хоча","це","цей","чи","чого","що","як","який","якої","є","із","інших","їх","її"],"ur":["آئی","آئے","آج","آخر","آخرکبر","آدهی","آًب","آٹھ","آیب","اة","اخبزت","اختتبم","ادھر","ارد","اردگرد","ارکبى","اش","اضتعوبل","اضتعوبلات","اضطرذ","اضکب","اضکی","اضکے","اطراف","اغیب","افراد","الگ","اور","اوًچب","اوًچبئی","اوًچی","اوًچے","اى","اً","اًذر","اًہیں","اٹھبًب","اپٌب","اپٌے","اچھب","اچھی","اچھے","اکثر","اکٹھب","اکٹھی","اکٹھے","اکیلا","اکیلی","اکیلے","اگرچہ","اہن","ایطے","ایک","ب","ت","تبزٍ","تت","تر","ترتیت","تریي","تعذاد","تن","تو","توبم","توہی","توہیں","تٌہب","تک","تھب","تھوڑا","تھوڑی","تھوڑے","تھی","تھے","تیي","ثب","ثبئیں","ثبترتیت","ثبری","ثبرے","ثبعث","ثبلا","ثبلترتیت","ثبہر","ثدبئے","ثرآں","ثراں","ثرش","ثعذ","ثغیر","ثلٌذ","ثلٌذوثبلا","ثلکہ","ثي","ثٌب","ثٌبرہب","ثٌبرہی","ثٌبرہے","ثٌبًب","ثٌذ","ثٌذکرو","ثٌذکرًب","ثٌذی","ثڑا","ثڑوں","ثڑی","ثڑے","ثھر","ثھرا","ثھراہوا","ثھرپور","ثھی","ثہت","ثہتر","ثہتری","ثہتریي","ثیچ","ج","خب","خبرہب","خبرہی","خبرہے","خبهوظ","خبًب","خبًتب","خبًتی","خبًتے","خبًٌب","خت","ختن","خجکہ","خص","خططرذ","خلذی","خو","خواى","خوًہی","خوکہ","خٌبة","خگہ","خگہوں","خگہیں","خیطب","خیطبکہ","در","درخبت","درخہ","درخے","درزقیقت","درضت","دش","دفعہ","دلچطپ","دلچطپی","دلچطپیبں","دو","دور","دوراى","دوضرا","دوضروں","دوضری","دوضرے","دوًوں","دکھبئیں","دکھبتب","دکھبتی","دکھبتے","دکھبو","دکھبًب","دکھبیب","دی","دیب","دیتب","دیتی","دیتے","دیر","دیٌب","دیکھو","دیکھٌب","دیکھی","دیکھیں","دے","ر","راضتوں","راضتہ","راضتے","رریعہ","رریعے","رکي","رکھ","رکھب","رکھتب","رکھتبہوں","رکھتی","رکھتے","رکھی","رکھے","رہب","رہی","رہے","ز","زبصل","زبضر","زبل","زبلات","زبلیہ","زصوں","زصہ","زصے","زقبئق","زقیتیں","زقیقت","زکن","زکویہ","زیبدٍ","صبف","صسیر","صفر","صورت","صورتسبل","صورتوں","صورتیں","ض","ضبت","ضبتھ","ضبدٍ","ضبرا","ضبرے","ضبل","ضبلوں","ضت","ضرور","ضرورت","ضروری","ضلطلہ","ضوچ","ضوچب","ضوچتب","ضوچتی","ضوچتے","ضوچو","ضوچٌب","ضوچی","ضوچیں","ضکب","ضکتب","ضکتی","ضکتے","ضکٌب","ضکی","ضکے","ضیذھب","ضیذھی","ضیذھے","ضیکٌڈ","ضے","طرف","طریق","طریقوں","طریقہ","طریقے","طور","طورپر","ظبہر","ع","عذد","عظین","علاقوں","علاقہ","علاقے","علاوٍ","عووهی","غبیذ","غخص","غذ","غروع","غروعبت","غے","فرد","فی","ق","قجل","قجیلہ","قطن","لئے","لا","لازهی","لو","لوجب","لوجی","لوجے","لوسبت","لوسہ","لوگ","لوگوں","لڑکپي","لگتب","لگتی","لگتے","لگٌب","لگی","لگیں","لگے","لی","لیب","لیٌب","لیں","لے","ه","هتعلق","هختلف","هسترم","هسترهہ","هسطوش","هسیذ","هطئلہ","هطئلے","هطبئل","هطتعول","هطلق","هعلوم","هػتول","هلا","هوکي","هوکٌبت","هوکٌہ","هٌبضت","هڑا","هڑًب","هڑے","هکول","هگر","هہرثبى","هیرا","هیری","هیرے","هیں","و","وار","والے","وٍ","ًئی","ًئے","ًب","ًبپطٌذ","ًبگسیر","ًطجت","ًقطہ","ًو","ًوخواى","ًکبلٌب","ًکتہ","ًہ","ًہیں","ًیب","ًے","ٓ آش","ٹھیک","پبئے","پبش","پبًب","پبًچ","پر","پراًب","پطٌذ","پل","پورا","پوچھب","پوچھتب","پوچھتی","پوچھتے","پوچھو","پوچھوں","پوچھٌب","پوچھیں","پچھلا","پھر","پہلا","پہلی","پہلےضی","پہلےضے","پہلےضےہی","پیع","چبر","چبہب","چبہٌب","چبہے","چلا","چلو","چلیں","چلے","چکب","چکی","چکیں","چکے","چھوٹب","چھوٹوں","چھوٹی","چھوٹے","چھہ","چیسیں","ڈھوًڈا","ڈھوًڈلیب","ڈھوًڈو","ڈھوًڈًب","ڈھوًڈی","ڈھوًڈیں","ک","کئی","کئے","کب","کبفی","کبم","کت","کجھی","کرا","کرتب","کرتبہوں","کرتی","کرتے","کرتےہو","کررہب","کررہی","کررہے","کرو","کرًب","کریں","کرے","کطی","کل","کن","کوئی","کوتر","کورا","کوروں","کورٍ","کورے","کوطي","کوى","کوًطب","کوًطی","کوًطے","کھولا","کھولو","کھولٌب","کھولی","کھولیں","کھولے","کہ","کہب","کہتب","کہتی","کہتے","کہو","کہوں","کہٌب","کہی","کہیں","کہے","کی","کیب","کیطب","کیطرف","کیطے","کیلئے","کیوًکہ","کیوں","کیے","کے","کےثعذ","کےرریعے","گئی","گئے","گب","گرد","گروٍ","گروپ","گروہوں","گٌتی","گی","گیب","گے","ہر","ہن","ہو","ہوئی","ہوئے","ہوا","ہوبرا","ہوبری","ہوبرے","ہوتب","ہوتی","ہوتے","ہورہب","ہورہی","ہورہے","ہوضکتب","ہوضکتی","ہوضکتے","ہوًب","ہوًی","ہوًے","ہوچکب","ہوچکی","ہوچکے","ہوگئی","ہوگئے","ہوگیب","ہوں","ہی","ہیں","ہے","ی","یقیٌی","یہ","یہبں"],"vi":["a ha","a-lô","ai","ai ai","ai nấy","alô","amen","anh","bao giờ","bao lâu","bao nhiêu","bao nả","bay biến","biết","biết bao","biết bao nhiêu","biết chừng nào","biết mấy","biết đâu","biết đâu chừng","biết đâu đấy","bà","bài","bác","bây bẩy","bây chừ","bây giờ","bây nhiêu","bèn","béng","bông","bạn","bản","bất chợt","bất cứ","bất giác","bất kì","bất kể","bất kỳ","bất luận","bất nhược","bất quá","bất thình lình","bất tử","bất đồ","bấy","bấy chầy","bấy chừ","bấy giờ","bấy lâu","bấy lâu nay","bấy nay","bấy nhiêu","bập bà bập bõm","bập bõm","bắt đầu từ","bằng","bằng không","bằng nấy","bằng ấy","bển","bệt","bị","bỏ mẹ","bỗng","bỗng chốc","bỗng dưng","bỗng không","bỗng nhiên","bỗng đâu","bộ","bội phần","bớ","bởi","bởi chưng","bởi nhưng","bởi thế","bởi vì","bởi vậy","bức","cao","cha","cha chả","chao ôi","chiếc","cho","cho nên","cho tới","cho tới khi","cho đến","cho đến khi","choa","chu cha","chui cha","chung cục","chung qui","chung quy","chung quy lại","chuyện","chành chạnh","chí chết","chính","chính là","chính thị","chùn chùn","chùn chũn","chú","chú mày","chú mình","chúng mình","chúng ta","chúng tôi","chăn chắn","chăng","chưa","chầm chập","chậc","chắc","chắc hẳn","chẳng lẽ","chẳng những","chẳng nữa","chẳng phải","chết nỗi","chết thật","chết tiệt","chỉ","chỉn","chốc chốc","chớ","chớ chi","chợt","chủn","chứ","chứ lị","coi bộ","coi mòi","con","cu cậu","cuốn","cuộc","càng","các","cái","cây","còn","có","có chăng là","có dễ","có thể","có vẻ","cóc khô","cô","cô mình","công nhiên","cùng","cùng cực","cùng nhau","cùng với","căn","căn cắt","cũng","cũng như","cũng vậy","cũng vậy thôi","cơ","cơ chừng","cơ hồ","cơ mà","cơn","cả","cả thảy","cả thể","cảm ơn","cần","cật lực","cật sức","cậu","cổ lai","của","cứ","cứ việc","cực lực","do","do vì","do vậy","do đó","duy","dào","dì","dù cho","dù rằng","dưới","dạ","dần dà","dần dần","dầu sao","dẫu","dẫu sao","dễ sợ","dễ thường","dở chừng","dữ","em","giữa","gì","hay","hoàn toàn","hoặc","hơn","hầu hết","họ","hỏi","khi","khác","không","luôn","là","làm","lên","lúc","lại","lần","lớn","muốn","mà","mình","mỗi","một","một cách","mới","mợ","ngay","ngay cả","ngay khi","ngay lúc","ngay lập tức","ngay tức khắc","ngay từ","nghe chừng","nghe đâu","nghen","nghiễm nhiên","nghỉm","ngoài","ngoài ra","ngoải","ngày","ngày càng","ngày ngày","ngày xưa","ngày xửa","ngôi","ngõ hầu","ngăn ngắt","ngươi","người","ngọn","ngọt","ngộ nhỡ","nh","nhau","nhiên hậu","nhiều","nhiệt liệt","nhung nhăng","nhà","nhân dịp","nhân tiện","nhé","nhón nhén","như","như chơi","như không","như quả","như thể","như tuồng","như vậy","nhưng","nhưng mà","nhược bằng","nhất","nhất loạt","nhất luật","nhất mực","nhất nhất","nhất quyết","nhất sinh","nhất thiết","nhất tâm","nhất tề","nhất đán","nhất định","nhận","nhỉ","nhỡ ra","những","những ai","những như","nào","này","nên","nên chi","nó","nóc","nói","năm","nơi","nấy","nếu","nếu như","nền","nọ","nớ","nức nở","nữa","oai oái","oái","pho","phè","phóc","phót","phăn phắt","phương chi","phải","phải chi","phải chăng","phắt","phỉ phui","phỏng","phỏng như","phốc","phụt","phứt","qua","qua quít","qua quýt","quyết","quyết nhiên","quyển","quá","quá chừng","quá lắm","quá sá","quá thể","quá trời","quá xá","quá đỗi","quá độ","quá ư","quý hồ","quả","quả là","quả tang","quả thật","quả tình","quả vậy","quả đúng","ra","ra phết","ra sao","ra trò","ren rén","riu ríu","riêng","riệt","rày","ráo","ráo trọi","rén","rích","rón rén","rút cục","răng","rất","rằng","rằng là","rốt cuộc","rốt cục","rồi","rứa","sa sả","sao","sau","sau chót","sau cuối","sau cùng","sau đó","so","song le","suýt","sì","sạch","sất","sắp","sẽ","số","số là","sốt sột","sở dĩ","sự","tanh","tha hồ","than ôi","thanh","theo","thi thoảng","thoạt","thoạt nhiên","thoắt","thuần","thà","thà là","thà rằng","thành ra","thành thử","thái quá","tháng","thì","thì thôi","thình lình","thím","thôi","thúng thắng","thương ôi","thường","thảo hèn","thảo nào","thấy","thẩy","thậm","thậm chí","thật lực","thật ra","thật vậy","thế","thế là","thế mà","thế nào","thế nên","thế ra","thế thì","thế à","thếch","thỉnh thoảng","thỏm","thốc","thốc tháo","thốt","thốt nhiên","thộc","thời gian","thục mạng","thửa","thực ra","thực sự","thực vậy","tiếp theo","tiếp đó","tiện thể","toà","toé khói","toẹt","trong","trên","trước","trước kia","trước nay","trước tiên","trước đây","trước đó","trếu tráo","trển","trệt","trệu trạo","trỏng","trời đất ơi","trừ phi","tuy","tuy nhiên","tuy rằng","tuy thế","tuy vậy","tuyệt nhiên","tuần tự","tuốt luốt","tuốt tuồn tuột","tuốt tuột","tà tà","tênh","tít mù","tò te","tôi","tông tốc","tù tì","tăm tắp","tại","tại vì","tấm","tấn","tất cả","tất thảy","tất tần tật","tất tật","tắp","tắp lự","tọt","tỏ ra","tỏ vẻ","tốc tả","tối ư","tột","tớ","tới","tức thì","tức tốc","từ","từng","tự vì","tựu trung","veo","veo veo","việc","vung thiên địa","vung tàn tán","vung tán tàn","và","vào","vâng","vèo","vì","vì chưng","vì thế","vì vậy","ví bằng","ví dù","ví phỏng","ví thử","vô hình trung","vô kể","vô luận","vô vàn","văng tê","vạn nhất","vả chăng","vả lại","vẫn","vậy","vậy là","vậy thì","về","vị tất","vốn dĩ","với","với lại","vở","vụt","vừa","vừa mới","xa xả","xiết bao","xon xón","xoành xoạch","xoét","xoẳn","xoẹt","xuất kì bất ý","xuất kỳ bất ý","xuể","xuống","xăm xúi","xăm xăm","xăm xắm","xềnh xệch","xệp","à","à ơi","ào","á","á à","ái","ái chà","ái dà","áng","âu là","ô hay","ô hô","ô kê","ô kìa","ôi chao","ôi thôi","ông","úi","úi chà","úi dào","ý","ý chừng","ý da","đang","đi","điều","đành đạch","đáng lí","đáng lý","đáng lẽ","đánh đùng","đáo để","đây","đã","đó","được","đại loại","đại nhân","đại phàm","đại để","đến","đến nỗi","đều","để","ơ","ơ hay","ơ kìa","ơi","ư","ạ","ạ ơi","ấy","ầu ơ","ắt","ắt hẳn","ắt là","ối dào","ối giời","ối giời ơi","ồ","ổng","ớ","ờ","ở","ở trên","ủa","ứ hự","ứ ừ","ừ","ử"],"yo":["a","an","bá","bí","bẹ̀rẹ̀","fún","fẹ́","gbogbo","inú","jù","jẹ","jẹ́","kan","kì","kí","kò","láti","lè","lọ","mi","mo","máa","mọ̀","ni","náà","ní","nígbà","nítorí","nǹkan","o","padà","pé","púpọ̀","pẹ̀lú","rẹ̀","sì","sí","sínú","ṣ","ti","tí","wà","wá","wọn","wọ́n","yìí","àti","àwọn","é","í","òun","ó","ń","ńlá","ṣe","ṣé","ṣùgbọ́n","ẹmọ́","ọjọ́","ọ̀pọ̀lọpọ̀"],"zu":["futhi","kahle","kakhulu","kanye","khona","kodwa","kungani","kusho","la","lakhe","lapho","mina","ngesikhathi","nje","phansi","phezulu","u","ukuba","ukuthi","ukuze","uma","wahamba","wakhe","wami","wase","wathi","yakhe","zakhe","zonke"]}
},{}],"nlplearn":[function(require,module,exports){
module.exports = require("./dist");
},{"./dist":2}]},{},[]);

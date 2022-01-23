"use strict";

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
 * @param {Array<number>} arr - Array of numbers.
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
 * @param {Array<number>} v1 - First vector.
 * @param {Array<number>} v2 - Second vector.
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
  /** @type {Array<Array<number>>} */

  /** @type {Array<any>} */

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
     * @param {Array<Array<number>>} X - Document-Term matrix
     *  (vectorized text).
     * @param {Array<any>} Y - Correspondent classification
     *  array.
     * @returns {NLPClassifier} reference to current
     *  classifier.
     */

  }, {
    key: "fit",
    value: function fit(X, Y) {
      if (!(X instanceof Array && X[0] && X[0] instanceof Array && typeof X[0][0] === "number")) throw new TypeError("'X' must be a 2d numeric array.");
      if (!(Y instanceof Array)) throw new TypeError("'Y' must be a 1d array.");
      /** @type {Array<Array<number>>} */

      var x = (0, _copy.deepCopy)(X);
      /** @type {Array<any>} */

      var y = (0, _copy.deepCopy)(Y);

      _classPrivateFieldSet(this, _classes, Array.from(new Set(y)));

      for (var i = 0; i < y.length; ++i) {
        y[i] = _classPrivateFieldGet(this, _classes).indexOf(y[i]);
      }
      /** @type {Array<Array<number>>} */


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
     * @param {Array<Array<number>>} X - Document-Term matrix
     *  (vectorized text).
     * @returns {Array<any>} an array of predicted values (classes).
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
     * @param {Array<Array<number>>} X - Document-Term matrix
     *  (vectorized text).
     * @returns {Array<Array<any>>} a matrix of match probability
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
     * @param {Array<Array<number>>} x - Document-term matrix.
     * @param {Array<any>} y - Classes (map).
     * @returns {Array<Array<number>>} the TF matrix (average).
     */

  }, {
    key: "loadModel",
    value:
    /**
     * @typedef {Object} NLPClassifierModel
     * @property {string} idf - IDFMetrics value.
     * @property {string} mtr - CLFMetrics value.
     * @property {Array<Array<number>>|null} coef - Fitted
     *  classifier coefficients (when available).
     * @property {string} dist - DistMetrics value.
     * @property {Array<any>|null} classes - Fitted
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
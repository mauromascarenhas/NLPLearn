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
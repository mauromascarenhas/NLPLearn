"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Classifier", {
  enumerable: true,
  get: function get() {
    return _nlpclassifier["default"];
  }
});
Object.defineProperty(exports, "Copy", {
  enumerable: true,
  get: function get() {
    return _copy["default"];
  }
});
Object.defineProperty(exports, "Distance", {
  enumerable: true,
  get: function get() {
    return _distance["default"];
  }
});
Object.defineProperty(exports, "NLTKStopWords", {
  enumerable: true,
  get: function get() {
    return _stopwords["default"];
  }
});
Object.defineProperty(exports, "Preprocessor", {
  enumerable: true,
  get: function get() {
    return _preprocessor["default"];
  }
});
Object.defineProperty(exports, "Stemmer", {
  enumerable: true,
  get: function get() {
    return _stemmer["default"];
  }
});
Object.defineProperty(exports, "StopWords", {
  enumerable: true,
  get: function get() {
    return _stopwords2["default"];
  }
});
Object.defineProperty(exports, "Tokenization", {
  enumerable: true,
  get: function get() {
    return _tokenization["default"];
  }
});
Object.defineProperty(exports, "Vectorizer", {
  enumerable: true,
  get: function get() {
    return _vectorizer["default"];
  }
});

var _copy = _interopRequireDefault(require("./utils/copy"));

var _distance = _interopRequireDefault(require("./utils/distance"));

var _preprocessor = _interopRequireDefault(require("./utils/preprocessor"));

var _nlpclassifier = _interopRequireDefault(require("./classifier/nlpclassifier"));

var _stopwords = _interopRequireDefault(require("./nltk-data/stopwords.json"));

var _stemmer = _interopRequireDefault(require("./preprocessing/stemmer"));

var _stopwords2 = _interopRequireDefault(require("./preprocessing/stopwords"));

var _tokenization = _interopRequireDefault(require("./preprocessing/tokenization"));

var _vectorizer = _interopRequireDefault(require("./preprocessing/vectorizer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
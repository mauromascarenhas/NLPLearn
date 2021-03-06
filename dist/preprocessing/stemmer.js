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
  value: [["ns", 1, "m", []], ["??es", 3, "??o", []], ["??es", 1, "??o", ["m??es", "mam??es"]], ["ais", 1, "al", ["cais", "mais"]], ["??is", 2, "el", []], ["eis", 2, "el", []], ["??is", 2, "ol", []], ["is", 2, "il", ["l??pis", "cais", "mais", "cr??cis", "biqu??nis", "pois", "depois", "dois", "leis"]], ["les", 3, "l", []], ["res", 3, "r", ["??rvores"]], ["s", 2, "", ["ali??s", "pires", "l??pis", "cais", "mais", "mas", "menos", "f??rias", "fezes", "p??sames", "cr??cis", "g??s", "atr??s", "mois??s", "atrav??s", "conv??s", "??s", "pa??s", "ap??s", "ambas", "ambos", "messias", "depois"]]]
};
var _feminine_reduction = {
  writable: true,
  value: [["ona", 3, "??o", ["abandona", "lona", "iona", "cortisona", "mon??tona", "maratona", "acetona", "detona", "carona"]], ["ora", 3, "or", []], ["na", 4, "no", ["carona", "abandona", "lona", "iona", "cortisona", "mon??tona", "maratona", "acetona", "detona", "guiana", "campana", "grana", "caravana", "banana", "paisana"]], ["inha", 3, "inho", ["rainha", "linha", "minha"]], ["esa", 3, "??s", ["mesa", "obesa", "princesa", "turquesa", "ilesa", "pesa", "presa"]], ["osa", 3, "oso", ["mucosa", "prosa"]], ["??aca", 3, "??aco", []], ["ica", 3, "ico", ["dica"]], ["ada", 2, "ado", ["pitada"]], ["ida", 3, "ido", ["vida"]], ["??da", 3, "ido", ["reca??da", "sa??da", "d??vida"]], ["ima", 3, "imo", ["v??tima"]], ["iva", 3, "ivo", ["saliva", "oliva"]], ["eira", 3, "eiro", ["beira", "cadeira", "frigideira", "bandeira", "feira", "capoeira", "barreira", "fronteira", "besteira", "poeira"]], ["??", 2, "??o", ["amanh??", "arapu??", "f??", "div??"]]]
};
var _adverb_reduction = {
  writable: true,
  value: [["mente", 4, "", ["experimente"]]]
};
var _argumentative_diminutive_reduction = {
  writable: true,
  value: [["d??ssimo", 5, "", []], ["abil??ssimo", 5, "", []], ["??ssimo", 3, "", []], ["??simo", 3, "", []], ["??rrimo", 4, "", []], ["zinho", 2, "", []], ["quinho", 4, "c", []], ["uinho", 4, "", []], ["adinho", 3, "", []], ["inho", 3, "", ["caminho", "cominho"]], ["alh??o", 4, "", []], ["u??a", 4, "", []], ["a??o", 4, "", ["antebra??o"]], ["a??a", 4, "", []], ["ad??o", 4, "", []], ["id??o", 4, "", []], ["??zio", 3, "", ["top??zio"]], ["arraz", 4, "", []], ["zarr??o", 3, "", []], ["arr??o", 4, "", []], ["arra", 3, "", []], ["z??o", 2, "", ["coaliz??o"]], ["??o", 3, "", ["camar??o", "chimarr??o", "can????o", "cora????o", "embri??o", "grot??o", "glut??o", "fic????o", "fog??o", "fei????o", "furac??o", "gam??o", "lampi??o", "le??o", "macac??o", "na????o", "??rf??o", "org??o", "patr??o", "port??o", "quinh??o", "rinc??o", "tra????o", "falc??o", "espi??o", "mam??o", "foli??o", "cord??o", "aptid??o", "campe??o", "colch??o", "lim??o", "leil??o", "mel??o", "bar??o", "milh??o", "bilh??o", "fus??o", "crist??o", "ilus??o", "capit??o", "esta????o", "sen??o"]]]
};
var _noun_suffix_reduction = {
  writable: true,
  value: [["encialista", 4, "", []], ["alista", 5, "", []], ["agem", 3, "", ["coragem", "chantagem", "vantagem", "carruagem"]], ["iamento", 4, "", []], ["amento", 3, "", ["firmamento", "fundamento", "departamento"]], ["imento", 3, "", []], ["mento", 6, "", ["firmamento", "elemento", "complemento", "instrumento", "departamento"]], ["alizado", 4, "", []], ["atizado", 4, "", []], ["tizado", 4, "", ["alfabetizado"]], ["izado", 5, "", ["organizado", "pulverizado"]], ["ativo", 4, "", ["pejorativo", "relativo"]], ["tivo", 4, "", ["relativo"]], ["ivo", 4, "", ["passivo", "possessivo", "pejorativo", "positivo"]], ["ado", 2, "", ["grado"]], ["ido", 3, "", ["c??ndido", "consolido", "r??pido", "decido", "t??mido", "duvido", "marido"]], ["ador", 3, "", []], ["edor", 3, "", []], ["idor", 4, "", ["ouvidor"]], ["dor", 4, "", ["ouvidor"]], ["sor", 4, "", ["assessor"]], ["atoria", 5, "", []], ["tor", 3, "", ["benfeitor", "leitor", "editor", "pastor", "produtor", "promotor", "consultor"]], ["or", 2, "", ["motor", "melhor", "redor", "rigor", "sensor", "tambor", "tumor", "assessor", "benfeitor", "pastor", "terior", "favor", "autor"]], ["abilidade", 5, "", []], ["icionista", 4, "", []], ["cionista", 5, "", []], ["ionista", 5, "", []], ["ionar", 5, "", []], ["ional", 4, "", []], ["??ncia", 3, "", []], ["??ncia", 4, "", ["ambul??ncia"]], ["edouro", 3, "", []], ["queiro", 3, "c", []], ["adeiro", 4, "", ["desfiladeiro"]], ["eiro", 3, "", ["desfiladeiro", "pioneiro", "mosteiro"]], ["uoso", 3, "", []], ["oso", 3, "", ["precioso"]], ["aliza??", 5, "", []], ["atiza??", 5, "", []], ["tiza??", 5, "", []], ["iza??", 5, "", ["organiza??"]], ["a??", 3, "", ["equa??", "rela??"]], ["i??", 3, "", ["elei????o"]], ["??rio", 3, "", ["volunt??rio", "sal??rio", "anivers??rio", "di??rio", "lion??rio", "arm??rio", "aleat??rio", "volunt??rio", "sal??rio", "anivers??rio", "di??rio", "compuls??rio", "lion??rio", "pr??prio", "st??rio", "arm??rio"]], ["??rio", 6, "", []], ["??s", 4, "", []], ["eza", 3, "", []], ["ez", 4, "", []], ["esco", 4, "", []], ["ante", 2, "", ["gigante", "elefante", "adiante", "possante", "instante", "restaurante"]], ["??stico", 4, "", ["eclesi??stico"]], ["al??stico", 3, "", []], ["??utico", 4, "", []], ["??utico", 4, "", []], ["tico", 3, "", ["pol??tico", "eclesi??stico", "diagnostico", "pr??tico", "dom??stico", "diagn??stico", "id??ntico", "alop??tico", "art??stico", "aut??ntico", "ecl??tico", "cr??tico", "critico"]], ["ico", 4, "", ["tico", "p??blico", "explico"]], ["ividade", 5, "", []], ["idade", 4, "", ["autoridade", "comunidade"]], ["oria", 4, "", ["categoria"]], ["encial", 5, "", []], ["ista", 4, "", []], ["auta", 5, "", []], ["quice", 4, "c", []], ["ice", 4, "", ["c??mplice"]], ["??aco", 3, "", []], ["ente", 4, "", ["freq??ente", "alimente", "acrescente", "permanente", "oriente", "aparente"]], ["ense", 5, "", []], ["inal", 3, "", []], ["ano", 4, "", []], ["??vel", 2, "", ["af??vel", "razo??vel", "pot??vel", "vulner??vel"]], ["??vel", 3, "", ["poss??vel"]], ["vel", 5, "", ["poss??vel", "vulner??vel", "sol??vel"]], ["bil", 3, "vel", []], ["ura", 4, "", ["imatura", "acupuntura", "costura"]], ["ural", 4, "", []], ["ual", 3, "", ["bissexual", "virtual", "visual", "pontual"]], ["ial", 3, "", []], ["al", 4, "", ["afinal", "animal", "estatal", "bissexual", "desleal", "fiscal", "formal", "pessoal", "liberal", "postal", "virtual", "visual", "pontual", "sideral", "sucursal"]], ["alismo", 4, "", []], ["ivismo", 4, "", []], ["ismo", 3, "", ["cinismo"]]]
};
var _verb_suffix_reduction = {
  writable: true,
  value: [["ar??amo", 2, "", []], ["??ssemo", 2, "", []], ["er??amo", 2, "", []], ["??ssemo", 2, "", []], ["ir??amo", 3, "", []], ["??ssemo", 3, "", []], ["??ramo", 2, "", []], ["??rei", 2, "", []], ["aremo", 2, "", []], ["ariam", 2, "", []], ["ar??ei", 2, "", []], ["??ssei", 2, "", []], ["assem", 2, "", []], ["??vamo", 2, "", []], ["??ramo", 3, "", []], ["eremo", 3, "", []], ["eriam", 3, "", []], ["er??ei", 3, "", []], ["??ssei", 3, "", []], ["essem", 3, "", []], ["??ramo", 3, "", []], ["iremo", 3, "", []], ["iriam", 3, "", []], ["ir??ei", 3, "", []], ["??ssei", 3, "", []], ["issem", 3, "", []], ["ando", 2, "", []], ["endo", 3, "", []], ["indo", 3, "", []], ["ondo", 3, "", []], ["aram", 2, "", []], ["ar??o", 2, "", []], ["arde", 2, "", []], ["arei", 2, "", []], ["arem", 2, "", []], ["aria", 2, "", []], ["armo", 2, "", []], ["asse", 2, "", []], ["aste", 2, "", []], ["avam", 2, "", ["agravam"]], ["??vei", 2, "", []], ["eram", 3, "", []], ["er??o", 3, "", []], ["erde", 3, "", []], ["erei", 3, "", []], ["??rei", 3, "", []], ["erem", 3, "", []], ["eria", 3, "", []], ["ermo", 3, "", []], ["esse", 3, "", []], ["este", 3, "", ["faroeste", "agreste"]], ["??amo", 3, "", []], ["iram", 3, "", []], ["??ram", 3, "", []], ["ir??o", 2, "", []], ["irde", 2, "", []], ["irei", 3, "", ["admirei"]], ["irem", 3, "", ["adquirem"]], ["iria", 3, "", []], ["irmo", 3, "", []], ["isse", 3, "", []], ["iste", 4, "", []], ["iava", 4, "", ["ampliava"]], ["amo", 2, "", []], ["iona", 3, "", []], ["ara", 2, "", ["arara", "prepara"]], ["ar??", 2, "", ["alvar??"]], ["are", 2, "", ["prepare"]], ["ava", 2, "", ["agrava"]], ["emo", 2, "", []], ["era", 3, "", ["acelera", "espera"]], ["er??", 3, "", []], ["ere", 3, "", ["espere"]], ["iam", 3, "", ["enfiam", "ampliam", "elogiam", "ensaiam"]], ["??ei", 3, "", []], ["imo", 3, "", ["reprimo", "intimo", "??ntimo", "nimo", "queimo", "ximo"]], ["ira", 3, "", ["fronteira", "s??tira"]], ["??do", 3, "", ["ir??"]], ["tizar", 4, "", ["alfabetizar"]], ["izar", 5, "", ["organizar"]], ["itar", 5, "", ["acreditar", "explicitar", "estreitar"]], ["ire", 3, "", ["adquire"]], ["omo", 3, "", []], ["ai", 2, "", []], ["am", 2, "", []], ["ear", 4, "", ["alardear", "nuclear"]], ["ar", 2, "", ["azar", "bazaar", "patamar"]], ["uei", 3, "", []], ["u??a", 5, "u", []], ["ei", 3, "", []], ["guem", 3, "g", []], ["em", 2, "", ["alem", "virgem"]], ["er", 2, "", ["??ter", "pier"]], ["eu", 3, "", ["chapeu"]], ["ia", 3, "", ["est??ria", "fatia", "acia", "praia", "elogia", "mania", "l??bia", "aprecia", "pol??cia", "arredia", "cheia", "??sia"]], ["ir", 3, "", ["freir"]], ["iu", 3, "", []], ["eou", 5, "", []], ["ou", 3, "", []], ["i", 3, "", []]]
};
var _vowel_removal = {
  writable: true,
  value: [["bil", 2, "vel", []], ["gue", 2, "g", ["gangue", "jegue"]], ["??", 3, "", []], ["??", 3, "", ["beb??"]], ["a", 3, "", ["??sia"]], ["e", 3, "", []], ["o", 3, "", ["??o"]]]
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
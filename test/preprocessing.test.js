"use strict";

import * as prep_util from "../src/utils/preprocessor";
import { PorterStemmer, RSLPStemmer } from "../src/preprocessing/stemmer";
import { StopWords } from "../src/preprocessing/stopwords";
import { NaiveWordTokenizer } from "../src/preprocessing/tokenization";
import { TFMetrics, IDFMetrics, TextVectorizer} from "../src/preprocessing/vectorizer";

describe("Tokenization tool", () => {
    const DOCS = ["Olá, mundo!", "mas que mundo cruel!", "muito bizarro", "apenas um teste",
        "_apenas um teste_", "apenas0 1um test2 com números 0.1 0,5 99'9 akdf'0 0's kkkk"];
    const DOCS_WON = [["Olá", "mundo"], ["mas", "que", "mundo", "cruel"],
        ["muito", "bizarro"], ["apenas", "teste"], ["_apenas", "teste_"],
        ["apenas", "test", "com", "números", "akdf", "kkkk"]];
    const DOCS_WHN = [["Olá", "mundo"], ["mas", "que", "mundo", "cruel"],
        ["muito", "bizarro"], ["apenas", "teste"], ["_apenas", "teste_"],
        ["apenas0", "test2", "com", "números", "0.1", "0,5", "99'9", "akdf'0", "kkkk"]];

    test.each(DOCS.map((e, i) => [e, DOCS_WON[i]]))("WordTokenizer - without numbers", (inp, out) => {
        let tokenizer = new NaiveWordTokenizer();
        expect(tokenizer.tokenize(inp)).toEqual(out);
    });
    
    test.each(DOCS.map((e, i) => [e, DOCS_WHN[i]]))("WordTokenizer - with numbers", (inp, out) => {
        let tokenizer = new NaiveWordTokenizer(false);
        expect(tokenizer.tokenize(inp)).toEqual(out);
    });
});

describe("Text stemmers", () => {
    let ews = ["important", "very", "liked", "like", "tokenization", "processing",
        "enormous", "important", "importing", "importation"];
    let ewl = ["import", "veri", "like", "like", "token", "process",
        "enorm", "import", "import", "import"];
    
    test.each(ews.map((e, i) => [e, ewl[i]]))("English (Porter) - %p => %p", (inp, out) => {
        expect(PorterStemmer.stem(inp)).toBe(out);
    });

    let pws = ["amigão", "amigo", "amigável", "imaginação", "imaginável", "imaginar",
        "texto", "contextualizar", "contextualização", "concatenar", "concatenação"];
    let pwl = ["amig", "amig", "amig", "imagin", "imagin", "imagin", "text", "contextual",
        "contextu", "concaten", "concaten"];

    test.each(pws.map((e, i) => [e, pwl[i]]))("Portuguese (Orengo RSLP) - %p => %p", (inp, out) => {
        expect(RSLPStemmer.stem(inp)).toBe(out);
    });
});

describe("Text vectorization tool", () => {
    const TOKENIZED_DOCS = [
        ["olá", "mundo"], ["mas", "que", "mundo", "cruel"],
        ["muito", "bizarro"], ["apenas", "teste"],
        ["apenas", "teste", "com", "números", "akdf", "kkkk"]
    ];
    const VOCABULARY = ["akdf", "apenas", "bizarro", "com", "cruel",
        "kkkk", "mas", "muito", "mundo", "números", "olá", "que", "teste"];

    const F2 = 1 / 2, F4 = 1 / 4, F6 = 1 / 6;
    const L1 = Math.log(2);
    const IDF1 = Math.log(5 / 1) + 1, IDF2 = Math.log(5 / 2) + 1,
        IDFS1 = Math.log(6 / 2) + 1, IDFS2 = Math.log(6 / 3) + 1;
    
    test("Text Vectorizer - TF: RAW, IDF: NONE", () => {
        let tv = new TextVectorizer(TFMetrics.RAW, IDFMetrics.NONE, VOCABULARY);
        expect(tv.fitTransform(TOKENIZED_DOCS)).toEqual([
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1]
        ]);
    });

    test("Text Vectorizer - TF: BOOL, IDF: NONE", () => {
        let tv = new TextVectorizer(TFMetrics.BOOL, IDFMetrics.NONE, VOCABULARY);
        expect(tv.fitTransform(TOKENIZED_DOCS)).toEqual([
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1]
        ]);
    });

    test("Text Vectorizer - TF: FREQ, IDF: NONE", () => {
        let tv = new TextVectorizer(TFMetrics.FREQ, IDFMetrics.NONE, VOCABULARY);
        expect(tv.fitTransform(TOKENIZED_DOCS)).toEqual([
            [0, 0, 0, 0, 0, 0, 0, 0, F2, 0, F2, 0, 0],
            [0, 0, 0, 0, F4, 0, F4, 0, F4, 0, 0, F4, 0],
            [0, 0, F2, 0, 0, 0, 0, F2, 0, 0, 0, 0, 0],
            [0, F2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, F2],
            [F6, F6, 0, F6, 0, F6, 0, 0, 0, F6, 0, 0, F6]
        ]);
    });

    test("Text Vectorizer - TF: LOG, IDF: NONE", () => {
        let tv = new TextVectorizer(TFMetrics.LOG, IDFMetrics.NONE, VOCABULARY);
        expect(tv.fitTransform(TOKENIZED_DOCS)).toEqual([
            [0, 0, 0, 0, 0, 0, 0, 0, L1, 0, L1, 0, 0],
            [0, 0, 0, 0, L1, 0, L1, 0, L1, 0, 0, L1, 0],
            [0, 0, L1, 0, 0, 0, 0, L1, 0, 0, 0, 0, 0],
            [0, L1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, L1],
            [L1, L1, 0, L1, 0, L1, 0, 0, 0, L1, 0, 0, L1]
        ]);
    });

    test("Text Vectorizer - TF: RAW, IDF: REGULAR", () => {
        let tv = new TextVectorizer(TFMetrics.RAW, IDFMetrics.REGULAR, VOCABULARY);
        expect(tv.fitTransform(TOKENIZED_DOCS)).toEqual([
            [0, 0, 0, 0, 0, 0, 0, 0, IDF2, 0, IDF1, 0, 0],
            [0, 0, 0, 0, IDF1, 0, IDF1, 0, IDF2, 0, 0, IDF1, 0],
            [0, 0, IDF1, 0, 0, 0, 0, IDF1, 0, 0, 0, 0, 0],
            [0, IDF2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, IDF2],
            [IDF1, IDF2, 0, IDF1, 0, IDF1, 0, 0, 0, IDF1, 0, 0, IDF2]
        ]);
    });

    test("Text Vectorizer - TF: RAW, IDF: SMOOTH", () => {
        let tv = new TextVectorizer(TFMetrics.RAW, IDFMetrics.SMOOTH, VOCABULARY);
        expect(tv.fitTransform(TOKENIZED_DOCS)).toEqual([
            [0, 0, 0, 0, 0, 0, 0, 0, IDFS2, 0, IDFS1, 0, 0],
            [0, 0, 0, 0, IDFS1, 0, IDFS1, 0, IDFS2, 0, 0, IDFS1, 0],
            [0, 0, IDFS1, 0, 0, 0, 0, IDFS1, 0, 0, 0, 0, 0],
            [0, IDFS2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, IDFS2],
            [IDFS1, IDFS2, 0, IDFS1, 0, IDFS1, 0, 0, 0, IDFS1, 0, 0, IDFS2]
        ]);
    });
});

describe("Text preprocessor utility", () => {
    test("TextProcessor - space normalization + uppercase + trim + strip accents", () => {
        let tp = new prep_util.TextProcessor(true, prep_util.TextCase.UPPERCASE, true, true,
            false, false, [], prep_util.StemmerType.NONE);
        expect(tp.fitTransform([
            "  Just a   regular   test   ",
            " is it   actually working?",
            " em português "
        ])).toEqual([
            "JUST A REGULAR TEST",
            "IS IT ACTUALLY WORKING?",
            "EM PORTUGUES"
        ]);
    });

    test("TextProcessor - space normalization + uppercase + strip accents", () => {
        let tp = new prep_util.TextProcessor(true, prep_util.TextCase.LOWERCASE, false, false,
            false, false, [], prep_util.StemmerType.NONE);
        expect(tp.fitTransform([
            "  just a   regular   test   ",
            " is it   actually working?",
            " em português "
        ])).toEqual([
            " just a regular test ",
            " is it actually working?",
            " em português "
        ]);
    });

    test("TextProcessor - space normalization + lowercase + remove numbers + stop list (pt-BR) + RSLP", () => {
        let tp = new prep_util.TextProcessor(true, prep_util.TextCase.LOWERCASE, false, true,
            true, true, StopWords.get("pt"), prep_util.StemmerType.RSLP);
        expect(tp.fitTransform([
            "  apenas um SiMpLes texto   ",
            " será que está a funcionar?",
            " em português "
        ])).toEqual([
            ["apen", "simpl", "text"],
            ["ser", "que", "est", "funcion"],
            ["portugu"]
        ]);
    });
})
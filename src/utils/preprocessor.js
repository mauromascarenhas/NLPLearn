"use strict";

import { NaiveWordTokenizer } from "../preprocessing/tokenization"
import { RSLPStemmer, PorterStemmer } from "../preprocessing/stemmer"

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
 const TextCase = Object.freeze({
    NONE: "NONE",
    LOWERCASE: "LOWERCASE",
    UPPERCASE: "UPPERCASE"
});

/**
 * Enumerator used so as to specify the stemmer to be used by TextProcessor
 * @enum {string}
 */
const StemmerType = Object.freeze({
    NONE: "NONE",
    RSLP: "RSLP",
    PORTER: "PORTER"
});

/**
 * Convenience class which provides a text preprocessing pipeline
 *  with predefined (and customizable) steps.
 */
class TextProcessor {

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
    constructor(normSpacing = true, normCase = TextCase.NONE, trimSpaces = true,
        stripAccents = false, tokenize = true, removeNumbers = false, stopwords = [],
        stemmerType = StemmerType.NONE){

        this.#checkPrimitive([
            { name: "normSpacing", type: "boolean", value: normSpacing },
            { name: "trimSpaces", type: "boolean", value: trimSpaces },
            { name: "stripAccents", type: "boolean", value: stripAccents },
            { name: "tokenize", type: "boolean", value: tokenize },
            { name: "removeNumbers", type: "boolean", value: removeNumbers }
        ]);

        this.#checkInstance([{ name: "stopwords", type: Array, value: stopwords }]);

        if (!normCase in TextCase) throw new Error("Invalid value for 'normCase'. It must be one of the object values available at TextCase object.");
        if (!stemmerType in StemmerType) throw new Error("Invalid value for 'normCase'. It must be one of the object values available at StemmerType object.");

        this.normCase = normCase;
        this.tokenize = tokenize;
        this.stopwords = [...stopwords];
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
    fit(X){ return this; }

    /**
     * Applies the requested transformations to the given document set. 
     * @param {string[]} X - 2d text array.
     * @returns {string[]|string[][]} the transformed text.
     */
    transform(X){
        if (!X instanceof Array) throw new TypeError("Invalid value for 'X'. It must be a 2d string array.");

        /** @type {string[]|string[][]} */
        let txts = [...X];
        if (this.normCase === TextCase.LOWERCASE) txts = txts.map((t) => t.toLocaleLowerCase());
        if (this.normSpacing) txts = txts.map(TextProcessor.#normalizeSpacing);
        if (this.trimSpaces) txts = txts.map((t) => t.trim());

        if (this.tokenize){
            let tokenizer = new NaiveWordTokenizer(this.removeNumbers);
            switch(this.stemmerType){
                case StemmerType.RSLP: txts = txts.map((t) => tokenizer.tokenize(t).map(RSLPStemmer.stem));
                case StemmerType.PORTER: txts = txts.map((t) => tokenizer.tokenize(t).map(PorterStemmer.stem));
                default: txts = txts.map(tokenizer.tokenize); break;
            }

            if (this.normCase === TextCase.UPPERCASE) txts = txts.map((t) => t.map((s) => s.toLocaleUpperCase()));
            if (this.stripAccents) txts = txts.map((t) => t.map(TextProcessor.#removeAccents));

            let stw = this.stopwords;
            if (stw.length){
                if (this.normCase === TextCase.LOWERCASE) stw = stw.map((t) => t.toLocaleLowerCase());
                if (this.stemmerType === StemmerType.RSLP) stw = stw.map(RSLPStemmer.stem);
                if (this.stemmerType === StemmerType.PORTER) stw = stw.map(PorterStemmer.stem);
                if (this.normCase === TextCase.LOWERCASE) stw = stw.map((t) => t.toLocaleUpperCase());
                if (this.stripAccents) stw = stw.map(TextProcessor.#removeAccents);
                txts = txts.map((t) => t.filter((w) => stw.includes(w)));
            }
        }
        else {
            if (this.normCase === TextCase.UPPERCASE) txts = txts.map((t) => t.toLocaleUpperCase());
            if (this.stripAccents) txts = txts.map(TextProcessor.#removeAccents);
        }

        return txts;
    }

    /**
     * Ocerloaded stub method (for pipeline compatibility purposes).
     *  Behaves the same as if calling "this.transform()".
     * @param {string[]} X - 2d text array.
     * @returns {string[]|string[][]} the transformed text.
     */
    fitTransform(X){ return this.fit(X).transform(X); }

    /**
     * Removes "extra" spaces.
     * @param {string} txt - Text to be normalized.
     * @returns {string} text with normalized spaces.
     */
    static #normalizeSpacing(txt){ return txt.replace(/\s+/gi, " "); }

    /**
     * Removes accents from the given text.
     * @param {string} txt - Text to be normalized.
     * @returns {string} text without accents.
     */
    static #removeAccents(txt){ return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

    /**
     * Asserts primitive values to the given variables
     * @param {TypeCheck[]} typeChecks - TypeCheck objects.
     * @throws {TypeError}
     */
    #checkPrimitive(typeChecks){
        for (const el of typeChecks){
            if (typeof el.value != el.type)
                throw new TypeError(`Invalid argument type for '${el.name}'. Expected '${el.type}', but '${typeof el.value}' was given.`);
        }
    }

    /**
     * Asserts object instances to the given variables
     * @param {TypeCheck[]} typeChecks - TypeCheck objects.
     * @throws {TypeError}
     */
    #checkInstance(typeChecks){
        for (const el of typeChecks)
            if (!el.value instanceof el.type)
                throw new TypeError(`Invalid argument type for '${el.name}'. Expected '${el.type}', but '${el.value.constructor.name}' was given.`);
    }

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
    static fromModel(model){
        return new TextProcessor(model.normSpacing, model.normCase, model.trimSpaces, model.stripAccents,
            model.tokenize, model.removeNumbers, model.stopwords, model.stemmerType);
    }

    /**
     * Exports the current classifer.
     * @returns {TextProcessorModel}
     */
    toModel(){
        return {
            normCase: this.normCase,
            tokenize: this.tokenize,
            stopwords: [...this.stopwords],
            trimSpaces: this.trimSpaces,
            normSpacing: this.normSpacing,
            stemmerType: this.stemmerType,
            stripAccents: this.stripAccents,
            removeNumbers: this.removeNumbers
        };
    }

}

export {
    TextCase,
    StemmerType,
    TextProcessor
}
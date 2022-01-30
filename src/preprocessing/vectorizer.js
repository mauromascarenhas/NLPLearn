"use strict";

/**
 * Text-vectorization utilities.
 * @module vectorizer
 */

import { deepCopy } from "../utils/copy";

/**
 * Constants for specifying TF metrics
 * @enum {string}
 */
const TFMetrics = Object.freeze({
    RAW: "RAW",
    LOG: "LOGARITHM",
    BOOL: "BOOLEAN",
    FREQ: "FREQUENCY"
});

/**
 * Constants for specifying IDF metrics
 * @enum {string}
 */
const IDFMetrics = Object.freeze({
    NONE: "NONE",
    SMOOTH: "SMOOTH",
    REGULAR: "REGULAR"
});

/**
 * Utility class used for text vectorization purposes.
 */
class TextVectorizer {

    #tf = TFMetrics.RAW;
    #idf = IDFMetrics.NONE;
    /** @type {string[]} */
    #vocab = null;
    #isFitted = false;
    /** @type {object} */
    #vocab_map = null;

    /**
     * Creates an instance of TextVectorizer class
     * @param {string} tf - Term-Frequency
     * @param {string} idf - Inverse Document-Frequency
     * @param {string[]} vocab - Vocabulary
     */
    constructor(tf = TFMetrics.RAW, idf = IDFMetrics.NONE, vocab = null){
        if (!tf in TFMetrics) throw new Error("Invalid value for 'tf'.  It must be one of the object values available at TFMetrics object.");
        if (!idf in IDFMetrics) throw new Error("Invalid value for 'idf'.  It must be one of the object values available at IDFMetrics object.");
        if (vocab && !vocab instanceof Array) throw new TypeError(`Invalid argument type for 'vocab'. Expected 'string[]', but '${typeof vocab}' was given.`);

        this.#tf = tf;
        this.#idf = idf;
        this.#vocab = vocab;
    }

    get tfMetrics(){ return this.#tf; }
    get idfMetrics(){ return this.#idf; }
    get vocabulary(){ return this.#vocab; }

    /**
     * Builds vocabulary (if not specified) and vocabulary
     *  map
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {TextVectorizer} self instance
     */
    fit(X){
        let x = TextVectorizer.#checkTokenList(X);
        this.#vocab = this.#vocab || TextVectorizer.#buildVocabulary(x);
        this.#vocab_map = {};
        for (let i = 0; i < this.#vocab.length; ++i) this.#vocab_map[this.#vocab[i]] = i;
        this.#isFitted = true;
        return this;
    }

    /**
     * Vectorizes the given dataset.
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF-IDF matrix.
     */
    transform(X){
        if (!this.#isFitted) throw new Error("The Vectorizer must be fitted before a transformation request.");
        let X_ = TextVectorizer.#checkTokenList(X);

        let tf;
        switch(this.#tf){
            case TFMetrics.RAW: tf = this.#transformRaw(X_); break;
            case TFMetrics.LOG: tf = this.#transformLog(X_); break;
            case TFMetrics.BOOL: tf = this.#transformBool(X_); break;
            case TFMetrics.FREQ: tf = this.#transformFreq(X_); break;
        }

        if (this.#idf === IDFMetrics.NONE) return tf;

        let idf = this.#transformIDF(X_, this.#idf === IDFMetrics.SMOOTH);
        let tfidf = [];
        for (const row of tf){
            let nr = new Array(row.length)
            for (const [j, el] of row.entries()) nr[j] = el * idf[j];
            tfidf.push(nr);
        }
        return tfidf;
    }

    /**
     * Convenience method for #fit + #transform
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF-IDF matrix.
     */
    fitTransform(X){ return this.fit(X).transform(X); }

    /**
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF matrix (raw).
     * @private
     */
    #transformRaw(X){
        let tf = new Array(X.length);
        for (let i = 0; i < tf.length; ++i) tf[i] = new Array(this.#vocab.length).fill(0);
        for (let i = 0; i < X.length; ++i)
            for (const el of X[i])
                if (el in this.#vocab_map) tf[i][this.#vocab_map[el]]++;
        return tf;
    }

    /**
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF matrix (log).
     * @private
     */
    #transformLog(X){
        let tf = this.#transformRaw(X);
        for (let i = 0; i < tf.length; ++i)
            for (let j = 0; j < tf[i].length; ++j)
                tf[i][j] = Math.log(tf[i][j] + 1);
        return tf;
    }

    /**
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF matrix (bool).
     * @private
     */
    #transformBool(X){
        let tf = new Array(X.length);
        for (let i = 0; i < tf.length; ++i) tf[i] = new Array(this.#vocab.length).fill(0);
        for (let i = 0; i < X.length; ++i)
            for (const el of X[i])
                if (el in this.#vocab_map) tf[i][this.#vocab_map[el]] = 1;
        return tf;
    }

    /**
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF matrix (freq).
     * @private
     */
    #transformFreq(X){
        let tf = this.#transformRaw(X);
        for (let i = 0; i < tf.length; ++i){
            let sum = 0;
            for (let j = 0; j < tf[i].length; ++j) sum += tf[i][j];
            for (let j = 0; j < tf[i].length; ++j) tf[i][j] = tf[i][j] / sum;
        }
        return tf;
    }

    /**
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @param {boolean} smooth - Use smooth factor.
     * @returns {number[][]} IDF matrix.
     * @private
     */
    #transformIDF(X, smooth){
        let tf_bool = this.#transformBool(X);
        let n_count = new Array(tf_bool[0].length).fill(0);
        for (let i = 0; i < tf_bool.length; ++i){
            for (let j = 0; j < tf_bool[i].length; ++j)
                n_count[j] += tf_bool[i][j];
        }
        if (smooth)
            for (let i = 0; i < n_count.length; ++i)
                n_count[i] = Math.log((X.length + 1) / (n_count[i] + 1)) + 1;
        else
            for (let i = 0; i < n_count.length; ++i)
                n_count[i] = Math.log(X.length / n_count[i]) + 1;
        return n_count;
    }

    /**
     * Builds a vocabulary
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {string[]} vocabulary of the
     *  given input.
     * @private
     */
    static #buildVocabulary(X){
        let vocab = new Set();
        for (const row of X)
            for (const el of row) vocab.add(el);
        return Array.from(vocab).sort();
    }

    /**
     * Checks if the given input is a 2d string
     *  matrix / list-like object.
     * @param {string[][]} arr - 2d string
     *  matrix / list-like object.
     * @returns {string[][]} a copy of the
     *  given input (arr).
     * @private
     */
    static #checkTokenList(arr){
        try {
            for (const row of arr)
                for (const el of row)
                    if (typeof el != "string") throw new TypeError("Expected '2d' string list-like object.");
            return deepCopy(arr);
        }
        catch(_){ throw new TypeError("Expected '2d' string list-like object."); }
    }

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
    loadModel(model){
        this.#isFitted = model.isFitted;
        this.#vocab_map = model.vocabulary_map;
    }

    /**
     * Convenience method for converting a valid TextVectorizerModel
     *  into a TextVectorizer object instance.
     * @param {TextVectorizerModel} model - TextVectorizer
     *  exported model.
     * @returns {TextVectorizer} a TextVectorizer instance.
     */
    static fromModel(model){
        let inst = new TextVectorizer(model.tf, model.idf, model.vocabulary);
        inst.fromModel(model);
        return inst;
    }

    /**
     * Exports the current classifer.
     * @returns {TextVectorizerModel}
     */
    toModel(){
        return {
            tf: this.#tf,
            idf: this.#idf,
            isFitted: this.#isFitted,
            vocabulary: this.#vocab ? deepCopy(this.#vocab) : null,
            vocabulary_map: this.#vocab_map ? deepCopy(this.#vocab_map) : null
        };
    }

}

export {
    TFMetrics,
    IDFMetrics,
    TextVectorizer
}
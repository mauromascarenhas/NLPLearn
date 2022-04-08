"use strict";

/**
 * Provides classification tools for vectorized texts.
 * @module classifier
 */

import { deepCopy } from "../utils/copy";
import { cosine, euclidean } from "../utils/distance";
import { TFMetrics, IDFMetrics } from "../preprocessing/vectorizer"

/**
 * Sums array elements and returns min(sum, 1).
 * @param {number[]} arr - Array of numbers.
 * @returns {number} sum of the array's elements
 *  of 1 if sum <= 0.
 */
function safeSum(arr){
    let sum = 0;
    for (let i = 0; i < arr.length; ++i) sum += arr[i];
    return sum > 0 ? sum : 1;
}

/**
 * Similar to "cosine" but considering the
 *   possibility of |v1| = 0 or |v2| = 0.
 * @param {number[]} v1 - First vector.
 * @param {number[]} v2 - Second vector.
 * @returns {number} the cosine distance.
 */
function safeCos(v1, v2){
    let s1 = 0, s2 = 0;
    for (let i = 0; i < v1.length; ++i) s1 += v1[i];
    for (let i = 0; i < v2.length; ++i) s2 += v2[i];
    return (s1 && s2) ? cosine(v1, v2) : + !!(s1 || s2);
}

/**
 * Constants for specifying distance metrics.
 * @enum {string}
 */
const DistMetrics = Object.freeze({
    COSINE: "COSINE",
    EUCLIDEAN: "EUCLIDEAN"
})

/**
 * Constants for specifying classifier metrics.
 * @enum {string}
 */
const CLFMetrics = Object.freeze({
    AVG: "AVERAGE",
    ...TFMetrics
});

/**
 * A simple heuristics-based NLP classifier.
 */
class NLPClassifier {

    #idf = IDFMetrics.NONE;
    #mtr = DistMetrics.COSINE;
    #dist = CLFMetrics.AVG;
    /** @type {number[][]} */
    #coef = null;
    /** @type {any[]} */
    #classes = null;
    #isFitted = false;

    /**
     * Creates an instance of NLPClassifier.
     * @param {CLFMetrics} mtr - Term-Frequency metrics
     *  + average.
     * @param {DistMetrics} dist - Similarity metric.
     * @param {IDFMetrics} idf - IDF metric.
     */
    constructor(mtr = CLFMetrics.AVG, dist = DistMetrics.COSINE, idf = IDFMetrics.NONE){
        if (!idf in IDFMetrics) throw new Error("Invalid value for 'idf'. It must be one of the object values available at IDFMetrics object.");
        if (!mtr in CLFMetrics) throw new Error("Invalid value for 'mtr'. It must be one of the object values available at CLFMetrics object.");
        if (!dist in DistMetrics) throw new Error("Invalid value for 'dist'. It must be one of the object values available at DistMetrics object.");

        this.#idf = idf;
        this.#mtr = mtr;
        this.#dist = dist;
    }

    get classes(){ return this.#classes ? [...this.#classes] : null; }
    get clfMetrics(){ return this.#mtr; }
    get idfMetrics(){ return this.#idf; }
    get distMetrics(){ return this.#dist; }
    get coefficients(){ return this.#coef ? deepCopy(this.#coef) : null; }

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
    fit(X, Y){
        if (!(X instanceof Array && X[0] && X[0] instanceof Array && typeof X[0][0] === "number"))
            throw new TypeError("'X' must be a 2d numeric array.");
        if (!(Y instanceof Array))
            throw new TypeError("'Y' must be a 1d array.");
        
        /** @type {number[][]} */
        let x = deepCopy(X);
        /** @type {any[]} */
        let y = deepCopy(Y);

        this.#classes = Array.from(new Set(y));
        for (let i = 0; i < y.length; ++i) y[i] = this.#classes.indexOf(y[i]);

        /** @type {number[][]} */
        let tf;
        switch(this.#mtr){
            case CLFMetrics.AVG: tf = this.#fitAvg(x, y); break;
            case CLFMetrics.LOG: tf = this.#fitLog(x, y); break;
            case CLFMetrics.RAW: tf = this.#fitRaw(x, y); break;
            case CLFMetrics.BOOL: tf = this.#fitBool(x, y); break;
            case CLFMetrics.FREQ: tf = this.#fitFreq(x, y); break;
        }

        if (this.#idf === IDFMetrics.NONE) this.#coef = tf;
        else {
            let idf = this.#fitIDF(x, y, this.#idf === IDFMetrics.SMOOTH);
            this.#coef = new Array(tf.length);
            for (let i = 0; i < tf.length; ++i){
                this.#coef[i] = new Array(tf[i].length);
                for (let j = 0; j < tf[i].length; ++j)
                    this.#coef[i][j] = tf[i][j] * idf[j];
            }
        }

        this.#isFitted = true;
        return this;
    }

    /**
     * Performs the prediction for the given input.
     * @param {number[][]} X - Document-Term matrix
     *  (vectorized text).
     * @returns {any[]} an array of predicted values (classes).
     */
    predict(X){
        if (!this.#isFitted) throw new Error("The classifier must be fitted before predicting anything.");
        if (!(X instanceof Array && X[0] instanceof Array && typeof X[0][0] === "number"))
            throw new TypeError("'X' must be a 2d numeric array.");
        if (X[0].length != this.#coef[0].length)
            throw new TypeError(`'X' must have at least ${this.#coef.length} features.`);

        let decision = this.#applyDecision(this.#transformTest(X), this.#dist === DistMetrics.COSINE ? safeCos : euclidean);
        for (let i = 0; i < decision.length; ++i)
            decision[i] = this.classes[decision[i].indexOf(Math.min(...decision[i]))];
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
    predictProba(X){
        if (!this.#isFitted) throw new Error("The classifier must be fitted before predicting anything.");
        if (!(X instanceof Array && X[0] instanceof Array && typeof X[0][0] === "number"))
            throw new TypeError("'X' must be a 2d numeric array.");
        if (X[0].length != this.#coef[0].length)
            throw new TypeError(`'X' must have at least ${this.#coef.length} features.`);

        let decision = this.#applyDecision(this.#transformTest(X), this.#dist === DistMetrics.COSINE ? safeCos : euclidean);
        if (this.#dist === DistMetrics.COSINE){
            for (let i = 0; i < decision.length; ++i){
                for (let j = 0; j < decision[i].length; ++j)
                    decision[i][j] = 1 - decision[i][j];

                let ssum = safeSum(decision[i]);
                for (let j = 0; j < decision[i].length; ++j)
                    decision[i][j] = decision[i][j] / ssum;
            }
        }
        else {
            for (let i = 0; i < decision.length; ++i){
                let ssum = safeSum(decision[i]);
                for (let j = 0; j < decision[i].length; ++j)
                    decision[i][j] = 1 - (decision[i][j] / ssum);
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
    #fitAvg(x, y){
        let count = new Array(this.#classes.length).fill(0);
        let coef = new Array(this.#classes.length);
        for (let i = 0; i < coef.length; ++i) coef[i] = new Array(x[i].length).fill(0);

        for (let i = 0; i < x.length; ++i){
            for (let j = 0; j < x[i].length; ++j)
                coef[y[i]][j] = coef[y[i]][j] + x[i][j];
            count[y[i]]++;
        }

        for (let i = 0; i < count.length; ++i)
            for (let j = 0; j < coef[i].length; ++j)
                coef[i][j] = coef[i][j] / count[i];
        return coef;
    }

    /**
     * Fits the given document-term matrix to the specified
     *  metric (logarithm).
     * @param {number[][]} x - Document-term matrix.
     * @param {any[]} y - Classes (map).
     * @returns {number[][]} the TF matrix (logarithm).
     * @private
     */
     #fitLog(x, y){
        let count = new Array(this.#classes.length).fill(0);
        let coef = new Array(this.#classes.length);
        for (let i = 0; i < coef.length; ++i) coef[i] = new Array(x[i].length).fill(0);

        for (let i = 0; i < x.length; ++i){
            for (let j = 0; j < x[i].length; ++j)
                coef[y[i]][j] = coef[y[i]][j] + Math.log(x[i][j] + 1);
            count[y[i]]++;
        }

        for (let i = 0; i < count.length; ++i)
            for (let j = 0; j < coef[i].length; ++j)
                coef[i][j] = coef[i][j] / count[i];
        return coef;
    }

    /**
     * Fits the given document-term matrix to the specified
     *  metric (raw).
     * @param {number[][]} x - Document-term matrix.
     * @param {any[]} y - Classes (map).
     * @returns {number[][]} the TF matrix (raw).
     * @private
     */
     #fitRaw(x, y){ 
        let coef = new Array(this.#classes.length);
        for (let i = 0; i < this.#classes.length; ++i) coef[i] = new Array(x[i].length).fill(0);

        for (let i = 0; i < x.length; ++i)
            for (let j = 0; j < x[i].length; ++j)
                coef[y[i]][j] = coef[y[i]][j] + x[i][j];
        return coef;
    }

    /**
     * Fits the given document-term matrix to the specified
     *  metric (boolean).
     * @param {number[][]} x - Document-term matrix.
     * @param {any[]} y - Classes (map).
     * @returns {number[][]} the TF matrix (boolean).
     * @private
     */
     #fitBool(x, y){ 
        let coef = new Array(this.#classes.length);
        for (let i = 0; i < this.#classes.length; ++i) coef[i] = new Array(x[i].length).fill(0);
        
        for (let i = 0; i < x.length; ++i)
            for (let j = 0; j < x[i].length; ++j)
                coef[y[i]][j] = +(coef[y[i]][j] + x[i][j] != 0);
        return coef;
    }

    /**
     * Fits the given document-term matrix to the specified
     *  metric (frequency).
     * @param {number[][]} x - Document-term matrix.
     * @param {any[]} y - Classes (map).
     * @returns {number[][]} the TF matrix (frequency).
     * @private
     */
     #fitFreq(x, y){
        let count = new Array(this.#classes.length).fill(0);
        let coef = new Array(this.#classes.length);
        for (let i = 0; i < coef.length; ++i) coef[i] = new Array(x[i].length).fill(0);

        for (let i = 0; i < x.length; ++i){
            let cSum = safeSum(x[i]);
            for (let j = 0; j < x[i].length; ++j)
                coef[y[i]][j] = coef[y[i]][j] + (x[i][j] / cSum);
            count[y[i]]++;
        }

        for (let i = 0; i < count.length; ++i)
            for (let j = 0; j < coef[i].length; ++j)
                coef[i][j] = coef[i][j] / count[i];
        return coef;
    }

    /**
     * Creates a IDF matrix for the given document-term
     *  matrix (uses smooth factor by default).
     * @param {number[][]} x - Document-term matrix.
     * @param {any[]} y - Classes (map).
     * @param {boolean} smooth - Use smooth factor.
     * @returns the IDF matrix.
     * @private
     */
    #fitIDF(x, y, smooth = true){
        let bool_tf = this.#fitBool(x, y);
        let n_count = new Array(bool_tf[0].length).fill(0);
        for (let i = 0; i < bool_tf.length; ++i)
            for (let j = 0; j < bool_tf[i].length; ++j)
                n_count[j] += bool_tf[i][j];

        if (smooth)
            for (let i = 0; i < n_count.length; ++i)
                n_count[i] = Math.log((bool_tf.length + 1) / (n_count[i] + 1)) + 1;
        else
            for (let i = 0; i < n_count.length; ++i)
                n_count[i] = Math.log(bool_tf.length / n_count[i]) + 1;

        return n_count;
    }
    

    /**
     * Transforms test matrix into a valid comparison
     *  one.
     * @param {number[][]} X 
     * @returns {number[][]}
     * @private
     */
    #transformTest(X){
        let m = new Array(X.length);
        switch(this.#mtr){
            case CLFMetrics.LOG:
                for (let i = 0; i < m.length; ++i){
                    let r = [...X[i]];
                    for (let j = 0; j < r.length; ++j)
                        r[j] = Math.log(r[j] + 1);
                    m[i] = r;
                }
                break;
            case CLFMetrics.BOOL:
                for (let i = 0; i < m.length; ++i){
                    let r = [...X[i]];
                    for (let j = 0; j < r.length; ++j) r[j] = !!r[j];
                    m[i] = r;
                }
                break;
            case CLFMetrics.FREQ:
                for (let i = 0; i < m.length; ++i){
                    let r = [...X[i]];
                    let rs = safeSum(r);
                    for (let j = 0; j < r.length; ++j) r[j] = r[j] / rs;
                    m[i] = r;
                }
                break;
            default: return deepCopy(X);
        }
        return m;
    }

    /**
     * @callback Callable
     * @param {number[]} v1
     * @param {number[]} v2
     * @returns {number}
     */

    /**
     * Applies the given classification function
     *  to the test set.
     * @param {number[][]} X - Test
     *  matrix.
     * @param {Callable} callable - Classification
     *  function.
     * @returns {number[][]}
     * @private
     */
    #applyDecision(X, callable){
        let m = new Array(X.length);
        for (let i = 0; i < m.length; ++i){
            let r = new Array(this.#coef.length);
            for (let j = 0; j < r.length; ++j)
                r[j] = callable(X[i], this.#coef[j]);
            m[i] = r;
        }
        return m;
    }

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
    loadModel(model){
        this.#coef = model.coef;
        this.#classes = model.classes;
        this.#isFitted = model.isFitted;
    }

    /**
     * Convenience method for converting a valid NLPClassifierModel
     *  into a NLPClassifier object instance.
     * @param {NLPClassifierModel} model - NLPClassifier
     *  exported model.
     * @returns {NLPClassifier} a NLPClassifier instance.
     */
    static fromModel(model){
        let inst = new NLPClassifier(model.mtr, model.dist, model.idf);
        inst.loadModel(model);
        return inst;
    }

    /**
     * Exports the current classifer.
     * @returns {NLPClassifierModel}
     */
    toModel(){
        return {
            idf: this.#idf,
            mtr: this.#mtr,
            dist: this.#dist,
            coef: this.#coef ? deepCopy(this.#coef) : null,
            classes: this.#classes ? deepCopy(this.#classes) : null,
            isFitted: this.#isFitted
        };
    }
}

export {
    CLFMetrics,
    DistMetrics,
    NLPClassifier
};
/**
 * Constants for specifying classifier metrics.
 */
export type CLFMetrics = string;
/**
 * Constants for specifying classifier metrics.
 * @enum {string}
 */
export const CLFMetrics: Readonly<{
    RAW: string;
    LOG: string;
    BOOL: string;
    FREQ: string;
    AVG: string;
}>;
/**
 * Constants for specifying distance metrics.
 */
export type DistMetrics = string;
/**
 * Constants for specifying distance metrics.
 * @enum {string}
 */
export const DistMetrics: Readonly<{
    COSINE: string;
    EUCLIDEAN: string;
}>;
/**
 * A simple heuristics-based NLP classifier.
 */
export class NLPClassifier {
    /**
     * Convenience method for converting a valid NLPClassifierModel
     *  into a NLPClassifier object instance.
     * @param {NLPClassifierModel} model - NLPClassifier
     *  exported model.
     * @returns {NLPClassifier} a NLPClassifier instance.
     */
    static fromModel(model: {
        /**
         * - IDFMetrics value.
         */
        idf: string;
        /**
         * - CLFMetrics value.
         */
        mtr: string;
        /**
         * - Fitted
         * classifier coefficients (when available).
         */
        coef: number[][] | null;
        /**
         * - DistMetrics value.
         */
        dist: string;
        /**
         * - Fitted
         * classifier classes (when available).
         */
        classes: any[] | null;
        /**
         * - A property which
         * specifies whether the classifier is fitted or not.
         */
        isFitted: boolean;
    }): NLPClassifier;
    /**
     * Creates an instance of NLPClassifier.
     * @param {CLFMetrics} mtr - Term-Frequency metrics
     *  + average.
     * @param {DistMetrics} dist - Similarity metric.
     * @param {IDFMetrics} idf - IDF metric.
     */
    constructor(mtr?: CLFMetrics, dist?: DistMetrics, idf?: IDFMetrics);
    get classes(): any[];
    get clfMetrics(): string;
    get idfMetrics(): string;
    get distMetrics(): string;
    get coefficients(): number[][];
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
    fit(X: number[][], Y: any[]): NLPClassifier;
    /**
     * Performs the prediction for the given input.
     * @param {number[][]} X - Document-Term matrix
     *  (vectorized text).
     * @returns {any[]} an array of predicted values (classes).
     */
    predict(X: number[][]): any[];
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
    predictProba(X: number[][]): any[][];
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
    loadModel(model: {
        /**
         * - IDFMetrics value.
         */
        idf: string;
        /**
         * - CLFMetrics value.
         */
        mtr: string;
        /**
         * - Fitted
         * classifier coefficients (when available).
         */
        coef: number[][] | null;
        /**
         * - DistMetrics value.
         */
        dist: string;
        /**
         * - Fitted
         * classifier classes (when available).
         */
        classes: any[] | null;
        /**
         * - A property which
         * specifies whether the classifier is fitted or not.
         */
        isFitted: boolean;
    }): void;
    /**
     * Exports the current classifer.
     * @returns {NLPClassifierModel}
     */
    toModel(): {
        /**
         * - IDFMetrics value.
         */
        idf: string;
        /**
         * - CLFMetrics value.
         */
        mtr: string;
        /**
         * - Fitted
         * classifier coefficients (when available).
         */
        coef: number[][] | null;
        /**
         * - DistMetrics value.
         */
        dist: string;
        /**
         * - Fitted
         * classifier classes (when available).
         */
        classes: any[] | null;
        /**
         * - A property which
         * specifies whether the classifier is fitted or not.
         */
        isFitted: boolean;
    };
    #private;
}
import { IDFMetrics } from "../preprocessing/vectorizer";

/**
 * Constants for specifying TF metrics
 */
export type TFMetrics = string;
/**
 * Constants for specifying TF metrics
 * @enum {string}
 */
export const TFMetrics: Readonly<{
    RAW: string;
    LOG: string;
    BOOL: string;
    FREQ: string;
}>;
/**
 * Constants for specifying IDF metrics
 */
export type IDFMetrics = string;
/**
 * Constants for specifying IDF metrics
 * @enum {string}
 */
export const IDFMetrics: Readonly<{
    NONE: string;
    SMOOTH: string;
    REGULAR: string;
}>;
/**
 * Utility class used for text vectorization purposes.
 */
export class TextVectorizer {
    /**
     * Builds a vocabulary
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {string[]} vocabulary of the
     *  given input.
     * @private
     */
    private static "__#1@#buildVocabulary";
    /**
     * Checks if the given input is a 2d string
     *  matrix / list-like object.
     * @param {string[][]} arr - 2d string
     *  matrix / list-like object.
     * @returns {string[][]} a copy of the
     *  given input (arr).
     * @private
     */
    private static "__#1@#checkTokenList";
    /**
     * Convenience method for converting a valid TextVectorizerModel
     *  into a TextVectorizer object instance.
     * @param {TextVectorizerModel} model - TextVectorizer
     *  exported model.
     * @returns {TextVectorizer} a TextVectorizer instance.
     */
    static fromModel(model: {
        /**
         * - TFMetrics value.
         */
        tf: string;
        /**
         * - IDFMetrics value.
         */
        idf: string;
        /**
         * - Vocabulary.
         */
        vocabulary: string[] | null;
        /**
         * - Vocabulary map
         * object.
         */
        vocabulary_map: object | null;
        /**
         * - A property which
         * specifies whether the vectorizer is fitted or not.
         */
        isFitted: boolean;
    }): TextVectorizer;
    /**
     * Creates an instance of TextVectorizer class
     * @param {string} tf - Term-Frequency
     * @param {string} idf - Inverse Document-Frequency
     * @param {string[]} vocab - Vocabulary
     */
    constructor(tf?: string, idf?: string, vocab?: string[]);
    get tfMetrics(): string;
    get idfMetrics(): string;
    get vocabulary(): string[];
    /**
     * Builds vocabulary (if not specified) and vocabulary
     *  map
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {TextVectorizer} self instance
     */
    fit(X: string[][]): TextVectorizer;
    /**
     * Vectorizes the given dataset.
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF-IDF matrix.
     */
    transform(X: string[][]): number[][];
    /**
     * Convenience method for #fit + #transform
     * @param {string[][]} X - Array of
     *  tokenized texts.
     * @returns {number[][]} TF-IDF matrix.
     */
    fitTransform(X: string[][]): number[][];
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
    loadModel(model: {
        /**
         * - TFMetrics value.
         */
        tf: string;
        /**
         * - IDFMetrics value.
         */
        idf: string;
        /**
         * - Vocabulary.
         */
        vocabulary: string[] | null;
        /**
         * - Vocabulary map
         * object.
         */
        vocabulary_map: object | null;
        /**
         * - A property which
         * specifies whether the vectorizer is fitted or not.
         */
        isFitted: boolean;
    }): void;
    /**
     * Exports the current classifer.
     * @returns {TextVectorizerModel}
     */
    toModel(): {
        /**
         * - TFMetrics value.
         */
        tf: string;
        /**
         * - IDFMetrics value.
         */
        idf: string;
        /**
         * - Vocabulary.
         */
        vocabulary: string[] | null;
        /**
         * - Vocabulary map
         * object.
         */
        vocabulary_map: object | null;
        /**
         * - A property which
         * specifies whether the vectorizer is fitted or not.
         */
        isFitted: boolean;
    };
    #private;
}

/**
 * Interface used for variable type checking.
 */
export type TypeCheck = {
    /**
     * - Variable name.
     */
    name: string;
    /**
     * - Variable type.
     */
    type: string | any[];
    /**
     * - Variable value.
     */
    value: any;
};
/**
 * Enumerator used so as to specify the text case to be applied by TextProcessor
 */
export type TextCase = string;
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
export const TextCase: Readonly<{
    NONE: string;
    LOWERCASE: string;
    UPPERCASE: string;
}>;
/**
 * Enumerator used so as to specify the stemmer to be used by TextProcessor
 */
export type StemmerType = string;
/**
 * Enumerator used so as to specify the stemmer to be used by TextProcessor
 * @enum {string}
 */
export const StemmerType: Readonly<{
    NONE: string;
    RSLP: string;
    PORTER: string;
}>;
/**
 * Convenience class which provides a text preprocessing pipeline
 *  with predefined (and customizable) steps.
 */
export class TextProcessor {
    /**
     * Removes "extra" spaces.
     * @param {string} txt - Text to be normalized.
     * @returns {string} text with normalized spaces.
     * @private
     */
    private static "__#5@#normalizeSpacing";
    /**
     * Removes accents from the given text.
     * @param {string} txt - Text to be normalized.
     * @returns {string} text without accents.
     * @private
     */
    private static "__#5@#removeAccents";
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
    static fromModel(model: {
        /**
         * - Normalize extra spaces.
         */
        normSpacing: boolean;
        /**
         * - Normalize text case.
         */
        normCase: TextCase;
        /**
         * - Removes initial and ending spaces.
         */
        trimSpaces: boolean;
        /**
         * - Removes accents.
         */
        stripAccents: boolean;
        /**
         * - Tokenize text.
         */
        tokenize: boolean;
        /**
         * - Ignore numbers.
         */
        removeNumbers: boolean;
        /**
         * - Stoplist.
         */
        stopwords: string[];
        /**
         * - Stemmer type.
         */
        stemmerType: StemmerType;
    }): TextProcessor;
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
    constructor(normSpacing?: boolean, normCase?: TextCase, trimSpaces?: boolean, stripAccents?: boolean, tokenize?: boolean, removeNumbers?: boolean, stopwords?: string[], stemmerType?: StemmerType);
    normCase: string;
    tokenize: boolean;
    stopwords: string[];
    trimSpaces: boolean;
    normSpacing: boolean;
    stemmerType: string;
    stripAccents: boolean;
    removeNumbers: boolean;
    /**
     * Stub method (for pipeline compatibility purposes)
     * @param {string[]} X - 2d text array.
     * @returns {TextProcessor} current instance.
     */
    fit(X: string[]): TextProcessor;
    /**
     * Applies the requested transformations to the given document set.
     * @param {string[]} X - 2d text array.
     * @returns {string[]|string[][]} the transformed text.
     */
    transform(X: string[]): string[] | string[][];
    /**
     * Ocerloaded stub method (for pipeline compatibility purposes).
     *  Behaves the same as if calling "this.transform()".
     * @param {string[]} X - 2d text array.
     * @returns {string[]|string[][]} the transformed text.
     */
    fitTransform(X: string[]): string[] | string[][];
    /**
     * Exports the current classifer.
     * @returns {TextProcessorModel}
     */
    toModel(): {
        /**
         * - Normalize extra spaces.
         */
        normSpacing: boolean;
        /**
         * - Normalize text case.
         */
        normCase: TextCase;
        /**
         * - Removes initial and ending spaces.
         */
        trimSpaces: boolean;
        /**
         * - Removes accents.
         */
        stripAccents: boolean;
        /**
         * - Tokenize text.
         */
        tokenize: boolean;
        /**
         * - Ignore numbers.
         */
        removeNumbers: boolean;
        /**
         * - Stoplist.
         */
        stopwords: string[];
        /**
         * - Stemmer type.
         */
        stemmerType: StemmerType;
    };
    #private;
}

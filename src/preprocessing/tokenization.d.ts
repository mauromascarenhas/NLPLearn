/**
 * Text-tokenization utilities.
 * @module tokenization
 */
/**
 * Basic text tokenizer (word level) based
 *  on regular expression rules.
 * It provides support to number removal
 *  (default setting) and filter for small
 *  words.
 */
export class NaiveWordTokenizer {
    static "__#4@#wordSet": string;
    static "__#4@#digitSet": string;
    constructor(removeNumbers?: boolean, minWordLen?: number);
    /**
     * Tokenizes the given text/document in
     *  word level.
     * @param {string} text - Text/document.
     * @returns {string[]} the tokenized version
     *  of the given text.
     */
    tokenize(text: string): string[];
    #private;
}

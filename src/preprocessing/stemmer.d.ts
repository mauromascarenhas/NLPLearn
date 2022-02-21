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
export class RSLPStemmer {
    static "__#3@#plural_reduction": (string | number | string[])[][];
    static "__#3@#feminine_reduction": (string | number | string[])[][];
    static "__#3@#adverb_reduction": (string | number | string[])[][];
    static "__#3@#argumentative_diminutive_reduction": (string | number | string[])[][];
    static "__#3@#noun_suffix_reduction": (string | number | string[])[][];
    static "__#3@#verb_suffix_reduction": (string | number | string[])[][];
    static "__#3@#vowel_removal": (string | number | string[])[][];
    /**
     * Performs the stemming operation for the given word.
     * @param {string} word - The word to be stemmed.
     * @returns {string} a stem.
     */
    static stem(word: string): string;
    /**
     * Applies rule for the given word
     * @param {string} word - word (or part) to be stemmed.
     * @param {any[][]} rules - Array of rules.
     * @returns {string} word part (after applying rule).
     * @private
     */
    private static "__#3@#applyRule";
}
/**
 * Wrapper class for Porter Stemmer implementation
 *  available at: {@link https://www.npmjs.com/package/porter-stemmer}
 */
export class PorterStemmer {
    /**
     * Performs the stemming operation for the given word.
     *  this is the same as "stemmer(word)" function from
     *  "porter-stemmer" package.
     * @param {string} word - The word to be stemmed.
     * @returns {string} a stem.
     */
    static stem(word: string): string;
}

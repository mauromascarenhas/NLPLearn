/**
 * Class which aggregates methods related
 *   to stop words retrieval.
 */
export class StopWords {
    /**
     * Retrieves the stop words for the specified
     *   language.
     * Check NLTK's and stopword-iso's documentation
     *   so as to check for supported languages.
     *
     * @param {string} lang - ISO language code.
     * @param {string} source - Stop list source. Valid
     *   values are either "NLTK" (default) or "ISO".
     * @returns {string[]} the stop words array
     *   for the given language, or undefined, if not
     *   found.
     */
    static get(lang: string, source?: string): string[];
}

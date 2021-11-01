"use strict";

class NaiveWordTokenizer {
    
    static #wordSet = "a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_";
    static #digitSet = "\\d";
    #minWordLen = 3;
    /** @type {RegExp} */
    #tokenizerRegex = null;

    constructor(removeNumbers = true, minWordLen = 3){
        const DS = NaiveWordTokenizer.#digitSet, WS = NaiveWordTokenizer.#wordSet;

        this.#minWordLen = minWordLen - 1;
        this.#tokenizerRegex = new RegExp(
            removeNumbers ?
                `([${WS}]+(['-][${WS}]+)*)` :
                `((\\d+([\\.,']\\d+)*)|([${WS + DS}]+(['-][${WS + DS}]+)*))`,
            "g"
        );
    }

    /**
     * 
     * @param {string} text 
     * @returns {Array<string>}
     */
    tokenize(text){
        let res = [];
        let mtc = text.match(this.#tokenizerRegex);
        if (mtc)
            for (const m of mtc) if (m.length > this.#minWordLen) res.push(m);
        return res;
    }
}

export {
    NaiveWordTokenizer
}
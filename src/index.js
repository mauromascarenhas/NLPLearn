"use strict";

import * as copy from "./utils/copy";
import * as distance from "./utils/distance";
import * as preprocessor from "./utils/preprocessor";

import * as classifier from "./classifier/nlpclassifier";

import * as nltksw from "./nltk-data/stopwords.json";

import * as stemmer from "./preprocessing/stemmer";
import * as stopwords from "./preprocessing/stopwords";
import * as tokenization from "./preprocessing/tokenization";
import * as vectorizer from "./preprocessing/vectorizer";

export {
    copy,
    nltksw,
    distance,
    preprocessor,
    classifier,
    stemmer,
    stopwords,
    tokenization,
    vectorizer
}
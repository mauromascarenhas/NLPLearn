"use strict";

import Copy from "./utils/copy";
import Distance from "./utils/distance";
import Preprocessor from "./utils/preprocessor";

import Classifier from "./classifier/nlpclassifier";

import NLTKStopWords from "./nltk-data/stopwords.json";

import Stemmer from "./preprocessing/stemmer";
import StopWords from "./preprocessing/stopwords";
import Tokenization from "./preprocessing/tokenization";
import Vectorizer from "./preprocessing/vectorizer";

export {
    Copy,
    Distance,
    Preprocessor,
    Classifier,
    NLTKStopWords,
    Stemmer,
    StopWords,
    Tokenization,
    Vectorizer
}
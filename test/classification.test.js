"use strict"

import { NLPClassifier, CLFMetrics, DistMetrics } from "../src/classifier/nlpclassifier";
import { IDFMetrics } from "../src/preprocessing/vectorizer";

describe("Classification", () => {
    let td_mtr = [
        [0, 2, 4, 3, 7, 0, 1],
        [1, 4, 4, 2, 1, 3, 5],
        [0, 1, 1, 6, 4, 2, 3],
        [5, 1, 5, 3, 2, 4, 1],
        [2, 4, 4, 2, 6, 1, 6],
        [1, 0, 2, 0, 2, 5, 0]
    ];
    let dc_mtr = ["A", "B", "A", "C", "C", "D"];

    test("Text classifier - RAW + COSINE + NONE", () => {
        let cl = new NLPClassifier(CLFMetrics.RAW, DistMetrics.COSINE, IDFMetrics.NONE);
        cl.fit(td_mtr, dc_mtr);
        expect(cl.classes.length).toBe((new Set(dc_mtr)).size);
        expect(cl.coefficients.length).toBe((new Set(dc_mtr)).size);
        expect(cl.predict([[0, 3, 5, 9, 11, 2, 4]])).toEqual(["A"]);
        expect(cl.predict([[1, 4, 4, 2, 1, 3, 5]])).toEqual(["B"]);
        expect(cl.predict([[7, 5, 9, 5, 8, 5, 7]])).toEqual(["C"]);
        expect(cl.predict([[1, 0, 2, 0, 2, 5, 0]])).toEqual(["D"]);
        expect(cl.predict([[0, 2, 5, 1, 4, 2, 2]])).toEqual(["C"]);
    });

    test("Text classifier - AVG + COSINE + NONE", () => {
        let cl = new NLPClassifier(CLFMetrics.AVG, DistMetrics.COSINE, IDFMetrics.NONE);
        cl.fit(td_mtr, dc_mtr);
        expect(cl.classes.length).toBe((new Set(dc_mtr)).size);
        expect(cl.coefficients.length).toBe((new Set(dc_mtr)).size);
        expect(cl.predict([[0, 1.5, 2.5, 4.5, 5.5, 1, 2]])).toEqual(["A"]);
        expect(cl.predict([[1, 4, 4, 2, 1, 3, 5]])).toEqual(["B"]);
        expect(cl.predict([[3.5, 2.5, 4.5, 2.5, 4, 2.5, 3.5]])).toEqual(["C"]);
        expect(cl.predict([[1, 0, 2, 0, 2, 5, 0]])).toEqual(["D"]);
        expect(cl.predict([[0, 2, 5, 1, 4, 2, 2]])).toEqual(["C"]);
    });

    test("Text classifier - BOOL + COSINE + NONE", () => {
        let cl = new NLPClassifier(CLFMetrics.BOOL, DistMetrics.COSINE, IDFMetrics.NONE);
        cl.fit(td_mtr, dc_mtr);
        expect(cl.classes.length).toBe((new Set(dc_mtr)).size);
        expect(cl.coefficients.length).toBe((new Set(dc_mtr)).size);
        expect(cl.predict([[0, 1, 1, 1, 1, 1, 1]])).toEqual(["A"]);
        expect(cl.predict([[1, 1, 1, 1, 1, 1, 1]])).toEqual(["B"]);
        expect(cl.predict([[1, 1, 1, 1, 1, 1, 1]])).toEqual(["B"]);
        expect(cl.predict([[1, 0, 1, 0, 1, 1, 0]])).toEqual(["D"]);
        expect(cl.predict([[0, 2, 5, 1, 4, 2, 2]])).toEqual(["A"]);
    });

    test("Text classifier - FREQ + COSINE + NONE", () => {
        let cl = new NLPClassifier(CLFMetrics.FREQ, DistMetrics.COSINE, IDFMetrics.NONE);
        cl.fit(td_mtr, dc_mtr);
        expect(cl.classes.length).toBe((new Set(dc_mtr)).size);
        expect(cl.coefficients.length).toBe((new Set(dc_mtr)).size);
        expect(cl.predict([[0, 3, 5, 9, 11, 2, 4]])).toEqual(["A"]);
        expect(cl.predict([[1, 4, 4, 2, 1, 3, 5]])).toEqual(["B"]);
        expect(cl.predict([[7, 5, 9, 5, 8, 5, 7]])).toEqual(["C"]);
        expect(cl.predict([[1, 0, 2, 0, 2, 5, 0]])).toEqual(["D"]);
        expect(cl.predict([[0, 2, 5, 1, 4, 2, 2]])).toEqual(["C"]);
    });

    test("Text classifier - LOG + COSINE + NONE", () => {
        let cl = new NLPClassifier(CLFMetrics.LOG, DistMetrics.COSINE, IDFMetrics.NONE);
        cl.fit(td_mtr, dc_mtr);
        expect(cl.classes.length).toBe((new Set(dc_mtr)).size);
        expect(cl.coefficients.length).toBe((new Set(dc_mtr)).size);
        expect(cl.predict([[0, 3, 5, 9, 11, 2, 4]])).toEqual(["A"]);
        expect(cl.predict([[1, 4, 4, 2, 1, 3, 5]])).toEqual(["B"]);
        expect(cl.predict([[7, 5, 9, 5, 8, 5, 7]])).toEqual(["C"]);
        expect(cl.predict([[1, 0, 2, 0, 2, 5, 0]])).toEqual(["D"]);
        expect(cl.predict([[0, 2, 5, 1, 4, 2, 2]])).toEqual(["A"]);
    });

    test("Text classifier - RAW + COSINE + REGULAR", () => {
        let cl = new NLPClassifier(CLFMetrics.RAW, DistMetrics.COSINE, IDFMetrics.REGULAR);
        cl.fit(td_mtr, dc_mtr);
        expect(cl.classes.length).toBe((new Set(dc_mtr)).size);
        expect(cl.coefficients.length).toBe((new Set(dc_mtr)).size);
        expect(cl.predict([[0, 3, 5, 9, 11, 2, 4]])).toEqual(["A"]);
        expect(cl.predict([[1, 4, 4, 2, 1, 3, 5]])).toEqual(["B"]);
        expect(cl.predict([[7, 5, 9, 5, 8, 5, 7]])).toEqual(["C"]);
        expect(cl.predict([[1, 0, 2, 0, 2, 5, 0]])).toEqual(["D"]);
        expect(cl.predict([[0, 2, 5, 1, 4, 2, 2]])).toEqual(["C"]);
    });

    test("Text classifier - RAW + COSINE + SMOOTH", () => {
        let cl = new NLPClassifier(CLFMetrics.RAW, DistMetrics.COSINE, IDFMetrics.SMOOTH);
        cl.fit(td_mtr, dc_mtr);
        expect(cl.classes.length).toBe((new Set(dc_mtr)).size);
        expect(cl.coefficients.length).toBe((new Set(dc_mtr)).size);
        expect(cl.predict([[0, 3, 5, 9, 11, 2, 4]])).toEqual(["A"]);
        expect(cl.predict([[1, 4, 4, 2, 1, 3, 5]])).toEqual(["B"]);
        expect(cl.predict([[7, 5, 9, 5, 8, 5, 7]])).toEqual(["C"]);
        expect(cl.predict([[1, 0, 2, 0, 2, 5, 0]])).toEqual(["D"]);
        expect(cl.predict([[0, 2, 5, 1, 4, 2, 2]])).toEqual(["C"]);
    });

    test("Text classifier - RAW + EUCLIDEAN + NONE", () => {
        let cl = new NLPClassifier(CLFMetrics.RAW, DistMetrics.EUCLIDEAN, IDFMetrics.NONE);
        cl.fit(td_mtr, dc_mtr);
        expect(cl.classes.length).toBe((new Set(dc_mtr)).size);
        expect(cl.coefficients.length).toBe((new Set(dc_mtr)).size);
        expect(cl.predict([[0, 3, 5, 9, 11, 2, 4]])).toEqual(["A"]);
        expect(cl.predict([[1, 4, 4, 2, 1, 3, 5]])).toEqual(["B"]);
        expect(cl.predict([[7, 5, 9, 5, 8, 5, 7]])).toEqual(["C"]);
        expect(cl.predict([[1, 0, 2, 0, 2, 5, 0]])).toEqual(["D"]);
        expect(cl.predict([[0, 2, 5, 1, 4, 2, 2]])).toEqual(["B"]);
    });

    test("Text classifier - AVG + EUCLIDEAN + NONE", () => {
        let cl = new NLPClassifier(CLFMetrics.AVG, DistMetrics.EUCLIDEAN, IDFMetrics.NONE);
        cl.fit(td_mtr, dc_mtr);
        expect(cl.classes.length).toBe((new Set(dc_mtr)).size);
        expect(cl.coefficients.length).toBe((new Set(dc_mtr)).size);
        expect(cl.predict([[0, 3, 5, 9, 11, 2, 4]])).toEqual(["A"]);
        expect(cl.predict([[1, 4, 4, 2, 1, 3, 5]])).toEqual(["B"]);
        expect(cl.predict([[7, 5, 9, 5, 8, 5, 7]])).toEqual(["C"]);
        expect(cl.predict([[1, 0, 2, 0, 2, 5, 0]])).toEqual(["D"]);
        expect(cl.predict([[0, 2, 5, 1, 4, 2, 2]])).toEqual(["C"]);
    }); 
});
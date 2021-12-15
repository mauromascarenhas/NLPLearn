"use strict";

import { deepCopy } from "../src/utils/copy";
import { cosine, jaccard, euclidean } from "../src/utils/distance";

describe("Deep copy function", () => {
    let test_obj = {
        a: 1,
        b: 2,
        z: -2,
        k: "test",
        p: ["a", "b", "d"]
    };
    let test_arr = [1, 2, 3, "5a", "test", 10];
    let test_obj_arr = [
        { a: 1, b: 3 },
        "test",
        { x: 0, y: -2, z: [1, 2, 3] }
    ];

    test("Create a deep copy of the given object", () => {
        expect(deepCopy(test_obj)).toEqual(test_obj);
        expect(deepCopy(test_arr)).toEqual(test_arr);
        expect(deepCopy(test_obj_arr)).toEqual(test_obj_arr);
    });
    test("Check whether the object copy is deep or not", () => {
        let toa_cp = deepCopy(test_obj_arr);
        toa_cp[0].a = -5;
        toa_cp[2].z[1] = 5;
        expect(toa_cp).not.toEqual(test_obj_arr);
    });
});

describe("Distance functions", () => {
    test("Cosine", () => {
        expect(cosine([1, 1, 1, 1], [1, 1, 1, 1])).toBe(0);
        expect(cosine([0, 1, 0, 1], [1, 0, 1, 0])).toBe(1);
        expect(cosine([0, 1, 2, 3], [1, 4, 6, 7])).toBe(0.020876170553818074, 10);
    });

    test("Euclidean", () => {
        expect(euclidean([1, 1, 1, 1], [1, 1, 1, 1])).toBe(0);
        expect(euclidean([0, 1, 0, 1], [1, 0, 1, 0])).toBe(2);
        expect(euclidean([0, 1, 2, 3], [1, 4, 6, 7])).toBe(6.480740698407860230, 10);
    });

    test("Jaccard", () => {
        expect(jaccard([1, 1, 1, 1], [1, 1, 1, 1])).toBe(0);
        expect(jaccard([0, 1, 0, 1], [1, 0, 1, 0])).toBe(1);
        expect(jaccard([0, 1, 2, 3], [1, 4, 6, 7])).toBe(0.25, 10);
    });
});
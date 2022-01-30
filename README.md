# NLPLearn

Natural Language Processing Toolkit for JavaScript.

## About NLPLearn

NLPLearn is a natural language processing library focused on client-side operations, providing simple text processing tools, such as text tokenizer, stemmers, vectorizer etc. It includes a set of utility resources and a classifier as well.

## Usage

The objective of this library is to be used for different purposes and contexts. So, it has been made available in three different versions:

- ES6 modules: for newer projects (with better intellisense support);
- CommonJS: The same as the above, but transpiled for compatibility with older projects;
- Browser (useful for simple client-side apps): Browser-compatible Vanilla JS code (debugging + minified versions).

Furthermore, it is important to state that some classes have import/export utilities that let you to export instances of classifiers, vectorizers and others, to a plain JS object that can be stored as strings (JSON) so as to be retrieved and converted to an instance of its original class afterwards (check code docs for more details). Generic example:

    repo.save("my-model", model.toModel());
    // ...
    let modelClone = ModelClass.fromModel(repo.get("my-model"));

### ES6 Modules

Although the "distribution" is in CommonJS, it is possible to import components which have been written in newer syntax. All you have to do is to add "/src" to your import:

    import NLPLearn from "nlplearn/src"

Should you want to use object destructing:

    import { stemmer } from "nlplearn/src";
    const { PorterStemmer } = stemmer;
    // must return "close"
    console.log(PorterStemmer.stem("closing"));

Another advantage of using this sort of import is that it is possible (and way simpler) to import a single resource directly from the source module (it also saves memory, since you won't be importing unused resources):

    import { PorterStemmer } from "nlplearn/src/preprocessing/stemmer";
    // continue...

### CommonJS

Since the "distrubution" version of this library is already in CommonJS, all you have to do to access its modules is the following:

    const NLPLearn = require("nlplearn");
    // result must be 1
    console.log(NLPLearn.distance.cosine([0, 1], [1, 0]));

Should you want to use only specific resources:

    const distance = require("nlplearn").distance;
    // result must be 1
    console.log(distance.cosine([0, 1], [1, 0]));
    
    // in the following snippet, the result must be 1 as well
    const cosine = distance.cosine;
    console.log(cosine([0, 1], [1, 0]));

Since the class recomendation is to import from "index.js", as previously demonstrated, the importation of a single resource would be a little bit trickier, but is is possible. However, it will be necessary to follow the same directory structure as in ES modules, replacing "/src" by "/dist":

    const cosine = require("nlplearn/dist/utils/distance").cosine;
    // the same as: const cosine = require("nlplearn").distance.cosine;

### Browser (Vanilla JS)

The usage in browser is quite similar to CommonJS (thanks to Babel + Browserify). However, you must copy a version of nlplearn available in [the library repository](https://github.com/mauromascarenhas/NLPLearn/tree/main/browser-dist) to your server and add the following tag to the `<head>...</head>` session of your website (unfortunately, there is no CDN available yet):

    <script type="application/javascript" src="./path/to/nlplearn/nlplearn-<version>[.min].js" defer></script>

Available versions:

- Regular: mostly used for debugging purposes;
- Minified (ends with ".min.js"): meant for use in production - smaller size.

**NB.:** Differently from ES modules and CommonJS, it is not possible to import a single resource.

## Build

Should you want to use this library with recent JS versions (ES6+), the build step will not be necessary. However, if you need to use/integrate with legacy code (CommonJS) or get browser supported versions, everything you have to do is to use one of the following commands:

    > npm run build # Builds for CommonJS and Browser;
    > npm run build:dist # Builds for CommonJS, only;
    > npm run build:browser # Generates a browser-friendly code (must build for CommonJS before);
    > npm run build:browser:reg # Generates a browser-friendly code: for debugging purposes;
    > npm run build:browser:min # Generates a minified browser-friendly code: for production environment.

### Tests

The tests files are located into `./test` directory. So, evertything you have to do so as to perform the automated (unitary) tests is to run:

    > npm run test

## Docs

In addition to the static documentation, the source code is completely typed, providing a greater support for code intellisense (tested with JS, only).

The HTML documentation for this library can be accessed [here](https://mauromascarenhas.github.io/NLPLearn/). It is important to keep in mind that new set of documentation pages is generated for each tagged version. Check the next subtopic so as to learn how to build a "preview" version yourself.

### Docs generation

It is possible to generate the code documentation for the current version by running `npm run docs:gen` in development environment.

Finally, should you want to open it in browser, there is a convenience script which creates a local server and opens the generated documentation in browser:

    > npm run docs:serve # Serves "home" docs page
    > nom run docs:serve:current # Serves code docs for current version

## Sources and development

You can access the source code and contribute to the development of this library through our [repository available at Github](https://github.com/mauromascarenhas/NLPLearn). It is available under Mozilla Public Licence v2.0 ([MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)).
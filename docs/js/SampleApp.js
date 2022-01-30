const NLPLearn = require("nlplearn");

const texts = [
    "I need to be more confident about building predictive models...",
    "If I were to work with predictive models I would start with decision trees!",
    "I practice some radical sports such as skateborading and surfing oftenly.",
    "Personaly speaking, practicing sports is the norm.",
    "It is high time I bought this brand new skateboard.",
    "I love eating, specially pasta and lasagna.",
    "Culinary is my passion!"
];

const authors = [
    "James",
    "James",
    "Paul",
    "Paul",
    "Paul",
    "John",
    "John"
];

const { TextProcessor, TextCase, StemmerType } = NLPLearn.preprocessor;

/*
    In this step we tell TextProcessor to normalize text case (lowercase),
        strip accents, tokenize the texts (word-level) and removing numbers,
        remove english stopwords (NLTK set) and stemize whe given words.
*/
const pcs = new TextProcessor(false, TextCase.LOWERCASE, false, true,
    true, false, NLPLearn.stopwords.StopWords.get("en"), StemmerType.PORTER);

/*
    Creates a text vectorizer with default parameters: Raw count (TF),
        no IDF and no prefefined vocabulary (terms).
*/
const trf = new NLPLearn.vectorizer.TextVectorizer();
const matrix = trf.fitTransform(pcs.transform(texts));

const clf = new NLPLearn.classifier.NLPClassifier();
clf.fit(matrix, authors);

Vue.createApp({
    name: "SampleApp",
    data(){
        return {
            uInput: "I love practicing skateboarding!",
            prediction: ""
        }
    },
    methods: {
        predict(){
            let cMatrix = trf.transform(pcs.transform([this.uInput]));
            this.prediction = clf.predict(cMatrix)[0];
        }
    },
    watch: {
        uInput(){ this.prediction = ""; }
    },
    mounted(){

    },
    template: `
    <div class="row my-3">
        <div class="col-sm-10 col-md-8 mx-auto">
            <form class="row mx-auto" @submit.prevent="predict">
                <div class="col me-0 pe-0">
                    <label class="sr-only" for="userTextInput">Test phrase for prediction</label>
                    <input type="text" class="form-control" id="userTextInput" placeholder="Your test phrase here..." v-model="uInput">
                </div>
                <div class="col-auto ms-0 ps-0 d-flex">
                    <button type="submit" class="btn btn-primary align-self-end">Predict</button>
                </div>
            </form>
        </div>
    </div>
    <div v-if="prediction.length" class="row">
        <div class="col-sm-10 col-md-8 mx-auto">
            <div class="alert alert-primary text-center" role="alert">
                It was problably <strong>{{ prediction }}</strong> who said that!
            </div>
        </div>
    </div>
    `
}).mount("#app");
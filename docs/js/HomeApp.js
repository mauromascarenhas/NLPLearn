Vue.createApp({
    name: "HomeView",
    data(){
        return {
            docVersion: "1.1.0"
        }
    },
    computed: {
        availableVersions(){
            return [
                {
                    "name": "NLPLearn 1.1.0 (latest)",
                    "version": "1.1.0"
                },
                {
                    "name": "NLPLearn 1.0.0",
                    "version": "1.0.0"
                }
            ]
        }
    },
    template: `
        <div class="row d-flex justify-content-center my-3">
            <form class="col-auto">
                <label for="docsVer">Select NLPLearn version for "Docs" button:</label>
                <select id="docsVer" class="form-select" aria-label="Select package version for accessing docs" v-model="docVersion">
                    <option v-for="v in availableVersions" :key="v" :value="v.version">{{ v.name }}</option>
                </select>
            </form>
        </div>
        <div class="row">
            <div class="col-md-6 d-flex justify-content-center justify-content-md-end my-1">
                <a role="button" tabindex="0" class="btn btn-primary btn-lg p-3" href="./sample.html">Sample (latest version)</a>
            </div>
            <div class="col-md-6 d-flex justify-content-center justify-content-md-start my-1">
                <a role="button" tabindex="0" class="btn btn-primary btn-lg p-3" :href="'./' + docVersion + '/index.html'">Documentation for v{{ docVersion }}</a>
            </div>
        </div>
    `
}).mount("#app");

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),

    data: {
        assets: [
            { url: 'example/fbx/22-rp_manuel_animated_001_dancing_fbx/rp_manuel_animated_001_dancing.fbx', value: 0 },
            { url: 'example/fbx/Samba Dancing.fbx', value: 1 }
        ],

        showToolbar: false,
        showUI: true,
        showStats: true
    },

    components: {
    },

    methods: {
        loadAsset(assetNumber) {

            console.log("Loading Asset: " + assetNumber);
            this.$loader(app.assets[assetNumber].url);

        }
    },

    watch: {
        showStats(newValue) {
            var stats = document.getElementById("stats-container");
            if (newValue) {
                stats.style.display = "block";
            }
            else {
                stats.style.display = "none";
            }
        }
    }
})


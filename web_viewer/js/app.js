
var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),

    data: {
        assets: [
            { url: 'example/fbx/22-rp_manuel_animated_001_dancing_fbx/rp_manuel_animated_001_dancing.fbx', value: 0 },
            { url: 'example/fbx/Samba Dancing.fbx', value: 1 }
        ],

        showToolbar: false,
        showUI: true
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
    }
})


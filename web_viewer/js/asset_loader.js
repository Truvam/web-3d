import { FBXLoader } from 'https://unpkg.com/three@0.123.0/examples/jsm/loaders/FBXLoader.js';

export default class AssetLoader {
    constructor() {
        this.manager = new THREE.LoadingManager();
        this.setManager();

        this.loader = new FBXLoader(this.manager);
        this.asset = new THREE.Object3D();
    }

    setManager() {
        this.manager.onStart = function (url, itemsLoaded, itemsTotal) {

            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.manager.onLoad = function () {

            console.log('Loading complete!');
        };


        this.manager.onProgress = function (url, itemsLoaded, itemsTotal) {

            console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.manager.onError = function (url) {

            console.log('There was an error loading ' + url);

        };
    }

    load(scene, url) {
        this.loader.load(url, function (object) {
            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            });

            scene.add(object);

            object.rotation.set(0,0,0);
        });
    }
}
import Stats from 'https://unpkg.com/three@0.123.0/examples/jsm/libs/stats.module.js';

import Controls from './controls.js';
import { controlTypes } from './controls.js'

import AssetLoader from './asset_loader.js';

var container, stats, controls;
var camera, scene, renderer, light;

var clock = new THREE.Clock();

var loader;

var mixer;

init();
animate();

function init() {

    container = document.querySelector('#scene-container');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 200, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add(light);

    // ground
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // model
    loader = new AssetLoader();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.append(renderer.domElement);

    controls = new Controls(controlTypes.ORBIT, camera, container);

    window.addEventListener('resize', onWindowResize, false);

    // stats
    stats = new Stats();
    var stats_container = document.querySelector('#stats-container');
    stats_container.append(stats.domElement);
}

function onWindowResize() {
    changeWindowSize(window.innerWidth, window.innerHeight);
}

function changeWindowSize(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

//

function animate() {

    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);

    stats.update();

}

function loadAsset(url) {
    loader.load(scene, url)
}

function changeControlType(controlType) {
    if (controlType == controlTypes.POINTERLOCK) {
        controls = new Controls(controlTypes.POINTERLOCK, camera, container);

    }
    else {
        controls.clearEvents();
        controls = new Controls(controlTypes.ORBIT, camera, container);
    }
}

Vue.prototype.$loader = loadAsset;
Vue.prototype.$controlTypes = controlTypes;
Vue.prototype.$changeControlType = changeControlType;
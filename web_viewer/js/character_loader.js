//const file_path = document.getElementById("file-input");
//file_path.addEventListener("change", handleFiles, false);
function handleFiles() {
    const file = this.files[0]; /* now you can work with the file list */

    console.log(file);
}

import Stats from 'https://unpkg.com/three@0.123.0/examples/jsm/libs/stats.module.js';
import { FBXLoader } from 'https://unpkg.com/three@0.123.0/examples/jsm/loaders/FBXLoader.js';

import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/PointerLockControls.js';

import Controls from './controls.js';
import { controlTypes } from './controls.js'

var container, stats, controls;
var camera, scene, renderer, light;

var clock = new THREE.Clock();

var mixer;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

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

    // scene.add( new CameraHelper( light.shadow.camera ) );

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
    var loader = new FBXLoader();
    loader.load('example/fbx/Samba Dancing.fbx', function (object) {

        mixer = new THREE.AnimationMixer(object);

        var action = mixer.clipAction(object.animations[0]);
        action.play();

        object.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        scene.add(object);

    });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    //controls = new Controls(controlTypes.ORBIT, camera, renderer.body);
    controls = new Controls(controlTypes.POINTERLOCK, camera, renderer.body);

    window.addEventListener('resize', onWindowResize, false);
    //changeWindowSize(393,729);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);
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
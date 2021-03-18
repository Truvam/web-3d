import Stats from './stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.123.0/examples/jsm/libs/dat.gui.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.123.0/examples/jsm/controls/OrbitControls.js';
import { BufferGeometryUtils } from 'https://unpkg.com/three@0.123.0/examples/jsm/utils/BufferGeometryUtils.js';

let container, stats, gui, guiStatsEl;
let camera, controls, scene, renderer, material;


// gui

const Method = {
    INSTANCED: 'INSTANCED'
};

const api = {
    method: Method.INSTANCED,
    count: 900
};
var count = api.count, poly, time;

//

console.log("COUNT,FPS,POLY,TIME(ms)")


init();
initMesh();
animate();

//

function clean() {

    const meshes = [];

    scene.traverse(function (object) {

        if (object.isMesh) meshes.push(object);

    });

    for (let i = 0; i < meshes.length; i++) {

        const mesh = meshes[i];
        mesh.material.dispose();
        mesh.geometry.dispose();

        scene.remove(mesh);

    }

}

const randomizeMatrix = function () {

    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function (matrix) {

        position.x = Math.random() * 40 - 20;
        position.y = Math.random() * 40 - 20;
        position.z = Math.random() * 40 - 20;

        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        rotation.z = Math.random() * 2 * Math.PI;

        quaternion.setFromEuler(rotation);

        scale.x = scale.y = scale.z = Math.random() * 1;

        matrix.compose(position, quaternion, scale);

    };

}();

function initMesh() {

    clean();

    // make instances
    new THREE.BufferGeometryLoader()
        .setPath('models/json/')
        .load('suzanne_buffergeometry.json', function (geometry) {

            material = new THREE.MeshNormalMaterial();

            geometry.computeVertexNormals();

            var start = window.performance.now();

            makeInstanced(geometry);

            var end = window.performance.now();
            time = end - start;
        });
}

function makeInstanced(geometry) {

    const matrix = new THREE.Matrix4();
    const mesh = new THREE.InstancedMesh(geometry, material, api.count);

    for (let i = 0; i < api.count; i++) {

        randomizeMatrix(matrix);
        mesh.setMatrixAt(i, matrix);

    }

    scene.add(mesh);

    //

    // Printing previous count
    if (poly != undefined)
        console.log(count + "," + Math.round(stats.getFrameRate()) + "," + poly + "," + time);

    count = api.count;
    poly = renderer.info.render.triangles;

    const geometryByteLength = getGeometryByteLength(geometry);

    guiStatsEl.innerHTML = [

        '<i>GPU draw calls</i>: 1',
        '<i>GPU memory</i>: ' + formatBytes(api.count * 16 + geometryByteLength, 2),
        '<i>FPS</i>: ' + stats.getFrameRate(),
        '<i>Polygons</i>: ' + renderer.info.render.triangles

    ].join('<br/>');
}

function init() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    // camera

    camera = new THREE.PerspectiveCamera(70, width / height, 1, 100);
    camera.position.z = 30;

    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.info.autoReset = false;

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // controls

    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;

    // stats

    stats = new Stats();
    container.appendChild(stats.dom);

    // gui

    gui = new GUI();
    gui.add(api, 'count', 1, 100000).step(100).onChange(initMesh);

    const perfFolder = gui.addFolder('Performance');

    guiStatsEl = document.createElement('li');
    guiStatsEl.classList.add('gui-stats');

    perfFolder.__ul.appendChild(guiStatsEl);
    perfFolder.open();

    // listeners

    window.addEventListener('resize', onWindowResize);

    Object.assign(window, { scene });

}

//

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

function animate() {

    requestAnimationFrame(animate);

    controls.update();
    stats.update();

    render();

}

function render() {

    renderer.render(scene, camera);

}

//

function getGeometryByteLength(geometry) {

    let total = 0;

    if (geometry.index) total += geometry.index.array.byteLength;

    for (const name in geometry.attributes) {

        total += geometry.attributes[name].array.byteLength;

    }

    return total;

}

// Source: https://stackoverflow.com/a/18650828/1314762
function formatBytes(bytes, decimals) {

    if (bytes === 0) return '0 bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'KB', 'MB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

}

import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import palmModel from './assets/palm.glb';

const container = document.querySelector('#scene-container');

const scene = new THREE.Scene();

const fov = 35;
const aspect = container.clientWidth / container.clientHeight;
const near = .1;
const far = 100;

let camera;
let renderer;
let light;
(function init() {
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 6, 10);

    renderer  = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    light = new THREE.DirectionalLight({
        color: 'white',
        intensity: 5
    });
    light.position.set(10, 15, 10);
    scene.add(light);

    container.appendChild(renderer.domElement);

    loadPalmTree();
    animate();
})();

let palmTree;
function loadPalmTree() {
    var material = new THREE.MeshStandardMaterial({ color: 'green' });

    const loader = new GLTFLoader();
    loader.load(palmModel, model => {
        palmTree = model.scene;
        palmTree.traverse(el => {
            el.material = material;
        });
        scene.add(palmTree);
    });
}

let goingForward = true;
(function changeDirection() {
    goingForward = !goingForward;
    setTimeout(changeDirection, 3000);
})();

const zStep = .0001;
const yStep = .0001;
function animate() {
    requestAnimationFrame(animate);

    // Animation
    if (palmTree) {
        if (goingForward) {
            palmTree.rotation.z += zStep;
        } else {
            palmTree.rotation.z -= zStep;
        }
        palmTree.rotation.y += yStep;
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
});

let canvas = document.querySelector('canvas');
canvas.addEventListener('mousemove', (e) => {
    const {clientX, clientY} = e;

    camera.position.set(clientX * .00001, 6 + (clientY * .00005), 10);
});
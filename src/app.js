import * as THREE from "three/build/three.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "three/examples/jsm/loaders/IFCLoader";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

import { GUI as RhinoGUI } from "three/examples/jsm/libs/dat.gui.module";
import { createSideMenuButton } from './gui/gui-creator';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;

const lightColor = 0xffffff;

const ambientLight = new THREE.AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

const threeCanvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const grid = new THREE.GridHelper(50, 30);
scene.add(grid);

const axes = new THREE.AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;

const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();

window.addEventListener("resize", () => {
    (size.width = window.innerWidth), (size.height = window.innerHeight);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
});

const rhino3dmLoader = new Rhino3dmLoader();
rhino3dmLoader.setLibraryPath("libs/rhino3dm/");

const ifcLoader = new IFCLoader();
ifcLoader.setWasmPath("libs/web-ifc/");

setupModelReader();

function getExt(filename) {
    var pos = filename.lastIndexOf('.');
    if (pos === -1) return '';
    return filename.slice(pos + 1);
}

function initGUI(layers) {
    const gui = new RhinoGUI({ width: 300 });
    const layersControl = gui.addFolder('layers');
    layersControl.open();

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        layersControl.add(layer, 'visible').name(layer.name).onChange(function (val) {
            const name = this.object.name;

            scene.traverse(function (child) {
                if (child.userData.hasOwnProperty('attributes')) {
                    if ('layerIndex' in child.userData.attributes) {
                        const layerName = layers[child.userData.attributes.layerIndex].name;
                        if (layerName === name) {
                            child.visible = val;
                            layer.visible = val;
                        }
                    }
                }
            });
        });
    }
}

function setupModelReader() {
    const inputElement = createInputElement();
    const button = createSideMenuButton('./resources/file-add.svg');
    button.addEventListener('click', () => {
        button.blur();
        inputElement.click();
    });
}

function createInputElement() {
    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'file');
    inputElement.setAttribute('accept', '.ifc,.3dm');
    inputElement.classList.add('hidden');
    document.body.appendChild(inputElement);
    inputElement.addEventListener('change', (event) => loadModel(event), false);
    return inputElement;
}

function loadModel(event) {
    var ext = getExt(event.target.files[0].name).toLowerCase();
    var modelURL = URL.createObjectURL(event.target.files[0]);

    if (ext === "ifc") {
        console.log(modelURL);
        ifcLoader.load(modelURL, (geometry) => scene.add(geometry));
    }
    else if (ext === "3dm") {
        alert("NOTICE: This viewer is only supported Mesh objects in 3dm, not support other objects like NURBS.");
        rhino3dmLoader.load(modelURL, function (object) {
            object.traverse(function (child) {
                // rotate to y-up
                child.rotateX(- Math.PI / 4);
            });
            scene.add(object);
            console.log(object);
            initGUI(object.userData.layers);
        });
    }
}
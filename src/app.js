import {
    AmbientLight,
    AxesHelper,
    Color,
    DirectionalLight,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "three/examples/jsm/loaders/IFCLoader";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

const scene = new Scene();
scene.background = new Color(0xaaaaaa);

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const camera = new PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;

const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({ canvas: threeCanvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const grid = new GridHelper(50, 30);
scene.add(grid);

const axes = new AxesHelper();
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

const input = document.getElementById("file-input");

input.addEventListener(
    "change",
    (changed) => {
        var ext = getExt(input.files[0].name).toLowerCase();
        var modelURL = URL.createObjectURL(changed.target.files[0]);

        if (ext === "ifc") {
            console.log(modelURL);
            ifcLoader.load(modelURL, (geometry) => scene.add(geometry));
        }
        else if (ext === "3dm") {
            alert("NOTICE: This viewer is only support Mesh object in 3dm, not support like NURBS objects.");
            rhino3dmLoader.load(modelURL, (geometry) => scene.add(geometry), false, false);
        }
    },
    false
);

function getExt(filename) {
    var pos = filename.lastIndexOf('.');
    if (pos === -1) return '';
    return filename.slice(pos + 1);
}

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
    (size.width = window.innerWidth), (size.height = window.innerHeight)
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
});

const ifcLoader = new IFCLoader();
ifcLoader.setWasmPath("wasm/");

const input = document.getElementById("file-input");
input.addEventListener(
    "change",
    (changed) => {
        var ifcURL = URL.createObjectURL(changed.target.files[0]);
        console.log(ifcURL);
        ifcLoader.load(ifcURL, (geometry) => scene.add(geometry));
    },
    false
);

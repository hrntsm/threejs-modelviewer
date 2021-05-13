import * as THREE from "three/build/three.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "three/examples/jsm/loaders/IFCLoader";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

const scene = new THREE.Scene();
const rhino3dmLoader = new Rhino3dmLoader();
const ifcLoader = new IFCLoader();

export function setupScene() {
    scene.background = new THREE.Color(0xaaaaaa);

    const size = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
    camera.position.z = 15;
    camera.position.y = 15;
    camera.position.x = 15;

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

    rhino3dmLoader.setLibraryPath("libs/rhino3dm/");
    ifcLoader.setWasmPath("libs/web-ifc/");
}

export { scene, ifcLoader, rhino3dmLoader };
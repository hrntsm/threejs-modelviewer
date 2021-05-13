import { scene, ifcLoader, rhino3dmLoader } from '../scene/scene';
import { rhinoLayerGUI } from '../gui/rhino-layer';

export function loadModel(event) {
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
            rhinoLayerGUI(object.userData.layers);
        });
    }
}

function getExt(filename) {
    var pos = filename.lastIndexOf('.');
    if (pos === -1) return '';
    return filename.slice(pos + 1);
}
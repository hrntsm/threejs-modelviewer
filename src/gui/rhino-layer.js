import { scene } from '../scene/scene';
import { GUI as RhinoGUI } from "three/examples/jsm/libs/dat.gui.module";

export function rhinoLayerGUI(layers) {
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

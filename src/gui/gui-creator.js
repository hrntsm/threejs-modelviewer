import { loadModel } from '../loader/loader';

function createSideMenuButton(iconSource) {
    const button = document.createElement('button');
    button.classList.add('basic-button');

    const image = document.createElement("img");
    image.setAttribute("src", iconSource);
    image.classList.add('icon');
    button.appendChild(image);

    const sideMenu = document.getElementById('side-menu-left');
    sideMenu.appendChild(button);

    return button;
}

export function setupModelLoader() {
    const inputElement = createInputElement();
    const button = createSideMenuButton('./resources/file-document.svg');
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
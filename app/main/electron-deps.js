const nodeRequire = window.nodeRequire || window.require || require;

window.nodeRequire = nodeRequire;

const path = nodeRequire('path');
const { pathToFileURL } = nodeRequire('url');
const { ipcRenderer } = nodeRequire('electron');
const fs = nodeRequire('fs');

export {
    nodeRequire,
    path,
    pathToFileURL,
    ipcRenderer,
    fs
};
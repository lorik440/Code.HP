const nodeRequire = window.nodeRequire || window.require;

window.nodeRequire = nodeRequire;

export const path = nodeRequire("path");
export const { pathToFileURL } = nodeRequire("url");
export const { ipcRenderer } = nodeRequire("electron");
export const fs = nodeRequire("fs");
export { nodeRequire };

// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveHistory: (history) => ipcRenderer.invoke("save-history", history),
  loadHistory: () => ipcRenderer.invoke("load-history"),
  sendRequest: (requestData) => ipcRenderer.invoke("send-request", requestData),
  minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
  maximizeWindow: () => ipcRenderer.invoke("maximize-window"),
  closeWindow: () => ipcRenderer.invoke("close-window"),
});
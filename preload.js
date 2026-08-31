const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('audiora', {
  selectFiles: () => ipcRenderer.invoke('dialog:openFiles'),
  selectFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  minimize: () => ipcRenderer.send('window:minimize'),
  toggleMaximize: () => ipcRenderer.send('window:toggleMaximize'),
  close: () => ipcRenderer.send('window:close'),
  platform: process.platform
});

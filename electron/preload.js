const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any specific APIs you want to expose to the renderer process
  // For now, we'll keep it minimal for security
  getVersion: () => process.versions.electron,
  platform: process.platform,
  
  // Example: If you need to communicate between renderer and main process
  // openExternal: (url) => ipcRenderer.invoke('open-external', url),
  // showMessage: (message) => ipcRenderer.invoke('show-message', message)
});

// Prevent new window creation (security measure)
window.addEventListener('DOMContentLoaded', () => {
  // Override window.open to prevent popup windows
  window.open = () => {
    console.warn('window.open is disabled for security reasons');
    return null;
  };
}); 
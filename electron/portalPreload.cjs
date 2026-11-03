const { contextBridge, ipcRenderer } = require('electron');
let activityDebounce = null;

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  openTourPortal: () => ipcRenderer.send('open-tour-portal'),
  toggleWin: () => ipcRenderer.invoke('toggle-win'),
  goHome: () => ipcRenderer.send('go-home'),

  // 수신/송신 메서드
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  send: (channel, data) => ipcRenderer.send(channel, data),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

const handleUserActivity = () => {
  if (activityDebounce) return;

  activityDebounce = setTimeout(() => {
    ipcRenderer.send('portal-user-activity');
    activityDebounce = null;
  }, 1000);
};

window.addEventListener('mousemove', handleUserActivity);
window.addEventListener('scroll', handleUserActivity);
window.addEventListener('keydown', handleUserActivity);
window.addEventListener('click', handleUserActivity);

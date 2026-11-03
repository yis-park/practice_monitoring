const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

function readEnvXML() {
  const isPackaged = process.env.NODE_ENV === 'production' || process.defaultApp === undefined;

  // console.log('__Dirname', __dirname);
  const envPath = isPackaged ? path.join(process.resourcesPath, 'env.xml') : path.join(__dirname, '../env.xml');

  console.log('[preload] envPath:', envPath, 'isPackaged', process.env.NODE_ENV, 'test', path.join(__dirname, '../env.xml'));

  try {
    const xml = fs.readFileSync(envPath, 'utf-8');
    return parseStringPromise(xml).then((result) => {
      const env = result?.env || {};
      const backendUrl = env.backend_url?.[0] || '';
      const frontendUrl = env.frontend_url?.[0] || '';

      console.log('[preload] backendUrl', backendUrl, 'frontendUrl', frontendUrl);
      return { backendUrl, frontendUrl };
    });
  } catch (err) {
    console.error('[preload] env.xml 읽기 실패:', err);
    return Promise.resolve({ backendUrl: '', frontendUrl: '' });
  }
}

readEnvXML().then(({ backendUrl, frontendUrl }) => {
  console.log('[preload] 시작 - backendUrl:', backendUrl);

  contextBridge.exposeInMainWorld('electronAPI', {
    ping: () => ipcRenderer.invoke('ping'),
    openTourPortal: () => ipcRenderer.send('open-tour-portal'),
    toggleWin: () => ipcRenderer.invoke('toggle-win'),
    maximizeWin: () => ipcRenderer.invoke('maximize-win'),
    shutdownRestart: () => ipcRenderer.send('shutdown-restart'),
    shutdown: () => ipcRenderer.send('shutdown'),
    cancelShutdown: () => ipcRenderer.send('cancel-shutdown'),
    exit: () => ipcRenderer.send('exit'),
    getBaseUrl: () => backendUrl,
    retryReactApp: () => ipcRenderer.send('retry-react-app'),

    on: (channel, callback) => ipcRenderer.on(channel, callback),
    send: (channel, data) => ipcRenderer.send(channel, data),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  });
});

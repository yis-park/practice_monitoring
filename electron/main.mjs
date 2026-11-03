// electron/main.mjs
import { app, BrowserWindow, ipcMain, globalShortcut, powerSaveBlocker, dialog, powerMonitor } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import throttle from 'lodash.throttle';
import { exec } from 'child_process';
import { readEnvXML } from './readEnv.mjs';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import fs from 'fs';

let env = '';

// 로그 저장 경로
// const logDir = 'D:/orhyn/jecheon/jecheon-kiosk/logs'; // [테스트] 로컬 로그 디렉토리 경로
// const logDir = 'C:/jecheon/jecheon-frontend/jecheon-kiosk/logs'; // [테스트] 서버 로그 디렉토리 경로
const logDir = 'C:/jecheon/jecheon-kiosk/logs'; // 키오스크 로그 디렉토리 경로

try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (err) {
  console.error('[Electron] 로그 디렉토리 생성 실패:', err);
}
const logPath = path.join(logDir, 'kiosk.log');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
  originalLog(...args);
  logStream.write(`[${new Date().toISOString()}] [LOG] ${args.join(' ')}\n`);
};

console.warn = (...args) => {
  originalError(...args);
  logStream.write(`[${new Date().toISOString()}] [WARN] ${args.join(' ')}\n`);
};

console.error = (...args) => {
  originalError(...args);
  logStream.write(`[${new Date().toISOString()}] [ERR] ${args.join(' ')}\n`);
};

console.log('\n\n\n======================================');
console.log('[Jecheon Kiosk 시작] ' + new Date().toLocaleString());
console.log('======================================\n');
console.log('[Electron] 시작 - 로그 경로:', logPath);

// 절전 이벤트 처리
let isSystemShuttingDown = false;
powerMonitor.on('shutdown', () => {
  isSystemShuttingDown = true;
});

let win = null; // 메인 윈도우
let splash = null; // 스플래시 윈도우
let portalWin = null; // 관광 포털 윈도우
let overlayWin = null; // 오버레이 윈도우(처음으로 버튼)
let portalInactivityTimer = null;
let portalSyncOverlayPosition = null;
let isClosingPortal = false;
export const __dirname = path.dirname(fileURLToPath(import.meta.url));

let blockerId = null;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function hasLiveWindow(target) {
  return target != null && !target.isDestroyed();
}

function resetPortalInactivityTimer() {
  if (portalInactivityTimer) {
    clearTimeout(portalInactivityTimer);
    portalInactivityTimer = null;
  }

  if (!hasLiveWindow(portalWin)) return;

  portalInactivityTimer = setTimeout(
    () => {
      closeTourPortal();
    },
    1000 * 60 * 3
  );
}

function cleanupTourPortal({ restoreMainWindow = true } = {}) {
  if (portalInactivityTimer) {
    clearTimeout(portalInactivityTimer);
    portalInactivityTimer = null;
  }

  if (hasLiveWindow(portalWin) && portalSyncOverlayPosition) {
    portalWin.removeListener('move', portalSyncOverlayPosition);
    portalWin.removeListener('resize', portalSyncOverlayPosition);
  }

  if (hasLiveWindow(overlayWin)) {
    overlayWin.close();
  }

  portalSyncOverlayPosition = null;
  overlayWin = null;
  portalWin = null;
  isClosingPortal = false;

  if (restoreMainWindow && hasLiveWindow(win)) {
    win.setAlwaysOnTop(true);
    win.focus();
  }
}

function closeTourPortal() {
  if (!hasLiveWindow(portalWin) && !hasLiveWindow(overlayWin)) {
    cleanupTourPortal();
    return;
  }

  if (isClosingPortal) return;
  isClosingPortal = true;

  if (hasLiveWindow(portalWin)) {
    portalWin.close();
  } else {
    cleanupTourPortal();
  }
}

// 운영 시간 외 종료 관련 로직
let cancelUntil = 0;
ipcMain.on('cancel-shutdown', () => {
  cancelUntil = Date.now() + 30 * 60 * 1000; // 30분 동안 재확인 방지
});

function checkAndExitByTime() {
  const now = new Date();
  const hour = now.getHours();
  const timeStr = now.toTimeString().slice(0, 5);
  if (Date.now() < cancelUntil) {
    console.log(`${timeStr} 종료 재확인 유예 중입니다.`);
    return;
  }

  // production용 (9시 ~ 22시 외 종료)
  if (hour < 9 || hour >= 22) {
    console.log('운영 시간이 아닙니다. 종료 팝업을 띄웁니다.');
    win.webContents.send('show-exit-dialog');
  }

  // test용
  // if (hour >= 9 && hour < 22) {
  //   console.log(`[test] ${timeStr} 운영 시간이 아닙니다. 종료 팝업을 띄웁니다.`);
  //   win.webContents.send('show-exit-dialog');
  // }
}

const gotTheLock = app.requestSingleInstanceLock(); // 싱글 인스턴스 락
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(async () => {
    try {
      await delay(2000);
      const isCreated = await createWindow();
      if (isCreated) {
        blockerId = powerSaveBlocker.start('prevent-display-sleep');
      }
      console.log('[Electron] powerSaveBlocker started:', powerSaveBlocker.isStarted(blockerId), 'blockerId', blockerId);
    } catch (e) {
      console.error('창 생성 실패:', e);
      return;
    }

    ipcMain.handle('ping', async () => 'pong!');
    ipcMain.on('open-tour-portal', () => openTourPortal());
    ipcMain.on('portal-user-activity', () => {
      if (hasLiveWindow(portalWin)) {
        resetPortalInactivityTimer();
      }
    });
    ipcMain.on('go-home', () => {
      closeTourPortal();
    });
    ipcMain.on('shutdown-restart', () => {
      app.quit();
      exec('shutdown -r -t 3');
    });

    ipcMain.on('shutdown', () => {
      if (isSystemShuttingDown) {
        console.log('이미 시스템 종료 진행 중 → 중복 호출 방지');
        return;
      }
      isSystemShuttingDown = true;

      app.quit();
      exec('shutdown -s -t 3');
    });

    ipcMain.on('exit', () => {
      app.quit();
      exec(`reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon" /v Shell /t REG_SZ /d explorer.exe /f`, (err) => {
        if (!err) exec('shutdown -r -t 3');
      });
    });

    // offline > 다시 시도 버튼 클릭 시 수신
    ipcMain.on('retry-react-app', () => {
      console.log('[Electron] offline.html에서 재시도 요청 수신 window status', JSON.stringify(win));
      const url = `${frontendUrl}/smbiz_support/kiosk/`; // production용
      // const url = `${frontendUrl}/kiosk/`; // test용
      if (win && !win.isDestroyed()) {
        win.loadFile(path.join(__dirname, 'loading.html'));

        console.log('[Electron] 프론트엔드 최종 경로  URL:', url);

        tryLoadReactApp(win, url, 2);
      } else {
        console.log('[Electron] 창이 존재하지 않거나 이미 파괴되었습니다. 재시도 불가', win);
        createMainHidden();

        win.loadFile(path.join(__dirname, 'loading.html'));
        tryLoadReactApp(win, url, 2);
      }
    });

    let isTogglingFullscreen = false;
    ipcMain.handle('toggle-win', async () => {
      if (!win || win.isDestroyed() || isTogglingFullscreen) return;
      isTogglingFullscreen = true;
      win.setFullScreen(!win.isFullScreen());
      await new Promise((res) => setTimeout(res, 200));
      isTogglingFullscreen = false;
      return win.isFullScreen();
    });

    ipcMain.handle('maximize-win', async () => {
      if (!win || win.isDestroyed() || isTogglingFullscreen) return;
      isTogglingFullscreen = true;
      win.setFullScreen(true);
      await new Promise((res) => setTimeout(res, 200));
      isTogglingFullscreen = false;
      return win.isFullScreen();
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    setTimeout(() => {
      checkAndExitByTime();
    }, 30 * 1000); // 시작 후 30초 이후 종료 시점 확인 시작
    setInterval(
      () => {
        checkAndExitByTime();
      },
      10 * 60 * 1000 // 10분에 한 번 씩 종료 시점 확인
    );
  });
}

function isUrlAccessible(targetUrl) {
  try {
    const { protocol, hostname, port, pathname } = new URL(targetUrl);
    const requestLib = protocol === 'https:' ? https : http;

    return new Promise((resolve) => {
      const req = requestLib.request({ hostname, port, path: pathname, method: 'HEAD', timeout: 3000 }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    });
  } catch (e) {
    console.error('[Electron] URL 파싱 실패:', targetUrl, e);
    return Promise.resolve(false);
  }
}

// 앱 로딩 시도 함수
function tryLoadReactApp(win, url, retries = 2) {
  console.log(`[Electron] React 앱 로딩 시도 시작: ${url}, 남은 재시도 횟수: ${retries}`);
  if (retries <= 0) {
    console.error('[Electron] React 앱 최종 로드 실패 - fallback 화면으로');
    win.loadFile(path.join(__dirname, 'offline.html'));
    return;
  }

  // URL 접근 가능 여부 확인
  isUrlAccessible(url).then((ok) => {
    if (ok) {
      console.log('[Electron] url 접근 가능 확인 -> url 실행', url);
      win.loadURL(url).catch((err) => {
        console.error('[Electron] loadURL 에러:', err);
      });
    } else {
      console.warn(`[Electron] 접근 불가 url 재시도 남음: ${retries - 1}`);
      setTimeout(() => tryLoadReactApp(win, url, retries - 1), 2000);
    }
  });
}

let frontendUrl = '';
let backendUrl = '';

// 스플래시 화면 생성
function createSplash() {
  splash = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    transparent: false,
    backgroundColor: '#1a1a1a',
    center: true,
    fullscreen: true,
    icon: path.join(__dirname, '../public/icon.png'),
  });
  splash.loadFile(path.join(__dirname, 'loading.html'));
}

// 메인 윈도우 생성 (초기에는 숨김)
function createMainHidden() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    frame: false,
    resizable: false,
    fullscreen: true,
    kiosk: true,
    paintWhenInitiallyHidden: true,
    icon: path.join(__dirname, '../public/icon.png'),
    backgroundColor: '#1a1a1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.once('ready-to-show', () => {
    // 첫 페인트 준비 완료 시점에만 표시
    if (splash && !splash.isDestroyed()) splash.close();
    splash = null;
    win?.show();
    win?.focus();
  });

  win.on('closed', () => {
    win = null;
  });
}

// 시작 함수
async function createWindow() {
  try {
    createSplash();
    createMainHidden();

    // 환경 변수 읽기
    ({ backendUrl, frontendUrl } = await readEnvXML(app.isPackaged, __dirname));
    console.log('[Electron] env:', 'frontendUrl:', frontendUrl, 'backendUrl:', backendUrl);

    let retryCount = 3;
    while (retryCount-- > 0) {
      const isHttp = /^https?:\/\//i.test(frontendUrl || '');
      if (frontendUrl && isHttp) break;
      await delay(1000);
      ({ backendUrl, frontendUrl } = await readEnvXML(app.isPackaged, __dirname));
    }

    win.webContents.on('did-fail-load', (event, code, desc, urlTried) => {
      console.error('[Electron] did-fail-load:', code, desc, urlTried);
      if (code === -3) return; // 사용자의 네비게이션 중단 등
      if (code === -106) {
        console.log('와이파이 끊김 또는 인터넷 연결 없음');
      }
      tryLoadReactApp(win, `${frontendUrl}/smbiz_support/kiosk/`, 2);
    });

    if (!/^https?:\/\//i.test(frontendUrl || '')) {
      console.error('[Electron] 잘못된 baseUrl:', frontendUrl);
      await win.loadFile(path.join(__dirname, 'offline.html'));
      win.once('ready-to-show', () => {
        win.show();
        win.focus();
        if (splash && !splash.isDestroyed()) splash.close();
        splash = null;
      });
      return true;
    }

    if (app.isPackaged) {
      let url = `${frontendUrl}/smbiz_support/kiosk/`;
      tryLoadReactApp(win, url);
    } else {
      // const url = `${frontendUrl}/smbiz_support/kiosk/`;
      // tryLoadReactApp(win, 'http://localhost:5173/kiosk/');
      const url = 'http://localhost:5173/kiosk/';
      console.log('app status', app.isPackaged, 'url', url);
      tryLoadReactApp(win, url);
    }

    return true;
  } catch (error) {
    try {
      // 실패 시에도 스플래시 닫고 오프라인 노출
      if (!win || win.isDestroyed()) createMainHidden();
      await win.loadFile(path.join(__dirname, 'offline.html'));
      win.show();
      win.focus();
      if (splash && !splash.isDestroyed()) splash.close();
      splash = null;

      return true;
    } catch {
      return false;
    }
  }
}

app.on('before-quit', () => {
  try {
    if (logStream && !logStream.destroyed && !logStream.writableEnded) {
      logStream.write(`[${new Date().toISOString()}] [LOG] app before-quit\n`);
      logStream.end();
    }
  } catch (e) {
    console.error('로그 스트림 종료 실패:', e);
  }

  if (blockerId != null) {
    try {
      if (powerSaveBlocker.isStarted(blockerId)) {
        powerSaveBlocker.stop(blockerId);
        console.log('[Electron] powerSaveBlocker stopped');
      }
    } catch (e) {
      console.error('powerSaveBlocker stop 실패:', e);
    } finally {
      blockerId = null;
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (blockerId != null) {
      powerSaveBlocker.stop(blockerId);
      blockerId = null;
    }
    app.quit();
  }
});

export const openTourPortal = () => {
  if (hasLiveWindow(portalWin)) {
    portalWin.focus();
    if (hasLiveWindow(overlayWin)) {
      overlayWin.show();
    }
    resetPortalInactivityTimer();
    return;
  }

  portalWin = new BrowserWindow({
    parent: win,
    alwaysOnTop: true,
    kiosk: false,
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
    frame: false,
    movable: false,
    resizable: false,
    fullscreen: true,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'portalPreload.cjs'),
      nodeIntegration: false,
      contextIsolation: false,
    },
  });

  overlayWin = new BrowserWindow({
    parent: portalWin,
    width: 200,
    height: 80,
    kiosk: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    frame: false,
    movable: false,
    resizable: false,
    autoHideMenuBar: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'portalPreload.cjs'),
      contextIsolation: true,
    },
    show: false,
  });

  portalSyncOverlayPosition = () => {
    if (!hasLiveWindow(portalWin) || !hasLiveWindow(overlayWin)) return;

    const { x, y, width: portalWidth, height: portalHeight } = portalWin.getBounds();

    overlayWin.setBounds({
      x: x + portalWidth - 200 - 20,
      y: y + portalHeight - 80 - 150,
      width: 200,
      height: 80,
    });

    resetPortalInactivityTimer();
  };

  portalWin.on('move', portalSyncOverlayPosition);
  portalWin.on('resize', portalSyncOverlayPosition);

  portalWin.loadURL('https://www.jecheon.go.kr/tour/base/main/view');
  // overlayWin.loadFile(path.join(__dirname, 'overlay.html'));
  portalWin.webContents.once('did-finish-load', () => {
    overlayWin.loadFile(path.join(__dirname, 'overlay.html'));
  });

  portalWin.once('ready-to-show', () => {
    console.log('__dir', __dirname);
    portalSyncOverlayPosition();
    portalWin.show();
    portalWin.focus();
    overlayWin.show();
    win.setAlwaysOnTop(false);
    resetPortalInactivityTimer();
  });

  portalWin.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      if (portalWin.isFullScreen()) {
        portalWin.setFullScreen(false);
        if (overlayWin.isFullScreen()) {
          overlayWin.setFullScreen(false);
        }
      }
    }
  });
  portalWin.on('closed', () => {
    cleanupTourPortal();
  });
};

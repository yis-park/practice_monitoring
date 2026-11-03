export {};

declare global {
  interface Window {
    electronAPI: {
      ping: () => Promise<string>;
      openTourPortal: () => void;
      toggleWin: () => Promise<boolean>;
      maximizeWin: () => Promise<boolean>;
      shutdownRestart: () => void;
      shutdown: () => void;
      cancelShutdown: () => void;
      exit: () => void;
      getBaseUrl: () => string;
      on: (channel: string, callback: (...args: unknown[]) => void) => void;
      send: (channel: string, data?: unknown) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

declare module '*.css';
declare module 'swiper/css';

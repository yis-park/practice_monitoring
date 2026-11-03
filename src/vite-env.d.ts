/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_APP_BASE: string;
  readonly VITE_DEV_PROXY_PATH: string;
  readonly VITE_DEV_PROXY_REWRITE_TO: string;
  readonly VITE_DEV_PROXY_TARGET: string;
  readonly VITE_IMG_API_BASE: string;
  readonly VITE_SERVICE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

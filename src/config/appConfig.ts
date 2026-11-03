const requiredEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
};

export const SERVICE_KEY = requiredEnv(import.meta.env.VITE_SERVICE_KEY, 'VITE_SERVICE_KEY');
export const API_BASE = requiredEnv(import.meta.env.VITE_API_BASE, 'VITE_API_BASE');
export const IMG_API_BASE = import.meta.env.VITE_IMG_API_BASE ?? '';

const ASSET_REQUEST_PATTERNS = ['/file/download', '/QRimg', 'file/thumb'];

export const isAssetRequest = (url?: string) => {
  if (!url) return false;
  return ASSET_REQUEST_PATTERNS.some((pattern) => url.includes(pattern));
};

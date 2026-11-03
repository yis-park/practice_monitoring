import { SERVICE_KEY } from '../config/appConfig';
import type { ResponsePlayerListItem } from '../types/player';
import { apiInstance } from './api';

const downloadCache = new Map<string, string>();
const inflightCache = new Map<string, Promise<string | null>>();

// 디버그용 > 캐시 상태 조회
export const getDownloadCacheSnapshot = () => {
  return Array.from(downloadCache.entries()).map(([endpoint, blobUrl]) => ({
    endpoint,
    blobUrl,
  }));
};

export const collectEndpointsFromRaw = (raw: Record<string, ResponsePlayerListItem[]>): Set<string> => {
  const endpoints = new Set<string>();

  for (const group of Object.values(raw)) {
    for (const item of group) {
      if (item.file_endpoint) endpoints.add(item.file_endpoint);

      if (item.qr_endpoint) endpoints.add(item.qr_endpoint);
    }
  }

  return endpoints;
};
export const pruneDownloadCache = (keepEndpoints: Set<string>): void => {
  for (const [endpoint, blobUrl] of downloadCache.entries()) {
    if (!keepEndpoints.has(endpoint)) {
      URL.revokeObjectURL(blobUrl);

      downloadCache.delete(endpoint);
    }
  }
};

// 이미 blobUrl 이 있으면 즉시 반환
// 다운로드 중이면 동일 Promise 공유
// 새로 다운로드하면 blobUrl 생성 후 캐시 저장
export const downloadFileWithCache = (endPoint: string): Promise<string | null> => {
  if (!endPoint) return Promise.resolve(null);

  const cachedUrl = downloadCache.get(endPoint);
  if (cachedUrl) return Promise.resolve(cachedUrl);

  const inflight = inflightCache.get(endPoint);
  if (inflight) return inflight;

  const promise = fetchBlobUrl(endPoint)
    .then((blobUrl) => {
      if (blobUrl) downloadCache.set(endPoint, blobUrl);
      return blobUrl;
    })
    .finally(() => {
      inflightCache.delete(endPoint);
    });

  inflightCache.set(endPoint, promise);

  return promise;
};

const fetchBlobUrl = async (endpoint: string): Promise<string | null> => {
  try {
    const response = await apiInstance.get(endpoint, {
      params: {
        serviceKey: SERVICE_KEY,
      },
      responseType: 'blob',
    });

    const blob = response.data;
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  } catch (error) {
    console.error('파일 다운로드 실패:', error);
    return null;
  }
};

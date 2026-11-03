import { createContext, useCallback, useEffect, useRef, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from 'react';
import { parseCurrentPlaylists, parsedMediaData } from '../mappers/playerMapper';
import { getCurrentPlaylists, deletePlayedEmergencyNews } from '../services/playerApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import { collectEndpointsFromRaw, pruneDownloadCache } from '../services/downloadApi';
import type { MediaPlayList, PlayerListItemListProps, ResponsePlayerListItem } from '../types/player';
import type { DeleteResponse } from '../types/playerApi';

type EmergencyRef = {
  current: boolean;
};

interface PlayerContextType {
  currentPlaylists: PlayerListItemListProps | null;
  setCurrentPlaylists: Dispatch<SetStateAction<PlayerListItemListProps | null>>;
  playlistMedia: MediaPlayList[] | null;
  setPlaylistMedia: Dispatch<SetStateAction<MediaPlayList[] | null>>;
  loadCurrentPlaylist: (pointId: number) => Promise<void>;
  isLoading: boolean;
  isDownloading: boolean;
  reloadCurrentPlaylist: () => Promise<void>;
  isEmergencyNewsPlayed: EmergencyRef;
  playlistError: Error | null;
  deleteEmergencyNews: (nodeId: number) => void;
  deleteEmergencyNewsLoading: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const PlayerProvider = ({ children }: PropsWithChildren) => {
  const [playlistMedia, setPlaylistMedia] = useState<MediaPlayList[] | null>(null);
  const [currentPlaylists, setCurrentPlaylists] = useState<PlayerListItemListProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<number>(6);

  const rawPlaylistRef = useRef<Record<string, ResponsePlayerListItem[]> | null>(null);
  const selectedPointIdRef = useRef<number>(6);
  const isEmergencyNewsPlayed = useRef<boolean>(false);

  const [playlistError, setPlaylistError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const loadCurrentPlaylist = useCallback(
    async (pointId: number) => {
      setSelectedPointId(pointId);

      if (pointId === -1) {
        setCurrentPlaylists(null);
        setPlaylistMedia(null);
        rawPlaylistRef.current = null;
        selectedPointIdRef.current = pointId;

        pruneDownloadCache(new Set());
        return;
      } else {
        setIsLoading(true);

        const MIN_LOADING_TIME = 500;
        const start = Date.now();

        try {
          const rawData = await queryClient.fetchQuery({
            queryKey: ['currentPlaylists', pointId],
            queryFn: () => getCurrentPlaylists(pointId),
          });

          if (!rawData || (Object.keys(rawData).length === 0 && rawData.constructor === Object)) {
            if (rawData) {
              setPlaylistError(null);
            }
            setCurrentPlaylists(null);
            setPlaylistMedia(null);
            rawPlaylistRef.current = null;
            const elapsed = Date.now() - start;
            const remaining = MIN_LOADING_TIME - elapsed;
            if (remaining > 0) setTimeout(() => setIsLoading(false), remaining);
            else setIsLoading(false);
            return;
          }

          setPlaylistError(null);

          // rawData가 바뀌어서 새로 처리해야 하는 조건
          if (selectedPointIdRef.current !== pointId || rawPlaylistRef.current == null || !isEqual(rawData, rawPlaylistRef.current)) {
            // 긴급뉴스 재생 체크 초기화
            isEmergencyNewsPlayed.current = false;

            // 이번 rawData에서 "필요한 endpoint"를 먼저 수집
            const keepEndpoints = collectEndpointsFromRaw(rawData);

            const downloadStart = Date.now();
            // 다운로드 UI 표시
            setIsDownloading(true);

            const [current, media] = await Promise.all([parseCurrentPlaylists(rawData), parsedMediaData(rawData)]);

            setCurrentPlaylists(current);
            // 화면에 새 재생목록 적용
            setPlaylistMedia(media);

            // rawData ref 업데이트 (비교 기준)
            rawPlaylistRef.current = rawData;

            // pointId ref 업데이트
            selectedPointIdRef.current = pointId;

            //  렌더링이 한 번 진행된 뒤에 "필요 없는 blob"만 정리
            //  (바로 prune하면 아직 화면에서 이전 blob을 쓰는 순간 깨질 수 있어서 안전장치)
            setTimeout(() => {
              pruneDownloadCache(keepEndpoints);
            }, 0);

            const elapsed = Date.now() - downloadStart;
            const remaining = MIN_LOADING_TIME - elapsed;

            if (remaining > 0) setTimeout(() => setIsDownloading(false), remaining);
            else setIsDownloading(false);
          }
        } catch (error) {
          console.error('[PlayerProvider] 재생 목록 불러오기 실패:', error);
          setPlaylistError(error as Error);
          setCurrentPlaylists(null);
          setPlaylistMedia(null);
        } finally {
          const elapsed = Date.now() - start;
          const remaining = MIN_LOADING_TIME - elapsed;
          if (remaining > 0) setTimeout(() => setIsLoading(false), remaining);
          else setIsLoading(false);
        }
      }
    },
    [queryClient]
  );

  const reloadCurrentPlaylist = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['currentPlaylists', selectedPointId] });
    await loadCurrentPlaylist(selectedPointId);
  }, [loadCurrentPlaylist, queryClient, selectedPointId]);

  useEffect(() => {
    if (selectedPointId === -1) return;

    const interval = setInterval(
      () => {
        reloadCurrentPlaylist();
      },
      1000 * 60 * 1
    );

    return () => clearInterval(interval);
  }, [reloadCurrentPlaylist, selectedPointId]);

  const {
    mutate: deleteEmergencyNews,
    isPending: deleteLoading,
  } = useMutation<DeleteResponse, Error, number>({
    mutationFn: deletePlayedEmergencyNews,
    onSuccess: (data, nodeId) => {
      queryClient.invalidateQueries({ queryKey: ['currentPlaylists', nodeId] });
    },
    onError: (error) => {
      console.error('긴급뉴스 삭제 실패:', error);
    },
  });

  return (
    <PlayerContext.Provider
      value={{
        currentPlaylists,
        setCurrentPlaylists,
        playlistMedia,
        setPlaylistMedia,
        loadCurrentPlaylist,
        isLoading,
        isDownloading,
        reloadCurrentPlaylist,
        isEmergencyNewsPlayed,
        playlistError,
        deleteEmergencyNews,
        deleteEmergencyNewsLoading: deleteLoading,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerProvider, PlayerContext };

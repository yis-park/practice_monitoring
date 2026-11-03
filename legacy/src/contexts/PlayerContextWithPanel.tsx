import { createContext, useEffect, useRef, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from 'react';
import { parseCurrentPlaylists, parsedMediaData, type MediaPlayList, type PlayerListItemListProps } from '../types/player';
import { getCurrentPlaylists } from '../services/playerApi';
import { useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';

interface PlayerContextType {
  currentPlaylists: PlayerListItemListProps | null;
  filteredCurrentPlaylists: PlayerListItemListProps | null;
  setCurrentPlaylists: Dispatch<SetStateAction<PlayerListItemListProps | null>>;
  playlistMedia: MediaPlayList[] | null;
  setPlaylistMedia: Dispatch<SetStateAction<MediaPlayList[] | null>>;
  loadCurrentPlaylist: (pointId: number) => void;
  currentMediaItemIdx: number;
  setCurrentMediaItemIdx: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  searchKeywordLists: (pointId: number, finalKeyword: string) => void;
  reloadCurrentPlaylist: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const PlayerProvider = ({ children }: PropsWithChildren) => {
  const [currentMediaItemIdx, setCurrentMediaItemIdx] = useState<number>(-1);
  // const [selectedPointId, setSelectedPointId] = useState<number>(-1);
  const [selectedPointId, setSelectedPointId] = useState<number>(6);
  const [playlistMedia, setPlaylistMedia] = useState<MediaPlayList[] | null>(null);
  const [currentPlaylists, setCurrentPlaylists] = useState<PlayerListItemListProps | null>(null);
  const [filteredCurrentPlaylists, setFilteredCurrentPlaylists] = useState<PlayerListItemListProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentPlaylists?.items.length) {
      setCurrentMediaItemIdx(0);
    } else {
      setCurrentMediaItemIdx(-1);
    }
  }, [currentPlaylists]);

  const searchKeywordLists = (pointId: number, keyword: string) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const filtered = currentPlaylists?.items.filter((item) => item.playlistName.toLowerCase().includes(normalizedKeyword));
    setFilteredCurrentPlaylists({ items: filtered ?? [] });
  };

  // const selectedPointIdRef = useRef<number>(-1);
  const selectedPointIdRef = useRef<number>(6);
  const playlistMediaRef = useRef<MediaPlayList[] | null>(null);
  useEffect(() => {
    if (selectedPointId === -1) return;

    const interval = setInterval(
      () => {
        reloadCurrentPlaylist();
      },
      1000 * 60 * 5
    );

    return () => clearInterval(interval);
  }, [selectedPointId]);

  const queryClient = useQueryClient();
  const reloadCurrentPlaylist = async () => {
    await queryClient.invalidateQueries({ queryKey: ['currentPlaylists', selectedPointId] });
    await loadCurrentPlaylist(selectedPointId);
  };

  const loadCurrentPlaylist = async (pointId: number) => {
    setSelectedPointId(pointId);

    if (pointId === -1) {
      setCurrentPlaylists(null);
      setPlaylistMedia(null);
    } else {
      setIsLoading(true);

      const MIN_LOADING_TIME = 500;
      const start = Date.now();

      try {
        const rawData = await queryClient.fetchQuery({
          queryKey: ['currentPlaylists', pointId],
          queryFn: () => getCurrentPlaylists(pointId),
        });

        if (!rawData) {
          throw new Error('플레이리스트 데이터를 불러오지 못했습니다.');
        }

        if (Object.keys(rawData).length === 0 && rawData.constructor === Object) {
          setCurrentPlaylists(null);
          setPlaylistMedia(null);
          playlistMediaRef.current = null;

          const elapsed = Date.now() - start;
          const remaining = MIN_LOADING_TIME - elapsed;

          if (remaining > 0) {
            setTimeout(() => setIsLoading(false), remaining);
          } else {
            setIsLoading(false);
          }
          return;
        }

        const [current, media] = await Promise.all([parseCurrentPlaylists(rawData), parsedMediaData(rawData)]);

        if (selectedPointIdRef.current !== pointId) {
          playlistMediaRef.current = media;
          setCurrentPlaylists(current);
          setPlaylistMedia(media);
          selectedPointIdRef.current = pointId;
        } else {
          if (playlistMediaRef.current == null || !isEqual(media, playlistMediaRef.current)) {
            playlistMediaRef.current = media;
            setCurrentPlaylists(current);
            setPlaylistMedia(media);
          }
        }
      } catch (error) {
        console.error('[PlayerProvider] 재생 목록 불러오기 실패:', error);
        setCurrentPlaylists(null);
        setPlaylistMedia(null);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = MIN_LOADING_TIME - elapsed;

        if (remaining > 0) {
          setTimeout(() => setIsLoading(false), remaining);
        } else {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentPlaylists,
        filteredCurrentPlaylists,
        setCurrentPlaylists,
        playlistMedia,
        setPlaylistMedia,
        loadCurrentPlaylist,
        currentMediaItemIdx,
        setCurrentMediaItemIdx,
        isLoading,
        searchKeywordLists,
        reloadCurrentPlaylist,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerProvider, PlayerContext };

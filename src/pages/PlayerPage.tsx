import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ExitDialog from '../components/ExitDialog';
import LoadingOverlay from '../components/LoadingOverlay';
import PlayerStage from '../components/PlayerStage';
import type { MediaPlayItem, MediaPlayList, PlayItemBrief } from '../types/player';
import useScreenContext from './../contexts/useScreenContext';
import 'react-simple-keyboard/build/css/index.css';
import usePlayerContext from '../contexts/usePlayerContext';
import useExitDialog from '../hooks/useExitDialog';
import useKioskShortcuts from '../hooks/useKioskShortcuts';

type PlaylistMediaItem = MediaPlayItem & {
  category: string;
};

const flattenMediaItems = (playlistMedia: MediaPlayList[] | null): PlaylistMediaItem[] => {
  if (!playlistMedia) return [];

  return playlistMedia.flatMap((group) =>
    group.data.map((item) => ({
      ...item,
      category: group.category,
    }))
  );
};

const PlayerPage = () => {
  const [currentVideoTime, setCurrentVideoTime] = useState<{
    media: MediaPlayItem;
    progressTime: number;
  } | null>(null);

  const { setIsFullScreen, isLoading } = useScreenContext();
  const kioskId = 100;

  const {
    playlistMedia,
    loadCurrentPlaylist,
    isDownloading,
    isEmergencyNewsPlayed,
    playlistError,
    reloadCurrentPlaylist,
    deleteEmergencyNews,
  } = usePlayerContext();
  const mediaItems = useMemo(() => flattenMediaItems(playlistMedia), [playlistMedia]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const { count, maxCount, open: showExitDialog, onCancel: handleExitCancel, onExit: handleExit } = useExitDialog();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;

    hasLoadedRef.current = true;
    void loadCurrentPlaylist(kioskId);
  }, [kioskId, loadCurrentPlaylist]);

  useEffect(() => {
    setCurrentIdx(0);
  }, [mediaItems]);

  const prevItemRef = useRef<PlayItemBrief | null>(null);
  const currentItem = useMemo(() => mediaItems[currentIdx] ?? null, [mediaItems, currentIdx]);
  const currentPlayItem = currentItem;
  const category = currentItem?.category ?? '';

  useEffect(() => {
    if (!currentItem) return;

    if (currentItem.category === '긴급뉴스' && isEmergencyNewsPlayed.current) {
      setCurrentIdx((prev) => (prev + 1) % mediaItems.length);
      return;
    }

    if (prevItemRef.current != null && prevItemRef.current.category === '긴급뉴스') {
      setTimeout(() => {
        deleteEmergencyNews(kioskId);
        isEmergencyNewsPlayed.current = true;
      }, 0);
    }

    prevItemRef.current = currentItem;

    if (currentItem?.type === 'video') {
      setCurrentVideoTime({
        media: currentItem,
        progressTime: 0,
      });
    } else {
      setCurrentVideoTime(null);
    }
  }, [currentItem, deleteEmergencyNews, isEmergencyNewsPlayed, kioskId, mediaItems.length]);

  useEffect(() => {
    if (!currentItem) return;

    const duration = parseInt(currentItem.durationInMs);
    const safeDuration = isNaN(duration) ? 5000 : duration;

    const timer = setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % mediaItems.length);
    }, safeDuration);

    return () => clearTimeout(timer);
  }, [currentItem, mediaItems.length]);

  const moveToPortal = () => {
    window.electronAPI.openTourPortal();
  };

  const toggleFullScreen = useCallback(() => {
    window.electronAPI.toggleWin().then((fullScreenState) => {
      setIsFullScreen(fullScreenState ?? false);
    });
  }, [setIsFullScreen]);

  useKioskShortcuts({ onToggleFullScreen: toggleFullScreen });

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <LoadingOverlay open={isLoading.status} text={isLoading.text} />
      <ExitDialog count={count} maxCount={maxCount} open={showExitDialog} onCancel={handleExitCancel} onExit={handleExit} />

      <Box sx={{ p: { xs: 0, sm: 0 }, height: '100vh', width: '100vw' }} display="flex" flexDirection="row" alignItems="stretch">
        <PlayerStage
          category={category}
          currentPlayItem={currentPlayItem}
          currentVideoTime={currentVideoTime}
          onMoveToPortal={moveToPortal}
          onRetry={reloadCurrentPlaylist}
          playlistError={playlistError}
        />
      </Box>

      <LoadingOverlay fixed open={isDownloading} text="재생 목록을 가져오고 있습니다..." />
    </Box>
  );
};

export default PlayerPage;

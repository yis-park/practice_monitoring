import { Box } from '@mui/material';
import type { MediaPlayItem } from '../types/player';
import { useEffect, useRef, useState } from 'react';

const MainPlayer = ({
  currentPlayItem,
  isPlaying,
  currentVideoTime,
}: {
  currentPlayItem: MediaPlayItem;
  isPlaying: boolean;
  currentVideoTime: {
    media: MediaPlayItem;
    progressTime: number;
  } | null;
}) => {
  const baseUrl = import.meta.env.BASE_URL;
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrSize, setQrSize] = useState<number>(0);
  const [isMediaReady, setIsMediaReady] = useState(false);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    setIsMediaReady(false);
    if (!currentPlayItem || !currentPlayItem.image) return;

    const handleLoad = async (element: HTMLImageElement | HTMLVideoElement) => {
      await delay(100);
      const { size } = currentPlayItem.image!;
      const displayWidth = element instanceof HTMLImageElement ? element.naturalWidth : element.videoWidth;

      const clientSize = (size * element.clientWidth) / displayWidth;
      setQrSize(clientSize);
      setIsMediaReady(true);
    };

    if (currentPlayItem.type === 'image') {
      const img = imgRef.current;
      if (!img) return;

      if (img.complete) {
        handleLoad(img);
      } else {
        const fn = () => handleLoad(img);
        img.addEventListener('load', fn);

        return () => {
          img.removeEventListener('load', fn);
          setIsMediaReady(false);
          setQrSize(0);
        };
      }
    } else {
      const video = videoRef.current;
      if (!video) return;

      const tryLoad = async () => {
        for (let i = 0; i < 10; i++) {
          if (video.videoWidth > 0) {
            handleLoad(video);
            return;
          }
          await delay(50);
        }
        console.warn('videoWidth load 실패: fallback으로 handleLoad 호출');
        handleLoad(video);
      };

      if (video.readyState >= 1 && video.videoWidth > 0) {
        handleLoad(video);
      } else {
        const onMeta = () => {
          handleLoad(video);
          video.removeEventListener('loadedmetadata', onMeta);
        };
        video.addEventListener('loadedmetadata', onMeta);

        tryLoad();

        return () => {
          video.removeEventListener('loadedmetadata', onMeta);
          setIsMediaReady(false);
        };
      }
    }
  }, [currentPlayItem]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !currentVideoTime) return;
    if (currentPlayItem.type !== 'video') return;
    if (currentPlayItem.id !== currentVideoTime.media.id) return;

    const handleLoaded = () => {
      videoEl.currentTime = currentVideoTime.progressTime;
    };
    if (videoEl.readyState >= 1) {
      handleLoaded();
    } else {
      videoEl.addEventListener('loadedmetadata', handleLoaded, { once: true });
    }

    return () => {
      videoEl.removeEventListener('loadedmetadata', handleLoaded);
    };
  }, [currentVideoTime, currentPlayItem.id]);

  useEffect(() => {
    if (!videoRef.current || currentPlayItem.type !== 'video') return;

    const playPromise = isPlaying ? videoRef.current.play() : videoRef.current.pause();

    if (playPromise !== undefined && typeof playPromise.then === 'function') {
      playPromise.catch((error) => {
        if (error.name === 'AbortError') {
          console.warn('Play request aborted due to pause()');
        } else {
          console.error('Playback error:', error);
        }
      });
    }
  }, [isPlaying, currentPlayItem]);

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'background.paper',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: '100%',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: currentPlayItem.type === 'image' ? '100%' : null,
          width: currentPlayItem.type === 'image' ? null : '100%',
          maxWidth: currentPlayItem.type === 'image' ? '100%' : null,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {currentPlayItem.type === 'image' ? (
          <Box
            component="img"
            ref={imgRef}
            src={currentPlayItem.url}
            alt="mainPlayer"
            sx={{
              height: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              display: 'block',
            }}
          />
        ) : (
          <Box
            component="video"
            ref={videoRef}
            src={currentPlayItem.url}
            muted
            loop
            playsInline
            sx={{
              maxHeight: '100%',
              width: '100%',
              objectFit: 'cover',
              userSelect: 'none',
              display: 'block',
            }}
          />
        )}
        {isMediaReady && qrSize > 0 && currentPlayItem && currentPlayItem.image?.qr && (
          <Box
            component="img"
            src={currentPlayItem.image.qr || `${baseUrl}assets/sample_qr.jpg`}
            alt="qrCode"
            sx={{
              position: 'absolute',
              top: `${currentPlayItem.image.ypos * 100}%`,
              left: `${currentPlayItem.image.xpos * 100}%`,
              width: `${qrSize}px`,
              transform: 'translate(-50%, -50%)',
              transition: 'opacity 0.3s ease-in-out',
              opacity: 1,
              // objectFit: ' contain',
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default MainPlayer;

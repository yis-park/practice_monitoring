import { Box, CircularProgress, Typography } from '@mui/material';
import type { MediaPlayItem } from '../types/player';
import { useEffect, useRef, useState, useCallback } from 'react';

const MainPlayer = ({
  currentPlayItem,
  currentVideoTime,
}: {
  currentPlayItem: MediaPlayItem;
  currentVideoTime: {
    media: MediaPlayItem;
    progressTime: number;
  } | null;
}) => {
  const baseUrl = import.meta.env.BASE_URL;

  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);

  const [qrSize, setQrSize] = useState(0);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [isVideoBuffering, setIsVideoBuffering] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [qrPosPx, setQrPosPx] = useState<{ x: number; y: number } | null>(null);

  const recalcQrSize = useCallback(() => {
    if (!currentPlayItem?.image) return;

    const { size, xpos, ypos } = currentPlayItem.image;

    const wrapper = mediaWrapperRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();

    const calcContainRect = (boxW: number, boxH: number, naturalW: number, naturalH: number) => {
      const imgRatio = naturalW / naturalH;
      const boxRatio = boxW / boxH;

      let renderW = 0;
      let renderH = 0;
      let padX = 0;
      let padY = 0;

      if (boxRatio > imgRatio) {
        renderH = boxH;
        renderW = boxH * imgRatio;
        padX = (boxW - renderW) / 2;
      } else {
        renderW = boxW;
        renderH = boxW / imgRatio;
        padY = (boxH - renderH) / 2;
      }

      return { renderW, renderH, padX, padY };
    };

    if (currentPlayItem.type === 'image') {
      const img = imgRef.current;
      if (!img) return;

      const imgRect = img.getBoundingClientRect();
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      if (naturalW === 0 || naturalH === 0 || imgRect.width === 0 || imgRect.height === 0) {
        requestAnimationFrame(recalcQrSize);
        return;
      }

      const { renderW, renderH, padX, padY } = calcContainRect(imgRect.width, imgRect.height, naturalW, naturalH);

      const scale = renderW / naturalW;
      setQrSize(size * scale);

      const offsetX = imgRect.left - wrapperRect.left;
      const offsetY = imgRect.top - wrapperRect.top;

      setQrPosPx({
        x: offsetX + padX + renderW * xpos,
        y: offsetY + padY + renderH * ypos,
      });

      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const videoRect = video.getBoundingClientRect();
    const naturalW = video.videoWidth;
    const naturalH = video.videoHeight;

    if (naturalW === 0 || naturalH === 0 || videoRect.width === 0 || videoRect.height === 0) {
      requestAnimationFrame(recalcQrSize);
      return;
    }

    const { renderW, renderH, padX, padY } = calcContainRect(videoRect.width, videoRect.height, naturalW, naturalH);

    const scale = renderW / naturalW;
    setQrSize(size * scale);

    const offsetX = videoRect.left - wrapperRect.left;
    const offsetY = videoRect.top - wrapperRect.top;

    setQrPosPx({
      x: offsetX + padX + renderW * xpos,
      y: offsetY + padY + renderH * ypos,
    });
  }, [currentPlayItem]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || currentPlayItem.type !== 'video') return;

    setIsVideoBuffering(true);
    setVideoError(null);

    const handleLoadStart = () => {
      setIsVideoBuffering(true);
    };

    const handleWaiting = () => {
      setIsVideoBuffering(true);
    };

    const handleCanPlay = () => {
      setIsVideoBuffering(false);
    };

    const handlePlaying = () => {
      setIsVideoBuffering(false);
    };

    const handleError = () => {
      setVideoError('동영상 로딩 실패');
      setIsVideoBuffering(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [currentPlayItem]);

  useEffect(() => {
    setIsMediaReady(false);
    setQrSize(0);

    if (!currentPlayItem) return;

    if (currentPlayItem.type === 'image') {
      const img = imgRef.current;
      if (!img) return;

      const onLoad = () => {
        requestAnimationFrame(() => {
          recalcQrSize();
          setIsMediaReady(true);
        });
      };

      if (img.complete) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    } else {
      const video = videoRef.current;
      if (!video) return;

      const onCanPlay = () => {
        recalcQrSize();
        setIsMediaReady(true);
      };

      if (video.readyState >= 3) {
        onCanPlay();
      } else {
        video.oncanplay = onCanPlay;
      }
    }
  }, [currentPlayItem, recalcQrSize]);

  useEffect(() => {
    if (!isMediaReady) return;

    const el = mediaWrapperRef.current;
    if (!el) return;

    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => recalcQrSize());
    });

    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [isMediaReady, recalcQrSize]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentPlayItem.type !== 'video') return;

    if (currentVideoTime && currentVideoTime.media.id === currentPlayItem.id) {
      video.currentTime = currentVideoTime.progressTime;
    }

    video.play().catch(() => undefined);
  }, [currentVideoTime, currentPlayItem]);

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'background.paper',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Box
        ref={mediaWrapperRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        {currentPlayItem.type === 'video' && isVideoBuffering && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.35)',
              zIndex: 3,
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
          </Box>
        )}

        {currentPlayItem.type === 'video' && videoError && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 3,
            }}
          >
            <Typography sx={{ color: '#fff' }}>{videoError}</Typography>
          </Box>
        )}

        {currentPlayItem.type === 'image' ? (
          <Box
            component="img"
            ref={imgRef}
            src={currentPlayItem.url}
            alt="main"
            sx={{
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
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
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
            }}
          />
        )}

        {isMediaReady && qrSize > 0 && currentPlayItem.image?.qr && qrPosPx && (
          <Box
            component="img"
            src={currentPlayItem.image.qr || `${baseUrl}assets/sample_qr.jpg`}
            alt="qr"
            sx={{
              position: 'absolute',
              left: `${qrPosPx.x}px`,
              top: `${qrPosPx.y}px`,
              width: `${qrSize}px`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 2,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default MainPlayer;

import { Box, Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import { useEffect, useRef, useState, useCallback, type Dispatch, type SetStateAction } from 'react';
import { formatTimeToMinSec } from '../utils/format_utils';

type Props = {
  isPlaying: boolean; // 재생 중 여부
  progressKey: number;
  progressValue: number; // 현재 재생 위치
  duration: number; // 전체 재생 길이
  onSeek: (newValue: number) => void; // 사용자가 슬라이더 위치 변경 시 호출
  setDraggedSeekValue: Dispatch<SetStateAction<number>>;
  setIsAlertOpen: Dispatch<SetStateAction<boolean>>;
};

const PlaybackSlider = ({ isPlaying, progressKey, progressValue, duration, onSeek, setDraggedSeekValue, setIsAlertOpen }: Props) => {
  const [internalProgress, setInternalProgress] = useState(progressValue); // 현재 슬라이더 위치
  const animationRef = useRef<number | null>(null); // animationFrame ID 저장 (캔슬용)
  const lastFrameTimeRef = useRef<number | null>(null); // 이전 프레임의 timestamp 저장 (delta 계산용)
  const isPlayingRef = useRef(isPlaying); //	최신 isPlaying 값을 항상 참조 (callback 내부 stale 방지)
  const [hasEnded, setHasEnded] = useState(false);
  const isDraggingRef = useRef(false);
  const internalKeyRef = useRef(Date.now());
  const isFirstRender = useRef(true);

  // 외부에서 재생 위치 변경
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (progressValue === -1) {
      setInternalProgress(progressValue);
      return;
    }
    if (progressValue === 0) {
      setHasEnded(false);
      setInternalProgress(0);
      if (isPlaying) {
        onSeek(progressValue);
        lastFrameTimeRef.current = null;
        animationRef.current = requestAnimationFrame(animate);
      }
      return;
    }
    setInternalProgress(progressValue);
    onSeek(progressValue);
    lastFrameTimeRef.current = null;
  }, [progressValue, progressKey]);

  useEffect(() => {
    internalKeyRef.current = Date.now();
    if (internalProgress >= duration) {
      if (!hasEnded) {
        setHasEnded(true);
      }
    } else {
      if (!hasEnded) {
        requestAnimationFrame(() => onSeek(internalProgress));
      }
      if (hasEnded) {
        setHasEnded(false);
      }
    }
  }, [internalProgress, duration]);

  // 슬라이더 재생 진행 로직
  const animate = useCallback(
    (timestamp: number) => {
      if (!isPlayingRef.current) {
        return;
      }

      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const delta = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      setInternalProgress((prev) => {
        const next = prev + delta;
        if (next >= duration) {
          cancelAnimationFrame(animationRef.current!);
          requestAnimationFrame(() => onSeek(duration));
          return duration;
        }
        animationRef.current = requestAnimationFrame(animate);
        return next;
      });
    },
    [duration]
  );

  const cancelAndReset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;

      setInternalProgress((prev) => {
        if (prev >= duration) return 0;
        return Math.max(0, prev - 50);
      });
    }
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;

    if (isPlaying) {
      lastFrameTimeRef.current = null;
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, 50);
    } else {
      cancelAndReset();
    }

    return cancelAndReset;
  }, [isPlaying]);

  const handleChange = (_: Event, newValue: number | number[]) => {
    if (internalProgress === -1) {
      setIsAlertOpen(true);
      return;
    }
    isDraggingRef.current = true;

    const value = typeof newValue === 'number' ? newValue : newValue[0];
    // setInternalProgress(value);
    setDraggedSeekValue(value);
  };

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ width: '100%' }}>
      <Typography variant="body2">{formatTimeToMinSec(internalProgress)}</Typography>
      <Slider
        value={Math.floor(Math.min(internalProgress, duration))}
        min={0}
        max={duration}
        onChange={handleChange}
        key={internalKeyRef.current}
        sx={{
          height: 8,
          '& .MuiSlider-track': { backgroundColor: '#1976d2' },
          '& .MuiSlider-rail': { backgroundColor: '#ccc' },
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
            backgroundColor: '#1976d2',
            '&:hover, &.Mui-focusVisible, &.Mui-active': {
              boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)',
            },
          },
        }}
      />
    </Box>
  );
};

export default PlaybackSlider;

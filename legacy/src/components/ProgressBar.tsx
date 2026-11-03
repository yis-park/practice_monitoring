import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';

type Props = {
  progress: number; // 부모에서 내려주는 진행도 (ms)
  duration: number; // 전체 재생시간 (ms)
  onSeek: (ms: number) => void; // 클릭/드래그로 위치 조정할 때 호출
  onSeekStart: () => void;
  onSeekEnd: () => void;
};

const ProgressBar = ({ progress, duration, onSeek, onSeekStart, onSeekEnd }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showThumb, setShowThumb] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);

  const barRef = useRef<HTMLDivElement>(null);
  const seekThrottleRef = useRef(0);

  const currentProgress = isDragging ? localProgress : progress;
  const percentage = duration > 0 ? (currentProgress / duration) * 100 : 0;

  const handleSeek = (e: PointerEvent | React.PointerEvent) => {
    if (!barRef.current || duration === 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const newProgress = duration * ratio;
    setLocalProgress(newProgress);

    const now = Date.now();
    if (now - seekThrottleRef.current > 100) {
      seekThrottleRef.current = now;
      onSeek(newProgress);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    onSeekStart();
    handleSeek(e);
    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (isDragging) handleSeek(e);
  };

  const handlePointerUp = () => {
    onSeekEnd();
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <Box
      ref={barRef}
      onPointerDown={handlePointerDown}
      onMouseEnter={() => setShowThumb(true)}
      onMouseLeave={() => setShowThumb(false)}
      sx={{
        width: '100%',
        height: 8,
        bgcolor: 'grey.300',
        borderRadius: 2,
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${percentage}%`,
          bgcolor: 'primary.main',
          borderRadius: 2,
          transition: isDragging ? 'none' : 'width 0.1s linear',
        }}
      />

      {(showThumb || isDragging) && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: `${percentage}%`,
            transform: 'translate(-50%, -50%)',
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            boxShadow: '0 0 0 2px white',
            transition: isDragging ? 'none' : 'left 0.1s linear',
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
};

export default ProgressBar;

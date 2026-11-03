import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_COUNT = 10;

const useExitDialog = () => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(DEFAULT_COUNT);
  const countDownIntervalRef = useRef<number | undefined>(undefined);

  const clearCountdown = useCallback(() => {
    if (countDownIntervalRef.current !== undefined) {
      clearInterval(countDownIntervalRef.current);
      countDownIntervalRef.current = undefined;
    }
  }, []);

  const handleExit = useCallback(() => {
    clearCountdown();
    setOpen(false);
    window.electronAPI.shutdown();
  }, [clearCountdown]);

  const handleCancel = useCallback(() => {
    clearCountdown();
    window.electronAPI.cancelShutdown();
    setOpen(false);
  }, [clearCountdown]);

  useEffect(() => {
    const handleShowExitDialog = () => {
      clearCountdown();
      setCount(DEFAULT_COUNT);
      setOpen(true);

      countDownIntervalRef.current = window.setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            handleExit();
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    };

    if (window.electronAPI?.on) {
      window.electronAPI.on('show-exit-dialog', handleShowExitDialog);
    }

    return () => {
      clearCountdown();
      if (window.electronAPI?.removeAllListeners) {
        window.electronAPI.removeAllListeners('show-exit-dialog');
      }
    };
  }, [clearCountdown, handleExit]);

  return {
    count,
    maxCount: DEFAULT_COUNT,
    open,
    onCancel: handleCancel,
    onExit: handleExit,
  };
};

export default useExitDialog;

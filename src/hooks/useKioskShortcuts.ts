import { useEffect } from 'react';

type UseKioskShortcutsOptions = {
  onToggleFullScreen: () => void;
};

const useKioskShortcuts = ({ onToggleFullScreen }: UseKioskShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        window.electronAPI.shutdownRestart();
      }

      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        window.electronAPI.shutdown();
      }

      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        window.electronAPI.exit();
      }

      if (e.code === 'Escape') {
        e.preventDefault();
        onToggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleFullScreen]);
};

export default useKioskShortcuts;

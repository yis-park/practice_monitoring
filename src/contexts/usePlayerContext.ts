import { useContext } from 'react';
import { PlayerContext } from './PlayerContext';

const usePlayerContext = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerContext');
  }

  return context;
};

export default usePlayerContext;

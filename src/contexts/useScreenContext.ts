import { useContext } from 'react';
import { ScreenContext } from './ScreenContext';

const useScreenContext = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreenContext must be used within a ScreenProvider');
  }
  return context;
};

export default useScreenContext;

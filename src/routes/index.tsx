import { createHashRouter } from 'react-router-dom';
import PlayerPage from '../pages/PlayerPage';
import { PlayerProvider } from '../contexts/PlayerContext';
import { ScreenProvider } from '../contexts/ScreenContext';

export const router = createHashRouter([
  {
    path: '/',
    element: (
      <ScreenProvider>
          <PlayerProvider>
              <PlayerPage />
          </PlayerProvider>
      </ScreenProvider>
    ),
  },
]);

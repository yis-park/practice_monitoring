import { createContext, useState, type PropsWithChildren } from 'react';
import type { Loading } from '../types/screen';

interface ScreenContextType {
  screen: string;
  setScreen: (screen: string) => void;
  isFullScreen: boolean;
  setIsFullScreen: (screen: boolean) => void;
  isLoading: Loading;
  setIsLoading: (isLoading: Loading) => void;
}

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

const ScreenProvider = ({ children }: PropsWithChildren) => {
  const [screen, setScreen] = useState<string>('home');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState<Loading>({
    status: false,
    text: '로딩 중입니다.',
  });

  return (
    <ScreenContext.Provider value={{ screen, setScreen, isFullScreen, setIsFullScreen, isLoading, setIsLoading }}>{children}</ScreenContext.Provider>
  );
};

export { ScreenContext, ScreenProvider };

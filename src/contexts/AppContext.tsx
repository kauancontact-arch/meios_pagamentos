import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/mocks/users';

type Screen = 'login' | 'onboarding' | 'home' | 'forum' | 'topicList' | 'topicDetail' | 'tracks' | 'trackDetail' | 'profile';

interface AppContextType {
  currentUser: User | null;
  currentScreen: Screen;
  screenParams: any;
  login: (email: string) => boolean;
  logout: () => void;
  navigate: (screen: Screen, params?: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [screenParams, setScreenParams] = useState<any>(null);

  const login = (email: string): boolean => {
    // Mock login: find user by email, password is ignored
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      // In a real app, we'd check if onboarding is complete
      // For this mock, we'll always go home after login
      setCurrentScreen('home');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const navigate = (screen: Screen, params: any = null) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const value = {
    currentUser,
    currentScreen,
    screenParams,
    login,
    logout,
    navigate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
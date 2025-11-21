import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';

type Screen = 'login' | 'onboarding' | 'home' | 'forum' | 'topicList' | 'topicDetail' | 'tracks' | 'trackDetail' | 'profile';

interface AppContextType {
  currentUser: User | null;
  currentScreen: Screen;
  screenParams: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  navigate: (screen: Screen, params?: any) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, signIn, signOut, loading: authLoading } = useAuth();
  const { userData, loading: userDataLoading } = useUserData(authUser?.id);
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [screenParams, setScreenParams] = useState<any>(null);

  const loading = authLoading || userDataLoading;

  useEffect(() => {
    if (authUser && userData) {
      // User is authenticated and has profile data
      setCurrentScreen('home');
    } else if (!authUser) {
      // User is not authenticated
      setCurrentScreen('login');
    }
  }, [authUser, userData]);

  const login = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const logout = async () => {
    await signOut();
    setCurrentScreen('login');
  };

  const navigate = (screen: Screen, params: any = null) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const value = {
    currentUser: userData,
    currentScreen,
    screenParams,
    login,
    logout,
    navigate,
    loading,
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
import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';

interface ScreenParams {
  [key: string]: any;
}

interface AppContextType {
  currentUser: User | null;
  currentScreen: string;
  screenParams: ScreenParams;
  loading: boolean;
  navigate: (screen: string, params?: ScreenParams) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenParams, setScreenParams] = useState<ScreenParams>({});
  const { user: authUser, signIn, signOut } = useAuth();
  const { userData, loading: userDataLoading, updateUserData } = useUserData(authUser?.id);

  const loading = userDataLoading;

  useEffect(() => {
    if (authUser) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('login');
    }
  }, [authUser]);

  const navigate = (screen: string, params?: ScreenParams) => {
    setCurrentScreen(screen);
    if (params) {
      setScreenParams(params);
    } else {
      setScreenParams({});
    }
  };

  const login = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const logout = async () => {
    await signOut();
    setCurrentScreen('login');
  };

  const value: AppContextType = {
    currentUser: userData,
    currentScreen,
    screenParams,
    loading,
    navigate,
    login,
    logout,
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
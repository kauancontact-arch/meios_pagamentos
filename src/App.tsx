import { useState } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./hooks/useAuth";
import { useUserData } from "./hooks/useUserData";
import { Auth } from "./components/Auth";
import { Onboarding } from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import { Program } from "./components/Program";
import { SOS } from "./components/SOS";
import { Community } from "./components/Community";
import { AICoach } from "./components/AICoach";
import { SiteBlocker } from "./components/SiteBlocker";
import { UserProfile } from "./components/UserProfile";

type Screen = "auth" | "onboarding" | "dashboard" | "program" | "sos" | "community" | "coach" | "blocker" | "profile";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth");
  const [isGuest, setIsGuest] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const userDataHook = useUserData(user);
  const { loading: userDataLoading } = userDataHook;

  const [completedLessons, setCompletedLessons] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        // Skip progress fetching if Supabase is not properly configured
        if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('localhost')) {
          setCompletedLessons(0);
          setCompletedChallenges(0);
          return;
        }
        
        try {
          const lessons = await userDataHook.getCompletedLessons();
          const challenges = await userDataHook.getCompletedChallenges();
          setCompletedLessons(lessons);
          setCompletedChallenges(challenges);
        } catch (error) {
          console.warn('Failed to fetch user progress:', error);
          setCompletedLessons(0);
          setCompletedChallenges(0);
        }
      }
    };
    fetchProgress();
  }, [user, userDataHook]);

  // Trigger daily notifications when app loads or user changes
  useEffect(() => {
    const triggerNotifications = async () => {
      try {
        await userDataHook.triggerDailyNotifications();
      } catch (error) {
        console.warn('Failed to trigger daily notifications:', error);
        // Don't crash the app if notifications fail
      }
    };
    
    // Only trigger notifications if user data is available and not null
    const userData = userDataHook.getUserData();
    if (userData && userData.days_clean >= 0) {
      triggerNotifications();
    }
  }, [user, userDataHook]);

  // Navigation logic based on auth and user data state
  useEffect(() => {
    // Don't make navigation decisions while loading
    if (authLoading || userDataLoading) return;
    
    const userData = userDataHook.getUserData();
    
    // If user is logged in
    if (user) {
      if (!userData || !userDataHook.hasCompletedOnboarding()) {
        // User exists but hasn't completed onboarding
        if (currentScreen !== "onboarding") {
          setCurrentScreen("onboarding");
        }
      } else {
        // User exists and has completed onboarding
        if (currentScreen === "auth" || currentScreen === "onboarding") {
          setCurrentScreen("dashboard");
        }
      }
    } else if (isGuest) {
      // Guest user
      if (!userData || !userDataHook.hasCompletedOnboarding()) {
        if (currentScreen !== "onboarding") {
          setCurrentScreen("onboarding");
        }
      } else {
        if (currentScreen === "auth" || currentScreen === "onboarding") {
          setCurrentScreen("dashboard");
        }
      }
    } else {
      // Not logged in and not guest
      if (currentScreen !== "auth") {
        setCurrentScreen("auth");
      }
    }
  }, [user, isGuest, authLoading, userDataLoading, userDataHook, currentScreen]);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setCurrentScreen("onboarding");
  };

  const handleStartApp = () => {
    // Navigation will be handled by useEffect
    // Just trigger a re-evaluation by updating a timestamp or similar
    setCurrentScreen("dashboard");
  };

  // Show loading while checking auth
  if (authLoading || userDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 flex items-center justify-center">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentScreen === "auth" && (
              <Auth onContinueAsGuest={handleContinueAsGuest} />
            )}

            {currentScreen === "onboarding" && (
              <Onboarding onStart={handleStartApp} userDataHook={userDataHook} />
            )}

            {currentScreen === "dashboard" && (
              <Dashboard 
                onNavigate={handleNavigate} 
                userData={userDataHook.getUserData()}
                isGuest={isGuest}
                user={user}
                userDataHook={userDataHook}
              />
            )}

            {currentScreen === "program" && (
              <Program 
                onBack={handleBackToDashboard} 
                userData={userDataHook.getUserData()}
                user={user}
                userDataHook={userDataHook}
                completedLessons={completedLessons}
                completedChallenges={completedChallenges}
              />
            )}

            {currentScreen === "sos" && (
              <SOS 
                onBack={handleBackToDashboard} 
                onNavigate={handleNavigate}
                userData={userDataHook.getUserData()}
              />
            )}

            {currentScreen === "community" && (
              <Community 
                onBack={handleBackToDashboard}
                user={user}
                userData={userDataHook.getUserData()}
              />
            )}

            {currentScreen === "coach" && (
              <AICoach 
                onBack={handleBackToDashboard}
                userData={userDataHook.getUserData()}
                user={user}
                completedLessons={completedLessons}
                completedChallenges={completedChallenges}
              />
            )}

            {currentScreen === "blocker" && (
              <SiteBlocker 
                onBack={handleBackToDashboard}
                userData={userDataHook.getUserData()}
              />
            )}

            {currentScreen === "profile" && (
              <UserProfile onBack={handleBackToDashboard} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
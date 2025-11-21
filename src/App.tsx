import { useAppContext } from './contexts/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ForumCategoriesPage } from './pages/ForumCategoriesPage';
import { TopicListPage } from './pages/TopicListPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { TracksPage } from './pages/TracksPage';
import { TrackDetailPage } from './pages/TrackDetailPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { MentorsPage } from './pages/MentorsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { currentUser, currentScreen, loading } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl mx-auto flex items-center justify-center text-primary-foreground font-bold text-3xl mb-4">
            P
          </div>
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomePage />;
      case 'forum':
        return <ForumCategoriesPage />;
      case 'topicList':
        return <TopicListPage />;
      case 'topicDetail':
        return <TopicDetailPage />;
      case 'tracks':
        return <TracksPage />;
      case 'trackDetail':
        return <TrackDetailPage />;
      case 'events':
        return <EventsPage />;
      case 'eventDetail':
        return <EventDetailPage />;
      case 'mentors':
        return <MentorsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}

export default App;
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
import { ToolsPage } from './pages/ToolsPage';
import { NewsPage } from './pages/NewsPage';
import { JobsPage } from './pages/JobsPage';
import { ProfilePage } from './pages/ProfilePage';
import { GlossaryPage } from './pages/GlossaryPage';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { currentScreen, loading } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginPage />;
      case 'home':
        return (
          <AppLayout>
            <HomePage />
          </AppLayout>
        );
      case 'forum':
        return (
          <AppLayout>
            <ForumCategoriesPage />
          </AppLayout>
        );
      case 'topicList':
        return (
          <AppLayout>
            <TopicListPage />
          </AppLayout>
        );
      case 'topicDetail':
        return (
          <AppLayout>
            <TopicDetailPage />
          </AppLayout>
        );
      case 'tracks':
        return (
          <AppLayout>
            <TracksPage />
          </AppLayout>
        );
      case 'trackDetail':
        return (
          <AppLayout>
            <TrackDetailPage />
          </AppLayout>
        );
      case 'events':
        return (
          <AppLayout>
            <EventsPage />
          </AppLayout>
        );
      case 'eventDetail':
        return (
          <AppLayout>
            <EventDetailPage />
          </AppLayout>
        );
      case 'mentors':
        return (
          <AppLayout>
            <MentorsPage />
          </AppLayout>
        );
      case 'tools':
        return (
          <AppLayout>
            <ToolsPage />
          </AppLayout>
        );
      case 'news':
        return (
          <AppLayout>
            <NewsPage />
          </AppLayout>
        );
      case 'jobs':
        return (
          <AppLayout>
            <JobsPage />
          </AppLayout>
        );
      case 'profile':
        return (
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        );
      case 'glossary':
        return (
          <AppLayout>
            <GlossaryPage />
          </AppLayout>
        );
      default:
        return (
          <AppLayout>
            <HomePage />
          </AppLayout>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderScreen()}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
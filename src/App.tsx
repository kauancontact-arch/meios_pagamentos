import { useAppContext } from './contexts/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ForumCategoriesPage } from './pages/ForumCategoriesPage';
import { TopicListPage } from './pages/TopicListPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { TracksPage } from './pages/TracksPage';
import { TrackDetailPage } from './pages/TrackDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnimatePresence, motion } from 'framer-motion';

// Placeholder for pages not yet created
const PlaceholderPage = ({ title }: { title: string }) => (
  <div>
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-gray-500">Esta página está em construção.</p>
  </div>
);

function App() {
  const { currentUser, currentScreen } = useAppContext();

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
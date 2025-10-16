import { useAppContext } from './contexts/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ForumCategoriesPage } from './pages/ForumCategoriesPage';
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
      // Add other cases as pages are built
      case 'topicList':
        return <PlaceholderPage title="Lista de Tópicos" />;
      case 'tracks':
        return <PlaceholderPage title="Trilhas de Aprendizado" />;
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
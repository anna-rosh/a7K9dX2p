import { UserProvider } from '@/contexts/UserContext';
import { CommentsPage } from './pages';

const App = () => {
  return (
    <UserProvider>
      <CommentsPage />
    </UserProvider>
  );
};

export default App;

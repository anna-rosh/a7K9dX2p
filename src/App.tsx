import { UserProvider } from '@/contexts/UserContext';
import { CommentsPage } from './pages';

function App() {
  return (
    <UserProvider>
      <CommentsPage />
    </UserProvider>
  );
}

export default App;

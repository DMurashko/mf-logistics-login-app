import { ThemeProvider } from 'ui_library/Theme';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <ThemeProvider>
      <LoginPage />
    </ThemeProvider>
  );
}

export default App;

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/index.jsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;

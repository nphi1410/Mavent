
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';


function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/accounts" element={<AccountList />} />
          <Route path="/admin" element={<SuperAdminDashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Members from './pages/Members/Members';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Layout>
          <Routes>
            <Route path="/" element={<Members />} />
            <Route path="/members" element={<Members />} />
            {/* Thêm routes khác ở đây khi cần */}
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;

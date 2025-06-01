import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Members from './pages/Members/Members';
import Layout from './components/layout/AdminLayout';

// Component trang đơn giản để test
const HomePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Home Page</h1>
    <p className="text-gray-600 mb-4">
      Đây là trang chủ - không có sidebar và header admin.
    </p>
    <a 
      href="/event/9/members" 
      className="text-blue-600 hover:text-blue-800 underline"
    >
      Đi đến Member Management (có sidebar + header)
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/9/members" element={<Members />} />
            {/* Thêm routes khác ở đây khi cần */}
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;

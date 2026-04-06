import { Routes, Route, useLocation } from 'react-router-dom';
import Sidenav from './components/Sidenav';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Team from './components/Team';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const location = useLocation();
  const hideSidenav = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {!hideSidenav && <Sidenav />}

      <main className={`flex-1 p-10 ${hideSidenav ? 'flex items-center justify-center' : ''}`}>
        <div className={`rounded-3xl border border-slate-200 bg-white p-8 shadow-sm ${hideSidenav ? 'w-full max-w-md' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

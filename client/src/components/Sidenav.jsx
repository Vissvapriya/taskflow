import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Sidenav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'Team members', path: '/team' },
  ];

  if (!user) {
    return null;
  }

  return (
    <aside className="flex h-screen w-80 flex-col justify-between bg-white border-r border-slate-200 p-6">
      <div>
        <h1 className="mb-10 text-2xl font-extrabold text-slate-900">Taskflow</h1>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block rounded-2xl px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        <Link
          to="/profile"
          className="block rounded-2xl px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        >
          Profile
        </Link>
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidenav;

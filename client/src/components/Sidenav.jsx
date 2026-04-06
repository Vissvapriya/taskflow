import { Link } from 'react-router-dom';

function Sidenav() {
  const user = {
    name: 'Priya V',
    role: 'Product Manager',
  };

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'Team members', path: '/team' },
  ];

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

      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidenav;

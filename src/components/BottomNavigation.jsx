import { Link, useLocation } from 'react-router-dom';

export default function BottomNavigation() {
  const { pathname } = useLocation();

  const items = [
    { to: '/', label: 'Home', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75h-5.25a.75.75 0 01-.75-.75V13.5H9.75v7.5a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
      </svg>
    ) },
    { to: '/create', label: 'Create', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 5v14m7-7H5" />
      </svg>
    ) },
    { to: '/logs', label: 'Logs', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ) },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/90 backdrop-blur border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {items.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 py-3 px-4 rounded-xl text-sm transition-colors ${
              pathname === item.to
                ? 'bg-blue-100 text-blue-600 shadow'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={item.label}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

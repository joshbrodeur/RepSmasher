import { NavLink } from 'react-router-dom';

export default function BottomNavigation() {

  const items = [
    {
      to: '/',
      label: 'Home',
      icon: (
        <svg
          className="w-5 h-5 mb-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          <path d="M9 22V12h6v10" />
        </svg>
      ),
    },
    {
      to: '/create',
      label: 'Create',
      icon: (
        <svg
          className="w-5 h-5 mb-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      ),
    },
    {
      to: '/workouts',
      label: 'Workouts',
      icon: (
        <svg
          className="w-5 h-5 mb-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="5" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
          <rect x="7" y="11" width="10" height="2" />
        </svg>
      ),
    },
    {
      to: '/logs',
      label: 'Logs',
      icon: (
        <svg
          className="w-5 h-5 mb-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shadow-lg">
      <nav
        role="navigation"
        aria-label="Bottom navigation"
        className="flex justify-around items-center py-2 px-4 max-w-md mx-auto"
      >
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
            aria-label={item.label}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

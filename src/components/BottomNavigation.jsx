import { NavLink } from 'react-router-dom';

export default function BottomNavigation({ items = [] }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shadow-lg">
      <nav
        role="navigation"
        aria-label="Bottom navigation"
        className="flex justify-around items-center w-full py-2 px-4"
      >
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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

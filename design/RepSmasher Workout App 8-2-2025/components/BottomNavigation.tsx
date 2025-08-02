import { Home, Plus, BarChart3, Dumbbell } from 'lucide-react';

type Tab = 'home' | 'create' | 'workouts' | 'logs';

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'create' as const, icon: Plus, label: 'Create' },
    { id: 'workouts' as const, icon: Dumbbell, label: 'Workouts' },
    { id: 'logs' as const, icon: BarChart3, label: 'Logs' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }
              `}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
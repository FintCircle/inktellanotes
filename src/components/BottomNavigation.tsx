import React from 'react';
import { useInktella } from '../context/InktellaContext';
import { Compass, Rss, PenLine, MessageSquare, BookOpen } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { currentRoute, navigateTo } = useInktella();

  const navItems = [
    {
      id: 'discover',
      label: 'Discover',
      icon: Compass,
      isActive: currentRoute.type === 'discover',
      onClick: () => navigateTo({ type: 'discover' }),
    },
    {
      id: 'following',
      label: 'Following',
      icon: Rss,
      isActive: currentRoute.type === 'following',
      onClick: () => navigateTo({ type: 'following' }),
    },
    {
      id: 'write',
      label: 'Write',
      icon: PenLine,
      isAction: true,
      isActive: currentRoute.type === 'editor',
      onClick: () => navigateTo({ type: 'editor' }),
    },
    {
      id: 'conversations',
      label: 'Discuss',
      icon: MessageSquare,
      isActive: currentRoute.type === 'conversations',
      onClick: () => navigateTo({ type: 'conversations' }),
    },
    {
      id: 'notebooks',
      label: 'Notebooks',
      icon: BookOpen,
      isActive: currentRoute.type === 'notebooks',
      onClick: () => navigateTo({ type: 'notebooks' }),
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/90 dark:border-stone-800/90 bg-[#FAF9F6]/95 dark:bg-[#141312]/95 backdrop-blur-md pb-[calc(env(safe-area-inset-bottom,0px)+0.25rem)] pt-1 transition-colors shadow-xs"
    >
      <div className="flex items-center justify-around px-2 h-14">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] group focus:outline-none"
                aria-label={item.label}
              >
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center transition-all ${
                    item.isActive
                      ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs ring-2 ring-stone-900 dark:ring-stone-100'
                      : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 shadow-xs'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] tracking-tight font-medium text-stone-600 dark:text-stone-400 mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 transition-colors relative group focus:outline-none ${
                item.isActive
                  ? 'text-stone-950 dark:text-stone-100'
                  : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
              aria-label={item.label}
            >
              {/* Active top line accent */}
              {item.isActive && (
                <span className="absolute -top-1 w-6 h-0.5 bg-stone-900 dark:bg-stone-100 rounded-full" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform ${
                  item.isActive ? 'stroke-[2.25] scale-105' : 'stroke-[1.75]'
                }`}
              />
              <span
                className={`text-[10px] tracking-tight transition-all mt-0.5 ${
                  item.isActive ? 'font-semibold' : 'font-normal'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

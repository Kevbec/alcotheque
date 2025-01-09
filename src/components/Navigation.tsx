import { Link, useLocation } from 'react-router-dom';
import { Home, Wine, Settings } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  
  const links = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/inventory', icon: Wine, label: 'Inventaire' },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`
                  flex items-center px-3 text-sm font-medium transition-colors
                  ${location.pathname === to
                    ? 'text-indigo-600 dark:text-indigo-400 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-1.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="grid grid-cols-3 h-16">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`
                flex flex-col items-center justify-center space-y-1 transition-colors
                ${location.pathname === to
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300'
                }
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
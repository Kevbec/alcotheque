import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Logo from './Logo';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useWindowSize } from '../hooks/useWindowSize';
import { useAuthStore } from '../store/useAuthStore';
import { useScrollTop } from '../hooks/useScrollTop';

export default function Layout() {
  const [darkMode, setDarkMode] = React.useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 640;
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  useScrollTop();

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center justify-between h-full">
            <Logo />
            
            <div className="flex items-center">
              {profile && (
                <div className="flex items-center min-w-0">
                  <button
                    onClick={() => navigate('/settings')}
                    className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 truncate max-w-[120px] sm:max-w-none"
                  >
                    {profile.firstName}
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                {profile && (
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Se déconnecter"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <Navigation />
      </header>

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isMobile ? 'pt-28' : 'pt-36'} pb-24 md:pb-8`}>
        <Outlet />
      </main>
    </div>
  );
}
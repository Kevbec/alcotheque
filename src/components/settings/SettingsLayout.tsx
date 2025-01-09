import { ReactNode } from 'react';
import { User, Settings as SettingsIcon, Database } from 'lucide-react';
import { useWindowSize } from '../../hooks/useWindowSize';

interface SettingsLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
  showTitle?: boolean;
}

const tabs = [
  { icon: User, label: 'Utilisateur', id: 'user' },
  { icon: SettingsIcon, label: 'Général', id: 'general' },
  { icon: Database, label: 'Données', id: 'data' },
];

export default function SettingsLayout({ 
  activeTab, 
  onTabChange, 
  children,
  showTitle = true
}: SettingsLayoutProps) {
  const { width } = useWindowSize();
  const isMobile = width < 640;

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Paramètres</h2>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {isMobile ? (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {tabs.map(({ icon: Icon, id }) => (
                <button
                  key={id}
                  onClick={() => onTabChange(id)}
                  className={`
                    flex items-center justify-center p-3 rounded-lg whitespace-nowrap min-w-[64px] transition-colors
                    ${activeTab === id
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map(({ icon: Icon, label, id }) => (
                <button
                  key={id}
                  onClick={() => onTabChange(id)}
                  className={`
                    py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === id
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        )}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
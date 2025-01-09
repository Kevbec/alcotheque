import { useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import SettingsLayout from '../components/settings/SettingsLayout';
import UserSettings from '../components/settings/UserSettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import DataSettings from '../components/settings/DataSettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('user');
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        return <UserSettings />;
      case 'general':
        return <GeneralSettings />;
      case 'data':
        return <DataSettings />;
      default:
        return null;
    }
  };

  return (
    <div className={isMobile ? '-mt-4' : ''}>
      <SettingsLayout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        showTitle={!isMobile}
      >
        {renderContent()}
      </SettingsLayout>
    </div>
  );
}
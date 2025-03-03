
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import SettingsAppearanceTab from './SettingsAppearanceTab';
import SettingsNotificationsTab from './SettingsNotificationsTab';
import SettingsPrivacyTab from './SettingsPrivacyTab';
import { PlayerSettings } from '@/hooks/usePlayerAuth';

interface SettingsTabsContentProps {
  settings: PlayerSettings;
  updateSetting: <K extends keyof PlayerSettings>(key: K, value: PlayerSettings[K]) => void;
}

const SettingsTabsContent: React.FC<SettingsTabsContentProps> = ({
  settings,
  updateSetting
}) => {
  return (
    <>
      <TabsContent value="appearance" className="mt-4 space-y-4">
        <SettingsAppearanceTab settings={settings} updateSetting={updateSetting} />
      </TabsContent>
      
      <TabsContent value="notifications" className="mt-4 space-y-4">
        <SettingsNotificationsTab settings={settings} updateSetting={updateSetting} />
      </TabsContent>
      
      <TabsContent value="privacy" className="mt-4">
        <SettingsPrivacyTab settings={settings} updateSetting={updateSetting} />
      </TabsContent>
    </>
  );
};

export default SettingsTabsContent;

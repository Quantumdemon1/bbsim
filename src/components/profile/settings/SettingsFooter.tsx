
import React from 'react';
import { Button } from "@/components/ui/button";

interface SettingsFooterProps {
  onSave: () => void;
  onCancel: () => void;
}

const SettingsFooter: React.FC<SettingsFooterProps> = ({
  onSave,
  onCancel
}) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSave} className="bg-game-accent text-black hover:bg-game-highlight">
        Save Settings
      </Button>
    </div>
  );
};

export default SettingsFooter;

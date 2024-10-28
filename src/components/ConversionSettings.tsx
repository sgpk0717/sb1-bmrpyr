import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface ConversionSettingsProps {
  currentFps: number;
  onApply: (fps: number) => void;
}

export function ConversionSettings({ currentFps, onApply }: ConversionSettingsProps) {
  const [tempFps, setTempFps] = useState(currentFps);

  const handleApply = () => {
    onApply(tempFps);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg relative">
      <label className="block text-sm font-medium text-gray-700">
        Output FPS
        <input
          type="number"
          value={tempFps}
          onChange={(e) => setTempFps(Math.max(1, Math.min(60, parseInt(e.target.value) || 30)))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          min="1"
          max="60"
        />
      </label>
      <button
        onClick={handleApply}
        className="absolute bottom-4 right-4 flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
      >
        <Check className="w-4 h-4" />
        <span>Apply</span>
      </button>
    </div>
  );
}
import React from 'react';
import { Settings, Loader2 } from 'lucide-react';

interface ConversionControlsProps {
  onConvert: () => void;
  onToggleSettings: () => void;
  isConverting: boolean;
  isFFmpegLoaded: boolean;
  isFFmpegLoading: boolean;
  loadingStatus: string;
}

export function ConversionControls({
  onConvert,
  onToggleSettings,
  isConverting,
  isFFmpegLoaded,
  isFFmpegLoading,
  loadingStatus,
}: ConversionControlsProps) {
  const getButtonContent = () => {
    if (isConverting) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Converting...</span>
        </>
      );
    }
    if (isFFmpegLoading) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{loadingStatus || 'Loading FFmpeg...'}</span>
        </>
      );
    }
    return 'Convert to GIF';
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={onToggleSettings}
        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      >
        <Settings className="w-6 h-6" />
      </button>
      
      <button
        onClick={onConvert}
        disabled={isConverting || !isFFmpegLoaded || isFFmpegLoading}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
          isConverting || !isFFmpegLoaded || isFFmpegLoading
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {getButtonContent()}
      </button>
    </div>
  );
}
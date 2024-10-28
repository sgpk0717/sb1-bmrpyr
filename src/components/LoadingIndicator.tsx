import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface LoadingIndicatorProps {
  status: string;
  error?: boolean;
}

export function LoadingIndicator({ status, error }: LoadingIndicatorProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 mb-6 p-4 rounded-lg ${
      error ? 'bg-red-50' : 'bg-purple-50'
    }`}>
      {error ? (
        <AlertCircle className="w-8 h-8 text-red-600" />
      ) : (
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      )}
      <div className={`text-sm font-medium ${
        error ? 'text-red-700' : 'text-purple-700'
      }`}>
        {status}
      </div>
    </div>
  );
}
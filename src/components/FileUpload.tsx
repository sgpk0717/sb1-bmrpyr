import React from 'react';
import { Upload, FileVideo } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File) => void;
}

export function FileUpload({ file, onFileChange }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log('Selected file:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });
      
      if (selectedFile.type.startsWith('video/')) {
        onFileChange(selectedFile);
      } else {
        alert('Please select a valid video file');
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="video/mp4,video/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center space-x-2 w-full py-4 px-6 text-gray-700 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer"
      >
        {file ? (
          <>
            <FileVideo className="w-6 h-6 text-purple-500" />
            <span className="font-medium">{file.name}</span>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-400" />
            <span>Upload MP4 File</span>
          </>
        )}
      </label>
    </div>
  );
}
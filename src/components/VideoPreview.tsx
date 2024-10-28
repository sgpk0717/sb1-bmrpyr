import React, { useRef, useEffect, useState } from 'react';

interface VideoPreviewProps {
  file: File;
}

export function VideoPreview({ file }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    console.log('Created video URL:', url);

    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
        console.log('Revoked video URL:', videoUrl);
      }
    };
  }, [file]);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      console.error('Video error:', {
        error: target.error,
        networkState: target.networkState,
        readyState: target.readyState,
        src: target.src
      });
    };

    const handleLoadedMetadata = () => {
      if (!video) return;
      console.log('Video metadata loaded:', {
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        currentSrc: video.currentSrc
      });
    };

    if (video) {
      video.addEventListener('error', handleError);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (video) {
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  if (!videoUrl) {
    return <div>Loading video...</div>;
  }

  return (
    <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full h-full object-contain"
        onLoadStart={() => console.log('Video load started')}
        onCanPlay={() => console.log('Video can play')}
      >
        Your browser does not support the video tag.
      </video>
      <div className="mt-2 text-sm text-gray-500">
        File info: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
      </div>
    </div>
  );
}
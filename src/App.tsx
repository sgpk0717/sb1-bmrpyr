import React, { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { toBlobURL } from '@ffmpeg/util';
import { Download } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { VideoPreview } from './components/VideoPreview';
import { ConversionControls } from './components/ConversionControls';
import { ConversionSettings } from './components/ConversionSettings';
import { LoadingIndicator } from './components/LoadingIndicator';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [fps, setFps] = useState(30);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [converting, setConverting] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const loadFFmpeg = useCallback(async () => {
    try {
      setFfmpegLoading(true);
      setLoadingStatus('Initializing FFmpeg...');
      setLoadingError(null);
      const ffmpeg = ffmpegRef.current;

      if (await ffmpeg.loaded) {
        setFfmpegLoaded(true);
        setFfmpegLoading(false);
        return;
      }

      const coreURL = await toBlobURL(
        `/node_modules/@ffmpeg/core/dist/ffmpeg-core.js`,
        'text/javascript'
      );
      const wasmURL = await toBlobURL(
        `/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm`,
        'application/wasm'
      );
      const workerURL = await toBlobURL(
        `/node_modules/@ffmpeg/core/dist/ffmpeg-core.worker.js`,
        'text/javascript'
      );

      console.log('coreURL:', coreURL);
      console.log('wasmURL:', wasmURL);
      console.log('workerURL:', workerURL);

      // Load ffmpeg with the correct core URL
      await ffmpeg.load({
        coreURL: coreURL,
        wasmURL: wasmURL,
        workerURL: workerURL,
      });

      console.log('FFmpeg loaded successfully');
      setFfmpegLoaded(true);
      setLoadingStatus('');
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      setLoadingError(
        error instanceof Error ? error.message : 'Failed to load FFmpeg'
      );
      setLoadingStatus('Failed to load FFmpeg. Please refresh and try again.');
    } finally {
      setFfmpegLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFFmpeg();
  }, [loadFFmpeg]);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setGifUrl(null);
    setProgress(0);
  };

  const handleApplySettings = (newFps: number) => {
    setFps(newFps);
    setShowSettings(false);
  };

  const convertToGif = async () => {
    if (!file || !ffmpegLoaded) return;

    setConverting(true);
    setProgress(0);
    const ffmpeg = ffmpegRef.current;

    try {
      const fileData = await fetchFile(file);
      await ffmpeg.writeFile('input.mp4', fileData);

      // Set up progress tracking
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      await ffmpeg.exec([
        '-i',
        'input.mp4',
        '-vf',
        `fps=${fps},scale=480:-1:flags=lanczos`,
        '-f',
        'gif',
        'output.gif',
      ]);

      const data = await ffmpeg.readFile('output.gif');
      const gifBlob = new Blob([data], { type: 'image/gif' });
      const gifUrl = URL.createObjectURL(gifBlob);
      setGifUrl(gifUrl);

      // Cleanup
      await ffmpeg.deleteFile('input.mp4');
      await ffmpeg.deleteFile('output.gif');
    } catch (error) {
      console.error('Error during conversion:', error);
      alert('An error occurred during conversion');
    } finally {
      setConverting(false);
    }
  };

  const downloadGif = () => {
    if (!gifUrl) return;

    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = 'converted.gif';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          MP4 to GIF Converter
        </h1>

        {(ffmpegLoading || loadingError) && (
          <LoadingIndicator
            status={loadingError || loadingStatus}
            error={!!loadingError}
          />
        )}

        <div className="space-y-6">
          <FileUpload file={file} onFileChange={handleFileChange} />

          {file && (
            <>
              <VideoPreview file={file} />

              <ConversionControls
                onConvert={convertToGif}
                onToggleSettings={() => setShowSettings(!showSettings)}
                isConverting={converting}
                isFFmpegLoaded={ffmpegLoaded}
                isFFmpegLoading={ffmpegLoading}
                loadingStatus={loadingStatus}
              />
            </>
          )}

          {showSettings && (
            <ConversionSettings
              currentFps={fps}
              onApply={handleApplySettings}
            />
          )}

          {converting && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {gifUrl && (
            <button
              onClick={downloadGif}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download GIF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

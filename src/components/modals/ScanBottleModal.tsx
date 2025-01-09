import { useEffect, useRef, useState } from 'react';
import { X, Camera, Image, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { recognizeBottle } from '../../services/openai';
import { processImageForAPI } from '../../services/openai/imageProcessing';
import { useModalStore } from '../../store/useModalStore';

interface ScanBottleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScanBottleModal({ isOpen, onClose }: ScanBottleModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mode, setMode] = useState<'select' | 'camera'>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const { setBottleRecognitionData, setScannedPhoto, openAddBottleModal } = useModalStore();

  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setIsProcessing(false);
      setMode('select');
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      setMode('select');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setError('');
    
    try {
      const result = await recognizeBottle(imageData);
      setBottleRecognitionData(result);
      setScannedPhoto(imageData);
      setIsProcessing(false);
      onClose();
      openAddBottleModal();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'analyse de l\'image');
      setIsProcessing(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        processImageForAPI(imageData)
          .then(optimizedImage => {
            processImage(`data:image/jpeg;base64,${optimizedImage}`);
          })
          .catch(error => {
            setError('Erreur lors de l\'optimisation de l\'image');
            setIsProcessing(false);
          });
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imageData = e.target?.result as string;
          const optimizedImage = await processImageForAPI(imageData);
          processImage(`data:image/jpeg;base64,${optimizedImage}`);
        } catch (error) {
          setError('Erreur lors de l\'optimisation de l\'image');
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Scanner une bouteille
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {isProcessing ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Analyse de l'image en cours...
                </p>
              </div>
            ) : mode === 'select' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setMode('camera')}
                    className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors group"
                  >
                    <Camera className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                      Prendre une photo
                    </span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors group"
                  >
                    <Image className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                      Choisir une image
                    </span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setMode('select')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retour
                  </button>
                  <button
                    onClick={handleCapture}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Capturer
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Une erreur est survenue
                    </p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
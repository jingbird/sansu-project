import { Check, X } from 'lucide-react';

interface PreviewPageProps {
  imageUrl: string;
  onConfirm: () => void;
  onRetake: () => void;
}

function PreviewPage({ imageUrl, onConfirm, onRetake }: PreviewPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50 flex flex-col items-center justify-center p-6">
      <div className="space-y-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          とったしゃしん
        </h2>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="撮影した画像"
            className="w-full h-auto"
          />
        </div>

        <div className="space-y-4">
          <button
            onClick={onConfirm}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-2xl shadow-lg transition-colors duration-200 py-6 px-8 text-2xl font-bold flex items-center justify-center gap-3 min-h-[80px]"
          >
            <Check size={32} />
            <span>これでいい</span>
          </button>

          <button
            onClick={onRetake}
            className="w-full bg-gray-400 hover:bg-gray-500 active:bg-gray-600 text-white rounded-2xl shadow-lg transition-colors duration-200 py-5 px-8 text-xl font-bold flex items-center justify-center gap-3 min-h-[70px]"
          >
            <X size={28} />
            <span>とりなおす</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;

import { Camera } from 'lucide-react';

interface CameraPageProps {
  onFileSelect: (file: File) => void;
}

function CameraPage({ onFileSelect }: CameraPageProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          さんすうアシスタント
        </h1>

        <div className="text-8xl">
          📝
        </div>

        <p className="text-xl text-gray-700">
          プリントぜんたいを<br />うつしてね
        </p>

        <label htmlFor="camera-input" className="block">
          <div className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-2xl shadow-lg cursor-pointer transition-colors duration-200 py-6 px-8 text-2xl font-bold flex items-center justify-center gap-3 min-h-[80px] min-w-[200px]">
            <Camera size={32} />
            <span>しゃしんをとる</span>
          </div>
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

export default CameraPage;

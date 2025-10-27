import { RotateCcw } from 'lucide-react';

interface ErrorPageProps {
  message: string;
  onRetry: () => void;
}

function ErrorPage({ message, onRetry }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-12 max-w-md w-full">
        <div className="text-8xl">
          😢
        </div>

        <p className="text-2xl text-gray-800 leading-relaxed whitespace-pre-line">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-2xl shadow-lg transition-colors duration-200 py-6 px-8 text-2xl font-bold flex items-center justify-center gap-3 min-h-[80px]"
        >
          <RotateCcw size={32} />
          <span>もういちどためしてね</span>
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;

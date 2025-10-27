import { Loader2 } from 'lucide-react';

function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8">
        <Loader2 size={64} className="text-blue-500 animate-spin mx-auto" />

        <div className="space-y-4">
          <p className="text-2xl text-gray-800 font-medium">
            がぞうをよんでいます...
          </p>
          <p className="text-xl text-gray-600">
            すこしまってね
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;

import { ArrowLeft } from 'lucide-react';

interface CompletePageProps {
  onBackToProblems: () => void;
}

function CompletePage({ onBackToProblems }: CompletePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-12 max-w-md w-full">
        <div className="text-9xl animate-bounce">
          🦁
        </div>

        <h1 className="text-5xl font-bold text-green-600">
          よくできました！
        </h1>

        <button
          onClick={onBackToProblems}
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-2xl shadow-lg transition-colors duration-200 py-6 px-8 text-2xl font-bold flex items-center justify-center gap-3 min-h-[80px]"
        >
          <ArrowLeft size={32} />
          <span>もんだいにもどる</span>
        </button>
      </div>
    </div>
  );
}

export default CompletePage;

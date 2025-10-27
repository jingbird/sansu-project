import { ChevronRight } from 'lucide-react';

interface HintItem {
  src: string;
  state: 'normal' | 'eaten' | 'new';
  sparkle?: boolean;
}

interface Hint {
  step: number;
  visual: {
    type: 'images';
    items: HintItem[];
  };
  text: string;
}

interface HintPageProps {
  hints: Hint[];
  currentStep: number;
  onNext: () => void;
}

function HintPage({ hints, currentStep, onNext }: HintPageProps) {
  const currentHint = hints[currentStep];
  const totalSteps = hints.length;

  const getImageClass = (state: string) => {
    if (state === 'eaten') {
      return 'grayscale brightness-75 opacity-60';
    }
    if (state === 'new') {
      return 'animate-bounce';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50 flex flex-col p-6">
      <div className="text-right text-gray-600 text-lg mb-8">
        {currentStep + 1}/{totalSteps}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-md mx-auto w-full">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {currentHint.visual.items.map((item, index) => (
            <div key={index} className="relative">
              <div className={`text-7xl ${getImageClass(item.state)} transition-all duration-300`}>
                {item.src === 'strawberry' && '🍓'}
                {item.src === 'apple' && '🍎'}
                {item.src === 'orange' && '🍊'}
                {item.src === 'banana' && '🍌'}
                {item.src === 'child' && '🧒'}
                {item.src === 'dog' && '🐶'}
                {item.src === 'cat' && '🐱'}
                {item.src === 'car' && '🚗'}
              </div>
              {item.sparkle && (
                <div className="absolute -top-2 -right-2 text-3xl animate-pulse">
                  ✨
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-2xl text-gray-800 text-center font-medium leading-relaxed px-4">
          {currentHint.text}
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-md mx-auto bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-2xl shadow-lg transition-colors duration-200 py-6 px-8 text-2xl font-bold flex items-center justify-center gap-3 min-h-[80px]"
      >
        <span>すすむ</span>
        <ChevronRight size={32} />
      </button>
    </div>
  );
}

export default HintPage;

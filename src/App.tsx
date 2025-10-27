import { useState } from 'react';
import CameraPage from './pages/CameraPage';
import PreviewPage from './pages/PreviewPage';
import ProblemListPage from './pages/ProblemListPage';
import HintPage from './pages/HintPage';
import CompletePage from './pages/CompletePage';
import ErrorPage from './pages/ErrorPage';
import LoadingPage from './pages/LoadingPage';

type Screen = 'camera' | 'preview' | 'loading' | 'problems' | 'hints' | 'complete' | 'error';

const mockProblems = [
  {
    id: 1,
    text: 'テーブルのうえにいちごが2つあり、1つたべました。のこりはなんこですか？',
    hints: [
      {
        step: 1,
        visual: {
          type: 'images' as const,
          items: [
            { src: 'strawberry', state: 'normal' as const },
            { src: 'strawberry', state: 'normal' as const },
          ],
        },
        text: 'テーブルのうえにいちごが2つ',
      },
      {
        step: 2,
        visual: {
          type: 'images' as const,
          items: [
            { src: 'strawberry', state: 'normal' as const },
            { src: 'strawberry', state: 'eaten' as const },
          ],
        },
        text: '1つたべました',
      },
      {
        step: 3,
        visual: {
          type: 'images' as const,
          items: [
            { src: 'strawberry', state: 'normal' as const },
            { src: 'strawberry', state: 'eaten' as const },
          ],
        },
        text: 'のこりはいくつかな？',
      },
    ],
  },
  {
    id: 2,
    text: 'こうえんにこどもが3にんいます。2にんかえりました。のこりはなんにんですか？',
    hints: [
      {
        step: 1,
        visual: {
          type: 'images' as const,
          items: [
            { src: 'child', state: 'normal' as const },
            { src: 'child', state: 'normal' as const },
            { src: 'child', state: 'normal' as const },
          ],
        },
        text: 'こうえんにこどもが3にん',
      },
      {
        step: 2,
        visual: {
          type: 'images' as const,
          items: [
            { src: 'child', state: 'normal' as const },
            { src: 'child', state: 'eaten' as const },
            { src: 'child', state: 'eaten' as const },
          ],
        },
        text: '2にんかえりました',
      },
      {
        step: 3,
        visual: {
          type: 'images' as const,
          items: [
            { src: 'child', state: 'normal' as const },
            { src: 'child', state: 'eaten' as const },
            { src: 'child', state: 'eaten' as const },
          ],
        },
        text: 'のこりはなんにん？',
      },
    ],
  },
  {
    id: 3,
    text: 'りんごを2こもっています。1こもらいました。ぜんぶでなんこですか？',
    hints: [
      {
        step: 1,
        visual: {
          type: 'images' as const,
          items: [
            { src: 'apple', state: 'normal' as const },
            { src: 'apple', state: 'normal' as const },
          ],
        },
        text: 'りんごを2こもっています',
      },
      {
        step: 2,
        visual: {
          type: 'images' as const,
          items: [
            { src: 'apple', state: 'normal' as const },
            { src: 'apple', state: 'normal' as const },
            { src: 'apple', state: 'new' as const, sparkle: true },
          ],
        },
        text: '1こもらいました',
      },
      {
        step: 3,
        visual: {
          type: 'images' as const,
          items: [
            { src: 'apple', state: 'normal' as const },
            { src: 'apple', state: 'normal' as const },
            { src: 'apple', state: 'normal' as const },
          ],
        },
        text: 'ぜんぶでいくつかな？',
      },
    ],
  },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('camera');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
  const [currentHintStep, setCurrentHintStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedProblem = mockProblems.find(p => p.id === selectedProblemId);

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setCurrentScreen('preview');
  };

  const handleConfirmImage = () => {
    setCurrentScreen('loading');
    setTimeout(() => {
      setCurrentScreen('problems');
    }, 2000);
  };

  const handleRetake = () => {
    setImageUrl('');
    setCurrentScreen('camera');
  };

  const handleSelectProblem = (problemId: number) => {
    setSelectedProblemId(problemId);
    setCurrentHintStep(0);
    setCurrentScreen('hints');
  };

  const handleNextHint = () => {
    if (selectedProblem) {
      if (currentHintStep < selectedProblem.hints.length - 1) {
        setCurrentHintStep(currentHintStep + 1);
      } else {
        setCurrentScreen('complete');
      }
    }
  };

  const handleBackToProblems = () => {
    setSelectedProblemId(null);
    setCurrentHintStep(0);
    setCurrentScreen('problems');
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setCurrentScreen('error');
  };

  const handleRetryFromError = () => {
    setErrorMessage('');
    setCurrentScreen('camera');
  };

  return (
    <>
      {currentScreen === 'camera' && (
        <CameraPage onFileSelect={handleFileSelect} />
      )}

      {currentScreen === 'preview' && (
        <PreviewPage
          imageUrl={imageUrl}
          onConfirm={handleConfirmImage}
          onRetake={handleRetake}
        />
      )}

      {currentScreen === 'loading' && (
        <LoadingPage />
      )}

      {currentScreen === 'problems' && (
        <ProblemListPage
          problems={mockProblems}
          onSelectProblem={handleSelectProblem}
          onRetake={handleRetake}
        />
      )}

      {currentScreen === 'hints' && selectedProblem && (
        <HintPage
          hints={selectedProblem.hints}
          currentStep={currentHintStep}
          onNext={handleNextHint}
        />
      )}

      {currentScreen === 'complete' && (
        <CompletePage onBackToProblems={handleBackToProblems} />
      )}

      {currentScreen === 'error' && (
        <ErrorPage
          message={errorMessage}
          onRetry={handleRetryFromError}
        />
      )}
    </>
  );
}

export default App;

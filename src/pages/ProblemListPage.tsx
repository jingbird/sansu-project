import { ChevronRight, Home } from 'lucide-react';

interface Problem {
  id: number;
  text: string;
}

interface ProblemListPageProps {
  problems: Problem[];
  onSelectProblem: (problemId: number) => void;
  onRetake: () => void;
}

function ProblemListPage({ problems, onSelectProblem, onRetake }: ProblemListPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          どのもんだい？
        </h2>

        <div className="space-y-4">
          {problems.map((problem) => (
            <button
              key={problem.id}
              onClick={() => onSelectProblem(problem.id)}
              className="w-full bg-white hover:bg-yellow-50 active:bg-yellow-100 rounded-2xl shadow-lg transition-colors duration-200 p-6 text-left flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mt-1">
                {problem.id}
              </div>
              <div className="flex-1 text-lg text-gray-700 leading-relaxed">
                {problem.text}
              </div>
              <ChevronRight size={28} className="flex-shrink-0 text-gray-400 mt-1" />
            </button>
          ))}
        </div>

        <button
          onClick={onRetake}
          className="mx-auto mt-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-base"
        >
          <Home size={18} />
          <span>さいしょにもどる</span>
        </button>
      </div>
    </div>
  );
}

export default ProblemListPage;

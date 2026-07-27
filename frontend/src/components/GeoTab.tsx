import ReactMarkdown from 'react-markdown';
import { Target, Lightbulb, CheckCircle2 } from 'lucide-react';

export function GeoTab({ data }: { data: any }) {
  if (!data || !data.recommendations) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No GEO data available.
      </div>
    );
  }

  const { score, readiness, ai_overviews_probability, recommendations } = data;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">GEO Score</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{score}/100</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Readiness</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">{readiness}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">AI Overview Prob.</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">{ai_overviews_probability}</h3>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          GEO Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec: string, index: number) => (
            <div key={index} className="flex gap-3 items-start p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                {index + 1}
              </div>
              <div className="text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert">
                <ReactMarkdown>{rec}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

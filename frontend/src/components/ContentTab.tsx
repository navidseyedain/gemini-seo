import { Target, Users, AlertTriangle, CheckCircle2, List } from 'lucide-react';
import { ScoreRing } from './ScoreRing';

export function ContentTab({ data }: { data: any }) {
  if (!data) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">No content analysis available.</div>;

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-8">
        <div className="shrink-0">
          <ScoreRing score={data.score || 0} size={160} strokeWidth={12} />
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1 w-full">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <span className="block text-sm text-slate-500 mb-1">Word Count</span>
            <span className="font-bold text-lg">{data.word_count || 0}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <span className="block text-sm text-slate-500 mb-1">Readability</span>
            <span className="font-bold text-lg">{data.readability_level || 'N/A'}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <span className="block text-sm text-slate-500 mb-1">Primary Intent</span>
            <span className="font-bold text-lg">{data.primary_intent || 'N/A'}</span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <span className="block text-sm text-slate-500 mb-1">Tone</span>
            <span className="font-bold text-lg">{data.tone || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Keywords */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Top Keywords Detected
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.top_keywords?.map((kw: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Target Audience
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {data.target_audience}
          </p>
        </div>
      </div>

      {/* Content Gaps */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Content Gaps & Opportunities
        </h3>
        <div className="space-y-4">
          {data.content_gaps?.map((gap: any, i: number) => (
            <div key={i} className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-xl">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">{gap.topic}</h4>
              <p className="text-amber-700 dark:text-amber-400 text-sm">{gap.importance}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <List className="w-5 h-5 text-emerald-500" />
          Content Recommendations
        </h3>
        <ul className="space-y-3">
          {data.recommendations?.map((rec: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

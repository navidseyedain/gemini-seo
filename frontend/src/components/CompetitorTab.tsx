import ReactMarkdown from 'react-markdown';
import { Swords, ExternalLink, TrendingDown, TrendingUp } from 'lucide-react';

export function CompetitorTab({ data }: { data: any }) {
  if (!data || !data.gap_analysis) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No Competitor data available.
      </div>
    );
  }

  const { score, competitor_url, gap_analysis, missing_keywords, strengths, weaknesses } = data;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
            <Swords className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Competitive Analysis</h2>
            <p className="text-slate-500 dark:text-slate-400">Compared against top ranking competitor</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Competitor URL</p>
          <a href={competitor_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
            {competitor_url}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Gap Analysis</h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown>{gap_analysis}</ReactMarkdown>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Our Strengths
          </h3>
          <ul className="space-y-3">
            {strengths.map((s: string, i: number) => (
              <li key={i} className="flex gap-2 items-start text-slate-700 dark:text-slate-300">
                <span className="text-emerald-500 mt-1">•</span>
                <ReactMarkdown>{s}</ReactMarkdown>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Our Weaknesses
          </h3>
          <ul className="space-y-3">
            {weaknesses.map((w: string, i: number) => (
              <li key={i} className="flex gap-2 items-start text-slate-700 dark:text-slate-300">
                <span className="text-rose-500 mt-1">•</span>
                <ReactMarkdown>{w}</ReactMarkdown>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Missing Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {missing_keywords.map((kw: string, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

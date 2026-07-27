import ReactMarkdown from 'react-markdown';
import { Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

export function AccessibilityTab({ data }: { data: any }) {
  if (!data || !data.wcag_compliance) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No Accessibility data available.
      </div>
    );
  }

  const { score, wcag_compliance, issues, good_practices } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Accessibility Score</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{score}/100</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">WCAG Compliance</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">{wcag_compliance}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Accessibility Issues
          </h3>
          <ul className="space-y-3">
            {issues.map((issue: string, i: number) => (
              <li key={i} className="flex gap-2 items-start text-slate-700 dark:text-slate-300">
                <span className="text-rose-500 mt-1">•</span>
                <ReactMarkdown>{issue}</ReactMarkdown>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Good Practices
          </h3>
          <ul className="space-y-3">
            {good_practices.map((practice: string, i: number) => (
              <li key={i} className="flex gap-2 items-start text-slate-700 dark:text-slate-300">
                <span className="text-teal-500 mt-1">•</span>
                <ReactMarkdown>{practice}</ReactMarkdown>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

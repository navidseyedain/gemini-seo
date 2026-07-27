import { AlertTriangle, CheckCircle2, Map } from 'lucide-react';
import { ScoreRing } from './ScoreRing';

export function LocalTab({ data }: { data: any }) {
  if (!data) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">No Local SEO data available.</div>;

  return (
    <div className="space-y-6">

      {/* Score + Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <ScoreRing score={data.score} size={60} strokeWidth={6} />
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400 block">Local Score</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.score}/100</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${data.has_nap ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
          <div className="mb-2">
            {data.has_nap ? <CheckCircle2 className="w-7 h-7 text-emerald-500" /> : <AlertTriangle className="w-7 h-7 text-red-500" />}
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">NAP Details</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Name, Address, Phone</span>
        </div>
        
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${data.has_map_embed ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`}>
          <div className="mb-2">
            <Map className={`w-7 h-7 ${data.has_map_embed ? 'text-emerald-500' : 'text-yellow-500 opacity-50'}`} />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Map Embed</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Google Maps on page</span>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${data.has_local_schema ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
          <div className="mb-2">
            {data.has_local_schema ? <CheckCircle2 className="w-7 h-7 text-emerald-500" /> : <AlertTriangle className="w-7 h-7 text-red-500" />}
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Local Schema</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">LocalBusiness JSON-LD</span>
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold mb-3 dark:text-slate-100">Detected Local Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {data.local_keywords_detected && data.local_keywords_detected.length > 0 ? (
            data.local_keywords_detected.map((kw: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 rounded-full text-sm">
                {kw}
              </span>
            ))
          ) : (
            <span className="text-slate-500 dark:text-slate-400 text-sm">No local keywords (e.g., city names) detected in content.</span>
          )}
        </div>
      </div>

      {/* Findings */}
      <div>
        <h3 className="font-bold text-xl mb-4 dark:text-slate-100">Local SEO Findings</h3>
        <div className="space-y-3">
          {data.findings?.map((finding: any, i: number) => (
            <div key={i} className="flex bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="mr-4 mt-1">
                {finding.impact === 'high' ? <AlertTriangle className="text-red-500 w-6 h-6" /> : 
                 <AlertTriangle className="text-yellow-500 w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-2">{finding.issue}</p>
                  <span className={`px-2 py-1 text-xs rounded-md uppercase font-bold shrink-0
                    ${finding.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'}`}>
                    {finding.impact} Impact
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-sm mt-2">
                  <span className="text-slate-600 dark:text-slate-400 block font-semibold mb-1">Recommendation:</span>
                  <p className="text-slate-800 dark:text-slate-200">{finding.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
          
          {(!data.findings || data.findings.length === 0) && (
            <div className="p-6 text-center bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="font-medium">No major local SEO issues found!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

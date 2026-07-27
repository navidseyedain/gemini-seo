import { AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { ScoreRing } from './ScoreRing';

export function TechnicalTab({ data }: { data: any }) {
  if (!data) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">No technical data available.</div>;

  return (
    <div className="space-y-6">
      {/* Score + Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <ScoreRing score={data.score} size={70} strokeWidth={7} />
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400 block">Technical Score</span>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{data.score}/100</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${data.mobile_friendly ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <span className="text-xl">{data.mobile_friendly ? "📱" : "❌"}</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400 block">Mobile Friendly</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{data.mobile_friendly ? "Yes" : "No"}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${data.ssl_secure ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <span className="text-xl">{data.ssl_secure ? "🔒" : "🔓"}</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400 block">SSL Secure</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{data.ssl_secure ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Technical Findings</h3>
      <div className="space-y-4">
        {data.findings?.map((flaw: any, i: number) => (
          <div key={i} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg flex items-center capitalize text-slate-800 dark:text-slate-100">
                {flaw.impact === 'high' ? <XCircle className="w-5 h-5 text-red-500 mr-2"/> : 
                 flaw.impact === 'medium' ? <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2"/> :
                 <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2" />}
                {flaw.category} Issue
              </h4>
              <span className={`px-2 py-1 text-xs rounded-md font-medium uppercase
                ${flaw.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 
                  flaw.impact === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                {flaw.impact} Impact
              </span>
            </div>
            
            <div className="mt-3">
              <p className="text-slate-700 dark:text-slate-300"><strong>Issue:</strong> {flaw.message}</p>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 mt-3 rounded border border-slate-100 dark:border-slate-700 text-sm">
                <span className="text-slate-600 dark:text-slate-400 block font-semibold mb-1">Recommendation:</span>
                <p className="text-slate-800 dark:text-slate-200">{flaw.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { ArrowLeft, Minus, CheckCircle2, XCircle } from 'lucide-react';
import { ScoreRing } from './ScoreRing';

export function CompareTab({ reports, onBack }: { reports: any[], onBack: () => void }) {
  if (!reports || reports.length !== 2) return null;

  const [r1, r2] = reports;

  const getOverallScore = (report: any) => {
    const tech = report?.data?.technical?.score || 0;
    const local = report?.data?.local?.score || 0;
    const perf = report?.data?.performance?.score || 0;
    const content = report?.data?.content?.score || 0;
    const eeatScores = report?.data?.eeat;
    const eeat = eeatScores ? Math.round((
      (eeatScores.experience?.score || 0) +
      (eeatScores.expertise?.score || 0) +
      (eeatScores.authoritativeness?.score || 0) +
      (eeatScores.trustworthiness?.score || 0)
    ) / 4) : 0;
    return Math.round((tech + eeat + local + perf + content) / 5);
  };

  const scores1 = {
    overall: getOverallScore(r1),
    technical: r1.data?.technical?.score || 0,
    performance: r1.data?.performance?.score || 0,
    content: r1.data?.content?.score || 0,
    eeat: r1.data?.eeat ? Math.round(((r1.data.eeat.experience?.score || 0) + (r1.data.eeat.expertise?.score || 0) + (r1.data.eeat.authoritativeness?.score || 0) + (r1.data.eeat.trustworthiness?.score || 0)) / 4) : 0,
    local: r1.data?.local?.score || 0,
  };

  const scores2 = {
    overall: getOverallScore(r2),
    technical: r2.data?.technical?.score || 0,
    performance: r2.data?.performance?.score || 0,
    content: r2.data?.content?.score || 0,
    eeat: r2.data?.eeat ? Math.round(((r2.data.eeat.experience?.score || 0) + (r2.data.eeat.expertise?.score || 0) + (r2.data.eeat.authoritativeness?.score || 0) + (r2.data.eeat.trustworthiness?.score || 0)) / 4) : 0,
    local: r2.data?.local?.score || 0,
  };

  const renderComparisonRow = (label: string, s1: number, s2: number) => {
    const diff = s1 - s2;
    let icon1 = <Minus className="w-5 h-5 text-slate-400" />;
    let icon2 = <Minus className="w-5 h-5 text-slate-400" />;
    
    if (diff > 0) {
      icon1 = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      icon2 = <XCircle className="w-5 h-5 text-red-500" />;
    } else if (diff < 0) {
      icon1 = <XCircle className="w-5 h-5 text-red-500" />;
      icon2 = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }

    return (
      <div className="grid grid-cols-3 gap-4 py-4 border-b border-slate-100 dark:border-slate-800 items-center">
        <div className="flex flex-col items-center gap-2">
          {icon1}
          <span className="font-bold text-xl">{s1}</span>
        </div>
        <div className="text-center font-medium text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div className="flex flex-col items-center gap-2">
          {icon2}
          <span className="font-bold text-xl">{s2}</span>
        </div>
      </div>
    );
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">Competitive Analysis</h2>
          <p className="text-slate-500 dark:text-slate-400">Head-to-head comparison of two SEO reports.</p>
        </div>
        <button onClick={onBack} className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to History
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <div className="text-center break-all">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Report A</span>
            <span className="font-bold text-lg text-primary">{getDomain(r1.url)}</span>
            <div className="flex justify-center mt-4">
              <ScoreRing score={scores1.overall} size={80} strokeWidth={6} />
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
              VS
            </div>
          </div>

          <div className="text-center break-all">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Report B</span>
            <span className="font-bold text-lg text-primary">{getDomain(r2.url)}</span>
            <div className="flex justify-center mt-4">
              <ScoreRing score={scores2.overall} size={80} strokeWidth={6} />
            </div>
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="p-6">
          {renderComparisonRow('Technical SEO', scores1.technical, scores2.technical)}
          {renderComparisonRow('Performance', scores1.performance, scores2.performance)}
          {renderComparisonRow('Content Quality', scores1.content, scores2.content)}
          {renderComparisonRow('E-E-A-T', scores1.eeat, scores2.eeat)}
          {renderComparisonRow('Local SEO', scores1.local, scores2.local)}
        </div>
      </div>
    </div>
  );
}

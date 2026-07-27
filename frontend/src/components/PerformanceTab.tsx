import { Activity, FastForward, Zap, Clock, Maximize, AlertCircle } from 'lucide-react';
import { ScoreRing } from './ScoreRing';

export function PerformanceTab({ data }: { data: any }) {
  if (!data) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">No performance data available.</div>;
  if (data.error) return (
    <div className="p-8 text-center text-red-500">
      <AlertCircle className="w-12 h-12 mx-auto mb-4" />
      <p>{data.error}</p>
    </div>
  );

  const getMetricColor = (status: string) => {
    switch(status) {
      case 'good': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'needs_improvement': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'poor': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const getMetricIcon = (name: string) => {
    if (name.includes('LCP')) return <Maximize className="w-5 h-5" />;
    if (name.includes('FCP')) return <FastForward className="w-5 h-5" />;
    if (name.includes('CLS')) return <Activity className="w-5 h-5" />;
    if (name.includes('TTI')) return <Clock className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-8">
        <div className="shrink-0">
          <ScoreRing score={data.score} size={160} strokeWidth={12} />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Performance Score (Mobile)</h3>
          <p className="text-slate-600 dark:text-slate-400">
            This score represents the overall performance of the page on a mobile device, calculated using Google Lighthouse Core Web Vitals.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.metrics?.map((metric: any, i: number) => (
          <div key={i} className={`p-5 rounded-xl border ${getMetricColor(metric.status)} transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/50 dark:bg-black/20 flex items-center justify-center">
                {getMetricIcon(metric.name)}
              </div>
              <span className="font-bold text-lg">{metric.value}</span>
            </div>
            <h4 className="font-semibold">{metric.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

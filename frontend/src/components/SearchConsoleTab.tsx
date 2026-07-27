import { AlertTriangle, TrendingUp, Pointer, Eye, BarChart2, ArrowUpRight } from 'lucide-react'

export function SearchConsoleTab({ data }: { data: any }) {
  if (!data || data.error) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-2">Search Console Data Unavailable</h3>
        <p className="text-amber-700 dark:text-amber-500/80 max-w-md">
          {data?.error || "We couldn't connect to Google Search Console. Make sure you provided a valid OAuth JSON credential in settings."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
            <Pointer className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium uppercase tracking-wider">Total Clicks</span>
          </div>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{data.total_clicks.toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
            <Eye className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium uppercase tracking-wider">Impressions</span>
          </div>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{data.total_impressions.toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium uppercase tracking-wider">Avg CTR</span>
          </div>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{(data.avg_ctr * 100).toFixed(2)}%</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
            <BarChart2 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium uppercase tracking-wider">Avg Position</span>
          </div>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{data.avg_position.toFixed(1)}</span>
        </div>
      </div>

      {data.top_keywords && data.top_keywords.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-primary" /> Top Performing Keywords
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">Last 30 Days</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Query</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Clicks</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Impressions</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">CTR</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.top_keywords.map((kw: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200 flex items-center">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs mr-3">{idx + 1}</span>
                      {kw.query}
                    </td>
                    <td className="p-4 text-right font-medium text-slate-900 dark:text-slate-100">{kw.clicks.toLocaleString()}</td>
                    <td className="p-4 text-right text-slate-600 dark:text-slate-400">{kw.impressions.toLocaleString()}</td>
                    <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">{(kw.ctr * 100).toFixed(1)}%</td>
                    <td className="p-4 text-right text-slate-600 dark:text-slate-400">
                      <span className="flex items-center justify-end gap-1">
                        {kw.position.toFixed(1)} <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

import { AlertTriangle, Globe, Link2, FileText, CheckCircle2 } from 'lucide-react'

export function FirecrawlTab({ data }: { data: any }) {
  if (!data || data.error) {
    return (
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-indigo-500 mb-4" />
        <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-400 mb-2">Deep Crawl Unavailable</h3>
        <p className="text-indigo-700 dark:text-indigo-500/80 max-w-md">
          {data?.error || "We couldn't perform a deep crawl. Make sure you provided a valid Firecrawl API Key in settings."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
            <FileText className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium uppercase tracking-wider">Pages Crawled</span>
          </div>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{data.total_pages_found.toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
            <Link2 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium uppercase tracking-wider">Internal Links Analyzed</span>
          </div>
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{data.internal_links.toLocaleString()}</span>
        </div>
      </div>

      {data.pages && data.pages.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-primary" /> Discovered Pages (Sample)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">URL</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.pages.map((page: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate" title={page.url}>
                      <a href={page.url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        {page.url}
                      </a>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 truncate max-w-sm" title={page.title}>{page.title || 'N/A'}</td>
                    <td className="p-4 text-right">
                      {page.status === 200 ? (
                        <span className="inline-flex items-center text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> 200 OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded text-xs font-medium">
                          {page.status}
                        </span>
                      )}
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

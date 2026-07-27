import { Link, AlertCircle } from 'lucide-react';

export function BacklinkTab({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No Backlink data available.
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-500 gap-2 font-medium bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 text-center">
        <AlertCircle className="w-5 h-5" />
        {data.error}
      </div>
    );
  }

  const { score, domain, page_rank_integer, page_rank_decimal, rank } = data;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl">
            <Link className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Domain Authority</h2>
            <p className="text-slate-500 dark:text-slate-400">Powered by OpenPageRank</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Domain</p>
          <p className="font-bold text-slate-800 dark:text-slate-100">{domain}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">Authority Score</p>
          <h3 className="text-4xl font-bold text-sky-600 dark:text-sky-400">{score}/100</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">PageRank Decimal</p>
          <h3 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{page_rank_decimal?.toFixed(2)}</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">Global Rank</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {rank !== "N/A" ? `#${Number(rank).toLocaleString()}` : 'N/A'}
          </h3>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Clock, ExternalLink, Search, Trash2 } from 'lucide-react';
import { ScoreRing } from './ScoreRing';

interface ReportSummary {
  id: number;
  url: string;
  score: number;
  created_at: string;
}

interface HistoryTabProps {
  onLoadReport: (report: any) => void;
  onCompareReports: (reports: any[]) => void;
}

export function HistoryTab({ onLoadReport, onCompareReports }: HistoryTabProps) {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8005/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReport = async (id: number) => {
    setLoadingId(id);
    try {
      const res = await fetch(`http://localhost:8005/api/reports/${id}`);
      if (res.ok) {
        const data = await res.json();
        onLoadReport(data);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const deleteReport = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      const res = await fetch(`http://localhost:8005/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== id));
        setSelectedIds(prev => prev.filter(x => x !== id));
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const handleCompare = async () => {
    if (selectedIds.length !== 2) return;
    setLoading(true);
    try {
      const p1 = fetch(`http://localhost:8005/api/reports/${selectedIds[0]}`).then(r => r.json());
      const p2 = fetch(`http://localhost:8005/api/reports/${selectedIds[1]}`).then(r => r.json());
      const [r1, r2] = await Promise.all([p1, p2]);
      onCompareReports([r1, r2]);
    } catch (err) {
      console.error('Failed to load reports for comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Audit History</h1>
          <p className="text-slate-500 dark:text-slate-400">View and revisit your previous SEO audits.</p>
        </div>
        
        {reports.length > 1 && (
          <button
            onClick={handleCompare}
            disabled={selectedIds.length !== 2}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 text-white rounded-lg font-medium transition-colors"
          >
            Compare Selected ({selectedIds.length}/2)
          </button>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Search className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">No audits yet</h3>
          <p className="text-slate-400 mt-1">Run your first SEO audit from the Dashboard.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const isSelected = selectedIds.includes(report.id);
            return (
            <div
              key={report.id}
              className={`flex items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border transition-all cursor-pointer group
                ${isSelected ? 'border-primary shadow-md ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30'}
              `}
              onClick={() => loadReport(report.id)}
            >
              {/* Checkbox */}
              <div 
                className="flex items-center justify-center w-6 h-6 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 shrink-0 cursor-pointer hover:border-primary transition-colors"
                onClick={(e) => toggleSelection(report.id, e)}
              >
                {isSelected && <div className="w-3 h-3 bg-primary rounded-sm" />}
              </div>

              {/* Score */}
              <ScoreRing score={report.score} size={56} strokeWidth={6} />

              {/* URL & Date */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-slate-100 truncate text-lg">
                  {getDomain(report.url)}
                </p>
                <p className="text-sm text-slate-400 truncate">{report.url}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(report.created_at)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => deleteReport(report.id, e)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Delete Report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 shadow-xs hover:bg-primary/90 transition-colors"
                  disabled={loadingId === report.id}
                >
                  {loadingId === report.id ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      View Report
                    </>
                  )}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

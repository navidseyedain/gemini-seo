import { Copy, Code, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useState } from 'react';

export function SchemaTab({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);

  if (!data) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">No schema data available.</div>;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.recommended_schema_jsonld);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 gap-4">
        <div>
          <h3 className="text-xl font-bold mb-1 dark:text-slate-100">Schema.org Detection</h3>
          <p className="text-slate-500 dark:text-slate-400">We scanned the page for structured data.</p>
        </div>
        <div>
          <span className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-sm
            ${data.has_schema ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
            {data.has_schema ? <CheckCircle2 className="w-5 h-5 mr-2"/> : <XCircle className="w-5 h-5 mr-2"/>}
            {data.has_schema ? "Schema Detected" : "No Schema Found"}
          </span>
        </div>
      </div>

      {/* Detected Types */}
      {data.detected_types && data.detected_types.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <h4 className="font-bold mb-3 dark:text-slate-100">Detected Types</h4>
          <div className="flex flex-wrap gap-2">
            {data.detected_types.map((type: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-100 dark:border-indigo-800 font-mono text-sm">
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Findings */}
      <div>
        <h4 className="font-bold text-lg mb-4 dark:text-slate-100">Validation Findings</h4>
        <div className="space-y-3">
          {data.findings?.map((finding: any, i: number) => (
            <div key={i} className="flex bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="mr-4 mt-1">
                {finding.type === 'error' && <XCircle className="text-red-500 w-5 h-5" />}
                {finding.type === 'warning' && <AlertTriangle className="text-yellow-500 w-5 h-5" />}
                {(finding.type === 'success' || finding.type === 'opportunity') && <CheckCircle2 className="text-emerald-500 w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{finding.message}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1"><strong>Recommendation:</strong> {finding.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended JSON-LD */}
      {data.recommended_schema_jsonld && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg dark:text-slate-100">Recommended JSON-LD Code</h4>
            <button 
              onClick={handleCopy}
              className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-md transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <div className="bg-[#1e1e1e] p-6 rounded-xl overflow-x-auto relative">
            <Code className="absolute top-4 right-4 text-slate-600 w-6 h-6 opacity-50" />
            <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">
              {data.recommended_schema_jsonld}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

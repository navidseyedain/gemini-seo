import { useState } from 'react'
import { Globe, ArrowRight, AlertTriangle, CheckCircle2, ShieldCheck, FileText, MapPin, Code, Menu, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './components/Sidebar'
import { TechnicalTab } from './components/TechnicalTab'
import { SchemaTab } from './components/SchemaTab'
import { EeatTab } from './components/EeatTab'
import { LocalTab } from './components/LocalTab'
import { SettingsTab } from './components/SettingsTab'
import { HistoryTab } from './components/HistoryTab'
import { ReportExport } from './components/ReportExport'
import { AgentProgress } from './components/AgentProgress'
import { ScoreRing } from './components/ScoreRing'
import { PerformanceTab } from './components/PerformanceTab'
import { ContentTab } from './components/ContentTab'
import { CompareTab } from './components/CompareTab'
import { SearchConsoleTab } from './components/SearchConsoleTab'
import { FirecrawlTab } from './components/FirecrawlTab'
import { WelcomeGuide } from './components/WelcomeGuide'
import { GeoTab } from './components/GeoTab'
import { CompetitorTab } from './components/CompetitorTab'
import { AccessibilityTab } from './components/AccessibilityTab'
import { BacklinkTab } from './components/BacklinkTab'

interface AgentStatus {
  agent: string;
  status: 'pending' | 'running' | 'done' | 'error';
  message?: string;
}

export default function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [compareReports, setCompareReports] = useState<any[] | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    // Check for API Keys
    const savedKeysStr = localStorage.getItem('gemini_seo_keys');
    let geminiKey = '';
    let googleKey = '';
    let searchConsoleJson = '';
    let firecrawlKey = '';
    let openpagerankKey = '';
    if (savedKeysStr) {
      try {
        const keys = JSON.parse(savedKeysStr);
        geminiKey = keys.gemini || '';
        googleKey = keys.googleApi || '';
        searchConsoleJson = keys.searchConsole || '';
        firecrawlKey = keys.firecrawl || '';
        openpagerankKey = keys.openpagerank || '';
      } catch (e) {}
    }

    setLoading(true)
    setError(null)
    setReport(null)
    setActiveTab('dashboard')
    setAgentStatuses({})

    try {
      // Step 1: POST to start audit and get task_id
      const startRes = await fetch('http://localhost:8005/api/audit/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          geminiKey,
          googleApiKey: googleKey,
          searchConsoleJson,
          firecrawlKey,
          openpagerankKey
        })
      });

      if (!startRes.ok) {
        throw new Error('Failed to start audit');
      }
      
      const startData = await startRes.json();
      const taskId = startData.task_id;

      // Step 2: Connect to SSE stream
      const eventSource = new EventSource(`http://localhost:8005/api/audit/stream/${taskId}`);

      eventSource.addEventListener('status', (e) => {
        const data = JSON.parse(e.data);
        setAgentStatuses(prev => ({
          ...prev,
          [data.agent]: { agent: data.agent, status: data.status === 'done' ? 'done' : 'running', message: data.message }
        }));
      });

      eventSource.addEventListener('agent_done', (e: any) => {
        const data = JSON.parse(e.data);
        const hasError = data.data && data.data.error;
        setAgentStatuses(prev => ({
          ...prev,
          [data.agent]: { 
            agent: data.agent, 
            status: hasError ? 'error' : 'done', 
            message: hasError ? data.data.error : 'Complete' 
          }
        }));
      });

      eventSource.addEventListener('agent_error', (e) => {
        const data = JSON.parse(e.data);
        setAgentStatuses(prev => ({
          ...prev,
          [data.agent]: { agent: data.agent, status: 'error', message: data.error }
        }));
      });

      eventSource.addEventListener('complete', (e) => {
        const data = JSON.parse(e.data);
        setReport({ url: data.url, data });
        setLoading(false);
        eventSource.close();
      });

      eventSource.addEventListener('error_event', (e) => {
        const data = JSON.parse(e.data);
        setError(data.message || 'An error occurred');
        setLoading(false);
        eventSource.close();
      });

      eventSource.onerror = () => {
        // EventSource will fire error when the stream ends normally
        // Only set error if we don't have a report
        setTimeout(() => {
          setLoading(prev => {
            if (prev) {
              setError('Connection lost. Please try again.');
              return false;
            }
            return prev;
          });
        }, 2000);
        eventSource.close();
      };
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend. Make sure it is running on port 8005.');
      setLoading(false);
    }
  }

  const handleLoadReport = (reportData: any) => {
    setReport(reportData);
    setActiveTab('dashboard');
    setError(null);
  }

  // Calculate scores if report exists
  const techScore = report?.data?.technical?.score || 0;
  const eeatScores = report?.data?.eeat;
  const eeatScore = eeatScores
    ? Math.round((
        (eeatScores.experience?.score || 0) +
        (eeatScores.expertise?.score || 0) +
        (eeatScores.authoritativeness?.score || 0) +
        (eeatScores.trustworthiness?.score || 0)
      ) / 4)
    : 0;
  const localScore = report?.data?.local?.score || 0;
  const perfScore = report?.data?.performance?.score || 0;
  const contentScore = report?.data?.content?.score || 0;
  
  const geoScore = report?.data?.geo?.score || 0;
  const accessibilityScore = report?.data?.accessibility?.score || 0;
  const backlinkScore = report?.data?.backlink?.score || 0;
  const competitorScore = report?.data?.competitor?.score || 0;
  
  // Calculate average of core AI agents for now (ignoring GSC/Firecrawl for overall score to keep it comparable)
  const coreScores = [techScore, eeatScore, localScore, perfScore, contentScore, geoScore, accessibilityScore, backlinkScore, competitorScore];
  const overallScore = report ? Math.round(coreScores.reduce((a, b) => a + b, 0) / coreScores.length) : 0;
  
  // Check if any core agent failed to return data
  const hasErrors = report && (!report.data.technical || !report.data.schema_report || !report.data.eeat || !report.data.local || !report.data.performance || !report.data.content || !report.data.geo || !report.data.accessibility || !report.data.backlink || !report.data.competitor);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - desktop always visible, mobile slide-in */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 
        transform transition-transform duration-300 lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar currentTab={activeTab} setTab={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg text-primary flex items-center gap-2">🚀 Gemini SEO</span>
          <div className="w-9" /> {/* Spacer */}
        </div>

        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">

          {/* Top Bar with Export when Report is ready */}
          {report && !loading && activeTab !== 'settings' && activeTab !== 'history' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-700 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target URL</span>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 break-all">{report.url}</p>
              </div>
              <ReportExport report={report} />
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <HistoryTab 
              onLoadReport={handleLoadReport} 
              onCompareReports={(reports) => {
                setCompareReports(reports);
                setActiveTab('compare');
              }}
            />
          )}

          {/* Compare Tab */}
          {activeTab === 'compare' && compareReports && (
            <CompareTab 
              reports={compareReports} 
              onBack={() => {
                setCompareReports(null);
                setActiveTab('history');
              }} 
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsTab />
          )}

          {/* Header & Input (Dashboard or when no report) */}
          {(activeTab === 'dashboard' || (!report && !['settings', 'history', 'compare'].includes(activeTab))) && (
            <section className="mb-12 no-print">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">New SEO Audit</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your URL to launch parallel AI agents.</p>

              <form onSubmit={handleAnalyze} className="relative flex items-center w-full">
                <Globe className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all text-base sm:text-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 px-4 sm:px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base"
                >
                  {loading ? 'Running...' : 'Analyze'}
                  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center max-w-2xl border border-red-100 dark:border-red-800">
                  <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Welcome Guide & Features when no report is active */}
              {!report && !loading && (
                <WelcomeGuide onNavigateSettings={() => setActiveTab('settings')} />
              )}
            </section>
          )}

          {/* Loading State with Agent Progress */}
          <AnimatePresence>
            {loading && (
              <AgentProgress agents={agentStatuses} />
            )}
          </AnimatePresence>

          {/* Render Tab Content */}
          {!loading && report && !['settings', 'history', 'compare'].includes(activeTab) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">

              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Summary Header Card with Score Rings */}
                  <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Audit Complete</h2>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Parallel multi-agent scan finished for <strong className="text-slate-900 dark:text-slate-100">{report.url}</strong>.
                    </p>

                    {hasErrors && (
                      <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex gap-3 text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="font-semibold mb-1">Some agents encountered errors</p>
                          <p className="text-sm">Due to rate limits or API errors, some sections could not be analyzed and are showing as 0. Please try again later or check your API key.</p>
                        </div>
                      </div>
                    )}

                    {/* Score Rings Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                      <ScoreRing score={overallScore} size={100} strokeWidth={8} label="Overall" />
                      <ScoreRing score={techScore} size={100} strokeWidth={8} label="Technical" />
                      <ScoreRing score={perfScore} size={100} strokeWidth={8} label="Performance" />
                      <ScoreRing score={contentScore} size={100} strokeWidth={8} label="Content" />
                      <ScoreRing score={eeatScore} size={100} strokeWidth={8} label="E-E-A-T" />
                      
                      <ScoreRing score={localScore} size={100} strokeWidth={8} label="Local" />
                      <ScoreRing score={geoScore} size={100} strokeWidth={8} label="GEO Search" />
                      <ScoreRing score={accessibilityScore} size={100} strokeWidth={8} label="Access." />
                      <ScoreRing score={backlinkScore} size={100} strokeWidth={8} label="Authority" />
                      <ScoreRing score={competitorScore} size={100} strokeWidth={8} label="Competitor" />
                    </div>
                  </div>

                  {/* Navigation Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button onClick={() => setActiveTab('technical')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Code className="w-5 h-5" />
                        </div>
                        <ScoreRing score={techScore} size={40} strokeWidth={4} />
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Technical</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Core HTML & web vitals</span>
                    </button>

                    <button onClick={() => setActiveTab('performance')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Globe className="w-5 h-5" />
                        </div>
                        <ScoreRing score={perfScore} size={40} strokeWidth={4} />
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Performance</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Core Web Vitals & Speed</span>
                    </button>

                    <button onClick={() => setActiveTab('content')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <ScoreRing score={contentScore} size={40} strokeWidth={4} />
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Content</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Quality, SEO & Gaps</span>
                    </button>

                    <button onClick={() => setActiveTab('schema')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Schema.org</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">JSON-LD validation</span>
                    </button>

                    <button onClick={() => setActiveTab('eeat')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <ScoreRing score={eeatScore} size={40} strokeWidth={4} />
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">E-E-A-T</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Quality Rater Score</span>
                    </button>

                    <button onClick={() => setActiveTab('local')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <ScoreRing score={localScore} size={40} strokeWidth={4} />
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Local SEO</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Maps & NAP analysis</span>
                    </button>
                    <button onClick={() => setActiveTab('search_console')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Activity className="w-5 h-5" />
                        </div>
                        {report.data.search_console?.error ? (
                          <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">No Data</span>
                        ) : (
                          <span className="text-xs text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">Connected</span>
                        )}
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Search Console</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Real traffic & clicks</span>
                    </button>

                    <button onClick={() => setActiveTab('firecrawl')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Globe className="w-5 h-5" />
                        </div>
                        {report.data.firecrawl?.error ? (
                          <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">No Data</span>
                        ) : (
                          <span className="text-xs text-indigo-500 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">{report.data.firecrawl?.total_pages_found || 0} Pages</span>
                        )}
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Deep Crawl</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Site-wide structure</span>
                    </button>

                    <button onClick={() => setActiveTab('geo')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Activity className="w-5 h-5" />
                        </div>
                        <ScoreRing score={geoScore} size={40} strokeWidth={4} />
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">GEO Search</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">AI Search Readiness</span>
                    </button>

                    <button onClick={() => setActiveTab('accessibility')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <ScoreRing score={accessibilityScore} size={40} strokeWidth={4} />
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Accessibility</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">WCAG & UX standards</span>
                    </button>

                    <button onClick={() => setActiveTab('backlink')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Globe className="w-5 h-5" />
                        </div>
                        <ScoreRing score={backlinkScore} size={40} strokeWidth={4} />
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Backlinks</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Domain Authority</span>
                    </button>

                    <button onClick={() => setActiveTab('competitor')} className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md text-left transition-all group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Activity className="w-5 h-5" />
                        </div>
                        <ScoreRing score={competitorScore} size={40} strokeWidth={4} />
                      </div>
                      <span className="font-bold block text-lg text-slate-800 dark:text-slate-100">Competitor</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Competitor Gap Analysis</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Technical SEO Analysis</h2>
                  <TechnicalTab data={report.data.technical} />
                </div>
              )}

              {activeTab === 'schema' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Schema & Structured Data</h2>
                  <SchemaTab data={report.data.schema_report} />
                </div>
              )}

              {activeTab === 'eeat' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">E-E-A-T Analysis</h2>
                  <EeatTab data={report.data.eeat} />
                </div>
              )}

              {activeTab === 'local' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Local SEO Analysis</h2>
                  <LocalTab data={report.data.local} />
                </div>
              )}

              {activeTab === 'performance' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Performance (Lighthouse)</h2>
                  <PerformanceTab data={report.data.performance} />
                </div>
              )}

              {activeTab === 'content' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Content Quality & SEO</h2>
                  <ContentTab data={report.data.content} />
                </div>
              )}

              {activeTab === 'search_console' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Google Search Console</h2>
                  <SearchConsoleTab data={report.data.search_console} />
                </div>
              )}

              {activeTab === 'firecrawl' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Deep Crawl Analysis</h2>
                  <FirecrawlTab data={report.data.firecrawl} />
                </div>
              )}

              {activeTab === 'geo' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">GEO (Generative Engine Optimization)</h2>
                  <GeoTab data={report.data.geo} />
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Accessibility & UX</h2>
                  <AccessibilityTab data={report.data.accessibility} />
                </div>
              )}

              {activeTab === 'backlink' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Backlinks & Authority</h2>
                  <BacklinkTab data={report.data.backlink} />
                </div>
              )}

              {activeTab === 'competitor' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Competitor Gap Analysis</h2>
                  <CompetitorTab data={report.data.competitor} />
                </div>
              )}

            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

import React from 'react';
import { Cpu, Zap, ShieldCheck, Code, ArrowRight, Activity, Globe, FileText, MapPin, Layers } from 'lucide-react';

interface WelcomeGuideProps {
  onNavigateSettings: () => void;
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ onNavigateSettings }) => {
  const agentsList = [
    {
      title: 'Technical SEO Agent',
      icon: Code,
      color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      hoverBorder: 'hover:border-blue-500/40',
      desc: 'Audits DOM structure, semantic HTML5 tags, meta viewports, status codes, and SSL security.'
    },
    {
      title: 'Performance Agent',
      icon: Globe,
      color: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      hoverBorder: 'hover:border-orange-500/40',
      desc: 'Measures Core Web Vitals (LCP, CLS, FCP) and PageSpeed Insights for optimal user experience.'
    },
    {
      title: 'Content Quality Agent',
      icon: FileText,
      color: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
      hoverBorder: 'hover:border-pink-500/40',
      desc: 'Analyzes word count, readability levels, keyword density, intent alignment, and content gaps.'
    },
    {
      title: 'Schema.org Generator',
      icon: Code,
      color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      hoverBorder: 'hover:border-purple-500/40',
      desc: 'Validates existing microdata and automatically generates production-ready JSON-LD schemas.'
    },
    {
      title: 'E-E-A-T Quality Rater',
      icon: ShieldCheck,
      color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      hoverBorder: 'hover:border-emerald-500/40',
      desc: 'Rates Experience, Expertise, Authoritativeness, and Trustworthiness using Google guidelines.'
    },
    {
      title: 'Local SEO Agent',
      icon: MapPin,
      color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      hoverBorder: 'hover:border-amber-500/40',
      desc: 'Scans for NAP consistency (Name/Address/Phone), embedded Google Maps, and local search presence.'
    },
    {
      title: 'Search Console Agent',
      icon: Activity,
      color: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      hoverBorder: 'hover:border-red-500/40',
      desc: 'Fetches real organic traffic, click-through rates (CTR), impressions, and live keyword rankings.'
    },
    {
      title: 'Deep Crawl Agent',
      icon: Layers,
      color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      hoverBorder: 'hover:border-indigo-500/40',
      desc: 'Crawls site-wide page trees via Firecrawl to map internal link structures and discover orphans.'
    },
    {
      title: 'GEO / AI Search Agent',
      icon: Zap,
      color: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      hoverBorder: 'hover:border-teal-500/40',
      desc: 'Evaluates site readiness for Generative Engine Optimization and AI overviews like ChatGPT.'
    },
    {
      title: 'Accessibility Agent',
      icon: ShieldCheck,
      color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      hoverBorder: 'hover:border-indigo-500/40',
      desc: 'Checks WCAG compliance, semantic structure, and ARIA roles for inclusive UX design.'
    },
    {
      title: 'Backlink Authority',
      icon: Globe,
      color: 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
      hoverBorder: 'hover:border-sky-500/40',
      desc: 'Uses OpenPageRank to measure global rank, domain authority, and incoming backlink signals.'
    },
    {
      title: 'Competitor Gap',
      icon: Activity,
      color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
      hoverBorder: 'hover:border-rose-500/40',
      desc: 'Automatically finds top competitors via DuckDuckGo and analyzes missing keyword gaps.'
    }
  ];

  return (
    <div className="mt-12 space-y-12 animate-in fade-in duration-500">
      
      {/* How it Works / 3 Steps */}
      <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/30 p-8 rounded-3xl border border-indigo-100/80 dark:border-indigo-900/30 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          How Gemini SEO Multi-Agent Engine Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs relative">
            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-center text-sm mb-4">1</span>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
              Configure API Keys
              <button onClick={onNavigateSettings} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                Settings <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Add your free Google Gemini API key in Settings to power the AI sub-agents.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 font-extrabold flex items-center justify-center text-sm mb-4">2</span>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Enter Target URL</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Type any public website URL above and click Analyze to trigger the orchestrator.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs">
            <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-sm mb-4">3</span>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Parallel AI Audit</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              12 specialized sub-agents analyze Technical, Content, E-E-A-T, Schema & Local signals concurrently.
            </p>
          </div>
        </div>
      </div>

      {/* Agent Feature Grid (12 Agents) */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-500" />
          12 Specialized AI Sub-Agents Included
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agentsList.map((agent, idx) => {
            const IconComponent = agent.icon;
            return (
              <div 
                key={idx} 
                className={`p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/70 ${agent.hoverBorder} transition-all hover:shadow-xs`}
              >
                <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center mb-3`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 text-sm">{agent.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {agent.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Globe, Code, FileText, ShieldCheck, MapPin, Activity } from 'lucide-react';

interface AgentStatus {
  agent: string;
  status: 'pending' | 'running' | 'done' | 'error';
  message?: string;
}

interface AgentProgressProps {
  agents: Record<string, AgentStatus>;
}

const ALL_AGENTS = [
  { id: 'crawler', label: 'Web Crawler', icon: Globe, color: 'text-cyan-500' },
  { id: 'technical', label: 'Technical SEO', icon: Code, color: 'text-blue-500' },
  { id: 'schema_report', label: 'Schema.org', icon: FileText, color: 'text-purple-500' },
  { id: 'eeat', label: 'E-E-A-T', icon: ShieldCheck, color: 'text-emerald-500' },
  { id: 'local', label: 'Local SEO', icon: MapPin, color: 'text-amber-500' },
  { id: 'performance', label: 'Performance', icon: Globe, color: 'text-orange-500' },
  { id: 'content', label: 'Content Quality', icon: FileText, color: 'text-pink-500' },
  { id: 'search_console', label: 'GSC Agent', icon: Activity, color: 'text-red-500' },
  { id: 'firecrawl', label: 'Deep Crawler', icon: Code, color: 'text-indigo-500' },
  { id: 'geo', label: 'GEO Search', icon: Activity, color: 'text-teal-500' },
  { id: 'accessibility', label: 'Accessibility', icon: ShieldCheck, color: 'text-indigo-500' },
  { id: 'backlink', label: 'Backlink Authority', icon: Globe, color: 'text-sky-500' },
  { id: 'competitor', label: 'Competitor Gap', icon: Activity, color: 'text-rose-500' },
];

const agentMeta: Record<string, { label: string; icon: any; color: string }> = Object.fromEntries(
  ALL_AGENTS.map((a) => [a.id, { label: a.label, icon: a.icon, color: a.color }])
);

export function AgentProgress({ agents }: AgentProgressProps) {
  const agentKeys = ALL_AGENTS.map(a => a.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8"
    >
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Analyzing with AI Agents...</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Each agent runs in parallel for maximum speed.</p>

      <div className="space-y-3">
        {agentKeys.map((key, i) => {
          const agent = agents[key] || { agent: key, status: 'pending' };
          const meta = agentMeta[key] || { label: key, icon: Code, color: 'text-slate-500' };
          const Icon = meta.icon;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                agent.status === 'done'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                  : agent.status === 'running'
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : agent.status === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                agent.status === 'done' ? 'bg-emerald-100 dark:bg-emerald-900/40' :
                agent.status === 'running' ? 'bg-blue-100 dark:bg-blue-900/40' :
                'bg-slate-100 dark:bg-slate-700'
              }`}>
                <Icon className={`w-5 h-5 ${
                  agent.status === 'done' ? 'text-emerald-600' :
                  agent.status === 'running' ? 'text-blue-600' :
                  'text-slate-400'
                }`} />
              </div>

              {/* Label */}
              <div className="flex-1">
                <span className={`font-semibold text-sm ${
                  agent.status === 'done' ? 'text-emerald-800 dark:text-emerald-300' :
                  agent.status === 'running' ? 'text-blue-800 dark:text-blue-300' :
                  'text-slate-500 dark:text-slate-400'
                }`}>
                  {meta.label}
                </span>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2">
                {agent.status === 'done' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                )}
                {agent.status === 'running' && (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
                {agent.status === 'error' && (
                  <span className="text-xs text-red-600 font-medium">Failed</span>
                )}
                {agent.status === 'pending' && (
                  <span className="text-xs text-slate-400">Waiting...</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

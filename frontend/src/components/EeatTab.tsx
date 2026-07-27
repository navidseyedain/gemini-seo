import { ShieldCheck, UserCheck, Award, Lock, ShieldAlert } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ScoreRing } from './ScoreRing';

export function EeatTab({ data }: { data: any }) {
  if (!data) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">No E-E-A-T data available.</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />;
      case 'medium': return <ShieldAlert className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />;
      case 'critical': return <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />;
      default: return null;
    }
  };

  const signals = [
    { key: 'experience', label: 'Experience', icon: UserCheck, desc: 'First-hand experience, original photos, personal anecdotes.' },
    { key: 'expertise', label: 'Expertise', icon: Award, desc: 'Author credentials, deep topical coverage.' },
    { key: 'authoritativeness', label: 'Authority', icon: ShieldCheck, desc: 'Mentions of brand, citations.' },
    { key: 'trustworthiness', label: 'Trust', icon: Lock, desc: 'Contact info, privacy policies, secure terms.' },
  ];

  // Build radar chart data
  const radarData = signals.map(({ key, label }) => ({
    dimension: label,
    score: data[key]?.score || 0,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6">
      <p className="text-slate-600 dark:text-slate-400 mb-6">Google rates content based on E-E-A-T. Here is how your page performs across these 4 pillars:</p>

      {/* Radar Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">E-E-A-T Overview</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
            {signals.map(({ key, label }) => (
              <ScoreRing
                key={key}
                score={data[key]?.score || 0}
                size={80}
                strokeWidth={7}
                label={label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Signal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {signals.map(({ key, label, icon: Icon, desc }) => {
          const signalData = data[key];
          if (!signalData) return null;

          return (
            <div key={key} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg mr-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold dark:text-slate-100">{label}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold border flex items-center capitalize ${getStatusColor(signalData.status)}`}>
                  {getStatusIcon(signalData.status)}
                  {signalData.status}
                </span>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{desc}</p>
              
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-slate-800 dark:text-slate-200 text-sm">{signalData.description}</p>
              </div>

              <div className="mt-4 bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider block mb-1">Recommendation</span>
                <p className="text-sm text-indigo-900 dark:text-indigo-200">{signalData.recommendation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

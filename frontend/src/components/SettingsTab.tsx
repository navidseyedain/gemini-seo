import React, { useState, useEffect } from 'react';
import { Key, Save, Database, Globe, Sparkles } from 'lucide-react';

export function SettingsTab() {
  const [keys, setKeys] = useState({
    gemini: '',
    googleApi: '',
    searchConsole: '',
    firecrawl: '',
    dataForSeo: '',
    openpagerank: ''
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedKeys = localStorage.getItem('gemini_seo_keys');
    if (savedKeys) {
      try {
        setKeys(JSON.parse(savedKeys));
      } catch (e) {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gemini_seo_keys', JSON.stringify(keys));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl mr-4">
            <Key className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">API Credentials</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Configure third-party services to unlock deep crawling and live ranking data.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-orange-500" /> Google Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={keys.gemini}
              onChange={e => setKeys({...keys, gemini: e.target.value})}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Required for all core agent analysis.{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center">
                Get API Key →
              </a>
            </p>
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" /> Google PageSpeed API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={keys.googleApi}
              onChange={e => setKeys({...keys, googleApi: e.target.value})}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Required for Performance (Lighthouse) analysis.{' '}
              <a href="https://developers.google.com/speed/docs/insights/v5/get-started" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
                Get API Key →
              </a>
            </p>
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center">
              <Database className="w-5 h-5 mr-2 text-emerald-600" /> Google Search Console (OAuth JSON)
            </label>
            <textarea
              placeholder='{"client_id": "...", "client_secret": "..."}'
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm h-24"
              value={keys.searchConsole}
              onChange={e => setKeys({...keys, searchConsole: e.target.value})}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Allows the app to fetch your actual clicks and impressions.{' '}
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center">
                Open Search Console →
              </a>
            </p>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-orange-500" /> Firecrawl API Key
            </label>
            <input
              type="password"
              placeholder="fc-..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={keys.firecrawl}
              onChange={e => setKeys({...keys, firecrawl: e.target.value})}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Required for multi-page semantic clustering and deep technical crawls.{' '}
              <a href="https://www.firecrawl.dev/" target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center">
                Get API Key →
              </a>
            </p>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-sky-500" /> OpenPageRank API Key
            </label>
            <input
              type="password"
              placeholder="opr-..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={keys.openpagerank || ''}
              onChange={e => setKeys({...keys, openpagerank: e.target.value})}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Required for Backlink and Domain Authority analysis.{' '}
              <a href="https://www.domcop.com/openpagerank/what-is-openpagerank" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center">
                Get Free API Key →
              </a>
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            {saved ? (
              <span className="text-emerald-600 font-medium flex items-center">
                <Save className="w-5 h-5 mr-2" /> Settings Saved!
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 text-sm">Keys are stored locally in your browser.</span>
            )}
            
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center transition-colors shadow-sm"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Configuration
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

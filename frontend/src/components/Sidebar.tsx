import { useState, useEffect } from "react";
import { Activity, Code, MapPin, Settings, LayoutDashboard, ShieldCheck, Clock, Sun, Moon, Globe, FileText } from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export function Sidebar({ currentTab, setTab }: SidebarProps) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_seo_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gemini_seo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gemini_seo_theme', 'light');
    }
  }, [dark]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "history", label: "History", icon: Clock },
    { id: "technical", label: "Technical SEO", icon: Activity },
    { id: "performance", label: "Performance", icon: Globe },
    { id: "content", label: "Content", icon: FileText },
    { id: "schema", label: "Schema.org", icon: Code },
    { id: "eeat", label: "E-E-A-T", icon: ShieldCheck },
    { id: "local", label: "Local SEO", icon: MapPin },
    { id: "geo", label: "GEO Search", icon: Activity },
    { id: "accessibility", label: "Accessibility", icon: ShieldCheck },
    { id: "backlink", label: "Backlinks", icon: Globe },
    { id: "competitor", label: "Competitor Gap", icon: Activity },
    { id: "search_console", label: "Search Console", icon: Activity },
    { id: "firecrawl", label: "Deep Crawl", icon: Globe },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-border bg-card h-screen flex flex-col p-4 space-y-2 shrink-0">
      <div className="font-bold text-xl mb-6 text-primary flex items-center gap-2">
        <span>🚀</span> Gemini SEO
      </div>
      
      <nav className="flex-1 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        {dark ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="text-xs text-muted-foreground pt-4 border-t border-border">
        v3.0 Multi-Agent Edition
      </div>
    </div>
  );
}

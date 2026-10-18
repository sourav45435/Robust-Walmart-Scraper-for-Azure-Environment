import React from 'react';
import { Terminal, Database, FileText, CheckCircle2, Cloud, Code } from 'lucide-react';

export type TabId = 'console' | 'explorer' | 'audit' | 'validator' | 'azure' | 'code';

interface NavigationTabsProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  recordCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  recordCount,
}) => {
  const tabs = [
    {
      id: 'console' as TabId,
      label: 'Scraper Console',
      sublabel: 'Live Runner & Checkpoints',
      icon: Terminal,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'explorer' as TabId,
      label: 'Dataset Explorer',
      sublabel: '22-Field Verified Catalog',
      icon: Database,
      badge: `${recordCount}`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'audit' as TabId,
      label: 'Contest Audit',
      sublabel: 'Questions 1–11 Answers',
      icon: FileText,
      badge: '11/11 Passed',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'validator' as TabId,
      label: 'Acceptance Suite',
      sublabel: '11 Quality Assurance Gates',
      icon: CheckCircle2,
      badge: '100% Pass',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'azure' as TabId,
      label: 'Azure Architecture',
      sublabel: 'Container App & Cost Model',
      icon: Cloud,
      badge: '$28.40/mo',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'code' as TabId,
      label: 'Source Code',
      sublabel: 'Python, Docker, Terraform',
      icon: Code,
      badge: '8 Files',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
  ];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto scrollbar-none py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-left transition whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${tab.badgeColor}`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:block">{tab.sublabel}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

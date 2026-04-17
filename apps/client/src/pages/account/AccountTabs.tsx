import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AccountTabsProps {
  tabs: readonly Tab[];
  activeTab: string;
  onTabChange: (id: any) => void;
}

const AccountTabs = ({ tabs, activeTab, onTabChange }: AccountTabsProps) => {
  return (
    <div className="flex w-full overflow-x-auto rounded-full border border-white/60 bg-white/40 p-1.5 shadow-sm backdrop-blur-md hide-scrollbar md:w-fit md:min-w-[420px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex min-w-[max-content] flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-xs md:text-sm font-bold transition-all duration-300 ${isActive ? 'text-white' : 'text-muted hover:text-ink'
              }`}
          >
            {isActive && (
              <motion.div
                layoutId="account-active-tab"
                className="absolute inset-0 bg-primary shadow-sm rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AccountTabs;

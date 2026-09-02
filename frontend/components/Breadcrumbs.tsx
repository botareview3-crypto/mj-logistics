import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../lib/AppContext';

export interface BreadcrumbItem { label: string; path?: string; }

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[]; className?: string }> = ({ items, className = '' }) => {
  const { navigate } = useApp();
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-slate-500 py-2.5 overflow-x-auto whitespace-nowrap ${className}`}>
      <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1 hover:text-[#0077C7] transition-colors cursor-pointer text-slate-600 font-medium">
        <Home className="w-3.5 h-3.5" /><span>Home</span>
      </button>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 shrink-0" />
            {isLast || !item.path
              ? <span className="font-semibold text-slate-900 truncate max-w-[240px]">{item.label}</span>
              : <button type="button" onClick={() => navigate(item.path!)} className="hover:text-[#0077C7] transition-colors cursor-pointer truncate max-w-[200px]">{item.label}</button>
            }
          </React.Fragment>
        );
      })}
    </nav>
  );
};

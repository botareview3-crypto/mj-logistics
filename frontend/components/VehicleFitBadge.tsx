import React from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Part } from '../lib/types';

interface VehicleFitBadgeProps {
  part: Part;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VehicleFitBadge: React.FC<VehicleFitBadgeProps> = ({ part, size = 'md', className = '' }) => {
  const { activeVehicle, isPartCompatibleWithActiveVehicle, openSelectorModal } = useApp();
  const fits = isPartCompatibleWithActiveVehicle(part);
  const vehicleLabel = activeVehicle ? `${activeVehicle.make} ${activeVehicle.model} ${activeVehicle.engine.split(' ')[0]}` : '';

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm font-semibold' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  if (activeVehicle && fits === true) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-xs ${sizeClass} ${className}`}>
        <CheckCircle2 className={`${iconSize} text-emerald-600 shrink-0`} />
        <span className="truncate"><strong className="font-semibold text-emerald-900">Fits your vehicle:</strong> <span className="text-emerald-700">{vehicleLabel}</span></span>
      </div>
    );
  }

  if (activeVehicle && fits === false) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-50 text-rose-800 border border-rose-200 shadow-xs ${sizeClass} ${className}`}>
        <XCircle className={`${iconSize} text-rose-600 shrink-0`} />
        <span className="truncate"><strong className="font-semibold text-rose-900">Doesn&apos;t fit:</strong> <span className="text-rose-700">{vehicleLabel}</span></span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); openSelectorModal('vin'); }}
      className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 transition-colors cursor-pointer text-left ${sizeClass} ${className}`}
    >
      <HelpCircle className={`${iconSize} text-slate-500 shrink-0`} />
      <span className="truncate">Select vehicle to check fit</span>
    </button>
  );
};

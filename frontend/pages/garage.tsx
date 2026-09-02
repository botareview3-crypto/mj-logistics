import React, { useState } from 'react';
import { Car, Plus, Trash2, CheckCircle2, Edit2, Disc, Flame, Zap, Gauge, Sliders, ArrowRight } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Vehicle } from '../lib/types';

export default function MyGaragePage() {
  const { savedVehicles, activeVehicle, setActiveVehicle, removeSavedVehicle, updateSavedVehicleNickname, openSelectorModal, navigate, showToast } = useApp();
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [nicknameInput, setNicknameInput] = useState('');

  const handleStartEdit = (v: Vehicle) => { setEditingVehicleId(v.id); setNicknameInput(v.nickname || `${v.make} ${v.model}`); };
  const handleSaveNickname = (id: string) => { updateSavedVehicleNickname(id, nicknameInput); setEditingVehicleId(null); showToast('Vehicle nickname updated', 'info'); };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'My Garage' }]} />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0077C7] text-xs font-bold uppercase tracking-wider"><Car className="w-3.5 h-3.5" /><span>Multi-Vehicle Management</span></div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Garage ({savedVehicles.length})</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">Save family cars or workshop fleet vehicles. Set one as active to filter the catalogue for compatible spare parts.</p>
        </div>
        <button type="button" onClick={() => openSelectorModal('vin')} className="px-5 py-2.5 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer shrink-0">
          <Plus className="w-4 h-4" /><span>Add New Vehicle</span>
        </button>
      </div>

      {savedVehicles.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedVehicles.map(vehicle => {
            const isActive = activeVehicle?.id === vehicle.id;
            return (
              <div key={vehicle.id} className={`rounded-2xl border transition-all p-5 sm:p-6 flex flex-col justify-between space-y-5 bg-white ${isActive ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-xs'}`}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-200'}`}><Car className="w-6 h-6" /></div>
                      <div className="space-y-1">
                        {editingVehicleId === vehicle.id ? (
                          <div className="flex items-center gap-2">
                            <input type="text" value={nicknameInput} onChange={e => setNicknameInput(e.target.value)} className="px-2 py-1 text-sm font-bold border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0077C7]" autoFocus />
                            <button type="button" onClick={() => handleSaveNickname(vehicle.id)} className="px-2 py-1 bg-[#0077C7] text-white text-xs font-bold rounded-md cursor-pointer">Save</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900 leading-tight">{vehicle.nickname || `${vehicle.make} ${vehicle.model}`}</h2>
                            <button type="button" onClick={() => handleStartEdit(vehicle)} className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                          </div>
                        )}
                        <div className="text-xs text-slate-500 font-semibold">{vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.generation}</div>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs rounded-full"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /><span>Active Vehicle</span></span>
                    ) : (
                      <button type="button" onClick={() => { setActiveVehicle(vehicle); showToast(`Active vehicle set to ${vehicle.make} ${vehicle.model}`, 'success'); }} className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition-colors cursor-pointer">Set as Active</button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
                    <div><span className="text-slate-400 block font-medium">Engine</span><span className="font-bold text-slate-800 truncate block">{vehicle.engine}</span></div>
                    <div><span className="text-slate-400 block font-medium">Power / Fuel</span><span className="font-bold text-slate-800">{vehicle.powerHp ? `${vehicle.powerHp} HP • ` : ''}{vehicle.fuelType}</span></div>
                    <div><span className="text-slate-400 block font-medium">Engine Code</span><span className="font-mono font-bold text-slate-800">{vehicle.engineCode || 'OE OEM'}</span></div>
                    <div><span className="text-slate-400 block font-medium">Reg Plate / VIN</span><span className="font-mono font-bold text-slate-900 truncate block">{vehicle.regNumber || vehicle.vin?.slice(0, 10) || 'Verified'}</span></div>
                  </div>
                </div>

                {/* Quick links */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Quick Maintenance Short-Cuts:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {[
                      { icon: Disc, color: 'text-[#0077C7]', label: 'Brake Pads', path: '/catalog/braking-system/brake-pads' },
                      { icon: Disc, color: 'text-[#0077C7]', label: 'Brake Discs', path: '/catalog/braking-system/brake-discs' },
                      { icon: Gauge, color: 'text-amber-600', label: 'Oil Filters', path: '/catalog/engine-transmission/oil-filters' },
                      { icon: Flame, color: 'text-rose-600', label: 'Spark Plugs', path: '/catalog/engine-transmission/spark-glow-plugs' },
                      { icon: Sliders, color: 'text-purple-600', label: 'Shock Absorbers', path: '/catalog/suspension-steering/shock-absorbers' },
                      { icon: Zap, color: 'text-amber-500', label: 'Batteries', path: '/catalog/electrical-lighting/car-batteries' },
                    ].map(({ icon: Icon, color, label, path }) => (
                      <button key={label} type="button" onClick={() => { setActiveVehicle(vehicle); navigate(path); }} className="p-2 text-xs bg-slate-50 hover:bg-sky-50 hover:text-[#0077C7] hover:border-sky-200 border border-slate-200 rounded-lg text-slate-700 font-semibold flex items-center justify-between transition-colors cursor-pointer text-left">
                        <span className="flex items-center gap-1.5 truncate"><Icon className={`w-3.5 h-3.5 ${color} shrink-0`} /><span className="truncate">{label}</span></span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => { if (window.confirm(`Remove ${vehicle.make} ${vehicle.model} from My Garage?`)) { removeSavedVehicle(vehicle.id); showToast('Vehicle removed from garage', 'info'); } }} className="text-xs text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"><Trash2 className="w-3.5 h-3.5" /><span>Delete vehicle</span></button>
                  <button type="button" onClick={() => { setActiveVehicle(vehicle); navigate('/catalog'); }} className="text-xs font-bold text-[#0077C7] hover:text-[#0060A1] flex items-center gap-1 cursor-pointer"><span>Browse All Compatible Parts</span><ArrowRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-5 shadow-xs max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#0077C7] flex items-center justify-center mx-auto shadow-xs"><Car className="w-8 h-8" /></div>
          <div className="space-y-1"><h2 className="text-xl font-bold text-slate-900">Your Garage is Empty</h2><p className="text-xs sm:text-sm text-slate-500">Add your vehicle by registration number or make and model to check compatibility across the catalogue.</p></div>
          <button type="button" onClick={() => openSelectorModal('vin')} className="px-6 py-3 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-sm rounded-lg shadow-sm cursor-pointer inline-flex items-center gap-2"><Plus className="w-4 h-4" /><span>Add a vehicle</span></button>
        </div>
      )}
    </div>
  );
}


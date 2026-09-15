import React, { useState } from 'react';
import {
  Car, Plus, Trash2, CheckCircle2, Edit2,
  Disc, Flame, Zap, Gauge, Sliders, ArrowRight,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Vehicle } from '../lib/types';

const QUICK_LINKS = [
  { icon: Disc,    color: 'text-[#1e4d8c]', label: 'Brake Pads',     path: '/catalog/braking-system/brake-pads' },
  { icon: Disc,    color: 'text-[#1e4d8c]', label: 'Brake Discs',    path: '/catalog/braking-system/brake-discs' },
  { icon: Gauge,   color: 'text-amber-600',  label: 'Oil Filters',    path: '/catalog/engine-transmission/oil-filters' },
  { icon: Flame,   color: 'text-rose-500',   label: 'Spark Plugs',    path: '/catalog/engine-transmission/spark-glow-plugs' },
  { icon: Sliders, color: 'text-purple-500', label: 'Shock Absorbers',path: '/catalog/suspension-steering/shock-absorbers' },
  { icon: Zap,     color: 'text-amber-500',  label: 'Batteries',      path: '/catalog/electrical-lighting/car-batteries' },
];

export default function GaragePage() {
  const {
    savedVehicles, activeVehicle, setActiveVehicle,
    removeSavedVehicle, updateSavedVehicleNickname,
    openSelectorModal, navigate, showToast,
  } = useApp();

  const [editingId,      setEditingId]      = useState<string | null>(null);
  const [nicknameInput,  setNicknameInput]  = useState('');

  const startEdit  = (v: Vehicle) => { setEditingId(v.id); setNicknameInput(v.nickname || `${v.make} ${v.model}`); };
  const saveNick   = (id: string) => { updateSavedVehicleNickname(id, nicknameInput); setEditingId(null); showToast('Nickname saved', 'info'); };

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'My Garage' }]} />

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1f3c]/8 text-[#1e4d8c] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Car className="w-3.5 h-3.5" /> Multi-vehicle management
          </div>
          <h1 className="font-display text-3xl font-bold text-[#0d1f3c]">
            My Garage
            <span className="ml-2 text-xl font-normal text-slate-400">({savedVehicles.length})</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-lg leading-relaxed">
            Save your vehicles, set one as active, and every product page will confirm fitment automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openSelectorModal('vin')}
          className="flex items-center gap-2 px-5 py-3 bg-[#0d1f3c] hover:bg-[#1a3560] text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {savedVehicles.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {savedVehicles.map(vehicle => {
            const isActive = activeVehicle?.id === vehicle.id;

            return (
              <div
                key={vehicle.id}
                className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 flex flex-col gap-5 ${
                  isActive
                    ? 'border-emerald-400 ring-2 ring-emerald-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Vehicle header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      {editingId === vehicle.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={nicknameInput}
                            onChange={e => setNicknameInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveNick(vehicle.id)}
                            className="px-2 py-1.5 text-sm font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e4d8c] w-36"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => saveNick(vehicle.id)}
                            className="px-3 py-1.5 bg-[#0d1f3c] text-white text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h2 className="font-display text-[18px] font-bold text-[#0d1f3c] leading-tight">
                            {vehicle.nickname || `${vehicle.make} ${vehicle.model}`}
                          </h2>
                          <button
                            type="button"
                            onClick={() => startEdit(vehicle)}
                            className="text-slate-300 hover:text-slate-600 cursor-pointer p-0.5 transition-colors"
                            aria-label="Edit nickname"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {vehicle.year} {vehicle.make} {vehicle.model} · {vehicle.generation}
                      </p>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded-full shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setActiveVehicle(vehicle); showToast(`Active vehicle: ${vehicle.make} ${vehicle.model}`, 'success'); }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-200 transition-all cursor-pointer shrink-0"
                    >
                      Set Active
                    </button>
                  )}
                </div>

                {/* Specs grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                  {[
                    { label: 'Engine',      value: vehicle.engine },
                    { label: 'Fuel / Power',value: `${vehicle.fuelType}${vehicle.powerHp ? ` · ${vehicle.powerHp}hp` : ''}` },
                    { label: 'Engine Code', value: vehicle.engineCode || 'OEM' },
                    { label: 'Plate / VIN', value: vehicle.regNumber || vehicle.vin?.slice(0, 10) || 'Verified' },
                  ].map(spec => (
                    <div key={spec.label}>
                      <p className="text-slate-400 font-medium mb-0.5">{spec.label}</p>
                      <p className="font-bold text-[#0d1f3c] truncate font-mono text-[11px]">{spec.value}</p>
                    </div>
                  ))}
                </div>

                {/* Quick links */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Quick maintenance</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {QUICK_LINKS.map(({ icon: Icon, color, label, path }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => { setActiveVehicle(vehicle); navigate(path); }}
                        className="flex items-center justify-between p-2.5 text-[12px] bg-slate-50 hover:bg-[#0d1f3c] hover:text-white border border-slate-200 hover:border-[#0d1f3c] rounded-xl text-slate-700 font-medium transition-all cursor-pointer group"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${color} group-hover:text-white`} />
                          <span className="truncate">{label}</span>
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-white shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { if (window.confirm(`Remove ${vehicle.make} ${vehicle.model}?`)) { removeSavedVehicle(vehicle.id); showToast('Vehicle removed', 'info'); } }}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveVehicle(vehicle); navigate('/catalog'); }}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1e4d8c] hover:text-[#0d1f3c] transition-colors cursor-pointer"
                  >
                    Browse compatible parts <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty state ────────────────────────────────────────────── */
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center space-y-5 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#0d1f3c]">Your Garage is Empty</h2>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Add your vehicle to get fitment-verified parts on every product page.</p>
          </div>
          <button
            type="button"
            onClick={() => openSelectorModal('vin')}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#0d1f3c] hover:bg-[#1a3560] text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add a Vehicle
          </button>
        </div>
      )}
    </div>
  );
}

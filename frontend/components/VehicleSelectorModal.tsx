import React, { useState, useEffect } from 'react';
import { X, Car, Search, CheckCircle2, AlertCircle, Sparkles, ArrowRight, ShieldCheck, History, RotateCcw } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { VEHICLE_MAKES_DATABASE, SAMPLE_VIN_REG_DATABASE, decodeVinOrReg } from '../lib/data/vehicles';
import { Vehicle, VehicleModel, VehicleGeneration, VehicleEngine } from '../lib/types';

export const VehicleSelectorWidget: React.FC<{ isEmbedded?: boolean; className?: string }> = ({ isEmbedded = false, className = '' }) => {
  const { activeVehicle, setActiveVehicle, addSavedVehicle, savedVehicles, selectorInitialTab, closeSelectorModal, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'vin' | 'cascading'>(selectorInitialTab || 'vin');
  const [vinInput, setVinInput] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedCandidate, setDecodedCandidate] = useState<Vehicle | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedGen, setSelectedGen] = useState('');
  const [selectedEngineId, setSelectedEngineId] = useState('');

  useEffect(() => { setActiveTab(selectorInitialTab); }, [selectorInitialTab]);

  const currentMakeObj = VEHICLE_MAKES_DATABASE.find(m => m.name === selectedMake);
  const availableModels: VehicleModel[] = currentMakeObj ? currentMakeObj.models : [];
  const currentModelObj = availableModels.find(m => m.name === selectedModel);
  const availableGenerations: VehicleGeneration[] = currentModelObj ? currentModelObj.generations : [];
  const currentGenObj = availableGenerations.find(g => g.name === selectedGen);
  const availableEngines: VehicleEngine[] = currentGenObj ? currentGenObj.engines : [];
  const currentEngineObj = availableEngines.find(e => e.id === selectedEngineId);

  const handleMakeChange = (make: string) => { setSelectedMake(make); setSelectedModel(''); setSelectedGen(''); setSelectedEngineId(''); };
  const handleModelChange = (model: string) => { setSelectedModel(model); setSelectedGen(''); setSelectedEngineId(''); };
  const handleGenChange = (gen: string) => { setSelectedGen(gen); setSelectedEngineId(''); };

  const handleDecode = (q?: string) => {
    const query = (q !== undefined ? q : vinInput).trim();
    if (!query) { setDecodeError('Please enter a valid Registration plate number or 17-character VIN.'); return; }
    setDecodeError(null); setIsDecoding(true);
    setTimeout(() => {
      setIsDecoding(false);
      try { setDecodedCandidate(decodeVinOrReg(query)); }
      catch { setDecodeError('Could not decode vehicle. Try Make & Model tab.'); }
    }, 450);
  };

  const handleConfirmCandidate = () => {
    if (!decodedCandidate) return;
    addSavedVehicle(decodedCandidate);
    showToast(`Active vehicle set to: ${decodedCandidate.make} ${decodedCandidate.model}`, 'success');
    setDecodedCandidate(null); setVinInput('');
    if (!isEmbedded) closeSelectorModal();
  };

  const handleConfirmCascading = () => {
    if (!selectedMake || !selectedModel || !selectedGen || !currentEngineObj || !currentGenObj) return;
    const newVehicle: Vehicle = {
      id: currentEngineObj.id, make: selectedMake, model: selectedModel, generation: selectedGen,
      yearRange: currentGenObj.yearRange, year: currentGenObj.startYear + 2,
      engine: currentEngineObj.name, engineCode: currentEngineObj.code,
      powerHp: currentEngineObj.powerHp, fuelType: currentEngineObj.fuelType,
      nickname: `${selectedMake} ${selectedModel}`,
    };
    addSavedVehicle(newVehicle);
    showToast(`Active vehicle set to: ${newVehicle.make} ${newVehicle.model} ${currentEngineObj.name}`, 'success');
    if (!isEmbedded) closeSelectorModal();
  };

  const selectClass = "w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0077C7] focus:outline-none font-medium cursor-pointer";
  const disabledSelectClass = "w-full px-3 py-2 bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-300 rounded-lg text-sm";

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden ${className}`}>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {(['vin', 'cascading'] as const).map(tab => (
          <button key={tab} type="button" onClick={() => { setActiveTab(tab); setDecodeError(null); }}
            className={`py-3 px-6 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all cursor-pointer flex-1 flex items-center justify-center gap-2 ${activeTab === tab ? 'border-b-2 border-[#0077C7] text-[#0077C7]' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab === 'vin' ? <><Search className="w-4 h-4 text-[#0077C7]" />By Registration / VIN</> : <><Car className="w-4 h-4 text-[#0077C7]" />By Make & Model</>}
          </button>
        ))}
      </div>

      {/* VIN Tab */}
      {activeTab === 'vin' && (
        <div className="p-4 sm:p-6 space-y-4">
          {!decodedCandidate ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">Enter Vehicle Registration Number or 17-digit VIN:</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="bg-amber-400 text-slate-950 font-mono font-bold text-xs px-1.5 py-0.5 rounded-xs border border-amber-500">GB</span></div>
                    <input id="reg-vin-input" type="text" value={vinInput} onChange={e => { setVinInput(e.target.value.toUpperCase()); setDecodeError(null); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleDecode(); } }} placeholder="e.g. WF18 XKV or WVWZZZAUZHP..." className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm uppercase tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077C7] font-semibold shadow-inner" />
                  </div>
                  <button type="button" disabled={isDecoding || !vinInput.trim()} onClick={() => handleDecode()} className="px-6 py-2.5 sm:py-3 bg-[#0077C7] hover:bg-[#0060A1] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0">
                    {isDecoding ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Decoding...</span></> : <><Search className="w-4 h-4" /><span>Find Parts</span></>}
                  </button>
                </div>
                {decodeError && <div className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium"><AlertCircle className="w-4 h-4 shrink-0" /><span>{decodeError}</span></div>}
              </div>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-500" />Try popular sample registrations:</div>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_VIN_REG_DATABASE.slice(0, 4).map(sample => (
                    <button key={sample.code} type="button" onClick={() => { setVinInput(sample.vehicle.regNumber || sample.code); handleDecode(sample.vehicle.regNumber || sample.code); }} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-100 hover:bg-sky-50 hover:text-[#0077C7] hover:border-sky-300 text-slate-700 font-mono rounded-md border border-slate-200 transition-colors cursor-pointer">
                      <span className="font-bold">{sample.vehicle.regNumber}</span><span className="text-slate-400 font-sans">({sample.vehicle.make} {sample.vehicle.model})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-700"><ShieldCheck className="w-5 h-5" /></div>
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-sky-800">Vehicle Identified • Please Confirm</div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{decodedCandidate.year} {decodedCandidate.make} {decodedCandidate.model}</h3>
                  <p className="text-xs sm:text-sm text-slate-600">{decodedCandidate.generation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/90 p-3 rounded-lg border border-sky-100 text-xs">
                <div><span className="text-slate-400 block font-medium">Engine:</span><span className="font-semibold text-slate-800">{decodedCandidate.engine}</span></div>
                <div><span className="text-slate-400 block font-medium">Fuel:</span><span className="font-semibold text-slate-800">{decodedCandidate.fuelType} ({decodedCandidate.engineCode || 'OE'})</span></div>
                <div><span className="text-slate-400 block font-medium">Plate:</span><span className="font-mono font-bold text-slate-900">{decodedCandidate.regNumber || 'Verified'}</span></div>
                <div><span className="text-slate-400 block font-medium">VIN:</span><span className="font-mono text-slate-600 truncate block">{decodedCandidate.vin || 'WVWZZZ...'}</span></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button type="button" onClick={handleConfirmCandidate} className="flex-1 py-2.5 px-4 bg-[#0077C7] hover:bg-[#0060A1] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /><span>Yes, this is my car — Confirm & Filter Parts</span>
                </button>
                <button type="button" onClick={() => { setDecodedCandidate(null); setDecodeError(null); }} className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                  <RotateCcw className="w-4 h-4 text-slate-500" /><span>Try again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cascading Tab */}
      {activeTab === 'cascading' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">1. Select Make <span className="text-rose-500">*</span></label><select value={selectedMake} onChange={e => handleMakeChange(e.target.value)} className={selectClass}><option value="">-- Choose Make --</option>{VEHICLE_MAKES_DATABASE.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}</select></div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">2. Select Model <span className="text-rose-500">*</span></label><select disabled={!selectedMake} value={selectedModel} onChange={e => handleModelChange(e.target.value)} className={selectedMake ? selectClass : disabledSelectClass}><option value="">{selectedMake ? '-- Choose Model --' : 'Select Make first'}</option>{availableModels.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}</select></div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">3. Year / Generation <span className="text-rose-500">*</span></label><select disabled={!selectedModel} value={selectedGen} onChange={e => handleGenChange(e.target.value)} className={selectedModel ? selectClass : disabledSelectClass}><option value="">{selectedModel ? '-- Choose Generation / Year --' : 'Select Model first'}</option>{availableGenerations.map(g => <option key={g.name} value={g.name}>{g.name} ({g.yearRange})</option>)}</select></div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">4. Select Engine <span className="text-rose-500">*</span></label><select disabled={!selectedGen} value={selectedEngineId} onChange={e => setSelectedEngineId(e.target.value)} className={selectedGen ? selectClass : disabledSelectClass}><option value="">{selectedGen ? '-- Choose Engine --' : 'Select Generation first'}</option>{availableEngines.map(e => <option key={e.id} value={e.id}>{e.name} — ({e.fuelType}, code {e.code})</option>)}</select></div>
          </div>
          <div className="pt-2 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">{currentEngineObj ? <span className="text-emerald-700 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Ready to lock in fitment</span> : <span>Complete all 4 dropdowns to filter catalog</span>}</div>
            <button type="button" disabled={!currentEngineObj} onClick={handleConfirmCascading} className="px-6 py-2.5 bg-[#0077C7] hover:bg-[#0060A1] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0">
              <span>Apply Vehicle</span><ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Saved garage strip */}
      {savedVehicles.length > 0 && (
        <div className="bg-slate-50/90 border-t border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium"><History className="w-3.5 h-3.5 text-slate-400" /><span>Saved in My Garage:</span></div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {savedVehicles.map(v => {
              const isActive = activeVehicle?.id === v.id;
              return (
                <button key={v.id} type="button" onClick={() => { setActiveVehicle(v); showToast(`Active vehicle switched to ${v.make} ${v.model}`, 'success'); if (!isEmbedded) closeSelectorModal(); }}
                  className={`px-2 py-0.5 rounded-sm font-semibold border transition-colors cursor-pointer ${isActive ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'}`}>
                  {isActive ? '✓ ' : ''}{v.make} {v.model} ({v.engine.split(' ')[0]})
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const VehicleSelectorModal: React.FC = () => {
  const { isSelectorModalOpen, closeSelectorModal } = useApp();
  if (!isSelectorModalOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" onClick={e => { if (e.target === e.currentTarget) closeSelectorModal(); }}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0077C7] flex items-center justify-center text-white"><Car className="w-5 h-5" /></div>
            <div><h2 className="text-base sm:text-lg font-bold">Select your vehicle</h2><p className="text-xs text-slate-300">Use your vehicle details to check part compatibility</p></div>
          </div>
          <button type="button" onClick={closeSelectorModal} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <VehicleSelectorWidget isEmbedded={false} />
      </div>
    </div>
  );
};

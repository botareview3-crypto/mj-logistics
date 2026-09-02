import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Star, ShieldCheck, Truck, RotateCcw, ShoppingCart, Check, CheckCircle2, XCircle, Copy, Search, Car, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { PARTS_DATABASE, SAMPLE_PART_REVIEWS } from '../../lib/data/parts';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { VehicleFitBadge } from '../../components/VehicleFitBadge';
import { TrustStrip } from '../../components/TrustStrip';
import { ProductCard } from '../../components/ProductCard';

export default function ProductDetailPage() {
  const router = useRouter();
  const partId = router.query.id as string;
  const { activeVehicle, isPartCompatibleWithActiveVehicle, openSelectorModal, addToCart, navigate, showToast } = useApp();

  const part = PARTS_DATABASE.find(p => p.id === partId) || PARTS_DATABASE[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'fitment' | 'oem' | 'reviews'>('specs');
  const [fitmentSearch, setFitmentSearch] = useState('');
  const [copiedOem, setCopiedOem] = useState<string | null>(null);

  const fits = isPartCompatibleWithActiveVehicle(part);
  const relatedParts = PARTS_DATABASE.filter(p => p.id !== part.id && (p.systemId === part.systemId || p.brand === part.brand)).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(part, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleCopyOem = (oem: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(oem);
    }
    setCopiedOem(oem);
    showToast(`Copied OE code "${oem}" to clipboard`, 'info');
    setTimeout(() => setCopiedOem(null), 2000);
  };

  const filteredCompatibility = part.fitsVehicles.filter(cv =>
    cv.make.toLowerCase().includes(fitmentSearch.toLowerCase()) ||
    cv.model.toLowerCase().includes(fitmentSearch.toLowerCase()) ||
    cv.generation.toLowerCase().includes(fitmentSearch.toLowerCase()) ||
    cv.engineNames.some(eng => eng.toLowerCase().includes(fitmentSearch.toLowerCase()))
  );

  const productReviews = part.reviews && part.reviews.length > 0 ? part.reviews : SAMPLE_PART_REVIEWS;

  const tabClass = (tab: string) => `py-3.5 px-6 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === tab ? 'border-[#0077C7] text-[#0077C7] bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'}`;

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[
        { label: 'Catalog', path: '/catalog' },
        { label: part.systemId.replace(/-/g, ' '), path: `/catalog/${part.systemId}` },
        { label: part.subsystemId.replace(/-/g, ' '), path: `/catalog/${part.systemId}/${part.subsystemId}` },
        { label: part.name },
      ]} />

      {/* Main product grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-80 sm:h-96 flex items-center justify-center p-6">
              <img src={part.images[selectedImageIndex] || part.images[0]} alt={part.name} className="max-h-full max-w-full object-contain transition-all duration-200" />
              {part.isBestSeller && <span className="absolute top-3 left-3 bg-amber-500 text-white font-black text-xs uppercase px-2.5 py-1 rounded-md tracking-wider shadow-xs">Best Seller</span>}
              {part.originalPrice && <span className="absolute top-3 right-3 bg-rose-600 text-white font-bold text-xs uppercase px-2 py-0.5 rounded-md shadow-xs">Save ${(part.originalPrice - part.price).toFixed(2)}</span>}
            </div>
            {part.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {part.images.map((img, idx) => (
                  <button key={idx} type="button" onClick={() => setSelectedImageIndex(idx)} className={`w-16 h-16 rounded-lg border-2 p-1 bg-slate-50 shrink-0 transition-all cursor-pointer ${selectedImageIndex === idx ? 'border-[#0077C7] ring-2 ring-sky-100' : 'border-slate-200 hover:border-slate-400'}`}>
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0"><ShieldCheck className="w-4 h-4" /></div>
              <div><strong className="text-slate-900 block font-bold">100% Genuine {part.brand}</strong><span>Direct factory sealed packaging with verification barcode</span></div>
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-900 text-white font-black text-xs rounded-md uppercase tracking-wider">{part.brand}</span>
                  <span className="text-xs text-slate-500 font-mono font-medium">SKU: <strong className="text-slate-800">{part.sku}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="flex text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(part.rating) ? 'fill-amber-400' : 'text-slate-200'}`} />)}</div>
                  <span className="font-bold text-slate-900 ml-1">{part.rating}</span>
                  <span className="text-slate-400">({part.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">{part.name}</h1>
              <div className="flex flex-wrap gap-2 text-xs">
                {part.position && <span className="bg-sky-50 text-[#0077C7] border border-sky-200 px-2.5 py-1 rounded-md font-semibold">Position: {part.position}</span>}
                {part.material && <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md font-semibold">{part.material}</span>}
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">2-Year Warranty</span>
              </div>

              {/* Fitment banner */}
              <div className="pt-2">
                {activeVehicle && fits === true && (
                  <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-xl p-4 flex items-start gap-3.5 shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs"><CheckCircle2 className="w-6 h-6" /></div>
                    <div className="flex-1">
                      <div className="text-xs font-black uppercase tracking-wider text-emerald-800">100% Guaranteed Fitment Verified</div>
                      <h4 className="text-sm sm:text-base font-bold text-emerald-950 mt-0.5">Guaranteed to fit your {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ({activeVehicle.generation})</h4>
                      <p className="text-xs text-emerald-700 mt-0.5">Matched against your active engine specification: <strong>{activeVehicle.engine}</strong></p>
                    </div>
                  </div>
                )}
                {activeVehicle && fits === false && (
                  <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-4 flex items-start gap-3.5 shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs"><XCircle className="w-6 h-6" /></div>
                    <div className="flex-1">
                      <div className="text-xs font-black uppercase tracking-wider text-rose-800">Fitment Incompatible</div>
                      <h4 className="text-sm sm:text-base font-bold text-rose-950 mt-0.5">This part does NOT fit your active {activeVehicle.make} {activeVehicle.model}</h4>
                      <p className="text-xs text-rose-700 mt-0.5">Do not purchase for this vehicle. Check the compatibility table below or switch your vehicle.</p>
                      <button type="button" onClick={() => openSelectorModal('vin')} className="mt-2 text-xs font-bold text-[#0077C7] hover:underline flex items-center gap-1 cursor-pointer"><span>Change active vehicle</span><ArrowRight className="w-3 h-3" /></button>
                    </div>
                  </div>
                )}
                {!activeVehicle && (
                  <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0"><Car className="w-5 h-5" /></div>
                      <div><div className="text-xs font-bold text-slate-800">Confirm this fits your exact vehicle</div><p className="text-xs text-slate-500">Select your vehicle to verify compatibility before ordering.</p></div>
                    </div>
                    <button type="button" onClick={() => openSelectorModal('vin')} className="px-4 py-2 bg-[#0077C7] hover:bg-[#0060A1] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0">Check Fitment</button>
                  </div>
                )}
              </div>

              {/* Price & cart */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Price per unit (incl. VAT)</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">${part.price.toFixed(2)}</span>
                      {part.originalPrice && <span className="text-sm text-slate-400 line-through">${part.originalPrice.toFixed(2)}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>In Stock ({part.stockCount} units)</span></div>
                    <span className="text-[11px] text-slate-500">Dispatched within 24 hours</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shrink-0">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 text-sm font-bold cursor-pointer">-</button>
                    <span className="w-12 text-center text-sm font-bold text-slate-900 font-mono">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(Math.min(part.stockCount, quantity + 1))} className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 text-sm font-bold cursor-pointer">+</button>
                  </div>
                  <button type="button" onClick={handleAddToCart} className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${justAdded ? 'bg-emerald-600 text-white' : 'bg-[#0077C7] hover:bg-[#0060A1] active:bg-[#004B7D] text-white shadow-md'}`}>
                    {justAdded ? <><Check className="w-5 h-5" /><span>Added to Cart!</span></> : <><ShoppingCart className="w-5 h-5" /><span>Add to Cart • ${(part.price * quantity).toFixed(2)}</span></>}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-sky-600 shrink-0" /><span>Next-Day Tracked Delivery</span></div>
                <div className="flex items-center gap-2"><RotateCcw className="w-4 h-4 text-amber-600 shrink-0" /><span>30-Day Easy Returns</span></div>
                <div className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-600 shrink-0" /><span>24-Month Full Warranty</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <button type="button" onClick={() => setActiveTab('specs')} className={tabClass('specs')}>Technical Specifications ({Object.keys(part.specs).length})</button>
          <button type="button" onClick={() => setActiveTab('fitment')} className={tabClass('fitment')}>Vehicle Compatibility ({part.fitsVehicles.length} Models)</button>
          <button type="button" onClick={() => setActiveTab('oem')} className={tabClass('oem')}>OEM Cross-Reference ({part.oemNumbers.length})</button>
          <button type="button" onClick={() => setActiveTab('reviews')} className={tabClass('reviews')}>Customer Reviews ({productReviews.length})</button>
        </div>

        {activeTab === 'specs' && (
          <div className="p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900">Detailed Dimensions & Technical Parameters</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs sm:text-sm text-left">
                <tbody>
                  {Object.entries(part.specs).map(([key, val], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-2.5 px-4 font-bold text-slate-700 w-1/3 border-b border-slate-100">{key}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-900 font-mono border-b border-slate-100">{val}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/60">
                    <td className="py-2.5 px-4 font-bold text-slate-700 w-1/3">Manufacturer Part Number</td>
                    <td className="py-2.5 px-4 font-medium text-slate-900 font-mono">{part.sku}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'fitment' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div><h3 className="text-base font-bold text-slate-900">Full Vehicle Application Guide</h3><p className="text-xs text-slate-500">Filter by make, model, or engine code to verify fitment.</p></div>
              <div className="relative w-full sm:w-64">
                <input type="text" value={fitmentSearch} onChange={e => setFitmentSearch(e.target.value)} placeholder="Filter vehicles or engines..." className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0077C7]" />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
            <div className="space-y-3">
              {filteredCompatibility.map((veh, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-slate-900 text-white font-black text-xs rounded-sm">{veh.make}</span><strong className="text-sm font-bold text-slate-900">{veh.model} ({veh.generation})</strong></div>
                    <span className="text-xs font-mono text-slate-500">Years: {veh.yearRange}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">Compatible Engines:</span>
                    <div className="flex flex-wrap gap-1.5">{veh.engineNames.map((eng, eIdx) => <span key={eIdx} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-medium">{eng}</span>)}</div>
                  </div>
                </div>
              ))}
              {filteredCompatibility.length === 0 && <div className="p-6 text-center text-xs text-slate-500">No vehicles found matching &quot;{fitmentSearch}&quot;.</div>}
            </div>
          </div>
        )}

        {activeTab === 'oem' && (
          <div className="p-6 space-y-4">
            <div><h3 className="text-base font-bold text-slate-900">Original Equipment (OE) Part Numbers</h3><p className="text-xs text-slate-500">Direct cross-reference equivalence numbers from car manufacturers.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {part.oemNumbers.map(oem => (
                <div key={oem} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">OE Manufacturer Code</span><span className="font-mono font-black text-slate-900 text-sm">{oem}</span></div>
                  <button type="button" onClick={() => handleCopyOem(oem)} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">{copiedOem === oem ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div><h3 className="text-base font-bold text-slate-900">Customer Ratings & Workshop Feedback</h3><p className="text-xs text-slate-500">Verified reviews from car owners and independent mechanics.</p></div>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <div className="text-2xl font-black text-slate-900">{part.rating}</div>
                <div><div className="flex text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(part.rating) ? 'fill-amber-400' : 'text-slate-200'}`} />)}</div><span className="text-[11px] text-slate-500">Based on {part.reviewCount} reviews</span></div>
              </div>
            </div>
            <div className="space-y-4 divide-y divide-slate-100">
              {(productReviews as any[]).map(rev => (
                <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{rev.author || rev.userName}</span>
                      {rev.verifiedPurchase && <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 rounded-xs border border-emerald-200">✓ Verified Buyer</span>}
                      {(rev.vehicleOwned || rev.userCar) && <span className="text-xs text-slate-500 hidden sm:inline">• {rev.vehicleOwned || rev.userCar}</span>}
                    </div>
                    <span className="text-xs text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />)}</div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related parts */}
      {relatedParts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /><span>Frequently Bought Together & Complementary Parts</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedParts.map(rel => <ProductCard key={rel.id} part={rel} viewMode="grid" />)}
          </div>
        </section>
      )}

      <TrustStrip />
    </div>
  );
}

export function getStaticPaths() {
  return {
    paths: PARTS_DATABASE.map(part => ({ params: { id: part.id } })),
    fallback: false,
  };
}

export function getStaticProps() {
  return { props: {} };
}

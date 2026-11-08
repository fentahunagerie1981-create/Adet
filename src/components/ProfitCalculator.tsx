import React, { useState } from 'react';
import { CommodityPrice, Language } from '../types';
import { translations } from '../utils/translations';
import { Calculator, TrendingUp, DollarSign, Truck, AlertCircle, ArrowRight } from 'lucide-react';

interface ProfitCalculatorProps {
  prices: CommodityPrice[];
  lang: Language;
  preselectedCommodity?: CommodityPrice | null;
}

interface DestinationPreset {
  id: string;
  nameAm: string;
  nameEn: string;
  distanceKm: number;
  typicalFreightETB: number;
  typicalSellingMarkupPercent: number;
}

const DESTINATIONS: DestinationPreset[] = [
  {
    id: 'addis',
    nameAm: 'አዲስ አበባ (መርካቶ / ቃሊቲ)',
    nameEn: 'Addis Ababa (Merkato / Kality)',
    distanceKm: 470,
    typicalFreightETB: 350,
    typicalSellingMarkupPercent: 16
  },
  {
    id: 'bahirdar',
    nameAm: 'ባህር ዳር (መጋዘን ተራ)',
    nameEn: 'Bahir Dar (Warehouse Row)',
    distanceKm: 45,
    typicalFreightETB: 120,
    typicalSellingMarkupPercent: 8
  },
  {
    id: 'debremarkos',
    nameAm: 'ደብረ ማርቆስ ከተማ',
    nameEn: 'Debre Markos City',
    distanceKm: 175,
    typicalFreightETB: 200,
    typicalSellingMarkupPercent: 11
  },
  {
    id: 'gondar',
    nameAm: 'ጎንደር ከተማ',
    nameEn: 'Gondar City',
    distanceKm: 220,
    typicalFreightETB: 230,
    typicalSellingMarkupPercent: 12
  }
];

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  prices,
  lang,
  preselectedCommodity
}) => {
  const t = translations[lang];

  // Default to first grain or preselected
  const defaultCommodity = preselectedCommodity || prices.find(p => p.id === 'price-teff-magna') || prices[0];

  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(defaultCommodity?.id || '');
  const [quantity, setQuantity] = useState<number>(100); // 100 quintals (standard FSR truck load)
  const [purchasePrice, setPurchasePrice] = useState<number>(defaultCommodity?.currentPrice || 11200);
  const [selectedDestId, setSelectedDestId] = useState<string>('addis');
  const [freightPerQuintal, setFreightPerQuintal] = useState<number>(350);
  const [laborPerQuintal, setLaborPerQuintal] = useState<number>(50); // loading/unloading
  const [brokeragePerQuintal, setBrokeragePerQuintal] = useState<number>(40); // brokerage & bags
  const [sellingPrice, setSellingPrice] = useState<number>(13000);

  const handleCommodityChange = (id: string) => {
    setSelectedCommodityId(id);
    const comm = prices.find(p => p.id === id);
    if (comm) {
      setPurchasePrice(comm.currentPrice);
      const dest = DESTINATIONS.find(d => d.id === selectedDestId);
      const markup = dest ? (dest.typicalSellingMarkupPercent / 100) : 0.15;
      setSellingPrice(Math.round(comm.currentPrice * (1 + markup)));
    }
  };

  const handleDestinationChange = (destId: string) => {
    setSelectedDestId(destId);
    const dest = DESTINATIONS.find(d => d.id === destId);
    if (dest) {
      setFreightPerQuintal(dest.typicalFreightETB);
      const markup = dest.typicalSellingMarkupPercent / 100;
      setSellingPrice(Math.round(purchasePrice * (1 + markup)));
    }
  };

  // Financial Calculations
  const totalPurchaseCost = quantity * purchasePrice;
  const totalFreightCost = quantity * freightPerQuintal;
  const totalLaborCost = quantity * laborPerQuintal;
  const totalBrokerageCost = quantity * brokeragePerQuintal;
  const totalOverhead = totalFreightCost + totalLaborCost + totalBrokerageCost;

  const totalCapitalRequired = totalPurchaseCost + totalOverhead;
  const totalExpectedRevenue = quantity * sellingPrice;
  const netProfit = totalExpectedRevenue - totalCapitalRequired;
  const profitPerQuintal = quantity > 0 ? netProfit / quantity : 0;
  const returnOnInvestmentPercent = totalCapitalRequired > 0 ? (netProfit / totalCapitalRequired) * 100 : 0;
  const breakEvenPricePerQuintal = quantity > 0 ? totalCapitalRequired / quantity : 0;

  return (
    <div className="py-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400 font-medium mb-1">
          <Calculator className="w-3.5 h-3.5" />
          <span>{lang === 'am' ? 'የአዴት እህል ንግድና የሎጂስቲክስ ትርፍ ማስያ' : 'Adet Grain Arbitrage & Transport Analytics'}</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-ethiopic">
          {t.tradeCalculatorTitle}
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-3xl">
          {t.tradeCalculatorDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 shadow-xs">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider pb-2 border-b border-stone-100 dark:border-stone-800">
            {lang === 'am' ? '1. የግዢና የመዳረሻ ዝርዝሮች' : '1. Sourcing & Destination Details'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Commodity Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {t.selectCrop}
              </label>
              <select
                value={selectedCommodityId}
                onChange={(e) => handleCommodityChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-1 focus:ring-amber-700"
              >
                {prices.map((p) => (
                  <option key={p.id} value={p.id}>
                    {lang === 'am' ? p.nameAm : p.nameEn} ({p.currentPrice.toLocaleString()} {t.etb})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {t.destinationCity}
              </label>
              <select
                value={selectedDestId}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-1 focus:ring-amber-700"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {lang === 'am' ? d.nameAm : d.nameEn} (~{d.distanceKm} km)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Purchase Quantity (Quintals) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {t.purchaseQuantity}
              </label>
              <input
                type="number"
                min="1"
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums"
              />
              <span className="text-[11px] text-stone-400 block">
                {quantity === 100 ? (lang === 'am' ? '1 ሙሉ FSR መኪና' : '1 Full FSR Truck') : quantity === 400 ? (lang === 'am' ? '1 ሲኖ ትራክ' : '1 Sino Truck') : ''}
              </span>
            </div>

            {/* Adet Purchase Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {t.adetPurchasePrice}
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums"
              />
            </div>

            {/* Target Selling Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {t.destinationSellingPrice}
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums font-semibold text-emerald-700 dark:text-emerald-400"
              />
            </div>
          </div>

          <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider pt-2 pb-2 border-b border-stone-100 dark:border-stone-800">
            {lang === 'am' ? '2. የጭነትና የሎጂስቲክስ ወጪዎች (ብር/ኩንታል)' : '2. Logistics & Handling (ETB/Quintal)'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-400" />
                <span>{t.freightPerQuintal}</span>
              </label>
              <input
                type="number"
                min="0"
                value={freightPerQuintal}
                onChange={(e) => setFreightPerQuintal(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {t.loadingCost}
              </label>
              <input
                type="number"
                min="0"
                value={laborPerQuintal}
                onChange={(e) => setLaborPerQuintal(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {t.brokerageCost}
              </label>
              <input
                type="number"
                min="0"
                value={brokeragePerQuintal}
                onChange={(e) => setBrokeragePerQuintal(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Results Card (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900 text-white rounded-xl p-6 flex flex-col justify-between shadow-lg space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                {lang === 'am' ? 'የንግዱ ትንበያ ውጤት' : 'Commercial Trade Summary'}
              </span>
              <span className="text-xs text-stone-400">
                {quantity} {t.quintal}
              </span>
            </div>

            {/* Big Net Profit Display */}
            <div>
              <span className="text-xs text-stone-400 block">{t.netProfit}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-3xl sm:text-4xl font-extrabold tabular-nums ${
                    netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {netProfit.toLocaleString()}
                </span>
                <span className="text-sm text-stone-400">{t.etb}</span>
              </div>
            </div>

            {/* Sub-metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-stone-800/80">
                <span className="text-[11px] text-stone-400 block">{t.profitPerQuintal}</span>
                <span className={`text-lg font-bold tabular-nums ${profitPerQuintal >= 0 ? 'text-white' : 'text-rose-400'}`}>
                  {Math.round(profitPerQuintal).toLocaleString()} {t.etb}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-800/80">
                <span className="text-[11px] text-stone-400 block">{t.roi}</span>
                <span className={`text-lg font-bold tabular-nums ${returnOnInvestmentPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {returnOnInvestmentPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Detailed Itemized Breakdown */}
            <div className="pt-3 border-t border-stone-800 space-y-2 text-xs text-stone-300">
              <div className="flex justify-between">
                <span className="text-stone-400">{lang === 'am' ? 'የእህል ግዢ ወጪ (አዴት)' : 'Grain Cost (Adet):'}</span>
                <span className="font-medium tabular-nums">{totalPurchaseCost.toLocaleString()} {t.etb}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">{lang === 'am' ? 'የጭነትና የጉዞ ወጪ' : 'Freight Hauling:'}</span>
                <span className="font-medium tabular-nums">{totalFreightCost.toLocaleString()} {t.etb}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">{lang === 'am' ? 'የጉልበት፣ ከረጢትና ደላላ' : 'Labor, Sacks & Broker:'}</span>
                <span className="font-medium tabular-nums">{(totalLaborCost + totalBrokerageCost).toLocaleString()} {t.etb}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-800 text-stone-100 font-semibold">
                <span>{t.totalInvestment}:</span>
                <span className="tabular-nums text-amber-300">{totalCapitalRequired.toLocaleString()} {t.etb}</span>
              </div>
              <div className="flex justify-between text-stone-100 font-semibold">
                <span>{t.expectedRevenue}:</span>
                <span className="tabular-nums">{totalExpectedRevenue.toLocaleString()} {t.etb}</span>
              </div>
            </div>
          </div>

          {/* Break-even Indicator */}
          <div className="p-3 rounded-lg bg-stone-800/60 border border-stone-700/60 text-xs text-stone-300">
            <span className="font-medium text-amber-300 block">
              {lang === 'am' ? 'የመሸጫ ዝቅተኛ ወሰን (Break-Even): ' : 'Break-Even Threshold: '}
            </span>
            <span className="tabular-nums font-bold text-white">
              {Math.ceil(breakEvenPricePerQuintal).toLocaleString()} {t.etb} / {t.quintal}
            </span>
            <span className="text-stone-400 ml-1">
              {lang === 'am' ? '(ከዚህ በላይ ሲሸጥ ትርፍ ይጀምራል)' : '(Minimum selling price to cover all expenses)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

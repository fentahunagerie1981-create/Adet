import React, { useState } from 'react';
import { CommodityPrice, Category, Language } from '../types';
import { translations } from '../utils/translations';
import { TrendingUp, TrendingDown, Minus, Search, Calculator, Calendar, ArrowRight } from 'lucide-react';

interface LivePricesProps {
  prices: CommodityPrice[];
  lang: Language;
  onSelectCommodityForCalc: (commodity: CommodityPrice) => void;
}

export const LivePrices: React.FC<LivePricesProps> = ({
  prices,
  lang,
  onSelectCommodityForCalc
}) => {
  const t = translations[lang];
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: t.allCategories },
    { id: 'grain', label: t.categoryGrain },
    { id: 'oilseeds_pulses', label: t.categoryOilseeds },
    { id: 'livestock', label: t.categoryLivestock },
    { id: 'dairy_honey', label: t.categoryDairyHoney },
    { id: 'inputs', label: t.categoryInputs },
  ];

  const filteredPrices = prices.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const nameToSearch = `${item.nameAm} ${item.nameEn} ${item.gradeAm} ${item.gradeEn}`.toLowerCase();
    const matchesSearch = !searchQuery || nameToSearch.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8 space-y-6">
      {/* Header & Market Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400 font-medium mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.marketDateNote}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-ethiopic">
            {t.dailyPriceBoard}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {lang === 'am'
              ? 'በአዴት ማዕከላዊ እህልና ከብት ገበያ የተመዘገበ ይፋዊ የመገበያያ ዋጋ'
              : 'Official daily clearing price recorded at Adet Central Trading Floor & Depots'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'am' ? 'ሰብል ይፈልጉ...' : 'Search crop or commodity...'}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-stone-200 dark:border-stone-800">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-amber-800 text-white dark:bg-amber-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Prices Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 dark:bg-stone-950/60 text-stone-600 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider border-b border-stone-200 dark:border-stone-800">
            <tr>
              <th className="py-3.5 px-4">{lang === 'am' ? 'የሸቀጡ / እህሉ ስም' : 'Commodity'}</th>
              <th className="py-3.5 px-3">{t.grade}</th>
              <th className="py-3.5 px-3 text-right">{t.todayPrice}</th>
              <th className="py-3.5 px-3 text-right">{t.change}</th>
              <th className="py-3.5 px-3 text-right hidden sm:table-cell">{t.weeklyRange}</th>
              <th className="py-3.5 px-3 hidden md:table-cell">{t.location}</th>
              <th className="py-3.5 px-4 text-center">{t.calculateProfit}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {filteredPrices.map((item) => {
              const isUp = item.changePercent > 0;
              const isDown = item.changePercent < 0;
              const isNeutral = item.changePercent === 0;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-900 dark:text-stone-100 font-ethiopic">
                      {lang === 'am' ? item.nameAm : item.nameEn}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      {lang === 'am' ? item.nameEn : item.nameAm}
                    </div>
                  </td>

                  {/* Grade */}
                  <td className="py-3 px-3 text-xs text-stone-600 dark:text-stone-300">
                    {lang === 'am' ? item.gradeAm : item.gradeEn}
                  </td>

                  {/* Today's Price */}
                  <td className="py-3 px-3 text-right">
                    <div className="font-bold text-stone-900 dark:text-white tabular-nums text-base">
                      {item.currentPrice.toLocaleString()} {t.etb}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      / {lang === 'am' ? item.unitAm : item.unitEn}
                    </div>
                  </td>

                  {/* 24h Change */}
                  <td className="py-3 px-3 text-right tabular-nums text-xs">
                    <div
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isUp
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isDown
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                      {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                      {isNeutral && <Minus className="w-3 h-3" />}
                      <span>
                        {isUp ? '+' : ''}
                        {item.changePercent}%
                      </span>
                    </div>
                    <div className="text-stone-400 dark:text-stone-500 text-[11px]">
                      {item.previousPrice.toLocaleString()} {t.etb}
                    </div>
                  </td>

                  {/* Weekly Range */}
                  <td className="py-3 px-3 text-right tabular-nums text-xs text-stone-600 dark:text-stone-400 hidden sm:table-cell">
                    <div>{item.weeklyLow.toLocaleString()} - {item.weeklyHigh.toLocaleString()}</div>
                    <div className="text-[11px] text-stone-400">{t.etb}</div>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3 text-xs text-stone-600 dark:text-stone-400 hidden md:table-cell">
                    <div>{lang === 'am' ? item.marketLocationAm : item.marketLocationEn}</div>
                    <div className="text-[11px] text-stone-400">
                      {lang === 'am' ? `${item.volumeQuintalsToday} ኩንታል ዛሬ` : `${item.volumeQuintalsToday} Qtl today`}
                    </div>
                  </td>

                  {/* Action: Open in Calculator */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onSelectCommodityForCalc(item)}
                      title={lang === 'am' ? 'የትርፍ ማስያ ውስጥ አስላ' : 'Calculate trade profit for this crop'}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-300 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 dark:hover:bg-amber-900 rounded-md transition-colors"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">{t.calculateProfit}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredPrices.length === 0 && (
          <div className="p-8 text-center text-stone-500 dark:text-stone-400 text-sm">
            {t.noListingsFound}
          </div>
        )}
      </div>

      {/* Practical trading note for Gojjam grains */}
      <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-bold">{lang === 'am' ? 'የአዴት እህል ነጋዴዎች ማሳሰቢያ፡ ' : 'Adet Trade Note: '}</span>
          <span>
            {lang === 'am'
              ? 'ዋጋዎች በየሳምንቱ ሐሙስ ዋና ገበያ እና በየዕለቱ የጥዋት የደላሎች ቆጠራ መሰረት ይዘመናሉ። ትልቅ መጠን (ከ100 ኩንታል በላይ) ለሚገዙ የዋጋ ድርድር ይኖራል።'
              : 'Prices reflect Thursday central clearing and daily morning warehouse receipts. Volume discounts available for purchases exceeding 100 quintals.'}
          </span>
        </div>
      </div>
    </div>
  );
};

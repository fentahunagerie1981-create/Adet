import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { TrendingUp, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface HeroSectionProps {
  lang: Language;
  onExplore: () => void;
  onViewPrices: () => void;
  onPostListing: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onExplore,
  onViewPrices,
  onPostListing
}) => {
  const t = translations[lang];

  return (
    <div className="relative border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial context */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
              <MapPin className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>{lang === 'am' ? 'አዴት፣ ይልማና ዴንሳ · ምዕራብ ጎጃም፣ ኢትዮጵያ' : 'Adet, Yilmana Densa · West Gojjam, Ethiopia'}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'am' ? 'የገበያ ቀን፡ ሐሙስ' : 'Market Day: Thursday'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 font-ethiopic" style={{ textWrap: 'balance' }}>
              {t.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
              {t.heroSubheading}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onViewPrices}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <span>{t.viewDailyPrices}</span>
                <TrendingUp className="w-4 h-4" />
              </button>

              <button
                onClick={onExplore}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>{t.exploreMarket}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onPostListing}
                className="text-xs text-amber-800 dark:text-amber-400 hover:underline px-2 py-2 font-medium"
              >
                + {t.postListing}
              </button>
            </div>

            {/* Trust points */}
            <div className="flex items-center gap-6 pt-3 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'am' ? 'በህግ የተመዘገቡ ማህበራት' : 'Licensed Cooperatives'}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'am' ? 'ቀጥታ ከአምራች እስከ ሸማች' : 'Direct Farm-to-Buyer Trade'}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'am' ? 'የጭነት መኪኖች ማገናኛ' : 'Direct Hauling Access'}</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800 aspect-[4/3] bg-stone-100 dark:bg-stone-900">
              <img
                src="/src/assets/images/hero_adet_agriculture_1794060957221.jpg"
                alt="Adet Agricultural Landscape"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  {lang === 'am' ? 'የጎጃም የሰብል ጎተራ' : 'Ethiopian Agricultural Granary'}
                </p>
                <h3 className="text-base sm:text-lg font-bold text-white font-ethiopic">
                  {lang === 'am' ? 'አዴት ማዕከላዊ የሰብልና የእህል ግብይት' : 'Adet Central Agricultural & Grain Hub'}
                </h3>
                <p className="text-xs text-stone-200 mt-1 line-clamp-2">
                  {lang === 'am'
                    ? 'ከአዴት ግብርና ምርምር ማዕከል የተገኙ ዝርያዎች፣ ማኛ ጤፍ፣ የቢራ ገብስ፣ ኑግ እና የከብት ገበያ'
                    : 'Premier source of certified teff, malt barley, high-oil niger seeds, and fattened Gojjam cattle'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Tabular Metric Strip */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="px-3 py-2">
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {t.quickStatsTeff}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tabular-nums">
                11,200
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">{t.etb}/{t.quintal}</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              +2.75% {lang === 'am' ? 'ከሳምንቱ ጅማሮ' : 'vs last week'}
            </p>
          </div>

          <div className="px-3 py-2 border-l border-stone-200 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {t.quickStatsVolume}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tabular-nums">
                6,850+
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">{t.quintal}</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {lang === 'am' ? 'በአዴት መጋዘኖች የተመዘገበ' : 'Recorded in Adet silos'}
            </p>
          </div>

          <div className="px-3 py-2 border-l-0 lg:border-l border-stone-200 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {lang === 'am' ? 'የዳቦ ስንዴ / ገብስ' : 'Wheat & Malt Barley'}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tabular-nums">
                5,600 - 6,200
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">{t.etb}</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {lang === 'am' ? 'የቢራና ዱቄት ፋብሪካዎች ደረጃ' : 'Mill & Brewery Grade'}
            </p>
          </div>

          <div className="px-3 py-2 border-l border-stone-200 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {t.quickStatsMerchants}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tabular-nums">
                28+
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">{lang === 'am' ? 'ህብረቶችና ነጋዴዎች' : 'Unions & Traders'}</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
              {lang === 'am' ? 'ህጋዊ ፈቃድ ያላቸው' : 'Licensed in West Gojjam'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

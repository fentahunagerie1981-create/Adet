import React, { useState } from 'react';
import { Merchant, Language } from '../types';
import { translations } from '../utils/translations';
import { ShieldCheck, Phone, MapPin, Building, Star, Search, Award } from 'lucide-react';

interface MerchantDirectoryProps {
  merchants: Merchant[];
  lang: Language;
}

export const MerchantDirectory: React.FC<MerchantDirectoryProps> = ({
  merchants,
  lang
}) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');

  const filtered = merchants.filter(m => {
    const term = `${m.nameAm} ${m.nameEn} ${m.contactPerson} ${m.specializationAm} ${m.specializationEn} ${m.locationAm} ${m.locationEn}`.toLowerCase();
    return !search || term.includes(search.toLowerCase());
  });

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400 font-medium mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>{lang === 'am' ? 'የንግድና ህብረት ሥራ ማህበራት ማውጫ' : 'Verified Trade Entities & Unions'}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-ethiopic">
            {t.merchantDirectoryTitle}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            {t.merchantDirectoryDesc}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'am' ? 'ማህበር ወይም ነጋዴ ይፈልጉ...' : 'Search merchant or union...'}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((merchant) => (
          <div
            key={merchant.id}
            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-ethiopic">
                      {lang === 'am' ? merchant.nameAm : merchant.nameEn}
                    </h3>
                    {merchant.isVerified && (
                      <span title="Verified Trade License">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-amber-800 dark:text-amber-400 font-medium">
                    {lang === 'am' ? merchant.typeAm : merchant.typeEn}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-semibold tabular-nums">{merchant.rating}</span>
                  <span className="text-[11px] text-stone-400">({merchant.reviewCount})</span>
                </div>
              </div>

              {/* Specialization */}
              <div className="text-xs text-stone-600 dark:text-stone-300">
                <span className="text-stone-400 dark:text-stone-500 block mb-0.5">{t.specialization}:</span>
                <span className="font-medium">{lang === 'am' ? merchant.specializationAm : merchant.specializationEn}</span>
              </div>

              {/* Location & Details */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-stone-50 dark:bg-stone-950/60 text-xs text-stone-600 dark:text-stone-300">
                <div>
                  <span className="text-stone-400 block">{t.warehouseCapacity}</span>
                  <span className="font-semibold text-stone-900 dark:text-white tabular-nums">
                    {merchant.warehouseCapacityQuintals.toLocaleString()} {t.quintal}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">{t.yearsActive}</span>
                  <span className="font-semibold text-stone-900 dark:text-white tabular-nums">
                    {merchant.yearsInBusiness} {lang === 'am' ? 'ዓመታት' : 'Years'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{lang === 'am' ? merchant.locationAm : merchant.locationEn}</span>
              </div>
            </div>

            {/* Footer with Call Contact */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-500 dark:text-stone-400 truncate max-w-[200px]">
                {merchant.contactPerson}
              </span>

              <a
                href={`tel:${merchant.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 rounded-md transition-colors whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{merchant.phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

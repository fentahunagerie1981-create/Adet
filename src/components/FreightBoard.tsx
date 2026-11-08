import React, { useState } from 'react';
import { FreightRoute, Language } from '../types';
import { translations } from '../utils/translations';
import { Truck, Phone, Calendar, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface FreightBoardProps {
  routes: FreightRoute[];
  lang: Language;
}

export const FreightBoard: React.FC<FreightBoardProps> = ({
  routes,
  lang
}) => {
  const t = translations[lang];
  const [filterDest, setFilterDest] = useState('all');

  const destinations = ['all', 'Addis Ababa', 'Bahir Dar', 'Debre Markos', 'Gondar'];

  const filteredRoutes = routes.filter(r => {
    if (filterDest === 'all') return true;
    return r.destinationEn.toLowerCase().includes(filterDest.toLowerCase());
  });

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400 font-medium mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>{lang === 'am' ? 'የእህል ማጓጓዣና የጭነት መኪኖች' : 'Adet Grain Logistics & Freight Matching'}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-ethiopic">
            {t.freightBoardTitle}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            {t.freightBoardDesc}
          </p>
        </div>

        {/* Destination Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {destinations.map(dest => (
            <button
              key={dest}
              onClick={() => setFilterDest(dest)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filterDest === dest
                  ? 'bg-amber-800 text-white dark:bg-amber-700'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {dest === 'all' ? (lang === 'am' ? 'ሁሉም መዳረሻዎች' : 'All Routes') : dest}
            </button>
          ))}
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-white font-ethiopic">
                    {lang === 'am' ? route.truckTypeAm : route.truckTypeEn}
                  </span>
                  <span className="text-[11px] font-mono text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                    {route.plateNumber}
                  </span>
                </div>

                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {lang === 'am' ? 'ቦታ አለው' : 'Space Ready'}
                </span>
              </div>

              {/* Route Visual Pathway */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 text-xs">
                <div className="flex-1 truncate">
                  <span className="text-[11px] text-stone-400 block">{t.origin}</span>
                  <span className="font-semibold text-stone-900 dark:text-white truncate block">
                    {lang === 'am' ? route.originAm : route.originEn}
                  </span>
                </div>

                <div className="flex items-center justify-center px-1 text-stone-400">
                  <ArrowRight className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                </div>

                <div className="flex-1 truncate text-right">
                  <span className="text-[11px] text-stone-400 block">{t.destination}</span>
                  <span className="font-semibold text-stone-900 dark:text-white truncate block">
                    {lang === 'am' ? route.destinationAm : route.destinationEn}
                  </span>
                </div>
              </div>

              {/* Capacity and Rate */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 block">{t.loadCapacity}</span>
                  <span className="font-semibold text-stone-900 dark:text-white tabular-nums">
                    {route.capacityQuintals} {t.quintal}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">{t.freightPerQuintal}</span>
                  <span className="font-bold text-amber-800 dark:text-amber-400 tabular-nums">
                    {route.pricePerQuintalETB} {t.etb}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">{t.availableDate}</span>
                  <span className="font-medium text-stone-900 dark:text-white truncate block">
                    {route.availableDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Driver & Direct Contact */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">{t.driver}</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {route.driverName}
                </span>
              </div>

              <a
                href={`tel:${route.driverPhone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-white bg-stone-900 hover:bg-black dark:bg-stone-700 dark:hover:bg-stone-600 rounded-md transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.callDriver}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

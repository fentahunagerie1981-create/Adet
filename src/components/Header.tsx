import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { PlusCircle, Globe, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenPostModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  darkMode,
  setDarkMode,
  onOpenPostModal
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setCurrentTab('marketplace')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-amber-900 dark:text-amber-400 font-ethiopic whitespace-nowrap shrink-0">
              {t.brandName}
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-stone-500 dark:text-stone-400 font-normal">
              · {lang === 'am' ? 'ጎጃም' : 'West Gojjam'}
            </span>
          </button>

          {/* Zone 2: 4-5 concise nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('prices')}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'prices'
                  ? 'border-amber-700 dark:border-amber-400 text-stone-900 dark:text-white font-semibold'
                  : 'border-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.navPrices}
            </button>
            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'marketplace'
                  ? 'border-amber-700 dark:border-amber-400 text-stone-900 dark:text-white font-semibold'
                  : 'border-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.navMarketplace}
            </button>
            <button
              onClick={() => setCurrentTab('calculator')}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'calculator'
                  ? 'border-amber-700 dark:border-amber-400 text-stone-900 dark:text-white font-semibold'
                  : 'border-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.navCalculator}
            </button>
            <button
              onClick={() => setCurrentTab('merchants')}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'merchants'
                  ? 'border-amber-700 dark:border-amber-400 text-stone-900 dark:text-white font-semibold'
                  : 'border-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.navDirectory}
            </button>
            <button
              onClick={() => setCurrentTab('freight')}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'freight'
                  ? 'border-amber-700 dark:border-amber-400 text-stone-900 dark:text-white font-semibold'
                  : 'border-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {t.navFreight}
            </button>
          </nav>

          {/* Zone 3: 1 primary action with utility toggles */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'am' ? 'en' : 'am')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors"
              title={lang === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{lang === 'am' ? 'EN' : 'አማርኛ'}</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.postListing}</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="flex md:hidden items-center justify-between overflow-x-auto py-2.5 gap-4 border-t border-stone-200 dark:border-stone-800 text-xs no-scrollbar">
          <button
            onClick={() => setCurrentTab('prices')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              currentTab === 'prices' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-semibold' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {t.navPrices}
          </button>
          <button
            onClick={() => setCurrentTab('marketplace')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              currentTab === 'marketplace' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-semibold' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {t.navMarketplace}
          </button>
          <button
            onClick={() => setCurrentTab('calculator')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              currentTab === 'calculator' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-semibold' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {t.navCalculator}
          </button>
          <button
            onClick={() => setCurrentTab('merchants')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              currentTab === 'merchants' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-semibold' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {t.navDirectory}
          </button>
          <button
            onClick={() => setCurrentTab('freight')}
            className={`whitespace-nowrap px-2 py-1 rounded ${
              currentTab === 'freight' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-semibold' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {t.navFreight}
          </button>
        </div>
      </div>
    </header>
  );
};

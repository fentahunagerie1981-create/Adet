import React, { useState, useEffect } from 'react';
import { Language, CommodityPrice, TradeListing } from './types';
import { translations } from './utils/translations';
import {
  INITIAL_COMMODITY_PRICES,
  INITIAL_TRADE_LISTINGS,
  INITIAL_MERCHANTS,
  INITIAL_FREIGHT_ROUTES
} from './data/initialData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LivePrices } from './components/LivePrices';
import { Marketplace } from './components/Marketplace';
import { ProfitCalculator } from './components/ProfitCalculator';
import { MerchantDirectory } from './components/MerchantDirectory';
import { FreightBoard } from './components/FreightBoard';
import { PostListingModal } from './components/PostListingModal';
import { TradeInquiryModal } from './components/TradeInquiryModal';
import { MapPin, Phone, Building2, Calendar, ShieldCheck } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('am');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('marketplace');
  const [prices] = useState<CommodityPrice[]>(INITIAL_COMMODITY_PRICES);

  // Initialize trade listings with local storage support
  const [listings, setListings] = useState<TradeListing[]>(() => {
    try {
      const stored = localStorage.getItem('adet_custom_listings');
      if (stored) {
        const custom = JSON.parse(stored);
        return [...custom, ...INITIAL_TRADE_LISTINGS];
      }
    } catch {
      // fallback
    }
    return INITIAL_TRADE_LISTINGS;
  });

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [inquiryListing, setInquiryListing] = useState<TradeListing | null>(null);
  const [calcCommodity, setCalcCommodity] = useState<CommodityPrice | null>(null);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddListing = (newListing: TradeListing) => {
    const updated = [newListing, ...listings];
    setListings(updated);
    try {
      const customOnly = updated.filter(item => item.id.startsWith('listing-') && !INITIAL_TRADE_LISTINGS.find(init => init.id === item.id));
      localStorage.setItem('adet_custom_listings', JSON.stringify(customOnly));
    } catch {
      // fallback
    }
    setCurrentTab('marketplace');
  };

  const handleSelectCommodityForCalc = (comm: CommodityPrice) => {
    setCalcCommodity(comm);
    setCurrentTab('calculator');
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans antialiased transition-colors duration-200">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      {/* Hero Section (Visible on home / marketplace view) */}
      {currentTab === 'marketplace' && (
        <HeroSection
          lang={lang}
          onExplore={() => {
            const el = document.getElementById('market-catalog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onViewPrices={() => setCurrentTab('prices')}
          onPostListing={() => setIsPostModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div id="market-catalog">
          {currentTab === 'prices' && (
            <LivePrices
              prices={prices}
              lang={lang}
              onSelectCommodityForCalc={handleSelectCommodityForCalc}
            />
          )}

          {currentTab === 'marketplace' && (
            <Marketplace
              listings={listings}
              lang={lang}
              onOpenPostModal={() => setIsPostModalOpen(true)}
              onOpenInquiry={(item) => setInquiryListing(item)}
            />
          )}

          {currentTab === 'calculator' && (
            <ProfitCalculator
              prices={prices}
              lang={lang}
              preselectedCommodity={calcCommodity}
            />
          )}

          {currentTab === 'merchants' && (
            <MerchantDirectory
              merchants={INITIAL_MERCHANTS}
              lang={lang}
            />
          )}

          {currentTab === 'freight' && (
            <FreightBoard
              routes={INITIAL_FREIGHT_ROUTES}
              lang={lang}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <PostListingModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        lang={lang}
        onAddListing={handleAddListing}
      />

      <TradeInquiryModal
        listing={inquiryListing}
        isOpen={!!inquiryListing}
        onClose={() => setInquiryListing(null)}
        lang={lang}
      />

      {/* Editorial Regional Footer */}
      <footer className="mt-16 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Regional Context */}
            <div className="space-y-3 md:col-span-1">
              <span className="text-xl font-bold tracking-tight text-amber-900 dark:text-amber-400 font-ethiopic block">
                {t.brandName}
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {lang === 'am'
                  ? 'የምዕራብ ጎጃም፣ ይልማና ዴንሳ ወረዳ ማዕከል የሆነችው አዴት የግብርና ምርቶችና የእህል ንግድ መድረክ።'
                  : 'Agricultural trade portal for Adet town and Yilmana Densa Woreda, West Gojjam, Ethiopia.'}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>{lang === 'am' ? 'አዴት፣ አማራ ክልል፣ ኢትዮጵያ' : 'Adet, Amhara Region, Ethiopia'}</span>
              </div>
            </div>

            {/* Col 2: Market Schedule & Research */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
                {lang === 'am' ? 'የገበያ ቀንና የምርምር ማዕከል' : 'Market Day & Research Center'}
              </h4>
              <p className="text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>{lang === 'am' ? 'ዋና ገበያ፡ ሐሙስ (Adet Thursday Market)' : 'Primary Market Day: Thursday'}</span>
              </p>
              <p className="text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>{lang === 'am' ? 'የአዴት ግብርና ምርምር ማዕከል (AARC)' : 'Adet Agricultural Research Center'}</span>
              </p>
              <p className="text-stone-500 text-[11px] pt-1">
                {lang === 'am'
                  ? 'የቁንጮ ጤፍና የስንዴ ዝርያዎች መገኛ'
                  : 'Breeder hub of Quncho teff and certified wheat'}
              </p>
            </div>

            {/* Col 3: Key Commodity Corridors */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
                {lang === 'am' ? 'ዋና ዋና የንግድ መስመሮች' : 'Major Trade Corridors'}
              </h4>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                <li>Adet ↔ Bahir Dar (45 km)</li>
                <li>Adet ↔ Debre Markos (175 km)</li>
                <li>Adet ↔ Addis Ababa / Merkato (470 km)</li>
                <li>Adet ↔ Gondar (220 km)</li>
              </ul>
            </div>

            {/* Col 4: Platform Guarantee */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
                {lang === 'am' ? 'የንግድ ጥበቃና እውቅና' : 'Trade Trust & Quality'}
              </h4>
              <p className="text-stone-600 dark:text-stone-400 flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'am'
                    ? 'በህጋዊ መንገድ የተመዘገቡ የህብረት ሥራ ዩኒየኖችና የንግድ ፍቃድ ያላቸው ነጋዴዎች ቀጥታ ግንኙነት።'
                    : 'Connecting verified multi-purpose agricultural cooperatives and licensed grain traders.'}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
            <div>
              © 2026 Adet Nigid (አዴት ንግድ). {lang === 'am' ? 'መብቱ በህግ የተጠበቀ ነው።' : 'All rights reserved.'}
            </div>
            <div className="flex items-center gap-4">
              <span>{lang === 'am' ? 'የገበሬዎችና የነጋዴዎች ድልድይ' : 'Empowering Ethiopian Highland Agriculture'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

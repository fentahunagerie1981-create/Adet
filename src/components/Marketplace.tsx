import React, { useState } from 'react';
import { TradeListing, Category, Language } from '../types';
import { translations } from '../utils/translations';
import { Search, Filter, Bookmark, BookmarkCheck, Phone, MessageSquare, ShieldCheck, MapPin, ArrowUpDown, Plus } from 'lucide-react';
import { ListingDetailModal } from './ListingDetailModal';

interface MarketplaceProps {
  listings: TradeListing[];
  lang: Language;
  onOpenPostModal: () => void;
  onOpenInquiry: (listing: TradeListing) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  listings,
  lang,
  onOpenPostModal,
  onOpenInquiry
}) => {
  const t = translations[lang];
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'quantity'>('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('adet_saved_listings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeListing, setActiveListing] = useState<TradeListing | null>(null);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (savedIds.includes(id)) {
      updated = savedIds.filter(item => item !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);
    try {
      localStorage.setItem('adet_saved_listings', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: t.allCategories },
    { id: 'grain', label: t.categoryGrain },
    { id: 'oilseeds_pulses', label: t.categoryOilseeds },
    { id: 'livestock', label: t.categoryLivestock },
    { id: 'dairy_honey', label: t.categoryDairyHoney },
    { id: 'inputs', label: t.categoryInputs },
  ];

  // Filter & Sort
  const filteredListings = listings
    .filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchVerified = !verifiedOnly || item.isVerifiedSeller;
      const searchTerms = `${item.titleAm} ${item.titleEn} ${item.varietyAm} ${item.varietyEn} ${item.sellerName} ${item.locationAm} ${item.locationEn}`.toLowerCase();
      const matchSearch = !searchQuery || searchTerms.includes(searchQuery.toLowerCase());
      return matchCat && matchVerified && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
      if (sortBy === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
      if (sortBy === 'quantity') return b.quantity - a.quantity;
      return 0; // default newest
    });

  return (
    <div className="py-8 space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-ethiopic">
            {lang === 'am' ? 'የአዴት የሸቀጦችና ምርቶች ገበያ' : 'Adet Commodity Marketplace'}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {lang === 'am'
              ? 'በአዴት መጋዘኖችና እርሻዎች የሚገኙ እህሎች፣ የቁም ከብቶችና ግብዓቶች ዝርዝር'
              : 'Direct trade offerings from Adet farmers, unions, and grain merchants'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 dark:text-stone-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="price_asc">{t.sortPriceLow}</option>
              <option value="price_desc">{t.sortPriceHigh}</option>
              <option value="quantity">{t.sortQuantity}</option>
            </select>
          </div>

          {/* Post Listing Trigger */}
          <button
            onClick={onOpenPostModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.postListing}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Verified Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        {/* Category buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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

        {/* Verified Only Checkbox */}
        <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded border-stone-300 text-amber-700 focus:ring-amber-700"
          />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t.verifiedOnly}</span>
        </label>
      </div>

      {/* Products Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => {
          const isSaved = savedIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setActiveListing(item)}
              className="group bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
            >
              {/* Product Visual Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={item.imageUrl}
                  alt={lang === 'am' ? item.titleAm : item.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />

                {/* Bookmark trigger */}
                <button
                  onClick={(e) => toggleSave(item.id, e)}
                  aria-label="Save listing"
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                {item.isNegotiable && (
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 text-[11px] font-medium bg-black/60 backdrop-blur-xs text-white rounded">
                    {t.negotiable}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                    <span className="truncate">{lang === 'am' ? item.varietyAm : item.varietyEn}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-stone-900 dark:text-stone-100 font-ethiopic line-clamp-2 text-base group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                    {lang === 'am' ? item.titleAm : item.titleEn}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 pt-1">
                    <span className="text-xl font-bold text-stone-900 dark:text-white tabular-nums">
                      {item.pricePerUnit.toLocaleString()}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      {t.etb} / {lang === 'am' ? item.unitAm : item.unitEn}
                    </span>
                  </div>
                </div>

                {/* Stock & Location */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span>{t.availableStock}:</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                      {item.quantity.toLocaleString()} {lang === 'am' ? item.unitAm : item.unitEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                    <span className="truncate">{lang === 'am' ? item.locationAm : item.locationEn}</span>
                  </div>

                  {/* Seller & Action strip */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1 truncate text-stone-700 dark:text-stone-300 font-medium">
                      <span className="truncate">{item.sellerName}</span>
                      {item.isVerifiedSeller && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </div>

                    <span className="text-amber-800 dark:text-amber-400 font-semibold group-hover:underline text-[11px] shrink-0">
                      {lang === 'am' ? 'ዝርዝር እይ →' : 'View →'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredListings.length === 0 && (
        <div className="p-12 text-center rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400">
          <p className="text-base font-semibold">{t.noListingsFound}</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setVerifiedOnly(false);
            }}
            className="mt-3 px-4 py-2 text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline"
          >
            {t.clearFilters}
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <ListingDetailModal
        listing={activeListing}
        isOpen={!!activeListing}
        onClose={() => setActiveListing(null)}
        lang={lang}
        onOpenInquiry={(item) => {
          setActiveListing(null);
          onOpenInquiry(item);
        }}
      />
    </div>
  );
};

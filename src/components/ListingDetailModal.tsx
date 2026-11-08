import React, { useState } from 'react';
import { TradeListing, Language } from '../types';
import { translations } from '../utils/translations';
import { X, Phone, MessageSquare, ShieldCheck, MapPin, Package, Calendar, Share2, Check } from 'lucide-react';

interface ListingDetailModalProps {
  listing: TradeListing | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenInquiry: (listing: TradeListing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  lang,
  onOpenInquiry
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  if (!isOpen || !listing) return null;

  const t = translations[lang];

  // Direct WhatsApp message pre-fill
  const cleanPhone = listing.sellerPhone.replace(/[^0-9]/g, '');
  const amharicMsg = encodeURIComponent(
    `ሰላም ${listing.sellerName}፣ በአዴት ንግድ (Adet Nigid) ላይ ያወጡትን "${listing.titleAm}" (${listing.quantity} ${listing.unitAm}) መግዛት እፈልጋለሁ። አሁን ይገኛል?`
  );
  const englishMsg = encodeURIComponent(
    `Hello ${listing.sellerName}, I am contacting you regarding your listing on Adet Nigid: "${listing.titleEn}" (${listing.quantity} ${listing.unitEn}). Is it currently available for purchase?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${lang === 'am' ? amharicMsg : englishMsg}`;

  const copyPhoneToClipboard = () => {
    navigator.clipboard.writeText(listing.sellerPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span>{lang === 'am' ? listing.varietyAm : listing.varietyEn}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.createdAt}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual */}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
            <img
              src={listing.imageUrl}
              alt={lang === 'am' ? listing.titleAm : listing.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {listing.isNegotiable && (
              <span className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded">
                {t.negotiable}
              </span>
            )}
          </div>

          {/* Title & Price Header */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-ethiopic">
              {lang === 'am' ? listing.titleAm : listing.titleEn}
            </h3>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 dark:text-amber-400 tabular-nums">
                {listing.pricePerUnit.toLocaleString()} {t.etb}
              </span>
              <span className="text-sm text-stone-500 dark:text-stone-400">
                / {lang === 'am' ? listing.unitAm : listing.unitEn}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 text-xs">
            <div>
              <span className="text-stone-500 dark:text-stone-400 block">{t.availableStock}</span>
              <span className="font-semibold text-stone-900 dark:text-white text-sm tabular-nums">
                {listing.quantity.toLocaleString()} {lang === 'am' ? listing.unitAm : listing.unitEn}
              </span>
            </div>
            <div>
              <span className="text-stone-500 dark:text-stone-400 block">{t.minOrder}</span>
              <span className="font-semibold text-stone-900 dark:text-white text-sm tabular-nums">
                {listing.minOrderQuantity} {lang === 'am' ? listing.unitAm : listing.unitEn}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-stone-500 dark:text-stone-400 block">{t.location}</span>
              <span className="font-medium text-stone-900 dark:text-white truncate block">
                {lang === 'am' ? listing.locationAm : listing.locationEn}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              {lang === 'am' ? 'የሸቀጡ ዝርዝር መረጃ' : 'Produce Details'}
            </h4>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {lang === 'am' ? listing.descriptionAm : listing.descriptionEn}
            </p>
          </div>

          {/* Seller Profile Card */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-900 dark:text-white">
                    {listing.sellerName}
                  </span>
                  {listing.isVerifiedSeller && (
                    <span title="Verified Trader">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === 'am' ? listing.sellerTypeAm : listing.sellerTypeEn}
                </div>
              </div>

              <button
                onClick={copyPhoneToClipboard}
                className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded transition-colors"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedPhone ? (lang === 'am' ? 'ተቀድቷል' : 'Copied') : listing.sellerPhone}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onOpenInquiry(listing)}
            className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          >
            {t.sendOfferMessage}
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${listing.sellerPhone}`}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600 rounded-lg shadow-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t.callSeller}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.chatWhatsapp}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

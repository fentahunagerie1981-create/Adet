import React, { useState } from 'react';
import { TradeListing, Language } from '../types';
import { translations } from '../utils/translations';
import { X, Send, MessageSquare, PhoneCall, CheckCircle2 } from 'lucide-react';

interface TradeInquiryModalProps {
  listing: TradeListing | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const TradeInquiryModal: React.FC<TradeInquiryModalProps> = ({
  listing,
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen || !listing) return null;
  const t = translations[lang];

  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [quantity, setQuantity] = useState(listing.minOrderQuantity || 10);
  const [offeredPrice, setOfferedPrice] = useState(listing.pricePerUnit);
  const [notes, setNotes] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const cleanPhone = listing.sellerPhone.replace(/[^0-9]/g, '');

  const sendViaWhatsApp = () => {
    const text = encodeURIComponent(
      lang === 'am'
        ? `ሰላም ${listing.sellerName}፣ ስሜ ${buyerName || 'ደንበኛ'} ይባላል (ስልክ፡ ${buyerPhone || 'ያልተገለጸ'})። በአዴት ንግድ ላይ ላወጡት "${listing.titleAm}" ${quantity} ${listing.unitAm} በኩንታል ${offeredPrice} ብር መግዛት እፈልጋለሁ። ${notes ? `ማስታወሻ፡ ${notes}` : ''}`
        : `Hello ${listing.sellerName}, my name is ${buyerName || 'Buyer'} (Phone: ${buyerPhone || 'Not specified'}). Regarding your listing "${listing.titleEn}", I am interested in purchasing ${quantity} ${listing.unitEn} at ${offeredPrice} ETB per unit. ${notes ? `Notes: ${notes}` : ''}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    onClose();
  };

  const sendViaSMS = () => {
    const text = encodeURIComponent(
      lang === 'am'
        ? `ሰላም ${listing.sellerName}፣ በአዴት ንግድ ላይ ላወጡት "${listing.titleAm}" ${quantity} ${listing.unitAm} በኩንታል ${offeredPrice} ብር መግዛት እፈልጋለሁ። ስልክ፡ ${buyerPhone}`
        : `Hello ${listing.sellerName}, offer for "${listing.titleEn}": ${quantity} units at ${offeredPrice} ETB. Contact: ${buyerPhone}`
    );
    window.open(`sms:${listing.sellerPhone}?body=${text}`, '_blank');
    onClose();
  };

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-ethiopic">
              {t.directInquiry}
            </h3>
            <p className="text-xs text-stone-500 truncate max-w-sm">
              {lang === 'am' ? listing.titleAm : listing.titleEn}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-stone-900 dark:text-white font-ethiopic">
              {lang === 'am' ? 'የንግድ ጥያቄዎ ለሻጩ ተልኳል!' : 'Your trade offer has been recorded!'}
            </h4>
            <p className="text-xs text-stone-500">
              {lang === 'am' ? 'ሻጩ በስልክ ወይም በዋትስአፕ በቅርቡ ያነጋግርዎታል።' : 'The seller will contact you shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleLocalSubmit} className="p-5 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.name} *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder={lang === 'am' ? 'የእርስዎ ስም' : 'Your name'}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.phoneNumber} *</label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+2519..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.desiredQuantity} *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.offeredPricePerUnit}</label>
                <input
                  type="number"
                  required
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">{t.noteOrQuestions}</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'am' ? 'የትራንስፖርት ሁኔታ፣ የመጋዘን ርክክብ፣ ወዘተ...' : 'Delivery preferences, inspection schedule...'}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
              />
            </div>

            {/* Direct Instant Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={sendViaWhatsApp}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.sendViaWhatsapp}</span>
                </button>

                <button
                  type="button"
                  onClick={sendViaSMS}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 rounded-lg transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{t.sendViaSms}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 rounded-lg transition-colors"
              >
                {lang === 'am' ? 'በድረ-ገጹ በኩል አስመዝግብ' : 'Record Trade Offer in System'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

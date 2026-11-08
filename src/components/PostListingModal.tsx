import React, { useState } from 'react';
import { TradeListing, Category, Language } from '../types';
import { translations } from '../utils/translations';
import { X, Upload, CheckCircle2 } from 'lucide-react';

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddListing: (listing: TradeListing) => void;
}

export const PostListingModal: React.FC<PostListingModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddListing
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const imageOptions = [
    { labelAm: 'የጤፍና እህል ምስል', labelEn: 'Teff & Grain Image', url: '/src/assets/images/commodity_teff_grain_1794060957048.jpg' },
    { labelAm: 'የአዴት እርሻና ሰብል ምስል', labelEn: 'Adet Farmland Crop', url: '/src/assets/images/hero_adet_agriculture_1794060957221.jpg' },
    { labelAm: 'የከብትና እንስሳት ምስል', labelEn: 'Gojjam Livestock Cattle', url: '/src/assets/images/livestock_gojjam_cattle_1794060958488.jpg' },
    { labelAm: 'የኑግና ጥራጥሬ ምስል', labelEn: 'Niger Seed & Pulses', url: '/src/assets/images/oilseed_niger_seed_nug_1794060958769.jpg' }
  ];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('grain');
  const [variety, setVariety] = useState('');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState(lang === 'am' ? 'ኩንታል' : 'Quintal');
  const [pricePerUnit, setPricePerUnit] = useState<number>(11000);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [minOrderQuantity, setMinOrderQuantity] = useState<number>(5);
  const [sellerName, setSellerName] = useState('');
  const [sellerType, setSellerType] = useState(lang === 'am' ? 'የተረጋገጠ የእህል ነጋዴ' : 'Verified Grain Merchant');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(lang === 'am' ? 'አዴት ማዕከላዊ መጋዘን' : 'Adet Central Silo');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(imageOptions[0].url);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sellerName || !phone) return;

    const newListing: TradeListing = {
      id: `listing-${Date.now()}`,
      titleAm: title,
      titleEn: title,
      category,
      varietyAm: variety || (lang === 'am' ? 'የዘንድሮ ምርት' : 'Fresh Harvest'),
      varietyEn: variety || 'Fresh Harvest',
      quantity,
      unitAm: unit,
      unitEn: unit,
      pricePerUnit,
      isNegotiable,
      minOrderQuantity,
      locationAm: location,
      locationEn: location,
      sellerName,
      sellerTypeAm: sellerType,
      sellerTypeEn: sellerType,
      sellerPhone: phone,
      isVerifiedSeller: true,
      imageUrl: selectedImage,
      descriptionAm: description || (lang === 'am' ? 'በጥሩ ሁኔታ የተከማቸ ጥራት ያለው የአዴት ምርት።' : 'Quality harvested grain in Adet.'),
      descriptionEn: description || 'Quality harvested grain in Adet.',
      createdAt: lang === 'am' ? 'አሁን የወጣ' : 'Just now',
      isFeatured: true
    };

    onAddListing(newListing);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-ethiopic">
            {t.addNewListingTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-bold text-stone-900 dark:text-white font-ethiopic">
              {t.successPosted}
            </h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                {t.formCropTitle} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'am' ? 'ለምሳሌ፡ ንጹህ ነጭ ማኛ ጤፍ 100 ኩንታል' : 'e.g. 100 Quintals White Magna Teff'}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white focus:ring-1 focus:ring-amber-700"
              />
            </div>

            {/* Category & Variety */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.formCategory}</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                >
                  <option value="grain">{t.categoryGrain}</option>
                  <option value="oilseeds_pulses">{t.categoryOilseeds}</option>
                  <option value="livestock">{t.categoryLivestock}</option>
                  <option value="dairy_honey">{t.categoryDairyHoney}</option>
                  <option value="inputs">{t.categoryInputs}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.formVariety}</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder={lang === 'am' ? 'ማኛ / ቁንጮ / ቃቃባ' : 'Magna / Quncho / Kakaba'}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
            </div>

            {/* Quantity, Unit, Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.formQuantity} *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.formUnit}</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                >
                  <option value={lang === 'am' ? 'ኩንታል' : 'Quintal'}>{lang === 'am' ? 'ኩንታል' : 'Quintal'}</option>
                  <option value={lang === 'am' ? 'ራስ' : 'Head'}>{lang === 'am' ? 'ራስ (ከብት)' : 'Head (Cattle)'}</option>
                  <option value={lang === 'am' ? 'ኪ.ግ' : 'kg'}>{lang === 'am' ? 'ኪሎ ግራም' : 'Kilogram'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.formPrice} *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white tabular-nums"
                />
              </div>
            </div>

            {/* Negotiation & Min Order */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="rounded border-stone-300 text-amber-700"
                />
                <span className="font-medium text-stone-800 dark:text-stone-200">{t.formNegotiable}</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-stone-500">{t.formMinOrder}:</span>
                <input
                  type="number"
                  min="1"
                  value={minOrderQuantity}
                  onChange={(e) => setMinOrderQuantity(Number(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-white tabular-nums"
                />
              </div>
            </div>

            {/* Seller Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.formSellerName} *</label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder={lang === 'am' ? 'የእርስዎ ስም / የንግድ ድርጅት' : 'Your name / Business'}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">{t.formPhone} *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251918..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">{t.formLocation} *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={lang === 'am' ? 'አዴት መጋዘን ተራ ወይም ይልማና ዴንሳ' : 'Adet Warehouse Row or Yilmana Densa'}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">{t.formDescription}</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={lang === 'am' ? 'የእህሉ እርጥበት መጠን፣ ጥራት፣ የጫኝ ሁኔታ...' : 'Quality specs, moisture level, transport notes...'}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
              />
            </div>

            {/* Choose Representative Image */}
            <div className="space-y-2">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                {lang === 'am' ? 'የሸቀጡ ገላጭ ምስል ይምረጡ' : 'Select Showcase Image'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {imageOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.url}
                    onClick={() => setSelectedImage(opt.url)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === opt.url
                        ? 'border-amber-700 ring-2 ring-amber-700/30'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={opt.url} alt={opt.labelEn} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-colors"
              >
                {t.publishListing}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

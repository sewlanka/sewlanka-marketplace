import React from 'react';
import { Filter, RotateCcw, MapPin, Truck, Banknote, Sparkles } from 'lucide-react';
import { Category, Language } from '../types';
import { translations } from '../utils/translations';
import { SRI_LANKA_DISTRICTS } from '../data/sriLankaData';

interface FilterSidebarProps {
  language: Language;
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  conditionFilter: string;
  onConditionChange: (cond: string) => void;
  codOnly: boolean;
  onCodChange: (val: boolean) => void;
  deliveryOnly: boolean;
  onDeliveryChange: (val: boolean) => void;
  tierFilter: string;
  onTierChange: (tier: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  language,
  selectedCategory,
  onSelectCategory,
  selectedDistrict,
  onSelectDistrict,
  conditionFilter,
  onConditionChange,
  codOnly,
  onCodChange,
  deliveryOnly,
  onDeliveryChange,
  tierFilter,
  onTierChange,
  onResetFilters,
  totalFilteredCount,
}) => {
  const t = translations[language];

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-600" />
          <h2 className="font-bold text-sm text-slate-800">{t.filterLabels.filterBy}</h2>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] font-medium text-slate-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer transition-colors"
          title={t.filterLabels.clearFilters}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{language === 'si' ? 'යළි පිහිටුවන්න' : 'Reset'}</span>
        </button>
      </div>

      <div className="space-y-5">
        {/* District Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.filterLabels.district}</span>
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">{t.allDistricts}</option>
            {SRI_LANKA_DISTRICTS.map((d) => (
              <option key={d.id} value={d.nameEn}>
                {language === 'si' ? d.nameSi : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Ad Tier Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'si' ? 'දැන්වීම් වර්ගය (Ad Tier)' : 'Listing Tier'}</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'all', label: language === 'si' ? 'සියල්ල' : 'All' },
              { id: 'urgent', label: language === 'si' ? '🚨 අර්ජන්ට්' : '🚨 Urgent' },
              { id: 'top', label: language === 'si' ? '💵 ටොප් ඇඩ්' : '💵 Top Ad' },
              { id: 'normal', label: language === 'si' ? '🥈 සාමාන්‍ය' : '🥈 Normal' },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => onTierChange(tier.id)}
                className={`py-1.5 px-2 text-xs rounded-lg font-medium text-center transition-all cursor-pointer ${
                  tierFilter === tier.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Machine / Item Condition Filter */}
        {(selectedCategory === 'all' || selectedCategory === 'machines' || selectedCategory === 'spare_parts') && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {t.filterLabels.condition}
            </label>
            <select
              value={conditionFilter}
              onChange={(e) => onConditionChange(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">{t.filterLabels.allConditions}</option>
              <option value="brand_new">{t.filterLabels.brandNew}</option>
              <option value="reconditioned">{t.filterLabels.reconditioned}</option>
              <option value="used">{t.filterLabels.used}</option>
            </select>
          </div>
        )}

        {/* Service & Delivery Checkboxes */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2.5">
            {t.filterLabels.services}
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={codOnly}
                onChange={(e) => onCodChange(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'si' ? 'භාණ්ඩ ලැබුණු පසු මුදල් (COD)' : 'Cash on Delivery (COD)'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={deliveryOnly}
                onChange={(e) => onDeliveryChange(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'si' ? 'දිවයින පුරා ඩිලිවරි පහසුකම්' : 'Islandwide Delivery'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Result stats footer */}
      <div className="mt-6 pt-3 border-t border-slate-100 text-center">
        <span className="text-xs text-slate-500">
          <strong className="text-slate-900 font-bold">{totalFilteredCount}</strong> {t.filterLabels.showingResults}
        </span>
      </div>
    </aside>
  );
};

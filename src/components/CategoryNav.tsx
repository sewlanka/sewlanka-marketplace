import React from 'react';
import { 
  Layers, 
  FileCheck2, 
  Cog, 
  Shirt, 
  Wrench, 
  UserCheck,
  Scissors
} from 'lucide-react';
import { Category, Language } from '../types';
import { translations } from '../utils/translations';

interface CategoryNavProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  language: Language;
  categoryCounts: Record<Category, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  language,
  categoryCounts,
}) => {
  const t = translations[language];

  const categories = [
    {
      id: 'all' as Category,
      labelSi: 'සියල්ල (All Ads)',
      labelEn: 'All Listings',
      icon: Layers,
      color: 'from-slate-700 to-slate-900',
      activeBorder: 'border-slate-800'
    },
    {
      id: 'subcontract' as Category,
      labelSi: 'සබ් ඕඩර්ස් (Sub-Contracts)',
      labelEn: 'Sub-Contract Orders',
      icon: FileCheck2,
      color: 'from-blue-600 to-indigo-700',
      activeBorder: 'border-blue-600'
    },
    {
      id: 'machines' as Category,
      labelSi: 'මහන මැෂින් (Sewing Machines)',
      labelEn: 'Sewing Machines',
      icon: Cog,
      color: 'from-amber-600 to-orange-700',
      activeBorder: 'border-amber-600'
    },
    {
      id: 'garments' as Category,
      labelSi: 'තොග ඇඳුම් (Wholesale Garments)',
      labelEn: 'Bulk Clothing / Stocks',
      icon: Shirt,
      color: 'from-emerald-600 to-teal-700',
      activeBorder: 'border-emerald-600'
    },
    {
      id: 'spare_parts' as Category,
      labelSi: 'ස්පෙයාර් පාට්ස් (Spare Parts)',
      labelEn: 'Spare Parts & Tools',
      icon: Wrench,
      color: 'from-violet-600 to-purple-800',
      activeBorder: 'border-violet-600'
    },
    {
      id: 'technicians' as Category,
      labelSi: 'මැෂින් රෙපයාර් (Technicians)',
      labelEn: 'Mechanics & Technicians',
      icon: UserCheck,
      color: 'from-rose-600 to-red-800',
      activeBorder: 'border-rose-600'
    },
    {
      id: 'operators' as Category,
      labelSi: 'මැසින් ඔපරේටර් (Operators)',
      labelEn: 'Machine Operators',
      icon: Scissors,
      color: 'from-teal-600 to-emerald-700',
      activeBorder: 'border-teal-600'
    }
  ];

  return (
    <div className="mb-6">
      {/* Category Pills Slider / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden group ${
                isActive
                  ? `bg-white shadow-md ring-2 ring-amber-500 border-amber-500 scale-[1.02]`
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Category Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2 shadow-xs transition-transform group-hover:scale-110 bg-gradient-to-br ${cat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Title */}
              <span className={`text-xs font-bold line-clamp-1 ${
                isActive ? 'text-slate-900' : 'text-slate-700'
              }`}>
                {language === 'si' ? cat.labelSi.split(' (')[0] : cat.labelEn}
              </span>

              {/* Count badge */}
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                {count} {language === 'si' ? 'දැන්වීම්' : 'ads'}
              </span>

              {/* Bottom active indicator */}
              {isActive && (
                <div className="absolute bottom-0 inset-x-4 h-0.5 bg-amber-500 rounded-t-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

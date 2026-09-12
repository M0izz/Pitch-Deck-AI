import React from 'react';
import {
  AlertTriangle,
  Lightbulb,
  PieChart,
  DollarSign,
  Compass,
  TrendingUp,
  Users,
  BarChart3,
  Rocket,
  CheckCircle2
} from 'lucide-react';
import type { Slide, SlideType } from '../types/pitch';

interface SlideThumbnailsProps {
  slides: Slide[];
  activeIndex: number;
  onSelectSlide: (index: number) => void;
}

const SLIDE_ICONS: Record<SlideType, any> = {
  problem: AlertTriangle,
  solution: Lightbulb,
  market_size: PieChart,
  business_model: DollarSign,
  competition: Compass,
  go_to_market: TrendingUp,
  team: Users,
  financials: BarChart3,
  traction: Rocket,
  funding_ask: DollarSign,
};

export const SlideThumbnails: React.FC<SlideThumbnailsProps> = ({
  slides,
  activeIndex,
  onSelectSlide,
}) => {
  return (
    <div className="w-full flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
      {slides.map((slide, idx) => {
        const Icon = SLIDE_ICONS[slide.type] || Lightbulb;
        const isActive = activeIndex === idx;

        return (
          <button
            key={slide.id}
            onClick={() => onSelectSlide(idx)}
            className={`flex-shrink-0 w-32 sm:w-36 p-3 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
              isActive
                ? 'bg-[#4D44FF] border-[#6A62FF] text-white shadow-xl scale-[1.02] ring-2 ring-[#4D44FF]/40 font-bold'
                : 'bg-[#181E38] border-white/10 text-slate-300 hover:text-white hover:bg-[#20274A] hover:border-white/25'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[10px] font-mono font-bold tracking-widest ${isActive ? 'text-[#FFCCD5]' : 'text-slate-400'}`}>
                0{slide.slideNumber}
              </span>
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            </div>

            <div className={`text-xs truncate font-display ${isActive ? 'text-white font-bold' : 'text-slate-200 font-medium'}`}>
              {slide.navTitle.replace(/^\d+\.\s*/, '')}
            </div>

            {slide.revisionCount > 0 && (
              <div className={`mt-1.5 flex items-center gap-1 text-[9px] font-bold tracking-wider font-mono ${isActive ? 'text-[#FFCCD5]' : 'text-[#05F1CD]'}`}>
                <CheckCircle2 className="w-2.5 h-2.5" />
                AUDIT REVISED
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

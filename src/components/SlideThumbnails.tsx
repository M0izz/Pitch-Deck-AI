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
            className={`flex-shrink-0 w-32 sm:w-36 p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
              isActive
                ? 'bg-[#FFCCD5] border-[#FFCCD5] text-[#2612B0] shadow-lg scale-[1.03] font-bold'
                : 'bg-[#3823D9]/90 border-white/20 text-white/80 hover:text-white hover:bg-[#432EEB] hover:border-white/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[10px] font-mono font-bold tracking-widest ${isActive ? 'text-[#2612B0]' : 'text-[#FFCCD5]'}`}>
                0{slide.slideNumber}
              </span>
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2612B0]' : 'text-white/70'}`} />
            </div>

            <div className={`text-xs truncate font-display ${isActive ? 'text-[#2612B0] font-bold' : 'text-white font-medium'}`}>
              {slide.navTitle.replace(/^\d+\.\s*/, '')}
            </div>

            {slide.revisionCount > 0 && (
              <div className={`mt-1 flex items-center gap-1 text-[9px] font-bold tracking-wider font-mono ${isActive ? 'text-[#2612B0]' : 'text-[#FFCCD5]'}`}>
                <CheckCircle2 className="w-2.5 h-2.5" />
                REVISED
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

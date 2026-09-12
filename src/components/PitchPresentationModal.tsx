import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  FileText,
  Layers
} from 'lucide-react';
import type { Slide } from '../types/pitch';
import { SlideCanvas, type SlideThemePreset } from './SlideCanvas';
import { PitchArchitectLogo } from './PitchArchitectLogo';

interface PitchPresentationModalProps {
  slides: Slide[];
  initialSlideIndex?: number;
  initialTheme?: SlideThemePreset;
  onClose: () => void;
  onExportPptx: () => void;
  onExportPdf: () => void;
  companyName?: string;
  overallScore?: number;
}

export const PitchPresentationModal: React.FC<PitchPresentationModalProps> = ({
  slides,
  initialSlideIndex = 0,
  initialTheme = 'graphite',
  onClose,
  onExportPptx,
  onExportPdf,
  companyName = 'Startup Pitch Deck',
  overallScore
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialSlideIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [presentationTheme, setPresentationTheme] = useState<SlideThemePreset>(initialTheme);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showFilmstrip, setShowFilmstrip] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialSlideIndex);
  }, [initialSlideIndex]);

  // Native Fullscreen Toggle
  const toggleNativeFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const zoomIn = () => setZoomLevel((prev) => Math.min(150, prev + 10));
  const zoomOut = () => setZoomLevel((prev) => Math.max(80, prev - 10));
  const resetZoom = () => setZoomLevel(100);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleNativeFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, onClose, toggleNativeFullscreen]);

  const handlePdfClick = async () => {
    setIsExportingPdf(true);
    try {
      await onExportPdf();
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#070913] text-white flex flex-col select-none overflow-hidden"
      tabIndex={0}
    >
      {/* 1. FLOATING TOP HUD (Zero Screen-Shrinking, Overlays in Top-Right) */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Left Floating Metadata Pill */}
        <div className="pointer-events-auto bg-[#0E132A]/90 border border-white/15 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5">
          <PitchArchitectLogo size={22} />
          <span className="font-bold text-xs text-white max-w-xs truncate hidden sm:inline">
            {companyName}
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-xs font-mono font-bold text-[#FFCCD5]">
            Slide {currentIndex + 1} / {slides.length}
          </span>
          {overallScore && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#05F1CD]/15 text-[#05F1CD] border border-[#05F1CD]/30 hidden md:inline">
              Score {overallScore}
            </span>
          )}
        </div>

        {/* Right Floating Control Cluster */}
        <div className="pointer-events-auto bg-[#0E132A]/90 border border-white/15 backdrop-blur-xl px-3 py-1.5 rounded-2xl shadow-2xl flex items-center gap-2">
          {/* Theme Quick Switcher */}
          <div className="flex items-center gap-1 bg-[#151C3B] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setPresentationTheme('graphite')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                presentationTheme === 'graphite' ? 'bg-[#38BDF8] text-[#090C19]' : 'text-slate-400 hover:text-white'
              }`}
              title="Graphite Theme"
            >
              Graphite
            </button>
            <button
              onClick={() => setPresentationTheme('light')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                presentationTheme === 'light' ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Executive Light Canvas"
            >
              Light
            </button>
            <button
              onClick={() => setPresentationTheme('midnight')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                presentationTheme === 'midnight' ? 'bg-[#4D44FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Midnight Theme"
            >
              Midnight
            </button>
            <button
              onClick={() => setPresentationTheme('aurora')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                presentationTheme === 'aurora' ? 'bg-gradient-to-r from-[#A78BFA] to-[#FFCCD5] text-[#1E1242]' : 'text-slate-400 hover:text-white'
              }`}
              title="Aurora Gradient Theme"
            >
              Aurora
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[#151C3B] px-2 py-1 rounded-xl border border-white/10">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 80}
              className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold min-w-[36px] text-center text-slate-300">
              {zoomLevel}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 150}
              className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 100 && (
              <button
                onClick={resetZoom}
                className="p-1 text-[10px] font-mono text-[#05F1CD] hover:underline cursor-pointer"
                title="Reset Zoom (0)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Native Fullscreen */}
          <button
            onClick={toggleNativeFullscreen}
            className="p-2 rounded-xl bg-[#151C3B] hover:bg-[#1E2854] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Native Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Export Quick Buttons */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/10">
            <button
              onClick={onExportPptx}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold btn-pink-primary transition-all shadow-md cursor-pointer hover:scale-105"
              title="Export PPTX"
            >
              <Download className="w-3 h-3 text-[#120A47]" />
              <span className="hidden md:inline ml-1">PPTX</span>
            </button>
            <button
              onClick={handlePdfClick}
              disabled={isExportingPdf}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#151C3B] hover:bg-[#1E2854] text-slate-200 border border-white/15 transition-all shadow-md cursor-pointer disabled:opacity-50"
              title="Download PDF"
            >
              <FileText className="w-3 h-3 text-slate-300" />
              <span className="hidden md:inline ml-1">{isExportingPdf ? '...' : 'PDF'}</span>
            </button>
          </div>

          {/* Close Presentation Mode */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 transition-all cursor-pointer ml-1"
            title="Exit Presentation View (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. TRUE WHOLE-SCREEN PRESENTATION STAGE (Covers Entire Viewport) */}
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-auto relative">
        {/* Floating Left Edge Navigation Button */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-2xl bg-[#0F142A]/80 hover:bg-[#4D44FF] border border-white/15 hover:border-[#4D44FF] text-white disabled:opacity-0 disabled:pointer-events-none transition-all duration-200 shadow-2xl backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
          title="Previous Slide (Left Arrow)"
        >
          <ChevronLeft className="w-7 h-7 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Scaled Slide Canvas (Takes Center Stage at True Full-Screen Dimensions) */}
        <div
          className="w-full max-w-[96vw] max-h-[96vh] flex items-center justify-center transition-transform duration-200 ease-out origin-center"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'center center'
          }}
        >
          <div className="w-full shadow-[0_25px_80px_rgba(0,0,0,0.9)] rounded-3xl overflow-hidden ring-1 ring-white/15">
            <SlideCanvas
              slide={currentSlide}
              totalSlides={slides.length}
              activeTheme={presentationTheme}
              hideThemeBar={true}
            />
          </div>
        </div>

        {/* Floating Right Edge Navigation Button */}
        <button
          onClick={nextSlide}
          disabled={currentIndex === slides.length - 1}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-2xl bg-[#0F142A]/80 hover:bg-[#4D44FF] border border-white/15 hover:border-[#4D44FF] text-white disabled:opacity-0 disabled:pointer-events-none transition-all duration-200 shadow-2xl backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
          title="Next Slide (Right Arrow or Space)"
        >
          <ChevronRight className="w-7 h-7 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3. FLOATING BOTTOM FILMSTRIP DRAWER (Collapsible, Does Not Squeeze Screen) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
        {showFilmstrip ? (
          <div className="bg-[#0E132A]/95 border border-white/15 backdrop-blur-2xl p-3 rounded-2xl shadow-2xl flex items-center gap-2 max-w-5xl overflow-x-auto animate-fadeIn">
            {slides.map((s, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 text-left p-2 rounded-xl border flex flex-col justify-between w-28 h-14 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#4D44FF]/30 border-[#FFCCD5] ring-2 ring-[#FFCCD5] shadow-lg'
                      : 'bg-[#151C3B] border-white/10 hover:border-white/30 text-slate-300'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold text-slate-400">
                    0{s.slideNumber}
                  </span>
                  <span className="text-[10px] font-bold text-white truncate line-clamp-1">
                    {s.navTitle.replace(/^\d+\.\s*/, '')}
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setShowFilmstrip(false)}
              className="p-1 text-slate-400 hover:text-white text-xs ml-1"
              title="Close Slides Drawer"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowFilmstrip(true)}
            className="bg-[#0E132A]/85 hover:bg-[#151C3B] border border-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xl text-xs font-mono font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer opacity-70 hover:opacity-100"
          >
            <Layers className="w-3.5 h-3.5 text-[#05F1CD]" />
            <span>Show Slide Strip ({currentIndex + 1}/{slides.length})</span>
          </button>
        )}
      </div>
    </div>
  );
};

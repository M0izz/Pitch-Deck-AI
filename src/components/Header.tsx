import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  Layers,
  RotateCcw,
  Bot,
  Home,
  Zap,
  Key,
  Check,
  Maximize2,
  BookOpen,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import type { VCPersona } from '../types/pitch';
import { VC_PERSONAS } from '../agents/criticAgent';
import { getStoredGeminiApiKey, setStoredGeminiApiKey } from '../services/geminiService';
import { PitchArchitectLogo } from './PitchArchitectLogo';
import { checkBackendHealth } from '../services/backendApi';

interface HeaderProps {
  activePersona: VCPersona;
  onSelectPersona: (persona: VCPersona) => void;
  onExportPptx: () => void;
  onExportPdf: () => void;
  onNewPitch: () => void;
  hasGeneratedPitch: boolean;
  isGenerating: boolean;
  activeView: 'landing' | 'studio' | 'diff' | 'audit' | 'reference_library';
  onSelectView: (view: 'landing' | 'studio' | 'diff' | 'audit' | 'reference_library') => void;
  score?: number;
  onOpenPresentation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePersona,
  onSelectPersona,
  onExportPptx,
  onExportPdf,
  onNewPitch,
  hasGeneratedPitch,
  isGenerating,
  activeView,
  onSelectView,
  score,
  onOpenPresentation
}) => {
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [savedKey, setSavedKey] = useState<string>('');
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    const k = getStoredGeminiApiKey();
    setSavedKey(k);
    setApiKeyInput(k);

    checkBackendHealth().then(res => setBackendOnline(!!res));
    const interval = setInterval(() => {
      checkBackendHealth().then(res => setBackendOnline(!!res));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveKey = () => {
    setStoredGeminiApiKey(apiKeyInput);
    setSavedKey(apiKeyInput.trim());
    setShowKeyModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[72px] border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 bg-[#090C19]/90 backdrop-blur-2xl transition-all duration-300 shadow-xl shadow-black/20 flex items-center">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 lg:gap-6">
          {/* 1. BRAND LOGO */}
          <div
            onClick={() => onSelectView('landing')}
            className="flex items-center cursor-pointer group select-none flex-shrink-0"
            title="PitchArchitect Home"
          >
            <PitchArchitectLogo size={42} showText={true} showBadge={true} />
          </div>

          {/* 2. SEGMENTED NAVIGATION ISLAND */}
          <nav className="flex items-center bg-[#10142A]/90 p-1.5 rounded-2xl border border-white/[0.1] shadow-2xl backdrop-blur-xl gap-1">
            <button
              onClick={() => onSelectView('landing')}
              className={`h-9 px-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-xs font-semibold whitespace-nowrap ${
                activeView === 'landing'
                  ? 'bg-gradient-to-r from-[#4D44FF] to-[#3B34DB] text-white shadow-lg shadow-[#4D44FF]/30 border border-white/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Home className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Overview</span>
            </button>

            {hasGeneratedPitch && (
              <>
                <button
                  onClick={() => onSelectView('studio')}
                  className={`h-9 px-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-xs font-semibold whitespace-nowrap ${
                    activeView === 'studio'
                      ? 'bg-gradient-to-r from-[#4D44FF] to-[#3B34DB] text-white shadow-lg shadow-[#4D44FF]/30 border border-white/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>10-Slide Deck</span>
                </button>

                <button
                  onClick={() => onSelectView('diff')}
                  className={`h-9 px-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-xs font-semibold whitespace-nowrap ${
                    activeView === 'diff'
                      ? 'bg-gradient-to-r from-[#4D44FF] to-[#3B34DB] text-white shadow-lg shadow-[#4D44FF]/30 border border-white/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden md:inline">Diff Engine</span>
                </button>

                <button
                  onClick={() => onSelectView('audit')}
                  className={`h-9 px-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-xs font-semibold whitespace-nowrap ${
                    activeView === 'audit'
                      ? 'bg-gradient-to-r from-[#4D44FF] to-[#3B34DB] text-white shadow-lg shadow-[#4D44FF]/30 border border-white/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#05F1CD] animate-pulse flex-shrink-0" />
                  <span>VC Audit</span>
                  {score && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#05F1CD]/20 text-[#05F1CD] border border-[#05F1CD]/30">
                      {score}
                    </span>
                  )}
                </button>
              </>
            )}

            <button
              onClick={() => onSelectView('reference_library')}
              className={`h-9 px-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-xs font-semibold whitespace-nowrap ${
                activeView === 'reference_library'
                  ? 'bg-gradient-to-r from-[#4D44FF] to-[#3B34DB] text-white shadow-lg shadow-[#4D44FF]/30 border border-white/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden lg:inline">Reference Decks</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-300 bg-white/10">
                9
              </span>
            </button>
          </nav>

          {/* 3. RIGHT ACTION CLUSTER */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Fullscreen / Whole Screen Zoom Button (When pitch is generated) */}
            {hasGeneratedPitch && onOpenPresentation && (
              <button
                onClick={onOpenPresentation}
                className="h-10 px-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#171D3B] to-[#222A54] hover:from-[#202754] hover:to-[#2B356B] border border-[#4D44FF]/50 hover:border-[#FFCCD5] text-[#FFCCD5] hover:text-white shadow-lg shadow-[#4D44FF]/15 hover:shadow-[#4D44FF]/30 transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-[0.98] group"
                title="Open Whole Screen Presentation & Zoom Mode (F)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#05F1CD] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Whole Screen</span>
                <span className="text-[10px] font-mono opacity-80 uppercase tracking-widest hidden md:inline">Zoom</span>
              </button>
            )}

            {/* Python ADK / Cloud Run Backend Indicator */}
            <div
              className={`hidden lg:flex items-center gap-2 h-10 px-3 rounded-xl text-xs font-mono border transition-all ${
                backendOnline
                  ? 'bg-[#05F1CD]/10 border-[#05F1CD]/40 text-[#05F1CD]'
                  : 'bg-white/[0.03] border-white/10 text-slate-400'
              }`}
              title={backendOnline ? 'Python ADK / Cloud Run Backend Active on Port 8000' : 'Client Mode: Python backend offline'}
            >
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-[#05F1CD] animate-pulse' : 'bg-slate-500'}`} />
              <span>{backendOnline ? 'Python ADK :8000' : 'Client Mode'}</span>
            </div>

            {/* Gemini API Key Trigger */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`h-10 flex items-center gap-2 px-3 rounded-xl text-xs font-mono border transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                savedKey
                  ? 'bg-[#05F1CD]/10 border-[#05F1CD]/40 text-[#05F1CD] hover:bg-[#05F1CD]/20'
                  : 'bg-[#11162C] border-white/10 text-slate-300 hover:text-white hover:border-white/30'
              }`}
              title="Configure Google Gemini Live API Key"
            >
              {savedKey ? (
                <span className="w-2 h-2 rounded-full bg-[#05F1CD] animate-pulse" />
              ) : (
                <Key className="w-3.5 h-3.5 text-[#FFCCD5]" />
              )}
              <span className="hidden xl:inline">{savedKey ? 'Gemini 2.0 Live' : 'API Key'}</span>
            </button>

            {hasGeneratedPitch ? (
              <>
                {/* VC Persona Selector */}
                <div className="relative group hidden lg:flex items-center">
                  <div className="flex items-center gap-1.5 h-10 bg-[#11162C] border border-white/15 hover:border-white/30 rounded-xl px-3 text-xs text-slate-200 font-medium transition-all">
                    <UserCheck className="w-3.5 h-3.5 text-[#FFCCD5] flex-shrink-0" />
                    <select
                      value={activePersona}
                      onChange={(e) => onSelectPersona(e.target.value as VCPersona)}
                      disabled={isGenerating}
                      aria-label="Select VC Persona"
                      className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-4 appearance-none"
                    >
                      {Object.values(VC_PERSONAS).map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#11162C] text-white">
                          {p.name} ({p.firmType.split('(')[0].trim()})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none -ml-3" />
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onExportPptx}
                    className="h-10 flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-bold btn-pink-primary transition-all duration-200 shadow-lg shadow-pink-500/10 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
                    title="Export as native editable PowerPoint presentation (.pptx)"
                  >
                    <Download className="w-3.5 h-3.5 text-[#120A47]" />
                    <span className="hidden sm:inline">PPTX</span>
                  </button>
                  <button
                    onClick={onExportPdf}
                    className="h-10 flex items-center gap-1.5 px-3 rounded-xl text-xs font-bold bg-[#11162C] text-slate-200 hover:text-white hover:bg-[#181F3D] border border-white/15 transition-all duration-200 shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    title="Download slide PDF snapshot"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-300" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                  <button
                    onClick={onNewPitch}
                    className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer"
                    title="Reset & Start New Business Concept"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => onSelectView('studio')}
                className="h-10 btn-cobalt-primary px-4 text-xs font-bold flex items-center gap-2 shadow-xl shadow-[#4D44FF]/25 cursor-pointer hover:scale-[1.02] active:scale-[0.98] rounded-xl"
              >
                <Zap className="w-3.5 h-3.5 text-[#FFCCD5]" />
                <span>Launch Studio</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#11162C] p-6 rounded-3xl border border-white/15 max-w-md w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#4D44FF]/20 flex items-center justify-center">
                  <Key className="w-4 h-4 text-[#FFCCD5]" />
                </div>
                <h3 className="font-sans font-bold text-white text-base">Google Gemini API Key</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your Google Gemini API key to enable live model synthesis. If left blank, PitchArchitect uses the built-in dynamic semantic generation engine with 100% custom synthesis.
            </p>

            <div className="space-y-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#181E38] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4D44FF]"
              />
              <span className="text-[10px] text-slate-400 font-mono block">
                Key is stored in your local browser storage only.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setApiKeyInput('');
                  setStoredGeminiApiKey('');
                  setSavedKey('');
                  setShowKeyModal(false);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
              >
                Clear Key
              </button>
              <button
                onClick={handleSaveKey}
                className="btn-pink-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                Save &amp; Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


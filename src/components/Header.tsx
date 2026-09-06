import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Download,
  FileText,
  Layers,
  RotateCcw,
  Bot,
  Home,
  Zap,
  Key,
  Check
} from 'lucide-react';
import type { VCPersona } from '../types/pitch';
import { VC_PERSONAS } from '../agents/criticAgent';
import { getStoredGeminiApiKey, setStoredGeminiApiKey } from '../services/geminiService';

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
}) => {
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [savedKey, setSavedKey] = useState<string>('');

  useEffect(() => {
    const k = getStoredGeminiApiKey();
    setSavedKey(k);
    setApiKeyInput(k);
  }, []);

  const handleSaveKey = () => {
    setStoredGeminiApiKey(apiKeyInput);
    setSavedKey(apiKeyInput.trim());
    setShowKeyModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/20 px-4 py-3 bg-[#4D44FF]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectView('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2A15C2] border border-[#FFCCD5]/40 flex items-center justify-center shadow-md group-hover:border-[#FFCCD5] transition-all">
              <Sparkles className="w-5 h-5 text-[#FFCCD5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  Pitch<span className="text-[#FFCCD5]">Architect</span>
                </span>
                <span className="pill-badge text-[10px] py-0.5 px-2.5">
                  Free Beta
                </span>
              </div>
              <p className="text-[11px] font-mono-micro tracking-wider uppercase text-white/80 hidden sm:block">
                Autonomous Investor Studio
              </p>
            </div>
          </div>

          {/* View Switcher Navigation */}
          <nav className="flex items-center bg-[#2A15C2]/80 p-1 rounded-xl border border-white/20 text-xs font-medium">
            <button
              onClick={() => onSelectView('landing')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'landing'
                  ? 'bg-[#FFCCD5] text-[#2612B0] font-bold shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Overview</span>
            </button>

            {hasGeneratedPitch && (
              <>
                <button
                  onClick={() => onSelectView('studio')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeView === 'studio'
                      ? 'bg-[#FFCCD5] text-[#2612B0] font-bold shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  10-Slide Deck
                </button>
                <button
                  onClick={() => onSelectView('diff')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeView === 'diff'
                      ? 'bg-[#FFCCD5] text-[#2612B0] font-bold shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  Diff Engine
                </button>
                <button
                  onClick={() => onSelectView('audit')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeView === 'audit'
                      ? 'bg-[#FFCCD5] text-[#2612B0] font-bold shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#FFCCD5] animate-pulse" />
                  VC Audit {score ? `(${score})` : ''}
                </button>
              </>
            )}

            <button
              onClick={() => onSelectView('reference_library')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'reference_library'
                  ? 'bg-[#FFCCD5] text-[#2612B0] font-bold shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reference Decks</span> (9)
            </button>
          </nav>

          {/* Actions & Persona Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* API Key Modal Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono-micro border transition-all ${
                savedKey
                  ? 'bg-[#FFCCD5]/20 border-[#FFCCD5] text-[#FFCCD5]'
                  : 'bg-[#2A15C2]/80 border-white/20 text-white/80 hover:text-white'
              }`}
              title="Configure Google Gemini Live API Key"
            >
              <Key className="w-3 h-3 text-[#FFCCD5]" />
              <span className="hidden xl:inline">{savedKey ? 'Gemini 2.5 Active' : 'Gemini Key'}</span>
            </button>

            {hasGeneratedPitch ? (
              <>
                {/* VC Persona Switcher */}
                <div className="relative group hidden lg:block">
                  <select
                    value={activePersona}
                    onChange={(e) => onSelectPersona(e.target.value as VCPersona)}
                    disabled={isGenerating}
                    aria-label="Select VC Persona"
                    className="text-xs bg-[#2A15C2] border border-white/30 text-white rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-[#FFCCD5] cursor-pointer transition-colors"
                  >
                    {Object.values(VC_PERSONAS).map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#2A15C2] text-white">
                        {p.name} ({p.firmType.split('(')[0].trim()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Export Group */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onExportPptx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FFCCD5] text-[#2612B0] hover:bg-[#FFE5EA] transition-all shadow-sm"
                    title="Export as native editable PowerPoint presentation"
                  >
                    <Download className="w-3.5 h-3.5 text-[#2612B0]" />
                    <span className="hidden md:inline">PPTX</span>
                  </button>
                  <button
                    onClick={onExportPdf}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2A15C2] text-white hover:bg-[#3823D9] border border-white/30 transition-all shadow-sm"
                    title="Download PDF snapshot"
                  >
                    <FileText className="w-3.5 h-3.5 text-white" />
                    <span className="hidden md:inline">PDF</span>
                  </button>
                  <button
                    onClick={onNewPitch}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    title="Start New Business Concept"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => onSelectView('studio')}
                className="btn-pink-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-lg"
              >
                <Zap className="w-3.5 h-3.5 text-[#2612B0]" />
                <span>Launch Studio</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Gemini API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl border border-white/30 max-w-md w-full space-y-4 shadow-2xl bg-[#2A15C2]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#FFCCD5]" />
                <h3 className="font-display font-bold text-white text-base">Google Gemini API Key</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/90 leading-relaxed">
              Enter your Google Gemini API key to enable live model streaming. If left blank, PitchArchitect uses the built-in dynamic semantic generation engine with 100% custom synthesis.
            </p>

            <div className="space-y-1.5">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#3823D9] border border-white/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FFCCD5]"
              />
              <span className="text-[10px] text-white/70 font-mono-micro">
                Key is stored securely in your browser session only.
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
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 hover:text-white"
              >
                Clear Key
              </button>
              <button
                onClick={handleSaveKey}
                className="btn-pink-primary px-4 py-2 text-xs flex items-center gap-1.5"
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

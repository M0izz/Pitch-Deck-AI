import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Maximize2
} from 'lucide-react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { InputWizard } from './components/InputWizard';
import { AgentExecutionStream } from './components/AgentExecutionStream';
import { SlideCanvas, type SlideThemePreset } from './components/SlideCanvas';
import { SlideThumbnails } from './components/SlideThumbnails';
import { BeforeAfterDiff } from './components/BeforeAfterDiff';
import { VCAuditPanel } from './components/VCAuditPanel';
import { ReferenceDeckLibrary } from './components/ReferenceDeckLibrary';
import { PitchPresentationModal } from './components/PitchPresentationModal';
import type {
  UserBusinessInput,
  Slide,
  VCPersona,
  VCCritiqueResult,
  SlideRevisionDiff,
  AgentLogMessage,
  ReadinessDeltaMetrics
} from './types/pitch';
import { runMultiAgentPitchGeneration } from './agents/orchestrator';
import { exportDeckToPptx, exportSlideElementToPdf } from './services/exporter';

export function App() {
  const [activePersona, setActivePersona] = useState<VCPersona>('saas_skeptic');
  const [activeView, setActiveView] = useState<'landing' | 'studio' | 'diff' | 'audit' | 'reference_library'>('landing');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [slideTheme, setSlideTheme] = useState<SlideThemePreset>('graphite');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<AgentLogMessage[]>([]);
  const [totalDurationMs, setTotalDurationMs] = useState<number | undefined>();

  const [slides, setSlides] = useState<Slide[]>([]);
  const [finalCritique, setFinalCritique] = useState<VCCritiqueResult | null>(null);
  const [revisionDiffs, setRevisionDiffs] = useState<SlideRevisionDiff[]>([]);
  const [readinessDelta, setReadinessDelta] = useState<ReadinessDeltaMetrics | null>(null);
  const [lastInput, setLastInput] = useState<UserBusinessInput | null>(null);

  const handleGenerate = async (input: UserBusinessInput) => {
    setIsGenerating(true);
    setAgentLogs([]);
    setLastInput(input);
    setActiveView('studio');

    try {
      const result = await runMultiAgentPitchGeneration(
        input,
        activePersona,
        (log) => {
          setAgentLogs((prev) => [...prev, log]);
        }
      );

      setSlides(result.slides);
      setFinalCritique(result.finalCritique);
      setRevisionDiffs(result.revisionDiffs);
      setReadinessDelta(result.readinessDelta);
      setTotalDurationMs(result.durationMs);
      setActiveSlideIndex(0);
      setActiveView('studio');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } catch (err) {
      console.error('Multi-agent pipeline failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePersonaChange = async (newPersona: VCPersona) => {
    setActivePersona(newPersona);
    if (slides.length > 0 && lastInput) {
      setIsGenerating(true);
      try {
        const result = await runMultiAgentPitchGeneration(
          lastInput,
          newPersona,
          (log) => {
            setAgentLogs((prev) => [...prev, log]);
          }
        );
        setSlides(result.slides);
        setFinalCritique(result.finalCritique);
        setRevisionDiffs(result.revisionDiffs);
        setReadinessDelta(result.readinessDelta);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleExportPptx = async () => {
    if (slides.length === 0) return;
    const title = lastInput?.businessIdea.slice(0, 30) || 'Startup Pitch Deck';
    await exportDeckToPptx(slides, title);
  };

  const handleExportPdf = async () => {
    await exportSlideElementToPdf('active-pitch-slide-canvas', 'Startup_Pitch_Deck.pdf');
  };

  const handleNewPitch = () => {
    setSlides([]);
    setFinalCritique(null);
    setRevisionDiffs([]);
    setReadinessDelta(null);
    setAgentLogs([]);
    setActiveSlideIndex(0);
    setActiveView('landing');
  };

  return (
    <div className="min-h-screen bg-[#090C19] bg-grid-architectural text-slate-100 flex flex-col selection:bg-[#4D44FF] selection:text-white relative">
      {/* Ambient Architectural Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#4D44FF]/12 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#05F1CD]/5 blur-[160px] rounded-full pointer-events-none" />
      </div>

      {/* Header */}
      <Header
        activePersona={activePersona}
        onSelectPersona={handlePersonaChange}
        onExportPptx={handleExportPptx}
        onExportPdf={handleExportPdf}
        onNewPitch={handleNewPitch}
        hasGeneratedPitch={slides.length > 0}
        isGenerating={isGenerating}
        activeView={activeView}
        onSelectView={setActiveView}
        score={finalCritique?.overallScore}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto relative z-10">
        {/* Landing Page View */}
        {activeView === 'landing' && (
          <LandingPage
            onLaunchStudio={(input) => {
              if (input) {
                handleGenerate(input);
              } else {
                setActiveView('studio');
              }
            }}
            onExploreReferenceDecks={() => setActiveView('reference_library')}
          />
        )}

        {/* Studio / Pitch Generation Views */}
        {activeView !== 'landing' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* If in studio view with no slides and not generating, show Input Wizard */}
            {activeView === 'studio' && slides.length === 0 && !isGenerating && (
              <InputWizard onGenerate={handleGenerate} isGenerating={isGenerating} />
            )}

            {/* Live Multi-Agent Execution Stream */}
            <AgentExecutionStream
              logs={agentLogs}
              isGenerating={isGenerating}
              totalDurationMs={totalDurationMs}
            />

            {/* Generated Pitch Interface */}
            {slides.length > 0 && (
              <div className="space-y-6">
                {/* Investor Readiness Delta Headline Banner */}
                {readinessDelta && (
                  <div className="bg-[#11162C] rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#05F1CD]/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-[#05F1CD]/10 text-[#05F1CD] border border-[#05F1CD]/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#A5B4FC] flex items-center gap-1.5 font-mono">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFCCD5]" />
                          Institutional Readiness Audit
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 font-display tracking-wide flex flex-wrap items-baseline gap-2">
                          <span>Score: <span className="text-slate-400 font-normal">{readinessDelta.initialScore}</span></span>
                          <span className="text-slate-500">→</span>
                          <span className="text-[#05F1CD]">{readinessDelta.finalScore}/100</span>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#05F1CD]/10 text-[#05F1CD] border border-[#05F1CD]/30 align-middle font-mono uppercase tracking-wider">
                            +{readinessDelta.scoreDelta} pts ({readinessDelta.revisionPasses} autonomous pass)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1 relative z-10">
                      <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Partner Verdict:</span>
                      <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-md font-mono uppercase tracking-wider ${
                        finalCritique?.overallScore && finalCritique.overallScore >= 85
                          ? 'bg-[#05F1CD] text-[#090C19]'
                          : 'bg-amber-400 text-[#090C19]'
                      }`}>
                        {finalCritique?.verdict}
                      </span>
                    </div>
                  </div>
                )}

                {/* Unresolved Objections Callout (Honest Failure Mode) */}
                {readinessDelta && readinessDelta.unresolvedFlags.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[#181E38] border border-amber-500/30 text-xs text-white shadow-xl">
                    <div className="flex items-center gap-2 font-bold text-amber-400 mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Partner Red Flag Alert Areas (Requires Discussion):</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 ml-1">
                      {readinessDelta.unresolvedFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* View: 10-Slide Studio */}
                {activeView === 'studio' && (
                  <div className="space-y-4">
                    {/* 10-Slide Navigation Timeline */}
                    <div className="bg-[#11162C] p-3 rounded-2xl border border-white/10 shadow-xl">
                      <SlideThumbnails
                        slides={slides}
                        activeIndex={activeSlideIndex}
                        onSelectSlide={setActiveSlideIndex}
                      />
                    </div>

                    {/* Canvas Utility Toolbar */}
                    <div className="flex items-center justify-between px-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Active Canvas
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
                          Slide {activeSlideIndex + 1}: {slides[activeSlideIndex]?.navTitle}
                        </span>
                      </div>

                      <button
                        onClick={() => setIsPresentationOpen(true)}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#171D3B] to-[#222A54] hover:from-[#202754] hover:to-[#2C366E] border border-[#4D44FF]/40 hover:border-[#FFCCD5] text-[#FFCCD5] hover:text-white font-bold text-xs shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                        title="Display Slide on Whole Screen View with Zoom controls (F)"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#05F1CD] group-hover:scale-110 transition-transform" />
                        <span>Whole Screen View</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-300 hidden sm:inline">
                          Zoom
                        </span>
                      </button>
                    </div>

                    {/* Active Slide Canvas */}
                    <SlideCanvas
                      slide={slides[activeSlideIndex]}
                      totalSlides={slides.length}
                      activeTheme={slideTheme}
                      onThemeChange={setSlideTheme}
                    />

                    {/* Slide Step Controls */}
                    <div className="flex items-center justify-between px-2 pt-2">
                      <button
                        onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                        disabled={activeSlideIndex === 0}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold border transition-all font-mono uppercase tracking-wider cursor-pointer ${
                          activeSlideIndex === 0
                            ? 'opacity-30 cursor-not-allowed border-white/5 bg-[#181E38] text-slate-500'
                            : 'border-white/10 bg-[#181E38] hover:bg-[#20274A] text-slate-200 shadow-md'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous Slide
                      </button>

                      <div className="text-xs font-bold text-[#A5B4FC] font-mono tracking-widest uppercase">
                        Slide {activeSlideIndex + 1} of {slides.length}
                      </div>

                      <button
                        onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                        disabled={activeSlideIndex === slides.length - 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all font-mono uppercase tracking-wider cursor-pointer ${
                          activeSlideIndex === slides.length - 1
                            ? 'opacity-30 cursor-not-allowed border-white/5 bg-[#181E38] text-slate-500'
                            : 'btn-cobalt-primary text-white shadow-xl hover:scale-105'
                        }`}
                      >
                        Next Slide
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* View: Agentic Diff */}
                {activeView === 'diff' && (
                  <BeforeAfterDiff diffs={revisionDiffs} />
                )}

                {/* View: VC Audit Panel */}
                {activeView === 'audit' && finalCritique && (
                  <VCAuditPanel
                    critique={finalCritique}
                    activePersona={activePersona}
                    onSelectPersona={handlePersonaChange}
                  />
                )}
              </div>
            )}

            {/* View: Reference Library */}
            {activeView === 'reference_library' && (
              <ReferenceDeckLibrary
                onSelectArchetypeForGrounding={(archId) => {
                  if (lastInput) {
                    handleGenerate({ ...lastInput, selectedReferenceArchetype: archId });
                  } else {
                    setActiveView('studio');
                  }
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Whole Screen Presentation & Zoom Modal */}
      {isPresentationOpen && slides.length > 0 && (
        <PitchPresentationModal
          slides={slides}
          initialSlideIndex={activeSlideIndex}
          initialTheme={slideTheme}
          onClose={() => setIsPresentationOpen(false)}
          onExportPptx={handleExportPptx}
          onExportPdf={handleExportPdf}
          companyName={
            lastInput?.businessIdea
              ? lastInput.businessIdea.length > 32
                ? lastInput.businessIdea.slice(0, 32) + '...'
                : lastInput.businessIdea
              : 'Startup Pitch Deck'
          }
          overallScore={finalCritique?.overallScore}
        />
      )}
    </div>
  );
}

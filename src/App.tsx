import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { InputWizard } from './components/InputWizard';
import { AgentExecutionStream } from './components/AgentExecutionStream';
import { SlideCanvas } from './components/SlideCanvas';
import { SlideThumbnails } from './components/SlideThumbnails';
import { BeforeAfterDiff } from './components/BeforeAfterDiff';
import { VCAuditPanel } from './components/VCAuditPanel';
import { ReferenceDeckLibrary } from './components/ReferenceDeckLibrary';
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
    <div className="min-h-screen bg-[#4D44FF] text-white flex flex-col selection:bg-[#FFCCD5] selection:text-[#2612B0]">
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
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto">
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
                  <div className="bg-[#2A15C2]/95 rounded-3xl p-5 sm:p-6 border border-white/20 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFCCD5] text-[#2612B0] border border-white/20 flex items-center justify-center flex-shrink-0 shadow-md">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#FFCCD5] flex items-center gap-1.5 font-mono">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFCCD5]" />
                          Investor Readiness Delta
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 font-poster tracking-wide">
                          Score: <span className="text-[#FFCCD5]/80 font-normal">{readinessDelta.initialScore}</span> →{' '}
                          <span className="text-[#FFCCD5]">{readinessDelta.finalScore}/100</span>{' '}
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1E0E99] text-[#FFCCD5] border border-white/20 align-middle ml-2 font-mono uppercase tracking-wider">
                            +{readinessDelta.scoreDelta} pts ({readinessDelta.revisionPasses} autonomous revision pass)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
                      <span className="text-[11px] text-[#FFCCD5]/80 font-mono uppercase tracking-wider">Institutional Decision:</span>
                      <span className="text-xs font-extrabold text-[#2612B0] px-3.5 py-1.5 rounded-xl bg-[#FFCCD5] shadow-md font-mono uppercase tracking-wider">
                        {finalCritique?.verdict}
                      </span>
                    </div>
                  </div>
                )}

                {/* Unresolved Objections Callout (Honest Failure Mode) */}
                {readinessDelta && readinessDelta.unresolvedFlags.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[#2A15C2]/95 border border-[#FFCCD5]/40 text-xs text-white shadow-xl">
                    <div className="flex items-center gap-2 font-bold text-[#FFCCD5] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      <AlertTriangle className="w-4 h-4 text-[#FFCCD5]" />
                      <span>Unresolved Founder Challenge Areas (Requires Live Discussion):</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-white/90 ml-1">
                      {readinessDelta.unresolvedFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* View: 10-Slide Studio */}
                {activeView === 'studio' && (
                  <div className="space-y-5">
                    {/* 10-Slide Navigation Timeline */}
                    <div className="bg-[#2A15C2]/95 p-3 rounded-2xl border border-white/20 shadow-2xl">
                      <SlideThumbnails
                        slides={slides}
                        activeIndex={activeSlideIndex}
                        onSelectSlide={setActiveSlideIndex}
                      />
                    </div>

                    {/* Active Slide Canvas */}
                    <SlideCanvas
                      slide={slides[activeSlideIndex]}
                      totalSlides={slides.length}
                    />

                    {/* Slide Step Controls */}
                    <div className="flex items-center justify-between px-2 pt-2">
                      <button
                        onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                        disabled={activeSlideIndex === 0}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold border transition-all font-mono uppercase tracking-wider ${
                          activeSlideIndex === 0
                            ? 'opacity-40 cursor-not-allowed border-white/10 bg-[#3823D9]/40 text-white/40'
                            : 'border-white/20 bg-[#2A15C2] hover:bg-[#3823D9] text-white shadow-md'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous Slide
                      </button>

                      <div className="text-xs font-bold text-[#FFCCD5] font-mono tracking-widest uppercase">
                        Slide {activeSlideIndex + 1} of {slides.length}
                      </div>

                      <button
                        onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                        disabled={activeSlideIndex === slides.length - 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all font-mono uppercase tracking-wider ${
                          activeSlideIndex === slides.length - 1
                            ? 'opacity-40 cursor-not-allowed border-white/10 bg-[#3823D9]/40 text-white/40'
                            : 'bg-[#FFCCD5] hover:bg-[#FFE5EA] text-[#2612B0] shadow-xl font-extrabold hover:scale-105'
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
    </div>
  );
}

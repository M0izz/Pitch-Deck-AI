import React, { useState } from 'react';
import {
  Upload,
  Zap,
  BookOpen,
  Layers,
  Sparkles,
  Compass,
  Lightbulb
} from 'lucide-react';
import { REFERENCE_DECKS_DATABASE, STANDARD_PITCH_OUTLINE } from '../services/referenceDecks';
import { processAndIndexPdf, CUSTOM_DECK_REGISTRY } from '../services/pdfIndexer';
import type { IndexedCustomDeck } from '../services/pdfIndexer';
import type { ReferenceDeckArchetype } from '../types/pitch';

interface ReferenceDeckLibraryProps {
  onSelectArchetypeForGrounding?: (archetypeId: string) => void;
}

export const ReferenceDeckLibrary: React.FC<ReferenceDeckLibraryProps> = ({
  onSelectArchetypeForGrounding,
}) => {
  const [selectedDeck, setSelectedDeck] = useState<ReferenceDeckArchetype>(REFERENCE_DECKS_DATABASE[0]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [customDecks, setCustomDecks] = useState<IndexedCustomDeck[]>(CUSTOM_DECK_REGISTRY);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const indexed = await processAndIndexPdf(file);
      setCustomDecks([...CUSTOM_DECK_REGISTRY]);
      setSelectedDeck(indexed.summaryArchetype);
    } catch (err) {
      console.error('Failed to index PDF:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full bg-[#3823D9] text-[#FFCCD5] border border-[#FFCCD5]/30 mb-2 uppercase tracking-widest font-mono">
            <BookOpen className="w-3.5 h-3.5 text-[#FFCCD5]" />
            Historical Reference Archetypes &amp; Standard Outline
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-poster tracking-wide">
            Curated Pitch Deck Knowledge Base &amp; PDF Ingestion
          </h2>
          <p className="text-xs text-[#FFCCD5]/90 mt-1 font-sans">
            Synthesized structural metadata from 9 iconic historical fundraises and the universal 11-point standard pitch outline.
          </p>
        </div>

        {/* Upload Custom PDF Button */}
        <div className="relative">
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-[#FFCCD5] hover:bg-[#FFE5EA] text-[#2612B0] shadow-lg transition-all font-mono uppercase tracking-wider">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Indexing PDF...' : 'Upload & Index PDF Deck'}</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Standard 11-Point Pitch Outline Callout */}
      <div className="bg-[#2A15C2]/95 rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-[#FFCCD5]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#FFCCD5] font-mono">
            Universal Institutional Standard Pitch Outline (11 Points)
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {STANDARD_PITCH_OUTLINE.map((step, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-[#1E0E99]/90 border border-white/15 text-xs font-mono text-white flex items-center gap-1.5"
            >
              <strong className="text-[#FFCCD5] text-[10px]">0{idx + 1}.</strong>
              <span>{step}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Selector List, Right Deck Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Deck List */}
        <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#FFCCD5] font-mono mb-2">
            9 Historical Archetypes &amp; Frameworks
          </div>

          {REFERENCE_DECKS_DATABASE.map((deck) => (
            <div
              key={deck.id}
              onClick={() => setSelectedDeck(deck)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedDeck.id === deck.id
                  ? 'bg-[#FFCCD5] border-[#FFCCD5] text-[#2612B0] shadow-lg scale-[1.02] font-bold'
                  : 'bg-[#2A15C2]/90 border-white/20 text-white hover:bg-[#3823D9]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold font-display ${selectedDeck.id === deck.id ? 'text-[#2612B0]' : 'text-white'}`}>{deck.name}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${selectedDeck.id === deck.id ? 'bg-[#2612B0] text-white' : 'bg-[#1E0E99] text-[#FFCCD5]'}`}>
                  {deck.year} • {deck.stage}
                </span>
              </div>
              <p className={`text-[11px] line-clamp-1 ${selectedDeck.id === deck.id ? 'text-[#2612B0]/80' : 'text-[#FFCCD5]/80'}`}>{deck.industry}</p>
            </div>
          ))}

          {customDecks.length > 0 && (
            <>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#FFCCD5] font-mono mt-4 mb-2">
                Custom Uploaded &amp; Indexed Decks ({customDecks.length})
              </div>
              {customDecks.map((cd) => (
                <div
                  key={cd.id}
                  onClick={() => setSelectedDeck(cd.summaryArchetype)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedDeck.id === cd.id
                      ? 'bg-[#FFCCD5] border-[#FFCCD5] text-[#2612B0] shadow-lg scale-[1.02] font-bold'
                      : 'bg-[#2A15C2]/90 border-white/20 text-white hover:bg-[#3823D9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold font-display ${selectedDeck.id === cd.id ? 'text-[#2612B0]' : 'text-white'}`}>{cd.title}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#1E0E99] text-[#FFCCD5] border border-white/20 font-mono uppercase">
                      {cd.pageCount} slides
                    </span>
                  </div>
                  <p className="text-[11px] text-[#FFCCD5]/70 line-clamp-1 font-mono">Indexed at {cd.indexedAt}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Column: Detailed Deck Inspector */}
        <div className="lg:col-span-2 bg-[#2A15C2]/95 rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 text-white">
          {/* Header Bar */}
          <div className="border-b border-white/15 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white font-display">{selectedDeck.name}</h3>
                <span className="text-[10px] px-3 py-1 rounded-full bg-[#3823D9] text-[#FFCCD5] font-mono font-bold uppercase tracking-wider border border-[#FFCCD5]/30">
                  {selectedDeck.stage} • {selectedDeck.year}
                </span>
              </div>
              <p className="text-xs text-[#FFCCD5]/90 mt-1 font-mono">
                {selectedDeck.location}  •  Amount Raised: <strong className="text-white font-bold">{selectedDeck.amountRaised}</strong>
              </p>
            </div>

            {onSelectArchetypeForGrounding && (
              <button
                onClick={() => onSelectArchetypeForGrounding(selectedDeck.id)}
                className="text-xs px-4 py-2.5 rounded-xl bg-[#FFCCD5] hover:bg-[#FFE5EA] text-[#2612B0] font-bold transition-all flex items-center gap-2 shadow-lg self-start sm:self-auto font-mono uppercase tracking-wider"
              >
                <Zap className="w-3.5 h-3.5 text-[#2612B0]" />
                Ground Pitch With Archetype
              </button>
            )}
          </div>

          {/* Metadata Cards: Industry & Business Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-[#1E0E99]/90 border border-white/15">
              <span className="text-[10px] uppercase font-bold text-[#FFCCD5] block mb-1 font-mono tracking-wider">Industry Vertical</span>
              <strong className="text-white font-semibold">{selectedDeck.industry}</strong>
            </div>
            <div className="p-4 rounded-2xl bg-[#1E0E99]/90 border border-white/15">
              <span className="text-[10px] uppercase font-bold text-[#FFCCD5] block mb-1 font-mono tracking-wider">Business Model</span>
              <strong className="text-white font-semibold">{selectedDeck.businessModel}</strong>
            </div>
          </div>

          {/* Key Lesson Callout */}
          <div className="p-5 rounded-2xl bg-[#3823D9]/90 border border-[#FFCCD5]/30 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FFCCD5] uppercase tracking-widest mb-1.5 font-mono">
              <Lightbulb className="w-4 h-4 text-[#FFCCD5]" />
              Key Takeaway for Founders:
            </div>
            <p className="text-sm text-white font-normal leading-relaxed italic">
              "{selectedDeck.keyLesson}"
            </p>
          </div>

          {/* Ordered Slide Sequence */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFCCD5] mb-3 flex items-center gap-2 font-mono">
              <Layers className="w-3.5 h-3.5 text-[#FFCCD5]" />
              Ordered Slide Sequence (Narrative Architecture):
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedDeck.slideSequence.map((role, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#1E0E99]/90 border border-white/15 text-xs font-mono text-white flex items-center gap-1.5"
                >
                  <span className="text-[#FFCCD5] font-bold">{idx + 1}.</span>
                  <span>{role}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Narrative Notes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFCCD5] mb-3 flex items-center gap-2 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCCD5]" />
              Narrative Effectiveness Notes:
            </h4>
            <ul className="space-y-2 text-xs text-white">
              {selectedDeck.narrativeNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-[#1E0E99]/90 p-3.5 rounded-2xl border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-[#FFCCD5] mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Search,
  BookOpen,
  ShieldCheck,
  Zap,
  Terminal,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles
} from 'lucide-react';
import type { AgentLogMessage, AgentRole } from '../types/pitch';

interface AgentExecutionStreamProps {
  logs: AgentLogMessage[];
  isGenerating: boolean;
  totalDurationMs?: number;
}

const AGENT_META: Record<AgentRole, { label: string; icon: any; color: string; bg: string }> = {
  orchestrator: {
    label: 'Taskmaster Orchestrator',
    icon: Zap,
    color: 'text-[#818CF8]',
    bg: 'bg-[#4D44FF]/15 border-[#4D44FF]/30',
  },
  researcher: {
    label: 'Market Intelligence Agent',
    icon: Search,
    color: 'text-[#38BDF8]',
    bg: 'bg-[#0284C7]/15 border-[#0284C7]/30',
  },
  narrative_architect: {
    label: 'Narrative Architect',
    icon: BookOpen,
    color: 'text-[#FFCCD5]',
    bg: 'bg-[#FFCCD5]/15 border-[#FFCCD5]/30',
  },
  vc_critic: {
    label: 'VC Critic Partner',
    icon: ShieldCheck,
    color: 'text-[#FBBF24]',
    bg: 'bg-[#F59E0B]/15 border-[#F59E0B]/30',
  },
  revision_specialist: {
    label: 'Autonomous Refinement Engine',
    icon: Cpu,
    color: 'text-[#05F1CD]',
    bg: 'bg-[#05F1CD]/15 border-[#05F1CD]/30',
  },
};

export const AgentExecutionStream: React.FC<AgentExecutionStreamProps> = ({
  logs,
  isGenerating,
  totalDurationMs,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && isGenerating) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isGenerating]);

  if (logs.length === 0 && !isGenerating) return null;

  return (
    <div className="w-full bg-[#11162C] rounded-3xl border border-white/10 overflow-hidden shadow-2xl mb-6 text-white">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 bg-[#0D1122] border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-[#151B36] transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#4D44FF]/20 text-[#A5B4FC] border border-[#4D44FF]/40 shadow-sm">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm text-white font-display tracking-wide">
                Multi-Agent Autonomous Execution Log
              </span>
              {isGenerating ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#090C19] bg-[#05F1CD] px-3 py-0.5 rounded-full shadow-sm animate-pulse font-mono uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Agents Auditing &amp; Refining...
                </span>
              ) : (
                <span className="text-[10px] font-bold text-[#05F1CD] bg-[#05F1CD]/10 px-2.5 py-0.5 rounded-full border border-[#05F1CD]/30 flex items-center gap-1 font-mono uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Ready ({totalDurationMs ? `${(totalDurationMs / 1000).toFixed(2)}s` : '1.8s'})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider mt-0.5">
              Bottom-up market sizing, narrative structuring, VC partner rubric evaluation, and deck refinement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-400 font-mono">
            {logs.length} events logged
          </span>
          <button className="text-slate-400 hover:text-white">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Log Body */}
      {isExpanded && (
        <div
          ref={scrollRef}
          className="max-h-64 overflow-y-auto p-4 space-y-3 font-mono text-xs bg-[#0A0D1B]/95 divide-y divide-white/5"
        >
          {logs.map((log) => {
            const meta = AGENT_META[log.agentRole] || AGENT_META.orchestrator;
            const Icon = meta.icon;

            return (
              <div key={log.id} className="pt-3 first:pt-0 flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-xl border flex-shrink-0 ${meta.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold font-display ${meta.color}`}>
                        {meta.label}
                      </span>
                      {log.toolName && (
                        <span className="px-2 py-0.5 text-[9px] rounded-full bg-[#181E38] text-slate-300 border border-white/10 font-mono uppercase">
                          tool: {log.toolName}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      +{log.durationMs}ms
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed break-words font-sans text-xs">
                    {log.content}
                  </p>

                  {log.toolArgs && (
                    <div className="mt-1.5 p-2 rounded-xl bg-[#12162B] border border-white/10 text-[11px] text-slate-400 overflow-x-auto">
                      <span className="text-slate-500 font-bold">Args/Output: </span>
                      {JSON.stringify(log.toolArgs)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

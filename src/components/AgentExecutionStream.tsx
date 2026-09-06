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
    color: 'text-[#FFCCD5]',
    bg: 'bg-[#3823D9] border-white/20',
  },
  researcher: {
    label: 'Market Intelligence Agent',
    icon: Search,
    color: 'text-white',
    bg: 'bg-[#3823D9] border-white/20',
  },
  narrative_architect: {
    label: 'Narrative Architect',
    icon: BookOpen,
    color: 'text-[#FFE5EA]',
    bg: 'bg-[#3823D9] border-white/20',
  },
  vc_critic: {
    label: 'VC Critic Partner',
    icon: ShieldCheck,
    color: 'text-[#FFCCD5]',
    bg: 'bg-[#3823D9] border-white/20',
  },
  revision_specialist: {
    label: 'Autonomous Refinement Engine',
    icon: Cpu,
    color: 'text-white',
    bg: 'bg-[#3823D9] border-white/20',
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
    <div className="w-full bg-[#2A15C2]/95 rounded-3xl border border-white/20 overflow-hidden shadow-2xl mb-6 text-white">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 bg-[#1E0E99]/90 border-b border-white/15 flex items-center justify-between cursor-pointer hover:bg-[#1E0E99] transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FFCCD5] text-[#2612B0] shadow-sm">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm text-white font-display tracking-wide">
                Multi-Agent Autonomous Execution Log
              </span>
              {isGenerating ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#2612B0] bg-[#FFCCD5] px-3 py-0.5 rounded-full shadow-sm animate-pulse font-mono uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  Agents Auditing &amp; Refining...
                </span>
              ) : (
                <span className="text-[10px] font-bold text-[#FFCCD5] bg-[#3823D9] px-2.5 py-0.5 rounded-full border border-[#FFCCD5]/30 flex items-center gap-1 font-mono uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Ready ({totalDurationMs ? `${(totalDurationMs / 1000).toFixed(2)}s` : '1.8s'})
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#FFCCD5]/80 font-mono tracking-wider mt-0.5">
              Bottom-up market sizing, narrative structuring, VC partner rubric evaluation, and deck refinement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-[#FFCCD5]/80 font-mono">
            {logs.length} events logged
          </span>
          <button className="text-white hover:text-[#FFCCD5]">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Log Body */}
      {isExpanded && (
        <div
          ref={scrollRef}
          className="max-h-64 overflow-y-auto p-4 space-y-3 font-mono text-xs bg-[#1E0E99]/90 divide-y divide-white/10"
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
                        <span className="px-2 py-0.2 text-[9px] rounded-full bg-[#3823D9] text-[#FFCCD5] border border-white/20 font-mono uppercase">
                          tool: {log.toolName}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-white/60 font-mono">
                      +{log.durationMs}ms
                    </span>
                  </div>

                  <p className="text-white leading-relaxed break-words font-sans text-xs">
                    {log.content}
                  </p>

                  {log.toolArgs && (
                    <div className="mt-1.5 p-2 rounded-xl bg-[#3823D9]/90 border border-white/15 text-[11px] text-[#FFCCD5]/90 overflow-x-auto">
                      <span className="text-white font-semibold">Args/Output: </span>
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

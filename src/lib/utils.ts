import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Scene } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseRetellTranscript(jsonString: string): Scene[] {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    throw new Error("Invalid JSON format. Please provide a valid RetellAI JSON object.");
  }

  const turns = data.transcript_object || (Array.isArray(data) ? data : null);
  
  if (!turns || !Array.isArray(turns)) {
    throw new Error("Invalid Retell JSON format: Missing transcript_object or array of turns.");
  }

  const FPS = 30;
  
  const humanize = (str: string) => {
    return str
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const transcriptTurns = turns.filter((t: any) => t.role === 'agent' || t.role === 'user').map((turn: any) => {
    const start = turn.words?.[0]?.start ?? turn.start ?? 0;
    const end = turn.words?.[turn.words.length - 1]?.end ?? turn.end ?? start + 2;
    return { 
      role: turn.role === 'agent' ? 'agent' : 'user', 
      type: 'transcript' as const,
      content: (turn.content || '').trim(), 
      start, 
      end,
      audioStart: start,
      audioEnd: end
    };
  }).sort((a: any, b: any) => a.start - b.start);

  const bundledTranscripts: any[] = [];
  let currentBundle: any = null;

  for (const turn of transcriptTurns) {
    if (!currentBundle) {
      currentBundle = { ...turn };
    } else {
      const isSameRole = currentBundle.role === turn.role;
      const durationWithNext = turn.end - currentBundle.start;

      if (isSameRole && durationWithNext <= 3.0) {
        currentBundle.content += ' ' + turn.content;
        currentBundle.end = turn.end;
        currentBundle.audioEnd = turn.end;
      } else {
        bundledTranscripts.push(currentBundle);
        currentBundle = { ...turn };
      }
    }
  }
  if (currentBundle) bundledTranscripts.push(currentBundle);

  for (let i = 0; i < bundledTranscripts.length; i++) {
    const current = bundledTranscripts[i];
    // Use actual spoken duration plus small padding to eliminate silence gaps
    current.durationSeconds = Math.max(0.5, current.end - current.start + 0.2);
  }

  const featureTurns = turns.filter((t: any) => t.role === 'tool_call_invocation').map((turn: any) => {
    const start = turn.time_sec ?? 0;
    return { 
      role: 'system' as const, 
      type: 'feature' as const,
      content: `Invoking: ${humanize(turn.name || 'Unknown Tool')}`, 
      start, 
      end: start + 2.0,
      durationSeconds: 2.0,
      audioStart: undefined,
      audioEnd: undefined
    };
  });

  const allItems = [...bundledTranscripts, ...featureTurns].sort((a, b) => a.start - b.start);

  return allItems.map(item => ({
    id: Math.random().toString(36).substring(7),
    type: item.type,
    role: item.role,
    text: item.content,
    durationInFrames: Math.max(1, Math.round(item.durationSeconds * FPS)),
    audioStart: item.audioStart,
    audioEnd: item.audioEnd
  }));
}

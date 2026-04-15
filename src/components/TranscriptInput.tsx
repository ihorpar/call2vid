import React, { useState } from 'react';
import { generateScenesFromTranscript, transcribeAudio } from '../lib/gemini';
import { parseRetellTranscript } from '../lib/utils';
import { Scene } from '../types';
import { Loader2, Wand2, Upload, Paperclip, Mic, FileJson } from 'lucide-react';

interface Props {
  onScenesGenerated: (scenes: Scene[]) => void;
  onAudioUploaded: (url: string | undefined) => void;
}

export const TranscriptInput: React.FC<Props> = ({ onScenesGenerated, onAudioUploaded }) => {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    fetch('/default_transcript.json')
      .then(res => res.json())
      .then(data => {
        setTranscript(JSON.stringify(data, null, 2));
      })
      .catch(err => console.error('Failed to load default transcript:', err));
  }, []);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState('');
  const [audioAttached, setAudioAttached] = useState(false);

  const handleAudioAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const audioUrl = URL.createObjectURL(file);
    onAudioUploaded(audioUrl);
    setAudioAttached(true);
  };

  const handleAudioTranscribe = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const audioUrl = URL.createObjectURL(file);
    onAudioUploaded(audioUrl);
    setAudioAttached(true);

    setIsTranscribing(true);
    setError('');
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          const transcriptText = await transcribeAudio(base64String, file.type);
          setTranscript(transcriptText);
        } catch (err: any) {
          setError(err.message || 'Failed to transcribe audio');
        } finally {
          setIsTranscribing(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setIsTranscribing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Failed to process file');
      setIsTranscribing(false);
    }
  };

  const handleGenerate = async () => {
    if (!transcript.trim()) return;
    
    setIsLoading(true);
    setError('');
    try {
      // Strict Retell JSON parsing
      const scenes = parseRetellTranscript(transcript);
      onScenesGenerated(scenes);
    } catch (err: any) {
      setError(err.message || 'Failed to generate scenes. Please ensure you are pasting a valid RetellAI JSON object.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[var(--color-surface-900)] border border-[var(--color-surface-800)] rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 border-b border-[var(--color-surface-800)] bg-[var(--color-surface-950)]/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
              <FileJson className="w-6 h-6 text-[var(--color-accent-primary)]" />
              Import Transcript
            </h2>
            <p className="text-[var(--color-surface-400)] text-sm">Paste your RetellAI JSON transcript or upload an audio file to begin.</p>
          </div>
          <div className="flex gap-3">
            <div>
              <input 
                type="file" 
                id="audio-attach" 
                accept="audio/wav,audio/mpeg,audio/mp3,audio/m4a" 
                className="hidden" 
                onChange={handleAudioAttach} 
              />
              <label 
                htmlFor="audio-attach" 
                className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${audioAttached ? 'bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)] text-white shadow-lg shadow-[var(--color-accent-primary)]/20' : 'bg-[var(--color-surface-900)] border-[var(--color-surface-700)] text-[var(--color-surface-300)] hover:text-white hover:border-[var(--color-surface-600)]'}`}
              >
                <Paperclip className="w-4 h-4" />
                {audioAttached ? 'Audio Attached' : 'Attach Audio'}
              </label>
            </div>
            <div>
              <input 
                type="file" 
                id="audio-transcribe" 
                accept="audio/wav,audio/mpeg,audio/mp3,audio/m4a" 
                className="hidden" 
                onChange={handleAudioTranscribe} 
                disabled={isTranscribing || isLoading}
              />
              <label 
                htmlFor="audio-transcribe" 
                className={`cursor-pointer px-4 py-2 rounded-lg border border-[var(--color-surface-700)] bg-[var(--color-surface-900)] text-[var(--color-surface-300)] text-sm font-medium hover:text-white hover:border-[var(--color-surface-600)] transition-colors flex items-center gap-2 ${(isTranscribing || isLoading) ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                {isTranscribing ? 'Transcribing...' : 'Auto-Transcribe'}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="relative group">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste RetellAI JSON here..."
            className="w-full h-80 p-6 bg-[var(--color-surface-950)] border border-[var(--color-surface-800)] rounded-xl text-[var(--color-surface-50)] focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] outline-none resize-none font-mono text-sm leading-relaxed transition-all shadow-inner"
            disabled={isTranscribing}
          />
          <div className="absolute top-4 right-4 px-2 py-1 bg-[var(--color-surface-800)] text-[var(--color-surface-400)] text-xs rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            JSON
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-red-400 text-xs font-bold">!</span>
            </div>
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading || isTranscribing || !transcript.trim()}
          className="w-full py-4 bg-[var(--color-accent-primary)] text-white rounded-xl hover:bg-[var(--color-accent-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-[var(--color-accent-primary)]/20 hover:shadow-xl hover:shadow-[var(--color-accent-primary)]/30 active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Timeline...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Video
            </>
          )}
        </button>
      </div>
    </div>
  );
};

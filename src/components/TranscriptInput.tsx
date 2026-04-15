import React, { useState } from 'react';
import { generateScenesFromTranscript, transcribeAudio } from '../lib/gemini';
import { parseRetellTranscript } from '../lib/utils';
import { Scene } from '../types';
import { Loader2, Wand2, Upload, Paperclip, Mic } from 'lucide-react';

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
    <div className="w-full max-w-3xl mx-auto p-8 border border-editorial-border">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif italic text-editorial-paper mb-2">Create Video from Transcript</h2>
          <p className="text-[11px] uppercase tracking-[1px] text-editorial-muted">Paste your call center transcript, paste RetellAI JSON, or upload audio.</p>
        </div>
        <div className="flex gap-2">
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
              className={`cursor-pointer px-4 py-2 border border-editorial-border text-[10px] uppercase tracking-[1px] hover:bg-editorial-paper hover:text-editorial-bg transition-colors flex items-center gap-2 ${audioAttached ? 'bg-editorial-paper text-editorial-bg' : ''}`}
            >
              <Paperclip className="w-3 h-3" />
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
              className={`cursor-pointer px-4 py-2 border border-editorial-border text-[10px] uppercase tracking-[1px] hover:bg-editorial-paper hover:text-editorial-bg transition-colors flex items-center gap-2 ${(isTranscribing || isLoading) ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isTranscribing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mic className="w-3 h-3" />}
              {isTranscribing ? 'Transcribing...' : 'Auto-Transcribe'}
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste RetellAI JSON here...&#10;&#10;OR paste raw text:&#10;Agent: Hello, how can I help you today?&#10;User: I need to book an appointment."
          className="w-full h-64 p-4 bg-transparent border border-editorial-border text-editorial-paper focus:border-editorial-accent outline-none resize-none font-sans text-[13px]"
          disabled={isTranscribing}
        />

        {error && (
          <div className="p-4 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading || isTranscribing || !transcript.trim()}
          className="w-full py-3 bg-editorial-paper text-editorial-bg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed font-sans text-[11px] uppercase tracking-[1px] flex items-center justify-center gap-2 transition-colors border border-editorial-paper"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Scenes...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate Video
            </>
          )}
        </button>
      </div>
    </div>
  );
};

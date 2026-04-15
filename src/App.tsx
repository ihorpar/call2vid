import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { Scene, TemplateType, Settings, Orientation } from './types';
import { TranscriptInput } from './components/TranscriptInput';
import { SceneEditor } from './components/SceneEditor';
import { TemplateSelector } from './components/TemplateSelector';
import { VideoComposition } from './components/VideoComposition';
import { SettingsPanel } from './components/SettingsPanel';
import { Video, ArrowLeft, Settings as SettingsIcon, PlaySquare, Monitor, Smartphone } from 'lucide-react';
import { cn } from './lib/utils';

const DEFAULT_SETTINGS: Settings = {
  agentLabel: 'AI Agent',
  userLabel: 'User',
};

export default function App() {
  const [mode, setMode] = useState<'input' | 'editor'>('input');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('call2vid_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('call2vid_settings', JSON.stringify(settings));
  }, [settings]);

  const handleScenesGenerated = (newScenes: Scene[]) => {
    setScenes(newScenes);
    setMode('editor');
  };

  const totalDuration = Math.max(1, scenes.reduce((acc, scene) => acc + (scene.type === 'transcript' ? scene.durationInFrames : 0), 0));

  const compositionWidth = orientation === 'landscape' ? 1920 : 1080;
  const compositionHeight = orientation === 'landscape' ? 1080 : 1920;

  return (
    <div className="h-screen bg-[var(--color-surface-950)] text-[var(--color-surface-50)] flex flex-col font-sans overflow-hidden relative">
      {showSettings && (
        <SettingsPanel 
          settings={settings} 
          onChange={setSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      <header className="h-16 shrink-0 border-b border-[var(--color-surface-800)] bg-[var(--color-surface-900)] px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-accent-primary)]/20">
              <PlaySquare className="w-4 h-4 text-white" />
            </div>
            Call2Vid
          </div>
          
          {mode === 'editor' && (
            <div className="h-6 w-px bg-[var(--color-surface-800)] mx-2" />
          )}
          
          {mode === 'editor' && (
            <div className="flex items-center gap-4">
              <TemplateSelector value={template} onChange={setTemplate} />
              
              <div className="flex items-center gap-1 bg-[var(--color-surface-950)] p-1 rounded-md border border-[var(--color-surface-800)]">
                <button
                  onClick={() => setOrientation('landscape')}
                  className={cn(
                    "p-1.5 rounded transition-all",
                    orientation === 'landscape' ? "bg-[var(--color-surface-800)] text-white" : "text-[var(--color-surface-500)] hover:text-[var(--color-surface-300)]"
                  )}
                  title="Landscape (16:9)"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOrientation('portrait')}
                  className={cn(
                    "p-1.5 rounded transition-all",
                    orientation === 'portrait' ? "bg-[var(--color-surface-800)] text-white" : "text-[var(--color-surface-500)] hover:text-[var(--color-surface-300)]"
                  )}
                  title="Portrait (9:16)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {mode === 'editor' && (
            <button
              onClick={() => setMode('input')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--color-surface-400)] hover:text-white hover:bg-[var(--color-surface-800)] rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              New Project
            </button>
          )}
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-[var(--color-surface-400)] hover:text-white hover:bg-[var(--color-surface-800)] rounded-md transition-colors"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0">
        {mode === 'input' ? (
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <TranscriptInput onScenesGenerated={handleScenesGenerated} onAudioUploaded={setAudioUrl} />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Editor */}
            <div className="w-[550px] shrink-0 flex flex-col border-r border-[var(--color-surface-800)] bg-[var(--color-surface-900)]/50">
              <div className="flex-1 overflow-hidden">
                <SceneEditor scenes={scenes} onChange={setScenes} settings={settings} />
              </div>
            </div>

            {/* Right Panel: Player */}
            <div className="flex-1 flex flex-col items-center justify-center p-10 relative bg-[var(--color-surface-950)]">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
              
              <div className={cn(
                "bg-black rounded-xl border border-[var(--color-surface-800)] shadow-2xl shadow-black/50 overflow-hidden relative z-10 transition-all duration-500",
                orientation === 'landscape' ? "w-full max-w-5xl aspect-video" : "h-full aspect-[9/16]"
              )}>
                {scenes.length > 0 ? (
                  <Player
                    component={VideoComposition}
                    inputProps={{ scenes, template, audioUrl, settings, orientation }}
                    durationInFrames={totalDuration}
                    compositionWidth={compositionWidth}
                    compositionHeight={compositionHeight}
                    fps={30}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    controls
                    autoPlay
                    loop
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--color-surface-500)]">
                    No scenes to preview
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

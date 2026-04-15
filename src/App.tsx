import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { Scene, TemplateType, Settings } from './types';
import { TranscriptInput } from './components/TranscriptInput';
import { SceneEditor } from './components/SceneEditor';
import { TemplateSelector } from './components/TemplateSelector';
import { VideoComposition } from './components/VideoComposition';
import { SettingsPanel } from './components/SettingsPanel';
import { Video, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';

const DEFAULT_SETTINGS: Settings = {
  agentLabel: 'AI Agent',
  userLabel: 'User',
};

export default function App() {
  const [mode, setMode] = useState<'input' | 'editor'>('input');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('vocalize_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('vocalize_settings', JSON.stringify(settings));
  }, [settings]);

  const handleScenesGenerated = (newScenes: Scene[]) => {
    setScenes(newScenes);
    setMode('editor');
  };

  const totalDuration = Math.max(1, scenes.reduce((acc, scene) => acc + (scene.type === 'transcript' ? scene.durationInFrames : 0), 0));

  return (
    <div className="h-screen bg-editorial-bg text-editorial-paper flex flex-col font-sans overflow-hidden relative">
      {showSettings && (
        <SettingsPanel 
          settings={settings} 
          onChange={setSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      <header className="h-[60px] shrink-0 border-b border-editorial-border px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="font-serif italic text-xl tracking-tight">vocalize.studio</div>
          <div className="flex gap-6 text-[11px] uppercase tracking-[1px] ml-4">
            <span className="text-editorial-muted">Draft: #284-A</span>
            <TemplateSelector value={template} onChange={setTemplate} />
            <span className="text-editorial-accent">Rendered via Remotion</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowSettings(true)}
            className="text-editorial-muted hover:text-editorial-accent transition-colors"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          {mode === 'editor' && (
            <button
              onClick={() => setMode('input')}
              className="flex items-center gap-2 text-[11px] uppercase tracking-[1px] text-editorial-muted hover:text-editorial-paper transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Input
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0">
        {mode === 'input' ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-editorial-bg overflow-y-auto">
            <TranscriptInput onScenesGenerated={handleScenesGenerated} onAudioUploaded={setAudioUrl} />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden bg-editorial-bg">
            {/* Left Panel: Editor */}
            <div className="w-[550px] shrink-0 flex flex-col border-r border-editorial-border">
              <div className="flex-1 overflow-hidden">
                <SceneEditor scenes={scenes} onChange={setScenes} settings={settings} />
              </div>
            </div>

            {/* Right Panel: Player */}
            <div className="flex-1 flex flex-col items-center justify-center p-10 relative bg-[#121212]">
              <div className="w-full max-w-4xl aspect-video bg-black border border-editorial-border shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden relative">
                {scenes.length > 0 ? (
                  <Player
                    component={VideoComposition}
                    inputProps={{ scenes, template, audioUrl, settings }}
                    durationInFrames={totalDuration}
                    compositionWidth={1920}
                    compositionHeight={1080}
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
                  <div className="w-full h-full flex items-center justify-center text-editorial-muted font-serif italic text-xl">
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

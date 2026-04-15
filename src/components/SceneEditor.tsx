import React from 'react';
import { Scene, SceneType, Role, Settings } from '../types';
import { Trash2, Plus, GripVertical, Clock, MessageSquare, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  scenes: Scene[];
  onChange: (scenes: Scene[]) => void;
  settings: Settings;
}

export const SceneEditor: React.FC<Props> = ({ scenes, onChange, settings }) => {
  const [filter, setFilter] = React.useState<'all' | 'transcript' | 'feature'>('all');

  const updateScene = (id: string, updates: Partial<Scene>) => {
    onChange(scenes.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeScene = (id: string) => {
    onChange(scenes.filter(s => s.id !== id));
  };

  const addScene = (index: number) => {
    const newScene: Scene = {
      id: Math.random().toString(36).substring(7),
      type: filter === 'feature' ? 'feature' : 'transcript',
      role: filter === 'feature' ? 'system' : 'agent',
      text: 'New scene text',
      durationInFrames: 90
    };
    const newScenes = [...scenes];
    newScenes.splice(index + 1, 0, newScene);
    onChange(newScenes);
  };

  const moveScene = (index: number, direction: number) => {
    if (index + direction < 0 || index + direction >= scenes.length) return;
    const newScenes = [...scenes];
    const temp = newScenes[index];
    newScenes[index] = newScenes[index + direction];
    newScenes[index + direction] = temp;
    onChange(newScenes);
  };

  const filteredScenes = scenes.filter(s => filter === 'all' || s.type === filter);

  return (
    <div className="flex flex-col gap-4 p-6 h-full overflow-y-auto border-r border-editorial-border">
      <div className="flex items-center justify-between mb-2">
        <div className="font-serif italic text-[18px] text-editorial-paper">Scenes</div>
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          {(['all', 'transcript', 'feature'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2 py-1 text-[9px] uppercase tracking-[1px] font-bold rounded transition-all",
                filter === f 
                  ? "bg-editorial-accent text-editorial-bg" 
                  : "text-editorial-muted hover:text-editorial-paper"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredScenes.map((scene) => {
        const index = scenes.findIndex(s => s.id === scene.id);
        const isFeature = scene.type === 'feature';

        return (
          <div key={scene.id} className="relative group">
            <div className={cn(
              "p-4 transition-all flex gap-4 rounded-xl border-l-[6px] border-y border-r shadow-lg",
              isFeature 
                ? "bg-[#2A2A00] border-l-yellow-400 border-y-yellow-500/30 border-r-yellow-500/30" 
                : "bg-[#1A1A1A] border-l-editorial-accent border-y-editorial-border/50 border-r-editorial-border/50 hover:border-y-editorial-accent/30 hover:border-r-editorial-accent/30"
            )}>
              <div className="flex flex-col items-center justify-center gap-2 text-editorial-muted">
                <button 
                  onClick={() => moveScene(index, -1)}
                  disabled={index === 0}
                  className="hover:text-editorial-accent disabled:opacity-30 disabled:hover:text-editorial-muted transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <button 
                  onClick={() => moveScene(index, 1)}
                  disabled={index === scenes.length - 1}
                  className="hover:text-editorial-accent disabled:opacity-30 disabled:hover:text-editorial-muted transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
              
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <select
                      value={scene.type}
                      onChange={(e) => updateScene(scene.id, { type: e.target.value as SceneType, role: e.target.value === 'feature' ? 'system' : 'agent' })}
                      className={cn(
                        "text-[9px] uppercase tracking-[1px] font-bold bg-transparent border-none outline-none cursor-pointer",
                        isFeature ? "text-yellow-400" : "text-editorial-accent"
                      )}
                    >
                      <option value="transcript" className="bg-editorial-bg">Transcript</option>
                      <option value="feature" className="bg-editorial-bg">Feature Showcase</option>
                    </select>

                    {scene.type === 'transcript' && (
                      <select
                        value={scene.role}
                        onChange={(e) => updateScene(scene.id, { role: e.target.value as Role })}
                        className="text-[9px] uppercase tracking-[1px] font-bold text-editorial-muted bg-transparent border-none outline-none cursor-pointer hover:text-editorial-paper"
                      >
                        <option value="agent" className="bg-editorial-bg">{settings.agentLabel}</option>
                        <option value="user" className="bg-editorial-bg">{settings.userLabel}</option>
                      </select>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-editorial-muted text-[10px] uppercase tracking-[1px]">
                      <Clock className="w-3 h-3" />
                      <input
                        type="number"
                        step="0.1"
                        value={(scene.durationInFrames / 30).toFixed(1)}
                        onChange={(e) => updateScene(scene.id, { durationInFrames: Math.round(parseFloat(e.target.value) * 30) || 30 })}
                        className="w-12 bg-transparent text-right outline-none text-editorial-paper border-b border-editorial-border focus:border-editorial-accent"
                      />
                      <span>sec</span>
                    </div>
                    
                    <button
                      onClick={() => removeScene(scene.id)}
                      className="text-editorial-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={scene.text}
                    onChange={(e) => updateScene(scene.id, { text: e.target.value })}
                    className={cn(
                      "w-full bg-black/40 border p-4 text-[14px] text-editorial-paper/90 outline-none resize-none leading-relaxed rounded-lg transition-colors",
                      isFeature ? "border-yellow-500/30 focus:border-yellow-400" : "border-editorial-border focus:border-editorial-accent"
                    )}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={() => addScene(index)}
                className="bg-editorial-paper text-editorial-bg p-1.5 shadow-lg hover:bg-white transition-all border border-editorial-paper"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
      
      {scenes.length === 0 && (
        <div className="text-center py-12 text-editorial-muted font-serif italic text-lg">
          No scenes yet. Generate from transcript or add one manually.
          <button
            onClick={() => addScene(-1)}
            className="mt-4 mx-auto flex items-center gap-2 px-4 py-2 bg-transparent border border-editorial-paper text-editorial-paper hover:bg-editorial-paper hover:text-editorial-bg font-sans text-[11px] uppercase tracking-[1px] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Scene
          </button>
        </div>
      )}
    </div>
  );
};

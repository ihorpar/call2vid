import React from 'react';
import { Scene, SceneType, Role, Settings } from '../types';
import { Trash2, Plus, Clock, GripVertical, AlignLeft, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-[var(--color-surface-800)] bg-[var(--color-surface-900)] shrink-0">
        <div className="font-semibold text-xs text-white">Timeline</div>
        <div className="flex gap-1 bg-[var(--color-surface-950)] p-0.5 rounded-md border border-[var(--color-surface-800)]">
          {(['all', 'transcript', 'feature'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2 py-0.5 text-[10px] font-medium rounded transition-all capitalize",
                filter === f 
                  ? "bg-[var(--color-surface-800)] text-white shadow-sm" 
                  : "text-[var(--color-surface-500)] hover:text-[var(--color-surface-100)]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence initial={false}>
          {filteredScenes.map((scene) => {
            const index = scenes.findIndex(s => s.id === scene.id);
            const isFeature = scene.type === 'feature';

            return (
              <motion.div 
                key={scene.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1
                }}
                className="relative group"
              >
                <div className={cn(
                  "p-3 transition-all flex gap-2 rounded-lg border shadow-sm",
                  isFeature 
                    ? "bg-[var(--color-accent-feature)]/5 border-[var(--color-accent-feature)]/20" 
                    : "bg-[var(--color-surface-900)] border-[var(--color-surface-800)] hover:border-[var(--color-surface-700)]"
                )}>
                  <div className="flex flex-col items-center justify-center gap-1 text-[var(--color-surface-600)]">
                    <button 
                      onClick={() => moveScene(index, -1)}
                      disabled={index === 0}
                      className="hover:text-[var(--color-accent-primary)] disabled:opacity-20 disabled:hover:text-[var(--color-surface-600)] transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button 
                      onClick={() => moveScene(index, 1)}
                      disabled={index === scenes.length - 1}
                      className="hover:text-[var(--color-accent-primary)] disabled:opacity-20 disabled:hover:text-[var(--color-surface-600)] transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isFeature ? (
                          <Zap className="w-3.5 h-3.5 text-[var(--color-accent-feature)]" />
                        ) : (
                          <AlignLeft className="w-3.5 h-3.5 text-[var(--color-accent-transcript)]" />
                        )}
                        <select
                          value={scene.type}
                          onChange={(e) => updateScene(scene.id, { type: e.target.value as SceneType, role: e.target.value === 'feature' ? 'system' : 'agent' })}
                          className={cn(
                            "text-[10px] font-bold bg-transparent border-none outline-none cursor-pointer",
                            isFeature ? "text-[var(--color-accent-feature)]" : "text-[var(--color-accent-transcript)]"
                          )}
                        >
                          <option value="transcript" className="bg-[var(--color-surface-900)]">Transcript</option>
                          <option value="feature" className="bg-[var(--color-surface-900)]">Feature</option>
                        </select>

                        {scene.type === 'transcript' && (
                          <>
                            <span className="text-[var(--color-surface-700)] text-[10px]">•</span>
                            <select
                              value={scene.role}
                              onChange={(e) => updateScene(scene.id, { role: e.target.value as Role })}
                              className="text-[10px] font-semibold text-[var(--color-surface-400)] bg-transparent border-none outline-none cursor-pointer hover:text-white"
                            >
                              <option value="agent" className="bg-[var(--color-surface-900)]">{settings.agentLabel}</option>
                              <option value="user" className="bg-[var(--color-surface-900)]">{settings.userLabel}</option>
                            </select>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[var(--color-surface-500)] text-[10px] font-mono bg-[var(--color-surface-950)] px-1.5 py-0.5 rounded border border-[var(--color-surface-800)]">
                          <Clock className="w-2.5 h-2.5" />
                          <input
                            type="number"
                            step="0.1"
                            value={(scene.durationInFrames / 30).toFixed(1)}
                            onChange={(e) => updateScene(scene.id, { durationInFrames: Math.round(parseFloat(e.target.value) * 30) || 30 })}
                            className="w-8 bg-transparent text-right outline-none text-white"
                          />
                          <span className="text-[var(--color-surface-600)]">s</span>
                        </div>
                        
                        <button
                          onClick={() => removeScene(scene.id)}
                          className="text-[var(--color-surface-600)] hover:text-red-400 transition-colors"
                          title="Delete scene"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={scene.text}
                      onChange={(e) => updateScene(scene.id, { text: e.target.value })}
                      className={cn(
                        "w-full bg-[var(--color-surface-950)] border p-2 text-xs text-[var(--color-surface-200)] outline-none resize-none leading-relaxed rounded transition-colors",
                        isFeature 
                          ? "border-[var(--color-accent-feature)]/20 focus:border-[var(--color-accent-feature)]" 
                          : "border-[var(--color-surface-800)] focus:border-[var(--color-accent-primary)]"
                      )}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => addScene(index)}
                    className="bg-[var(--color-surface-800)] text-white p-1 rounded-full shadow-lg hover:bg-[var(--color-surface-700)] transition-all border border-[var(--color-surface-600)]"
                    title="Add scene below"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {scenes.length === 0 && (
          <div className="text-center py-16 text-[var(--color-surface-500)] flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-900)] flex items-center justify-center border border-[var(--color-surface-800)]">
              <AlignLeft className="w-8 h-8 text-[var(--color-surface-600)]" />
            </div>
            <p className="text-sm">No scenes yet. Generate from transcript or add one manually.</p>
            <button
              onClick={() => addScene(-1)}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-[var(--color-accent-primary)] text-white rounded-md hover:bg-[var(--color-accent-primary-hover)] text-sm font-medium transition-colors shadow-lg shadow-[var(--color-accent-primary)]/20"
            >
              <Plus className="w-4 h-4" />
              Add First Scene
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

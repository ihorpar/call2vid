import React from 'react';
import { Settings } from '../types';
import { Settings as SettingsIcon, X } from 'lucide-react';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<Props> = ({ settings, onChange, onClose }) => {
  return (
    <div className="absolute inset-0 bg-editorial-bg/95 backdrop-blur-sm z-[100] p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-5 h-5 text-editorial-accent" />
          <h2 className="font-serif italic text-2xl">Settings</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-md flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[2px] text-editorial-muted">
            AI Agent Label
          </label>
          <input 
            type="text"
            value={settings.agentLabel}
            onChange={(e) => onChange({ ...settings, agentLabel: e.target.value })}
            className="bg-transparent border border-editorial-border p-3 text-editorial-paper outline-none focus:border-editorial-accent transition-colors"
            placeholder="e.g. AI Agent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[2px] text-editorial-muted">
            User Label
          </label>
          <input 
            type="text"
            value={settings.userLabel}
            onChange={(e) => onChange({ ...settings, userLabel: e.target.value })}
            className="bg-transparent border border-editorial-border p-3 text-editorial-paper outline-none focus:border-editorial-accent transition-colors"
            placeholder="e.g. Customer"
          />
        </div>

        <div className="mt-4 p-4 border border-editorial-border bg-white/5 text-[12px] text-editorial-muted leading-relaxed">
          These labels will be used in the video preview and are persisted in your browser's local storage.
        </div>
      </div>
    </div>
  );
};

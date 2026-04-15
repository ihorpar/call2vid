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
    <div className="absolute inset-0 bg-[var(--color-surface-950)]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface-900)] border border-[var(--color-surface-800)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-surface-800)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-800)] flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-[var(--color-surface-300)]" />
            </div>
            <h2 className="font-semibold text-lg text-white">Project Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[var(--color-surface-400)] hover:text-white hover:bg-[var(--color-surface-800)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--color-surface-300)]">
              AI Agent Label
            </label>
            <input 
              type="text"
              value={settings.agentLabel}
              onChange={(e) => onChange({ ...settings, agentLabel: e.target.value })}
              className="bg-[var(--color-surface-950)] border border-[var(--color-surface-800)] rounded-lg p-3 text-white outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
              placeholder="e.g. AI Agent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--color-surface-300)]">
              User Label
            </label>
            <input 
              type="text"
              value={settings.userLabel}
              onChange={(e) => onChange({ ...settings, userLabel: e.target.value })}
              className="bg-[var(--color-surface-950)] border border-[var(--color-surface-800)] rounded-lg p-3 text-white outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
              placeholder="e.g. Customer"
            />
          </div>

          <div className="mt-2 p-4 rounded-lg border border-[var(--color-surface-800)] bg-[var(--color-surface-950)] text-sm text-[var(--color-surface-400)] leading-relaxed">
            These labels will be used in the video preview and are persisted in your browser's local storage.
          </div>
        </div>
      </div>
    </div>
  );
};

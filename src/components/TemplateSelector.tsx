import React from 'react';
import { TemplateType } from '../types';
import { cn } from '../lib/utils';
import { LayoutTemplate } from 'lucide-react';

interface Props {
  value: TemplateType;
  onChange: (template: TemplateType) => void;
}

export const TemplateSelector: React.FC<Props> = ({ value, onChange }) => {
  const templates: { id: TemplateType; name: string; desc: string }[] = [
    { id: 'modern', name: 'Editorial Noir', desc: 'Dark, sophisticated editorial style' },
    { id: 'minimal', name: 'Swiss Minimal', desc: 'Clean, grid-based high contrast' },
    { id: 'glass', name: 'SaaS Glass', desc: 'Modern glassmorphism with depth' },
    { id: 'brutalist', name: 'Neo Brutalist', desc: 'High-impact high-contrast design' },
  ];

  return (
    <div className="flex items-center gap-2 bg-[var(--color-surface-950)] border border-[var(--color-surface-800)] rounded-md px-3 py-1.5">
      <LayoutTemplate className="w-4 h-4 text-[var(--color-surface-400)]" />
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value as TemplateType)}
        className="bg-transparent border-none text-sm font-medium text-white outline-none cursor-pointer"
      >
        {templates.map(t => (
          <option key={t.id} value={t.id} className="bg-[var(--color-surface-900)] text-white">{t.name}</option>
        ))}
      </select>
    </div>
  );
};

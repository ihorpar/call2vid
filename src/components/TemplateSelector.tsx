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
    <div className="flex items-center gap-3">
      <div className="text-[10px] uppercase tracking-[1px] text-editorial-muted whitespace-nowrap">
        Template:
      </div>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value as TemplateType)}
        className="bg-transparent border-none text-editorial-accent text-[11px] uppercase tracking-[1px] outline-none cursor-pointer font-bold"
      >
        {templates.map(t => (
          <option key={t.id} value={t.id} className="bg-editorial-bg text-editorial-paper">{t.name}</option>
        ))}
      </select>
    </div>
  );
};

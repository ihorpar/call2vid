export type SceneType = 'transcript' | 'feature';
export type Role = 'agent' | 'user' | 'system';
export type Orientation = 'landscape' | 'portrait';

export interface Scene {
  id: string;
  type: SceneType;
  role: Role;
  text: string;
  durationInFrames: number;
  audioStart?: number;
  audioEnd?: number;
}

export type TemplateType = 'modern' | 'minimal' | 'glass' | 'brutalist';

export interface Settings {
  agentLabel: string;
  userLabel: string;
}

export interface VideoProps {
  scenes: Scene[];
  template: TemplateType;
  orientation: Orientation;
  audioUrl?: string;
  settings: Settings;
}

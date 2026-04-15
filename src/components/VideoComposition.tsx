import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Scene, VideoProps, Settings } from '../types';
import { cn } from '../lib/utils';
import React from 'react';

const ModernScene: React.FC<{ scene: Scene; settings: Settings }> = ({ scene, settings }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp' });

  if (scene.type === 'feature') {
    return (
      <AbsoluteFill className="pointer-events-none flex flex-col items-center pt-[10%] z-50">
        <div 
          style={{ opacity, transform: `translateY(${translateY}px)` }}
          className="flex items-center gap-6 bg-editorial-bg/95 backdrop-blur-xl border-2 border-editorial-accent px-12 py-6 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        >
          <div className="w-12 h-12 rounded-full border-4 border-editorial-accent flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 bg-editorial-accent rounded-full opacity-40" />
          </div>
          <h2 className="text-5xl font-serif italic tracking-tight text-editorial-paper uppercase">{scene.text}</h2>
        </div>
      </AbsoluteFill>
    );
  }

  const isAgent = scene.role === 'agent';

  return (
    <AbsoluteFill className="bg-editorial-bg flex flex-col justify-center p-20">
      <div 
        style={{ opacity, transform: `translateY(${translateY}px)` }}
        className={cn(
          "w-[65%] p-16 flex flex-col gap-10 border-l-[16px]",
          isAgent 
            ? "bg-[#1A1A1A] border-editorial-accent text-editorial-paper shadow-[30px_30px_80px_rgba(0,0,0,0.5)] self-start" 
            : "bg-[#121212] border-editorial-border text-editorial-paper/90 self-end"
        )}
      >
        <div className={cn(
          "text-3xl font-bold uppercase tracking-[6px]",
          isAgent ? "text-editorial-accent" : "text-editorial-muted"
        )}>
          {isAgent ? settings.agentLabel : settings.userLabel}
        </div>
        <div className="text-7xl font-sans leading-[1.1] font-light tracking-tight text-left line-clamp-5">
          {scene.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MinimalScene: React.FC<{ scene: Scene; settings: Settings }> = ({ scene, settings }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 15], [40, 0], { extrapolateRight: 'clamp' });

  if (scene.type === 'feature') {
    return (
      <AbsoluteFill className="pointer-events-none flex flex-col items-center pt-[10%] z-50">
        <div style={{ opacity, transform: `translateY(${translateY}px)` }} className="bg-white border-[6px] border-black px-12 py-6 shadow-[16px_16px_0px_rgba(0,0,0,0.2)]">
          <div className="text-5xl font-serif italic text-black tracking-tighter uppercase">
            {scene.text}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const isAgent = scene.role === 'agent';

  return (
    <AbsoluteFill className="bg-[#F5F5F0] flex flex-col justify-center p-32">
      {/* Swiss Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      
      <div 
        style={{ opacity, transform: `translateY(${translateY}px)` }}
        className={cn(
          "w-[75%] flex flex-col gap-10 relative",
          isAgent ? "self-start" : "self-end"
        )}
      >
        {/* Swiss Red Accent */}
        <div className={cn(
          "absolute -left-10 top-0 bottom-0 w-2 bg-[#E62E2D]",
          !isAgent && "hidden"
        )} />
        
        <div className="flex flex-col">
          <div className="text-2xl font-black uppercase tracking-[8px] text-black/40 border-b-4 border-black/20 pb-3 w-fit pr-4">
            {isAgent ? settings.agentLabel : settings.userLabel}
          </div>
        </div>

        <div className="text-7xl font-serif leading-[1.15] text-black text-left italic tracking-tight line-clamp-5">
          {scene.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const GlassScene: React.FC<{ scene: Scene; settings: Settings }> = ({ scene, settings }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const blur = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: 'clamp' });

  if (scene.type === 'feature') {
    return (
      <AbsoluteFill className="pointer-events-none flex flex-col items-center pt-[10%] z-50">
        <div style={{ opacity, backdropFilter: `blur(${blur}px)` }} className="bg-white/20 border-2 border-white/40 px-12 py-6 rounded-full shadow-[0_0_60px_rgba(168,85,247,0.4)]">
          <div className="text-5xl font-black text-white uppercase tracking-[0.1em]">
            {scene.text}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const isAgent = scene.role === 'agent';

  return (
    <AbsoluteFill className="bg-[#080808] flex flex-col justify-center p-24">
      <div className="absolute inset-0 opacity-40">
        <div className={cn(
          "absolute w-[800px] h-[800px] rounded-full blur-[200px] transition-all duration-1000",
          isAgent ? "top-[-10%] left-[-10%] bg-blue-600/40" : "bottom-[-10%] right-[-10%] bg-fuchsia-600/40"
        )} />
      </div>
      <div 
        style={{ opacity, backdropFilter: `blur(${blur}px)` }}
        className={cn(
          "w-[65%] p-20 rounded-[64px] border border-white/10 bg-white/5 shadow-2xl flex flex-col gap-12",
          isAgent ? "self-start" : "self-end"
        )}
      >
        <div className={cn(
          "text-2xl font-bold uppercase tracking-[8px]",
          isAgent ? "text-blue-400" : "text-fuchsia-400"
        )}>
          {isAgent ? settings.agentLabel : settings.userLabel}
        </div>
        <div className="text-7xl font-medium text-white leading-[1.1] tracking-tight text-left line-clamp-5">
          {scene.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BrutalistScene: React.FC<{ scene: Scene; settings: Settings }> = ({ scene, settings }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const springValue = spring({ frame, fps: 30, config: { damping: 12 } });

  if (scene.type === 'feature') {
    return (
      <AbsoluteFill className="pointer-events-none flex flex-col items-center pt-[10%] z-50">
        <div 
          style={{ opacity, transform: `scale(${springValue}) rotate(-1.5deg)` }} 
          className="bg-[#FFFF00] text-black px-12 py-6 border-[10px] border-black shadow-[20px_20px_0px_rgba(0,0,0,1)]"
        >
          <div className="text-5xl font-black uppercase tracking-tighter leading-none">
            {scene.text}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const isAgent = scene.role === 'agent';

  return (
    <AbsoluteFill className="bg-white flex flex-col justify-center p-24">
      <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      
      <div 
        style={{ opacity, transform: `translateX(${interpolate(frame, [0, 15], [isAgent ? -100 : 100, 0], { extrapolateRight: 'clamp' })}px)` }}
        className={cn(
          "w-[75%] flex flex-col gap-0",
          isAgent ? "self-start" : "self-end"
        )}
      >
        <div className={cn(
          "w-fit px-10 py-4 border-[8px] border-black text-4xl font-black uppercase tracking-widest shadow-[10px_10px_0px_rgba(0,0,0,1)] z-10",
          isAgent ? "bg-[#FFFF00] text-black" : "bg-black text-white"
        )}>
          {isAgent ? settings.agentLabel : settings.userLabel}
        </div>
        
        <div className={cn(
          "p-16 border-[8px] border-black bg-white shadow-[15px_15px_0px_rgba(0,0,0,1)] -mt-2",
          isAgent ? "border-l-[24px]" : "border-r-[24px]"
        )}>
          <div className="text-8xl font-black leading-[1] text-black text-left tracking-tight line-clamp-5">
            {scene.text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VideoComposition: React.FC<VideoProps> = ({ scenes, template, audioUrl, settings }) => {
  let currentTranscriptFrame = 0;
  const { fps } = useVideoConfig();

  const scenesWithTiming = scenes.map((scene) => {
    const startFrame = currentTranscriptFrame;
    if (scene.type === 'transcript') {
      currentTranscriptFrame += scene.durationInFrames;
    }
    return { scene, startFrame };
  });

  return (
    <AbsoluteFill className="bg-editorial-bg">
      {/* Render transcripts first so they are in the background */}
      {scenesWithTiming.filter(s => s.scene.type === 'transcript').map(({ scene, startFrame }) => (
        <Sequence
          key={scene.id}
          from={startFrame}
          durationInFrames={scene.durationInFrames}
        >
          {audioUrl && scene.audioStart !== undefined && scene.audioEnd !== undefined && (
            <Audio 
              src={audioUrl} 
              startFrom={Math.round(scene.audioStart * fps)} 
              endAt={Math.round(scene.audioEnd * fps)} 
            />
          )}
          {template === 'modern' && <ModernScene scene={scene} settings={settings} />}
          {template === 'minimal' && <MinimalScene scene={scene} settings={settings} />}
          {template === 'glass' && <GlassScene scene={scene} settings={settings} />}
          {template === 'brutalist' && <BrutalistScene scene={scene} settings={settings} />}
        </Sequence>
      ))}

      {/* Render features on top */}
      {scenesWithTiming.filter(s => s.scene.type === 'feature').map(({ scene, startFrame }) => (
        <Sequence
          key={scene.id}
          from={startFrame}
          durationInFrames={scene.durationInFrames}
        >
          {template === 'modern' && <ModernScene scene={scene} settings={settings} />}
          {template === 'minimal' && <MinimalScene scene={scene} settings={settings} />}
          {template === 'glass' && <GlassScene scene={scene} settings={settings} />}
          {template === 'brutalist' && <BrutalistScene scene={scene} settings={settings} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

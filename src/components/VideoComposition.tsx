import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate, Audio } from 'remotion';
import { Scene, VideoProps, Settings } from '../types';
import { cn } from '../lib/utils';
import React from 'react';

const ModernScene: React.FC<{ scene: Scene; settings: Settings; isPortrait: boolean }> = ({ scene, settings, isPortrait }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp' });

  if (scene.type === 'feature') {
    return (
      <AbsoluteFill className={cn("pointer-events-none flex flex-col items-center z-50", isPortrait ? "pt-[30%]" : "pt-[10%]")}>
        <div 
          style={{ opacity, transform: `translateY(${translateY}px)` }}
          className={cn(
            "flex items-center gap-6 bg-[#0C0C0C]/95 backdrop-blur-xl border-2 border-[#E2FF4D] rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)]",
            isPortrait ? "px-10 py-6 gap-5 rounded-[40px] border-4" : "px-12 py-6 gap-6"
          )}
        >
          <div className={cn("rounded-full border-[#E2FF4D] flex items-center justify-center animate-pulse", isPortrait ? "w-10 h-10 border-4" : "w-12 h-12 border-4")}>
            <div className={cn("bg-[#E2FF4D] rounded-full opacity-40", isPortrait ? "w-5 h-5" : "w-6 h-6")} />
          </div>
          <h2 className={cn("font-serif italic tracking-tight text-[#F5F2ED] uppercase", isPortrait ? "text-5xl" : "text-5xl")}>{scene.text}</h2>
        </div>
      </AbsoluteFill>
    );
  }

  const isAgent = scene.role === 'agent';

  return (
    <AbsoluteFill className={cn("bg-[#0C0C0C] flex flex-col justify-center", isPortrait ? "p-8" : "p-20")}>
      <div 
        style={{ opacity, transform: `translateY(${translateY}px)` }}
        className={cn(
          "flex flex-col border-l-[16px]",
          isPortrait ? "w-full p-12 gap-8 border-l-[12px]" : "w-[65%] p-16 gap-10 border-l-[16px]",
          isAgent 
            ? "bg-[#1A1A1A] border-[#E2FF4D] text-[#F5F2ED] shadow-[30px_30px_80px_rgba(0,0,0,0.5)] self-start" 
            : "bg-[#121212] border-[#F5F2ED]/15 text-[#F5F2ED]/90 self-end"
        )}
      >
        <div className={cn(
          "font-bold uppercase tracking-[6px]",
          isPortrait ? "text-2xl tracking-[4px]" : "text-3xl tracking-[6px]",
          isAgent ? "text-[#E2FF4D]" : "text-[#F5F2ED]/40"
        )}>
          {isAgent ? settings.agentLabel : settings.userLabel}
        </div>
        <div className={cn(
          "font-sans leading-[1.1] font-light tracking-tight text-left line-clamp-6",
          isPortrait ? "text-6xl" : "text-7xl"
        )}>
          {scene.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MinimalScene: React.FC<{ scene: Scene; settings: Settings; isPortrait: boolean }> = ({ scene, settings, isPortrait }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 15], [40, 0], { extrapolateRight: 'clamp' });

  if (scene.type === 'feature') {
    return (
      <AbsoluteFill className={cn("pointer-events-none flex flex-col items-center z-50", isPortrait ? "pt-[30%]" : "pt-[10%]")}>
        <div style={{ opacity, transform: `translateY(${translateY}px)` }} className={cn("bg-white border-black shadow-[16px_16px_0px_rgba(0,0,0,0.2)]", isPortrait ? "px-10 py-6 border-[6px]" : "px-12 py-6 border-[6px]")}>
          <div className={cn("font-serif italic text-black tracking-tighter uppercase", isPortrait ? "text-5xl" : "text-5xl")}>
            {scene.text}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const isAgent = scene.role === 'agent';

  return (
    <AbsoluteFill className={cn("bg-[#F5F5F0] flex flex-col justify-center", isPortrait ? "p-10" : "p-32")}>
      {/* Swiss Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      
      <div 
        style={{ opacity, transform: `translateY(${translateY}px)` }}
        className={cn(
          "flex flex-col gap-10 relative",
          isPortrait ? "w-full gap-8" : "w-[75%] gap-10",
          isAgent ? "self-start" : "self-end"
        )}
      >
        {/* Swiss Red Accent */}
        <div className={cn(
          "absolute top-0 bottom-0 bg-[#E62E2D]",
          isPortrait ? "-left-6 w-2" : "-left-10 w-2",
          !isAgent && "hidden"
        )} />
        
        <div className="flex flex-col">
          <div className={cn("font-black uppercase tracking-[8px] text-black/40 border-b-4 border-black/20 pb-3 w-fit pr-4", isPortrait ? "text-2xl tracking-[4px]" : "text-2xl tracking-[8px]")}>
            {isAgent ? settings.agentLabel : settings.userLabel}
          </div>
        </div>

        <div className={cn("font-serif leading-[1.15] text-black text-left italic tracking-tight line-clamp-6", isPortrait ? "text-6xl" : "text-7xl")}>
          {scene.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const GlassScene: React.FC<{ scene: Scene; settings: Settings; isPortrait: boolean }> = ({ scene, settings, isPortrait }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const blur = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: 'clamp' });

  if (scene.type === 'feature') {
    return (
      <AbsoluteFill className={cn("pointer-events-none flex flex-col items-center z-50", isPortrait ? "pt-[30%]" : "pt-[10%]")}>
        <div style={{ opacity, backdropFilter: `blur(${blur}px)` }} className={cn("bg-white/20 border-2 border-white/40 rounded-full shadow-[0_0_60px_rgba(168,85,247,0.4)]", isPortrait ? "px-10 py-6" : "px-12 py-6")}>
          <div className={cn("font-black text-white uppercase tracking-[0.1em]", isPortrait ? "text-5xl" : "text-5xl")}>
            {scene.text}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const isAgent = scene.role === 'agent';

  return (
    <AbsoluteFill className={cn("bg-[#080808] flex flex-col justify-center", isPortrait ? "p-8" : "p-24")}>
      <div className="absolute inset-0 opacity-40">
        <div className={cn(
          "absolute w-[800px] h-[800px] rounded-full blur-[200px] transition-all duration-1000",
          isAgent ? "top-[-10%] left-[-10%] bg-blue-600/40" : "bottom-[-10%] right-[-10%] bg-fuchsia-600/40"
        )} />
      </div>
      <div 
        style={{ opacity, backdropFilter: `blur(${blur}px)` }}
        className={cn(
          "rounded-[64px] border border-white/10 bg-white/5 shadow-2xl flex flex-col",
          isPortrait ? "w-full p-12 gap-8 rounded-[48px]" : "w-[65%] p-20 gap-12 rounded-[64px]",
          isAgent ? "self-start" : "self-end"
        )}
      >
        <div className={cn(
          "font-bold uppercase tracking-[8px]",
          isPortrait ? "text-2xl tracking-[4px]" : "text-2xl tracking-[8px]",
          isAgent ? "text-blue-400" : "text-fuchsia-400"
        )}>
          {isAgent ? settings.agentLabel : settings.userLabel}
        </div>
        <div className={cn("font-medium text-white leading-[1.1] tracking-tight text-left line-clamp-6", isPortrait ? "text-6xl" : "text-7xl")}>
          {scene.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BrutalistScene: React.FC<{ scene: Scene; settings: Settings; isPortrait: boolean }> = ({ scene, settings, isPortrait }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const springValue = spring({ frame, fps: 30, config: { damping: 12 } });

  if (scene.type === 'feature') {
    return (
      <AbsoluteFill className={cn("pointer-events-none flex flex-col items-center z-50", isPortrait ? "pt-[30%]" : "pt-[10%]")}>
        <div 
          style={{ opacity, transform: `scale(${springValue}) rotate(-1.5deg)` }} 
          className={cn("bg-[#FFFF00] text-black border-black shadow-[20px_20px_0px_rgba(0,0,0,1)]", isPortrait ? "px-10 py-6 border-[8px] shadow-[12px_12px_0px_rgba(0,0,0,1)]" : "px-12 py-6 border-[10px] shadow-[20px_20px_0px_rgba(0,0,0,1)]")}
        >
          <div className={cn("font-black uppercase tracking-tighter leading-none", isPortrait ? "text-5xl" : "text-5xl")}>
            {scene.text}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const isAgent = scene.role === 'agent';

  return (
    <AbsoluteFill className={cn("bg-white flex flex-col justify-center", isPortrait ? "p-10" : "p-24")}>
      <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      
      <div 
        style={{ opacity, transform: `translateX(${interpolate(frame, [0, 15], [isAgent ? -100 : 100, 0], { extrapolateRight: 'clamp' })}px)` }}
        className={cn(
          "flex flex-col gap-0",
          isPortrait ? "w-full" : "w-[75%]",
          isAgent ? "self-start" : "self-end"
        )}
      >
        <div className={cn(
          "w-fit border-black font-black uppercase tracking-widest shadow-[10px_10px_0px_rgba(0,0,0,1)] z-10",
          isPortrait ? "px-8 py-3 border-[6px] text-3xl shadow-[8px_8px_0px_rgba(0,0,0,1)]" : "px-10 py-4 border-[8px] text-4xl",
          isAgent ? "bg-[#FFFF00] text-black" : "bg-black text-white"
        )}>
          {isAgent ? settings.agentLabel : settings.userLabel}
        </div>
        
        <div className={cn(
          "border-black bg-white shadow-[15px_15px_0px_rgba(0,0,0,1)] -mt-2",
          isPortrait ? "p-10 border-[6px] shadow-[10px_10px_0px_rgba(0,0,0,1)]" : "p-16 border-[8px] shadow-[15px_15px_0px_rgba(0,0,0,1)]",
          isAgent ? (isPortrait ? "border-l-[16px]" : "border-l-[24px]") : (isPortrait ? "border-r-[16px]" : "border-r-[24px]")
        )}>
          <div className={cn("font-black leading-[1] text-black text-left tracking-tight line-clamp-6", isPortrait ? "text-7xl" : "text-8xl")}>
            {scene.text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VideoComposition: React.FC<VideoProps> = ({ scenes, template, audioUrl, settings, orientation }) => {
  let currentTranscriptFrame = 0;
  const { fps, width, height } = useVideoConfig();
  const isPortrait = orientation === 'portrait';

  const scenesWithTiming = scenes.map((scene) => {
    const startFrame = currentTranscriptFrame;
    if (scene.type === 'transcript') {
      currentTranscriptFrame += scene.durationInFrames;
    }
    return { scene, startFrame };
  });

  const renderScene = (scene: Scene) => {
    const props = { scene, settings };
    
    // Adjust styles based on orientation
    const containerPadding = isPortrait ? 'p-10' : 'p-20';
    const cardWidth = isPortrait ? 'w-full' : 'w-[65%]';
    const featurePt = isPortrait ? 'pt-[20%]' : 'pt-[10%]';
    const textSize = isPortrait ? 'text-4xl' : 'text-7xl';
    const labelSize = isPortrait ? 'text-xl' : 'text-3xl';

    if (template === 'modern') {
      return <ModernScene {...props} isPortrait={isPortrait} />;
    }
    if (template === 'minimal') {
      return <MinimalScene {...props} isPortrait={isPortrait} />;
    }
    if (template === 'glass') {
      return <GlassScene {...props} isPortrait={isPortrait} />;
    }
    if (template === 'brutalist') {
      return <BrutalistScene {...props} isPortrait={isPortrait} />;
    }
    return null;
  };

  return (
    <AbsoluteFill className="bg-[#0C0C0C]">
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
          {renderScene(scene)}
        </Sequence>
      ))}

      {/* Render features on top */}
      {scenesWithTiming.filter(s => s.scene.type === 'feature').map(({ scene, startFrame }) => (
        <Sequence
          key={scene.id}
          from={startFrame}
          durationInFrames={scene.durationInFrames}
        >
          {renderScene(scene)}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

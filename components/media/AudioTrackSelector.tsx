"use client";

import { useState, useRef, useEffect } from "react";
import {
  CURATED_AUDIO_TRACKS,
  AudioTrackItem,
} from "@/lib/audio-tracks";
import {
  Play,
  Pause,
  MusicNotes,
  CheckCircle,
  Sparkle,
} from "@phosphor-icons/react";

interface AudioTrackSelectorProps {
  selectedTrackUrl: string;
  onChange: (url: string, trackInfo?: AudioTrackItem) => void;
  templateDefaultUrl?: string;
}

export function AudioTrackSelector({
  selectedTrackUrl,
  onChange,
  templateDefaultUrl = "/audio/wedding-ambience.mp3",
}: AudioTrackSelectorProps) {
  const [activeTab, setActiveTab] = useState<"all" | "indian" | "pakistani" | "sufi" | "classical">("all");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handleTogglePlay = (track: AudioTrackItem) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setAudioProgress(0);
      };
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current && audioRef.current.duration) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setAudioProgress(pct);
        }
      };
    }

    if (playingTrackId === track.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = track.url;
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback error:", err);
      });
      setPlayingTrackId(track.id);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track: AudioTrackItem) => {
    onChange(track.url, track);
  };

  const filteredTracks =
    activeTab === "all"
      ? CURATED_AUDIO_TRACKS
      : CURATED_AUDIO_TRACKS.filter((t) => {
          if (activeTab === "indian") return t.category === "indian";
          if (activeTab === "pakistani") return t.category === "pakistani";
          if (activeTab === "sufi") return t.category === "sufi";
          if (activeTab === "classical") return t.category === "classical" || t.category === "universal";
          return true;
        });

  return (
    <div className="space-y-3.5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <MusicNotes className="h-4 w-4 text-amber-600" weight="fill" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Wedding Soundtrack &amp; Background Audio
            </h4>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Select a signature romantic soundtrack from the curated collection below ({CURATED_AUDIO_TRACKS.length} Masterpieces).
          </p>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {[
          { id: "all", label: "All Masterpieces", icon: "✨" },
          { id: "indian", label: "Trending Indian (Bollywood)", icon: "🇮🇳" },
          { id: "pakistani", label: "Trending Pakistani (Coke Studio)", icon: "🇵🇰" },
          { id: "sufi", label: "Sacred Nikah & Sufi", icon: "🌙" },
          { id: "classical", label: "Royal Shehnai & Sitar", icon: "✦" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-[#073D31] text-[#E1C98E] shadow-sm ring-2 ring-[#073D31]/20"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* AUDIO TRACKS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 py-1">
        {filteredTracks.map((track) => {
          const isSelected = selectedTrackUrl === track.url;
          const isCurrentPlaying = playingTrackId === track.id && isPlaying;

          return (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track)}
              className={`group relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? "bg-amber-50/70 border-amber-600 shadow-sm ring-2 ring-amber-500/20"
                  : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 shadow-2xs"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Play / Pause Circular Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay(track);
                  }}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer shadow-xs ${
                    isCurrentPlaying
                      ? "bg-amber-600 text-white animate-pulse"
                      : isSelected
                      ? "bg-amber-600/90 text-white hover:bg-amber-700"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white"
                  }`}
                  title={isCurrentPlaying ? "Pause preview" : "Listen to preview"}
                >
                  {isCurrentPlaying ? (
                    <Pause size={18} weight="fill" />
                  ) : (
                    <Play size={18} weight="fill" className="translate-x-0.5" />
                  )}
                </button>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs">{track.flag}</span>
                      <h5 className="text-xs font-bold text-stone-900 truncate">
                        {track.title}
                      </h5>
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle size={13} weight="fill" className="text-amber-600" />
                        <span>Selected</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-medium text-stone-600 truncate mt-0.5">
                    {track.artist}
                  </p>

                  <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                    {track.description}
                  </p>
                </div>
              </div>

              {/* Bottom Meta & Equalizer */}
              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  {track.tag && (
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-semibold text-[9px] uppercase tracking-wider">
                      {track.tag}
                    </span>
                  )}
                  <span className="text-stone-400 font-mono">{track.duration}</span>
                </div>

                {isCurrentPlaying ? (
                  <div className="flex items-center gap-1 text-amber-600 font-bold text-[10px]">
                    <span className="inline-block w-1 h-3 bg-amber-500 animate-bounce rounded-full" />
                    <span className="inline-block w-1 h-4 bg-amber-600 animate-bounce delay-100 rounded-full" />
                    <span className="inline-block w-1 h-2 bg-amber-500 animate-bounce delay-200 rounded-full" />
                    <span className="ml-1">Playing Preview</span>
                  </div>
                ) : (
                  <span className="text-stone-400 group-hover:text-stone-700 font-medium transition-colors">
                    Click to Select
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


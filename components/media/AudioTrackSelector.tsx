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
  YoutubeLogo,
  ArrowRight,
  CircleNotch,
  WarningCircle,
  Globe,
  CloudArrowUp,
  X,
  Check,
} from "@phosphor-icons/react";

interface AudioTrackSelectorProps {
  selectedTrackUrl: string;
  onChange: (url: string, trackInfo?: AudioTrackItem) => void;
  templateDefaultUrl?: string;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

export function AudioTrackSelector({
  selectedTrackUrl,
  onChange,
  templateDefaultUrl = "/audio/wedding-ambience.mp3",
}: AudioTrackSelectorProps) {
  const isSelectedYt = Boolean(selectedTrackUrl && (selectedTrackUrl.includes("yt-") || selectedTrackUrl.includes("cloudinary.com")));

  const [mainMode, setMainMode] = useState<"library" | "youtube" | "community">(
    isSelectedYt ? "community" : "library"
  );
  const [activeTab, setActiveTab] = useState<"all" | "indian" | "pakistani" | "sufi" | "classical">("all");
  
  // Audio playback preview state
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // YouTube processing state
  const [youtubeInput, setYoutubeInput] = useState<string>("");
  const [isProcessingYt, setIsProcessingYt] = useState<boolean>(false);
  const [ytError, setYtError] = useState<string | null>(null);
  
  // Community tracks state
  const [communityTracks, setCommunityTracks] = useState<AudioTrackItem[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState<boolean>(false);

  // Duplicate track modal state
  const [duplicateModalTrack, setDuplicateModalTrack] = useState<AudioTrackItem | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);

  const [customYtTrack, setCustomYtTrack] = useState<{
    title: string;
    artist: string;
    audioUrl: string;
    thumbnail?: string;
  } | null>(
    isSelectedYt
      ? {
          title: "Imported Wedding Soundtrack",
          artist: "YouTube / Cloud Audio",
          audioUrl: selectedTrackUrl,
        }
      : null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch community imported tracks
  const loadCommunityTracks = async () => {
    try {
      setIsLoadingCommunity(true);
      const res = await fetch("/api/audio/youtube");
      if (res.ok) {
        const data = await res.json();
        if (data.tracks && Array.isArray(data.tracks)) {
          setCommunityTracks(
            data.tracks.map((t: any) => ({
              id: t.id,
              title: t.title,
              artist: t.artist,
              url: t.audioUrl,
              category: t.category || "universal",
              categoryLabel: t.categoryLabel || "Community Imported",
              flag: t.storage === "cloudinary" ? "☁️" : "▶️",
              tag: t.storage === "cloudinary" ? "CLOUDINARY" : "IMPORTED",
              duration: t.duration || "Full Audio",
              description: t.description || `Imported song: ${t.title}`,
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Failed to load community tracks:", err);
    } finally {
      setIsLoadingCommunity(false);
    }
  };

  useEffect(() => {
    loadCommunityTracks();
  }, []);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const handleTogglePlayUrl = (trackId: string, trackUrl: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }

    if (playingTrackId === trackId && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = trackUrl;
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback error:", err);
      });
      setPlayingTrackId(trackId);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track: AudioTrackItem) => {
    onChange(track.url, track);
  };

  const handleProcessYoutube = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!youtubeInput.trim()) {
      setYtError("Please enter a YouTube video URL");
      return;
    }

    const videoId = extractYouTubeId(youtubeInput.trim());

    // 1. Client-Side Instant Duplicate Check
    if (videoId) {
      const existingCommunity = communityTracks.find(
        (t) => t.id === `yt-${videoId}` || (t.url && t.url.includes(videoId))
      );
      if (existingCommunity) {
        setDuplicateModalTrack(existingCommunity);
        setShowDuplicateModal(true);
        return;
      }
    }

    setIsProcessingYt(true);
    setYtError(null);

    try {
      const res = await fetch("/api/audio/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process YouTube link");
      }

      // 2. Server-Side Duplicate Check Trigger
      if (data.isDuplicate && data.track) {
        const dupTrack: AudioTrackItem = {
          id: data.track.id || `yt-${data.videoId}`,
          title: data.track.title || data.title,
          artist: data.track.artist || data.artist,
          url: data.track.audioUrl || data.audioUrl,
          category: data.track.category || "universal",
          categoryLabel: data.track.categoryLabel || "Community Library",
          flag: data.track.storage === "cloudinary" ? "☁️" : "▶️",
          tag: data.track.storage === "cloudinary" ? "CLOUDINARY" : "IMPORTED",
          duration: data.track.duration || "Full Audio",
          description: data.track.description || `Imported song: ${data.title}`,
        };
        setDuplicateModalTrack(dupTrack);
        setShowDuplicateModal(true);
        setIsProcessingYt(false);
        return;
      }

      const ytTrack = {
        title: data.title,
        artist: data.artist,
        audioUrl: data.audioUrl,
        thumbnail: data.thumbnail,
      };

      setCustomYtTrack(ytTrack);
      
      const newTrackItem: AudioTrackItem = {
        id: `yt-${data.videoId}`,
        title: data.title,
        artist: data.artist,
        url: data.audioUrl,
        category: "universal",
        categoryLabel: data.storage === "cloudinary" ? "Cloudinary Cloud" : "YouTube Imported",
        tag: data.storage === "cloudinary" ? "CLOUDINARY" : "YOUTUBE",
        duration: "Full Audio",
        description: `Imported song: ${data.title}`,
        flag: data.storage === "cloudinary" ? "☁️" : "▶️",
      };

      onChange(data.audioUrl, newTrackItem);

      // Auto-preview custom track
      handleTogglePlayUrl(`yt-${data.videoId}`, data.audioUrl);
      setYoutubeInput("");
      
      // Refresh community list so this track is immediately available to other templates
      await loadCommunityTracks();
      setMainMode("community");
    } catch (err: any) {
      console.error("YouTube import error:", err);
      setYtError(err.message || "Could not process this YouTube link. Please ensure it's a valid public video.");
    } finally {
      setIsProcessingYt(false);
    }
  };

  const handleConfirmSelectDuplicate = () => {
    if (duplicateModalTrack) {
      onChange(duplicateModalTrack.url, duplicateModalTrack);
      handleTogglePlayUrl(duplicateModalTrack.id, duplicateModalTrack.url);
      setCustomYtTrack({
        title: duplicateModalTrack.title,
        artist: duplicateModalTrack.artist,
        audioUrl: duplicateModalTrack.url,
      });
      setShowDuplicateModal(false);
      setYoutubeInput("");
      setMainMode("community");
    }
  };

  const filteredCuratedTracks =
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
    <div className="space-y-4">
      {/* TOP BAR: Mode Selector & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <MusicNotes className="h-4 w-4 text-amber-600" weight="fill" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Wedding Soundtrack &amp; Background Audio
            </h4>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Choose from trending masterpieces, reuse previously imported songs, or paste any YouTube link.
          </p>
        </div>

        {/* Source Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 self-start sm:self-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setMainMode("library")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mainMode === "library"
                ? "bg-white text-stone-900 shadow-xs border border-stone-200/80"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <span>✨</span>
            <span>Curated ({CURATED_AUDIO_TRACKS.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setMainMode("community")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mainMode === "community"
                ? "bg-[#073D31] text-[#E1C98E] shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Globe size={14} weight="bold" />
            <span>Community Library ({communityTracks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMainMode("youtube")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mainMode === "youtube"
                ? "bg-red-600 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <YoutubeLogo size={15} weight="fill" className={mainMode === "youtube" ? "text-white" : "text-red-600"} />
            <span>+ Import New</span>
          </button>
        </div>
      </div>

      {/* MODE 1: CURATED MASTERPIECES */}
      {mainMode === "library" && (
        <>
          {/* CATEGORY TABS */}
          <div className="flex flex-wrap items-center gap-1.5">
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
            {filteredCuratedTracks.map((track) => {
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
                        handleTogglePlayUrl(track.id, track.url);
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
        </>
      )}

      {/* MODE 2: COMMUNITY & IMPORTED TRACKS */}
      {mainMode === "community" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <Globe size={16} className="text-[#073D31]" />
              <span>Available for All Templates &amp; Users ({communityTracks.length})</span>
            </div>
            <button
              type="button"
              onClick={() => setMainMode("youtube")}
              className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            >
              <span>+ Import Another YouTube Song</span>
            </button>
          </div>

          {isLoadingCommunity ? (
            <div className="p-8 text-center text-stone-400 text-xs flex items-center justify-center gap-2">
              <CircleNotch size={16} className="animate-spin text-amber-600" />
              <span>Loading imported community tracks...</span>
            </div>
          ) : communityTracks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
              <Globe size={28} className="mx-auto text-stone-400" />
              <p className="text-xs font-bold text-stone-700">No imported songs yet</p>
              <p className="text-[11px] text-stone-500">
                Be the first to import a custom song from YouTube! It will be instantly saved for your invitation and available for others.
              </p>
              <button
                type="button"
                onClick={() => setMainMode("youtube")}
                className="mt-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
              >
                <YoutubeLogo size={15} weight="fill" />
                <span>Import YouTube Song</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 py-1">
              {communityTracks.map((track) => {
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
                          handleTogglePlayUrl(track.id, track.url);
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

                    {/* Bottom Meta */}
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
          )}
        </div>
      )}

      {/* MODE 3: YOUTUBE LINK IMPORTER */}
      {mainMode === "youtube" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50/80 border border-red-200/70 text-xs text-red-950">
              <YoutubeLogo size={20} weight="fill" className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[12px] text-red-900">
                  Import Any Wedding Song From YouTube
                </p>
                <p className="text-[11px] text-red-800/80 mt-0.5">
                  Copy and paste any YouTube link (song, instrumental, qawwali, or cover). The song is automatically extracted, stored in the cloud/server, and will be available for this and other templates!
                </p>
              </div>
            </div>

            <form onSubmit={handleProcessYoutube} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Paste YouTube Link
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={youtubeInput}
                      onChange={(e) => {
                        setYoutubeInput(e.target.value);
                        if (ytError) setYtError(null);
                      }}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      disabled={isProcessingYt}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:border-red-500 text-stone-900 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessingYt || !youtubeInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isProcessingYt ? (
                      <>
                        <CircleNotch size={15} className="animate-spin" />
                        <span>Checking &amp; Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Import &amp; Use Song</span>
                        <ArrowRight size={14} weight="bold" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {ytError && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  <WarningCircle size={16} weight="fill" className="shrink-0" />
                  <span>{ytError}</span>
                </div>
              )}
            </form>

            {/* ACTIVE / RECENTLY PROCESSED YOUTUBE TRACK */}
            {customYtTrack && (
              <div className="mt-4 pt-4 border-t border-stone-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Active Wedding Soundtrack
                </div>
                <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-500 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePlayUrl("custom-yt", customYtTrack.audioUrl)}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer shadow-xs ${
                        playingTrackId === "custom-yt" && isPlaying
                          ? "bg-amber-600 text-white animate-pulse"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white"
                      }`}
                      title="Listen to preview"
                    >
                      {playingTrackId === "custom-yt" && isPlaying ? (
                        <Pause size={20} weight="fill" />
                      ) : (
                        <Play size={20} weight="fill" className="translate-x-0.5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[9px] uppercase tracking-wider">
                          Active Song
                        </span>
                        <h5 className="text-xs font-bold text-stone-900 truncate">
                          {customYtTrack.title}
                        </h5>
                      </div>
                      <p className="text-[11px] text-stone-600 truncate mt-0.5">
                        {customYtTrack.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                    <CheckCircle size={14} weight="fill" className="text-emerald-600" />
                    <span>Active on Invitation</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DUPLICATE SONG DETECTED POPUP MODAL
          ───────────────────────────────────────────────────────────── */}
      {showDuplicateModal && duplicateModalTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Cross Button */}
            <button
              type="button"
              onClick={() => setShowDuplicateModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X size={18} weight="bold" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300/80 text-amber-700 shadow-xs">
                <MusicNotes size={26} weight="fill" />
              </div>
              <div className="pr-6">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full mb-1">
                  <Sparkle size={12} weight="fill" />
                  Already in Library
                </span>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  Song Already Uploaded!
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  We already have this song stored in the community library. You don't need to upload it again!
                </p>
              </div>
            </div>

            {/* Song Preview Card inside Modal */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() =>
                    handleTogglePlayUrl(
                      `dup-${duplicateModalTrack.id}`,
                      duplicateModalTrack.url
                    )
                  }
                  className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs ${
                    playingTrackId === `dup-${duplicateModalTrack.id}` && isPlaying
                      ? "bg-amber-600 text-white animate-pulse"
                      : "bg-white text-amber-700 border border-amber-300 hover:bg-amber-600 hover:text-white"
                  }`}
                  title={
                    playingTrackId === `dup-${duplicateModalTrack.id}` && isPlaying
                      ? "Pause preview"
                      : "Listen to preview"
                  }
                >
                  {playingTrackId === `dup-${duplicateModalTrack.id}` && isPlaying ? (
                    <Pause size={20} weight="fill" />
                  ) : (
                    <Play size={20} weight="fill" className="translate-x-0.5" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{duplicateModalTrack.flag}</span>
                    <h5 className="text-xs font-bold text-stone-900 truncate">
                      {duplicateModalTrack.title}
                    </h5>
                  </div>
                  <p className="text-[11px] font-medium text-stone-600 truncate mt-0.5">
                    {duplicateModalTrack.artist}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-semibold uppercase bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded">
                      {duplicateModalTrack.tag || "AVAILABLE"}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {duplicateModalTrack.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleConfirmSelectDuplicate}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#073D31] hover:bg-[#063329] text-[#E1C98E] font-bold text-xs tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check size={16} weight="bold" />
                <span>Select &amp; Use This Song</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDuplicateModal(false)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

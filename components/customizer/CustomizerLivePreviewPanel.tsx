"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  DeviceMobile,
  DeviceTablet,
  Laptop,
  ArrowsOut,
  X,
} from "@phosphor-icons/react";
import type { CulturalTradition } from "@/lib/pdf-theme-tokens";

type PreviewDevice = "mobile" | "tablet" | "laptop";

export interface CustomizerLivePreviewPanelHandle {
  openFullscreen: () => void;
}

interface CustomizerLivePreviewPanelProps {
  templateId: string;
  templateName: string;
  religion: CulturalTradition;
  musicTrack: string;
  /** Hide submit chrome in iframe (admin template settings). */
  adminPreview?: boolean;
}

const DEVICE_OPTIONS: {
  id: PreviewDevice;
  label: string;
  Icon: typeof DeviceMobile;
}[] = [
  { id: "mobile", label: "Mobile", Icon: DeviceMobile },
  { id: "tablet", label: "Tablet", Icon: DeviceTablet },
  { id: "laptop", label: "Laptop", Icon: Laptop },
];

function PreviewFrame({
  src,
  title,
  device,
  loaded,
  onLoad,
  edgeToEdge,
}: {
  src: string;
  title: string;
  device: PreviewDevice;
  loaded: boolean;
  onLoad: () => void;
  edgeToEdge?: boolean;
}) {
  if (edgeToEdge || device === "laptop") {
    return (
      <div className="relative h-full w-full min-h-0 bg-[#082F27]">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F7F4ED]">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#C8A45E]/30 border-t-[#C8A45E]" />
          </div>
        )}
        <iframe
          key={src}
          src={src}
          title={title}
          onLoad={onLoad}
          className="absolute inset-0 h-full w-full border-0 bg-[#082F27]"
          allow="autoplay"
        />
      </div>
    );
  }

  if (device === "tablet") {
    return (
      <div className="relative mx-auto h-full w-full max-w-3xl px-2">
        <div className="flex h-full min-h-0 flex-col rounded-[1.25rem] border-[5px] border-[#18211E] bg-[#18211E] p-1.5 shadow-lg">
          <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-[#C8A45E]/80" />
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span className="h-2 w-2 rounded-full bg-white/25" />
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-[#082F27]">
            {!loaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F7F4ED]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C8A45E]/30 border-t-[#C8A45E]" />
              </div>
            )}
            <iframe
              key={src}
              src={src}
              title={title}
              onLoad={onLoad}
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-full w-full max-w-[400px]">
      <div className="flex h-full min-h-0 flex-col rounded-[2.75rem] border-[5px] border-[#18211E] bg-[#18211E] p-[3px] shadow-lg">
        <div className="pointer-events-none absolute top-2.5 left-1/2 z-20 h-[22px] w-[28%] -translate-x-1/2 rounded-full bg-[#18211E]" />
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[2.4rem] bg-[#082F27]">
          {!loaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#F7F4ED]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C8A45E]/30 border-t-[#C8A45E]" />
            </div>
          )}
          <iframe
            key={src}
            src={src}
            title={title}
            onLoad={onLoad}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
}

export const CustomizerLivePreviewPanel = forwardRef<
  CustomizerLivePreviewPanelHandle,
  CustomizerLivePreviewPanelProps
>(function CustomizerLivePreviewPanel(
  { templateId, templateName, religion, musicTrack, adminPreview = false },
  ref
) {
  const [device, setDevice] = useState<PreviewDevice>("laptop");
  const [loaded, setLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useImperativeHandle(ref, () => ({
    openFullscreen: () => setIsFullscreen(true),
  }));

  const faith =
    religion === "muslim" ? "muslim" : religion === "hindu" ? "hindu" : "universal";

  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams({
      embed: "1",
      customizer: "1",
      faith,
      musicTrack,
    });
    if (adminPreview) params.set("adminPreview", "1");
    return `/preview/${templateId}/interactive?${params.toString()}`;
  }, [templateId, faith, musicTrack, adminPreview]);

  useEffect(() => {
    setLoaded(false);
  }, [iframeSrc, device]);

  const handleLoad = useCallback(() => setLoaded(true), []);

  const fullPreviewHref = `/preview/${templateId}/interactive?customizer=1&faith=${faith}&musicTrack=${encodeURIComponent(musicTrack)}`;

  return (
    <>
      <div className="flex h-full min-h-0 flex-col bg-[#E8E4DC]">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#073D31]/10 bg-[#F7F4ED] px-3 py-2 sm:px-4">
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#76766F]">
            Live preview
          </span>

          {/* Device Options — Hidden on mobile devices; only visible on desktop/laptop */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-[#073D31]/10 bg-white p-0.5">
            {DEVICE_OPTIONS.map(({ id, label, Icon }) => {
              const active = device === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDevice(id)}
                  aria-pressed={active}
                  title={label}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 font-sans text-[11px] font-bold transition-colors ${
                    active
                      ? "bg-[#073D31] text-[#F7F4ED]"
                      : "text-[#76766F] hover:bg-[#073D31]/5"
                  }`}
                >
                  <Icon size={16} weight={active ? "fill" : "regular"} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-full border border-[#073D31]/12 bg-white px-3 font-sans text-[11px] font-bold text-[#073D31] hover:border-[#C8A45E]/40"
            >
              <ArrowsOut size={15} weight="bold" />
              <span className="hidden sm:inline">Full screen</span>
            </button>
            <Link
              href={fullPreviewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1 px-2 font-sans text-xs font-semibold text-[#073D31] hover:text-[#C8A45E]"
            >
              Open tab
              <ArrowUpRight size={14} weight="bold" />
            </Link>
          </div>
        </div>

        <div
          className={`relative min-h-0 flex-1 overflow-hidden ${
            device === "laptop" ? "p-0" : "p-3 sm:p-4"
          }`}
        >
          <PreviewFrame
            src={iframeSrc}
            title={`${templateName} live preview`}
            device={device}
            loaded={loaded}
            onLoad={handleLoad}
          />
        </div>

        <p className="shrink-0 py-2 text-center font-sans text-[10px] font-bold uppercase tracking-wider text-[#76766F]">
          Updates as you edit · tap inside to interact
        </p>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[300] flex flex-col bg-[#082F27]">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#18211E] px-4 py-2">
            <span className="font-sans text-xs font-bold text-[#F7F4ED]">
              {templateName} — full screen preview
            </span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Close full screen"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <iframe
              src={iframeSrc}
              title={`${templateName} full screen`}
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </>
  );
});

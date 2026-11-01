"use client";

import { useEffect, useRef, useState } from "react";

export interface LazyAutoplayVideoProps {
  src: string;
  poster?: string;
  className?: string;
  videoClassName?: string;
  /** Load and play immediately (hero / above-the-fold only). */
  eager?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Defers network fetch and decode for muted loop videos until near the viewport.
 * Shows poster (or empty frame) until the observer fires.
 */
export function LazyAutoplayVideo({
  src,
  poster,
  className = "relative w-full h-full overflow-hidden",
  videoClassName = "absolute inset-0 w-full h-full object-cover",
  eager = false,
  rootMargin = "120px 0px",
  threshold = 0.12,
}: LazyAutoplayVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (eager || shouldLoad) return;
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager, shouldLoad, rootMargin, threshold]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    video.defaultMuted = true;
    video.muted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, [shouldLoad, src]);

  return (
    <div ref={rootRef} className={className} aria-hidden="true">
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element -- poster placeholder before video src attaches
        <img
          src={poster}
          alt=""
          aria-hidden
          className={`${videoClassName} brightness-[0.88]`}
          decoding="async"
          loading={eager ? "eager" : "lazy"}
        />
      ) : null}
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload={eager ? "metadata" : "none"}
          className={videoClassName}
        />
      ) : null}
    </div>
  );
}

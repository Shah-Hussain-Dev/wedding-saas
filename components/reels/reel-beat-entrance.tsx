"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface ReelBeatEntranceProps {
  beatId: string;
  activeBeatId: string | undefined;
  enterEpoch: number;
  reelMode?: boolean;
  children: ReactNode;
  className?: string;
}

/** Re-triggers entrance motion when a reel beat becomes active (video-like, not scroll reveal). */
export function ReelBeatEntrance({
  beatId,
  activeBeatId,
  enterEpoch,
  reelMode = false,
  children,
  className = "",
}: ReelBeatEntranceProps) {
  if (!reelMode) {
    return <>{children}</>;
  }

  const isActive = beatId === activeBeatId;

  return (
    <motion.div
      key={isActive ? `${beatId}-${enterEpoch}` : beatId}
      initial={
        isActive
          ? { opacity: 0, y: 22, scale: 0.98, filter: "blur(6px)" }
          : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      }
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      className={`h-full w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

import React from "react";

export function CornerFiligree({
  className = "",
  position = "top-left",
  color = "#C8A45E",
}: {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string;
}) {
  const getTransform = () => {
    switch (position) {
      case "top-right":
        return "scale(-1, 1)";
      case "bottom-left":
        return "scale(1, -1)";
      case "bottom-right":
        return "scale(-1, -1)";
      default:
        return "none";
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-16 h-16 pointer-events-none select-none ${className}`}
      style={{ transform: getTransform() }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`goldCornerGrad-${position}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF2D6" />
          <stop offset="35%" stopColor={color} />
          <stop offset="70%" stopColor="#9B772A" />
          <stop offset="100%" stopColor="#DFBF7A" />
        </linearGradient>
      </defs>
      {/* Outer corner L-accents */}
      <path
        d="M6 35V10C6 7.79 7.79 6 10 6H35"
        stroke={`url(#goldCornerGrad-${position})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M12 28V14C12 12.89 12.89 12 14 12H28"
        stroke={`url(#goldCornerGrad-${position})`}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Ornate filigree scrollwork & floral leaves */}
      <path
        d="M14 14C22 22 28 35 22 45C18 52 8 48 8 40C8 32 18 26 26 26C38 26 48 38 42 50C38 58 28 56 26 48"
        stroke={`url(#goldCornerGrad-${position})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="22" cy="22" r="3" fill={`url(#goldCornerGrad-${position})`} />
      <circle cx="34" cy="14" r="2" fill={`url(#goldCornerGrad-${position})`} />
      <circle cx="14" cy="34" r="2" fill={`url(#goldCornerGrad-${position})`} />
      <path
        d="M26 14C34 18 42 16 48 12C44 20 46 28 50 34C44 32 36 34 32 40"
        stroke={`url(#goldCornerGrad-${position})`}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArabesqueDivider({
  color = "#C8A45E",
  jewelColor = "#8A1024",
  className = "",
}: {
  color?: string;
  jewelColor?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center my-2 select-none ${className}`}>
      <svg
        viewBox="0 0 320 28"
        className="w-56 sm:w-64 h-6 pointer-events-none select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="arabesqueGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.05" />
            <stop offset="25%" stopColor={color} stopOpacity="0.75" />
            <stop offset="50%" stopColor="#FFF2D6" />
            <stop offset="75%" stopColor={color} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="jewelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DF2B4E" />
            <stop offset="60%" stopColor={jewelColor} />
            <stop offset="100%" stopColor="#4A0512" />
          </radialGradient>
        </defs>

        {/* Left Ornate Swirl Lines */}
        <path
          d="M20 14H110C118 14 122 10 128 10C134 10 137 14 142 14"
          stroke="url(#arabesqueGrad)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M70 11C82 7 96 7 108 11"
          stroke="url(#arabesqueGrad)"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M85 17C95 19 105 19 115 16"
          stroke="url(#arabesqueGrad)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx="120" cy="14" r="2.2" fill="url(#arabesqueGrad)" />
        <circle cx="132" cy="10" r="1.8" fill="url(#arabesqueGrad)" />

        {/* Central Floral Rosette (Red & Gold Petals) */}
        <g transform="translate(160, 14)">
          {/* Outer Gold Petals */}
          <circle cx="0" cy="-7" r="2.8" fill="url(#arabesqueGrad)" />
          <circle cx="0" cy="7" r="2.8" fill="url(#arabesqueGrad)" />
          <circle cx="-7" cy="0" r="2.8" fill="url(#arabesqueGrad)" />
          <circle cx="7" cy="0" r="2.8" fill="url(#arabesqueGrad)" />
          <circle cx="-5" cy="-5" r="2.2" fill="url(#arabesqueGrad)" />
          <circle cx="5" cy="-5" r="2.2" fill="url(#arabesqueGrad)" />
          <circle cx="-5" cy="5" r="2.2" fill="url(#arabesqueGrad)" />
          <circle cx="5" cy="5" r="2.2" fill="url(#arabesqueGrad)" />

          {/* Central Ruby Jewel Medallion */}
          <circle cx="0" cy="0" r="4.2" fill="url(#jewelGrad)" stroke="url(#arabesqueGrad)" strokeWidth="1" />
          <circle cx="-1" cy="-1" r="1" fill="#FFF2D6" opacity="0.8" />
        </g>

        {/* Right Ornate Swirl Lines */}
        <circle cx="188" cy="10" r="1.8" fill="url(#arabesqueGrad)" />
        <circle cx="200" cy="14" r="2.2" fill="url(#arabesqueGrad)" />
        <path
          d="M178 14C183 14 186 10 192 10C198 10 202 14 210 14H300"
          stroke="url(#arabesqueGrad)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M212 11C224 7 238 7 250 11"
          stroke="url(#arabesqueGrad)"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M205 16C215 19 225 19 235 17"
          stroke="url(#arabesqueGrad)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

export function LotusDivider({
  color = "#C8A45E",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center my-2 select-none ${className}`}>
      <svg
        viewBox="0 0 280 24"
        className="w-48 sm:w-56 h-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lotusGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="35%" stopColor={color} />
            <stop offset="50%" stopColor="#FFF5DC" />
            <stop offset="65%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M15 12H115" stroke="url(#lotusGrad)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Central Lotus Motif */}
        <path
          d="M140 4C140 4 135 12 135 16C135 18.76 137.24 21 140 21C142.76 21 145 18.76 145 16C145 12 140 4 140 4Z"
          fill="url(#lotusGrad)"
        />
        <path
          d="M135 16C131 13 125 15 125 18C125 20.2 127 21 132 20C135 19.5 137 17.5 135 16Z"
          fill="url(#lotusGrad)"
          opacity="0.8"
        />
        <path
          d="M145 16C149 13 155 15 155 18C155 20.2 153 21 148 20C145 19.5 143 17.5 145 16Z"
          fill="url(#lotusGrad)"
          opacity="0.8"
        />
        <path d="M165 12H265" stroke="url(#lotusGrad)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function CelestialDivider({
  color = "#C8A45E",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center my-2 select-none ${className}`}>
      <svg
        viewBox="0 0 280 24"
        className="w-48 sm:w-56 h-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="celestialGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="35%" stopColor={color} />
            <stop offset="50%" stopColor="#FFF7E6" />
            <stop offset="65%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M20 12H120" stroke="url(#celestialGrad)" strokeWidth="1.2" strokeLinecap="round" />
        {/* 4-point star in center */}
        <path
          d="M140 3L142 10L149 12L142 14L140 21L138 14L131 12L138 10Z"
          fill="url(#celestialGrad)"
        />
        <circle cx="127" cy="12" r="1.5" fill="url(#celestialGrad)" />
        <circle cx="153" cy="12" r="1.5" fill="url(#celestialGrad)" />
        <path d="M160 12H260" stroke="url(#celestialGrad)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function GoldenLaurelSprig({
  color = "#C8A45E",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 60 70"
      className={`w-9 h-11 inline-block select-none pointer-events-none ${className}`}
      style={{ transform: flip ? "scaleX(-1)" : "none" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="laurelGoldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF2D6" />
          <stop offset="40%" stopColor={color} />
          <stop offset="70%" stopColor="#9B772A" />
          <stop offset="100%" stopColor="#DFBF7A" />
        </linearGradient>
      </defs>
      {/* Curved main stem */}
      <path
        d="M48 60C45 45 35 25 20 12"
        stroke="url(#laurelGoldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Leaf 1 (top tip) */}
      <path
        d="M20 12C20 12 12 10 10 16C8 22 18 20 20 12Z"
        fill="url(#laurelGoldGrad)"
      />
      {/* Leaf 2 (upper side) */}
      <path
        d="M27 24C27 24 16 22 14 28C12 34 24 32 27 24Z"
        fill="url(#laurelGoldGrad)"
      />
      {/* Leaf 3 (middle side) */}
      <path
        d="M34 37C34 37 22 36 21 43C20 49 32 46 34 37Z"
        fill="url(#laurelGoldGrad)"
      />
      {/* Leaf 4 (lower inner side) */}
      <path
        d="M30 20C30 20 38 15 42 20C45 25 36 26 30 20Z"
        fill="url(#laurelGoldGrad)"
        opacity="0.9"
      />
      {/* Leaf 5 (lower outer) */}
      <path
        d="M42 48C42 48 30 50 30 57C30 63 41 58 42 48Z"
        fill="url(#laurelGoldGrad)"
      />
    </svg>
  );
}

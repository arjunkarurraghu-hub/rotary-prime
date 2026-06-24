import React from "react";

// Stylized Falcon / Rotary crest used as the club emblem.
export default function FalconCrest({ size = 44, rounded = true }) {
  const r = rounded ? 12 : 0;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: "block" }}
      aria-label="Falcons crest"
    >
      <defs>
        <linearGradient id="navy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a4d99" />
          <stop offset="100%" stopColor="#0e2a52" />
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0b93a" />
          <stop offset="100%" stopColor="#c08715" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" rx={r} fill="url(#navy)" />
      {/* Inner ring */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="#d6a72a" strokeWidth="2" opacity="0.45" />
      {/* Falcon silhouette (stylized wings) */}
      <g transform="translate(50 52)">
        {/* Wings */}
        <path
          d="M -32 4 C -22 -8 -12 -10 -4 -4 L 0 0 L 4 -4 C 12 -10 22 -8 32 4 C 22 0 14 2 8 8 L 0 14 L -8 8 C -14 2 -22 0 -32 4 Z"
          fill="url(#gold)"
        />
        {/* Head */}
        <path
          d="M -4 -4 L 0 -14 L 4 -4 L 0 -2 Z"
          fill="url(#gold)"
        />
        {/* Eye */}
        <circle cx="0" cy="-8" r="1.2" fill="#0e2a52" />
      </g>
      {/* Wordmark stripe */}
      <rect x="14" y="80" width="72" height="9" rx="2" fill="#d6a72a" />
      <text
        x="50"
        y="87"
        textAnchor="middle"
        fontSize="6"
        fontWeight="800"
        fill="#0e2a52"
        fontFamily="Hanken Grotesk, sans-serif"
        letterSpacing="1"
      >
        FALCONS
      </text>
    </svg>
  );
}

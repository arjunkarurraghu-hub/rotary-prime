import React, { forwardRef } from "react";
import { inrFormat } from "../../utils/numberToWords";

// Silver / Gold donor certificate (A4 landscape)
// tier: "silver" | "gold"
const DonorCertificate = forwardRef(function DonorCertificate(
  { name, amount, project, date, tier = "silver", refNumber },
  ref
) {
  const isGold = tier === "gold";
  const today = date || new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const palette = isGold
    ? {
        primary: "#d4a020",
        primaryDark: "#8b6510",
        bandLight: "#fff7e0",
        bandBorder: "#e8c97a",
        deep: "#0e2a52",
        accent: "#f5cf52",
        tierLabel: "Gold Patron",
        tierTagline: "Distinguished Contributor"
      }
    : {
        primary: "#9aa3ad",
        primaryDark: "#5a6573",
        bandLight: "#f0f3f7",
        bandBorder: "#c9d0d8",
        deep: "#0e2a52",
        accent: "#c7ccd2",
        tierLabel: "Silver Patron",
        tierTagline: "Valued Contributor"
      };

  return (
    <div
      ref={ref}
      style={{
        // A4 landscape ~ 1123 x 794
        width: "1123px",
        height: "794px",
        background: "#fffdf6",
        position: "relative",
        fontFamily: "Hanken Grotesk, sans-serif",
        color: "#15233b",
        overflow: "hidden",
        boxSizing: "border-box"
      }}
    >
      {/* Ornate border */}
      <div
        style={{
          position: "absolute",
          inset: 22,
          border: `3px solid ${palette.primary}`,
          borderRadius: 14
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 32,
          border: `1px solid ${palette.primary}`,
          borderRadius: 10,
          opacity: 0.55
        }}
      />

      {/* Corner flourishes */}
      {["tl", "tr", "bl", "br"].map((pos) => (
        <Corner key={pos} pos={pos} color={palette.primary} />
      ))}

      {/* Subtle background wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${palette.bandLight} 0%, transparent 65%)`,
          opacity: 0.65,
          pointerEvents: "none"
        }}
      />

      {/* Watermark falcon */}
      <img
        src="/brand/falcons_crest.jpg"
        alt=""
        crossOrigin="anonymous"
        style={{
          position: "absolute",
          right: 60,
          bottom: 60,
          width: 220,
          height: 220,
          objectFit: "cover",
          borderRadius: 14,
          opacity: 0.08,
          filter: "grayscale(50%)"
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          padding: "70px 90px 60px",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img
            src="/rbp_logo_full.png"
            alt="Rotary Bangalore Prime"
            crossOrigin="anonymous"
            style={{ height: 56, width: "auto" }}
          />
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: palette.primaryDark, textTransform: "uppercase" }}>
              Rotary District 3191 · Falcons 2026–2027
            </div>
            <div style={{ fontSize: 12, color: "#5c5950", marginTop: 2 }}>Create Lasting Impact</div>
          </div>
        </div>

        {/* Tier ribbon */}
        <div style={{ marginTop: 30, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 60%, ${palette.primary} 100%)`,
              color: palette.deep,
              padding: "10px 32px",
              borderRadius: 999,
              fontWeight: 800,
              letterSpacing: 4,
              fontSize: 14,
              textTransform: "uppercase",
              boxShadow: `0 6px 18px -8px ${palette.primaryDark}`
            }}
          >
            <Medal color={palette.deep} />
            {palette.tierLabel}
            <Medal color={palette.deep} />
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1.1,
              color: palette.deep
            }}
          >
            Certificate of Appreciation
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 4,
              color: palette.primaryDark,
              textTransform: "uppercase",
              marginTop: 6
            }}
          >
            {palette.tierTagline}
          </div>
        </div>

        {/* Body */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <div style={{ fontSize: 16, color: "#5c5950", letterSpacing: 1 }}>This certificate is proudly presented to</div>
          <div
            style={{
              fontFamily: "Hanken Grotesk, serif",
              fontSize: 56,
              fontWeight: 800,
              color: palette.deep,
              letterSpacing: -1,
              margin: "12px 0 4px",
              lineHeight: 1.05
            }}
          >
            {name || "Valued Donor"}
          </div>
          <div
            style={{
              height: 2,
              width: 280,
              background: palette.primary,
              margin: "0 auto"
            }}
          />
          <div
            style={{
              fontSize: 16,
              color: "#3a2a05",
              lineHeight: 1.7,
              marginTop: 22,
              maxWidth: 760,
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            In grateful recognition of a generous contribution of{" "}
            <strong style={{ color: palette.deep, fontSize: 20 }}>₹ {inrFormat(amount)}</strong>{" "}
            towards{" "}
            <strong>{project || "Rotary Bangalore Prime's service projects"}</strong>{" "}
            — empowering nutrition, healthcare, education and environment initiatives across Bengaluru.
          </div>
        </div>

        {/* Signature row */}
        <div
          style={{
            marginTop: "auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 40,
            alignItems: "end",
            paddingTop: 30
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ borderBottom: "1.5px solid #15233b", height: 36 }} />
            <div style={{ fontSize: 12, color: "#5c5950", marginTop: 6 }}>President</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: palette.deep }}>Rotary Bangalore Prime</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                margin: "0 auto",
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${palette.bandLight} 0%, transparent 80%)`,
                border: `2px solid ${palette.primary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette.primaryDark,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
                lineHeight: 1.1,
                textAlign: "center",
                padding: 6,
                boxSizing: "border-box"
              }}
            >
              RBP<br />Trust<br />Seal
            </div>
            <div style={{ fontSize: 11, color: "#9a958a", marginTop: 6 }}>{dateStr}</div>
            {refNumber && (
              <div style={{ fontSize: 10, color: "#837f76", fontFamily: "ui-monospace, monospace" }}>
                Ref: {refNumber}
              </div>
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ borderBottom: "1.5px solid #15233b", height: 36 }} />
            <div style={{ fontSize: 12, color: "#5c5950", marginTop: 6 }}>Chairman, Trust</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: palette.deep }}>Rotary Bangalore Prime Trust</div>
          </div>
        </div>
      </div>
    </div>
  );
});

function Corner({ pos, color }) {
  const style = { position: "absolute", width: 60, height: 60 };
  if (pos === "tl") Object.assign(style, { top: 40, left: 40 });
  if (pos === "tr") Object.assign(style, { top: 40, right: 40, transform: "scaleX(-1)" });
  if (pos === "bl") Object.assign(style, { bottom: 40, left: 40, transform: "scaleY(-1)" });
  if (pos === "br") Object.assign(style, { bottom: 40, right: 40, transform: "scale(-1,-1)" });
  return (
    <svg viewBox="0 0 60 60" style={style}>
      <path
        d="M2 30 Q2 2 30 2 M2 30 L2 18 Q2 8 12 6 M2 30 L8 30 Q14 30 16 24"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.85"
      />
      <circle cx="6" cy="6" r="3" fill={color} opacity="0.85" />
    </svg>
  );
}

function Medal({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M8 2 L12 9 L16 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15" r="6" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M12 12 L13 14 L15 14.2 L13.5 15.6 L14 17.6 L12 16.6 L10 17.6 L10.5 15.6 L9 14.2 L11 14 Z" fill={color} />
    </svg>
  );
}

export default DonorCertificate;

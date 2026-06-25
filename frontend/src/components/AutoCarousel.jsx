import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// AutoCarousel: cycles through slides automatically. Pauses on hover.
// Click slide -> calls onSlideClick(index). Dots + arrows for manual nav.
export default function AutoCarousel({
  slides = [],
  interval = 4500,
  onSlideClick,
  aspect = "16/10"
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearTimeout(timerRef.current);
  }, [index, paused, slides.length, interval]);

  if (!slides.length) return null;

  const prev = () =>
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  const current = slides[index];

  return (
    <div
      className="relative rounded-[20px] overflow-hidden border border-[#eceae4] bg-[#ece9e2] group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ aspectRatio: aspect }}
    >
      {slides.map((s, i) => (
        <button
          key={i}
          onClick={() => onSlideClick?.(i)}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-label={s.caption || `Slide ${i + 1}`}
          tabIndex={i === index ? 0 : -1}
        >
          <img
            src={s.src}
            alt={s.caption || `Slide ${i + 1}`}
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          {s.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-left">
              <div className="text-white text-[14px] md:text-[18px] font-extrabold leading-snug max-w-[640px]">
                {s.caption}
              </div>
            </div>
          )}
        </button>
      ))}

      {/* Slide counter */}
      <div className="absolute top-3 right-3 z-20 text-[11px] font-bold tracking-wider uppercase text-white bg-black/45 backdrop-blur-sm rounded-full px-3 py-1">
        {index + 1} / {slides.length}
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5 pointer-events-none">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                i === index ? "w-7 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

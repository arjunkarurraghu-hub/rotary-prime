import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Target,
  IndianRupee,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import axios from "axios";
import { projects, recentDonors, clubInfo } from "../mock";
import AutoCarousel from "../components/AutoCarousel";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  const [lightbox, setLightbox] = useState(null);
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    if (!project) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API}/projects/${project.id}/stats`);
        if (!cancelled) setLiveStats(res.data);
      } catch {
        /* ignore — fallback to base mock */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [project]);

  if (!project) {
    return (
      <div className="max-w-[800px] mx-auto px-5 py-20 text-center">
        <div className="text-2xl font-extrabold text-[#15233b]">
          Project not found
        </div>
        <Link to="/" className="text-[#17458b] font-bold mt-4 inline-block">
          ← Back home
        </Link>
      </div>
    );
  }

  // Merge live platform donations with base mock numbers
  const liveRaised = (liveStats?.raised_platform || 0) + project.raised;
  const liveDonors = (liveStats?.donors_platform || 0) + project.donors;
  const liveProgress = Math.min(
    100,
    Math.round((liveRaised / project.goal) * 100)
  );

  const fmtMoney = (n) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  const remaining = Math.max(0, project.goal - liveRaised);
  const remainingLabel = fmtMoney(remaining);
  const liveRaisedLabel = fmtMoney(liveRaised);
  const details = project.details;
  // Normalize gallery: support [{src,caption}] or [string]
  const rawGallery = project.gallery || [project.image];
  const gallery = rawGallery.map((g) =>
    typeof g === "string" ? { src: g, caption: "" } : g
  );

  const showLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prevImg = () =>
    setLightbox((i) => (i === 0 ? gallery.length - 1 : i - 1));
  const nextImg = () =>
    setLightbox((i) => (i === gallery.length - 1 ? 0 : i + 1));

  return (
    <div className="bg-[#f7f6f2] min-h-screen">
      {/* HEADER BANNER — minimal */}
      <div className="bg-[#17458b] text-white">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-5 md:py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#a9c2ea] hover:text-white text-[13px] font-semibold transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase text-[#d6a72a]">
              {project.categoryLabel}
            </span>
            {details?.tagline && (
              <span className="text-[10px] md:text-[11px] font-bold tracking-wider uppercase text-[#3a2a05] bg-[#d6a72a] rounded-full px-2.5 py-[3px]">
                {details.tagline}
              </span>
            )}
          </div>
          <h1 className="text-[22px] md:text-[32px] font-extrabold tracking-tight mt-2 leading-tight">
            {project.title}
          </h1>
          <p className="text-[13px] md:text-[14px] text-[#c8d8ef] mt-1.5 max-w-[760px] leading-relaxed">
            {project.location}
          </p>
        </div>
      </div>

      {/* STATS CARD — sits naturally below header */}
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 mt-6 md:mt-7">
        <div className="bg-white border border-[#eceae4] rounded-[18px] shadow-[0_8px_22px_-16px_rgba(20,35,59,0.18)] grid grid-cols-3">
          <div className="text-center p-4 md:p-5">
            <div className="text-[18px] md:text-[24px] font-extrabold text-[#17458b] tabular-nums">
              {liveRaisedLabel}
            </div>
            <div className="text-[11px] md:text-[12px] text-[#837f76] mt-1">
              Raised
            </div>
          </div>
          <div className="text-center p-4 md:p-5 border-l border-r border-[#f0eee8]">
            <div className="text-[18px] md:text-[24px] font-extrabold text-[#15233b] tabular-nums">
              {project.goalLabel}
            </div>
            <div className="text-[11px] md:text-[12px] text-[#837f76] mt-1">
              Goal
            </div>
          </div>
          <div className="text-center p-4 md:p-5">
            <div className="text-[18px] md:text-[24px] font-extrabold text-[#15233b] tabular-nums">
              {liveDonors}
            </div>
            <div className="text-[11px] md:text-[12px] text-[#837f76] mt-1">
              Donors
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-8 md:py-12 grid lg:grid-cols-[1fr_360px] gap-8 md:gap-10">
        <div className="min-w-0">
          <div className="flex justify-between text-[13px] font-bold">
            <span className="text-[#17458b]">{liveProgress}% funded</span>
            <span className="text-[#837f76]">{remainingLabel} to go</span>
          </div>
          <div className="h-[10px] bg-[#ece9e2] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#d99a1c] rounded-full transition-all duration-700"
              style={{ width: `${liveProgress}%` }}
            />
          </div>

          <p className="text-[15px] md:text-[16px] text-[#4b4840] leading-[1.7] mt-7">
            {project.description}
          </p>

          <div className="mt-5 bg-[#fbf3df] border border-[#f0e2bf] rounded-[14px] px-4 py-3 text-[14px] md:text-[15px] text-[#6a4d12] font-semibold">
            {project.impactLine}
          </div>

          {/* HIGHLIGHTS — use rich numbers when available */}
          {details?.highlights ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
              {details.highlights.map((h, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#eceae4] rounded-[14px] p-4"
                >
                  <div className="text-[11px] uppercase tracking-wider text-[#837f76] font-semibold">
                    {h.label}
                  </div>
                  <div className="text-[18px] md:text-[20px] font-extrabold text-[#15233b] mt-1 tracking-tight">
                    {h.value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              {[
                { icon: Users, label: "Beneficiaries", value: "3,000+ / yr" },
                { icon: MapPin, label: "Locations", value: "12 sites" },
                { icon: Calendar, label: "Started", value: "Jul 2026" }
              ].map((h, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#eceae4] rounded-[14px] p-4"
                >
                  <h.icon size={18} className="text-[#17458b]" />
                  <div className="text-[11px] uppercase tracking-wider text-[#837f76] mt-2 font-semibold">
                    {h.label}
                  </div>
                  <div className="text-[15px] font-extrabold text-[#15233b] mt-1">
                    {h.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GALLERY */}
          {gallery.length > 0 && gallery[0].src && (
            <div className="mt-10">
              <SectionTitle
                eyebrow="From the field"
                title={
                  details
                    ? `${project.title.split("—")[0].trim()} in action`
                    : `${project.title} — moments from the field`
                }
              />
              <p className="text-[14px] md:text-[15px] text-[#5c5950] mt-3 max-w-[640px] leading-relaxed">
                Every photo here is from an actual {project.categoryLabel.toLowerCase()} session.
                Click any image to view it full-screen.
              </p>

              {details ? (
                /* RICH gallery layout (used by Roti Project) */
                <>
                  <button
                    onClick={() => showLightbox(0)}
                    className="group relative block w-full mt-5 rounded-[20px] overflow-hidden border border-[#eceae4] bg-[#ece9e2]"
                  >
                    <img
                      src={gallery[0].src}
                      alt={gallery[0].caption || project.title}
                      className="w-full h-[260px] md:h-[440px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 text-left">
                      <div className="inline-block text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase text-[#3a2a05] bg-[#d6a72a] rounded-full px-3 py-1">
                        Featured
                      </div>
                      <div className="text-white text-[18px] md:text-[22px] font-extrabold mt-3 leading-snug max-w-[640px]">
                        {gallery[0].caption || "On the ground with the team"}
                      </div>
                    </div>
                  </button>
                  {gallery.length > 1 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {gallery.slice(1).map((g, idx) => {
                        const i = idx + 1;
                        return (
                          <button
                            key={i}
                            onClick={() => showLightbox(i)}
                            className="group bg-white border border-[#eceae4] rounded-[16px] overflow-hidden hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 text-left"
                          >
                            <div className="aspect-[4/3] overflow-hidden bg-[#ece9e2]">
                              <img
                                src={g.src}
                                alt={g.caption || `${project.title} ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                              />
                            </div>
                            {g.caption && (
                              <div className="p-4">
                                <div className="text-[13.5px] text-[#15233b] font-semibold leading-snug">
                                  {g.caption}
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                /* AUTO CAROUSEL — used by simpler projects like Sanjeevani */
                <div className="mt-5">
                  <AutoCarousel
                    slides={gallery}
                    interval={4500}
                    aspect="16/10"
                    onSlideClick={(i) => showLightbox(i)}
                  />
                </div>
              )}
            </div>
          )}

          {/* RICH STORY SECTIONS */}
          {details && (
            <>
              <Section title="Why this project exists" body={details.rationale} />
              <Section title="The story so far" body={details.intro} />

              {/* LOCATIONS */}
              <div className="mt-10">
                <SectionTitle
                  eyebrow="Where we serve"
                  title="4 partner locations across Bengaluru"
                />
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mt-5">
                  {details.locations.map((loc, i) => (
                    <div
                      key={i}
                      className="bg-white border border-[#eceae4] rounded-[16px] p-5 hover:border-[#17458b] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-[10px] bg-[#e7eefb] text-[#17458b] flex items-center justify-center flex-shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[15px] font-extrabold text-[#15233b] leading-snug">
                            {loc.name}
                          </div>
                          <div className="text-[12px] font-bold tracking-wider uppercase text-[#9a5a1a] mt-1">
                            {loc.frequency}
                          </div>
                        </div>
                      </div>
                      <p className="text-[13.5px] text-[#5c5950] mt-3 leading-relaxed">
                        {loc.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACHIEVEMENTS */}
              <div className="mt-10">
                <SectionTitle
                  eyebrow="Key achievements"
                  title="A flagship Zero Hunger program"
                />
                <ul className="mt-5 space-y-3">
                  {details.achievements.map((a, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-white border border-[#eceae4] rounded-[14px] p-4"
                    >
                      <CheckCircle2
                        size={20}
                        className="text-[#1f8b57] flex-shrink-0 mt-[2px]"
                      />
                      <span className="text-[14.5px] text-[#4b4840] leading-relaxed">
                        {a}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* COST BREAKDOWN */}
              {details.costBreakdown && (
                <div className="mt-10">
                  <SectionTitle
                    eyebrow="What your giving funds"
                    title={`Cost plan · ${details.costBreakdown.period}`}
                  />
                  <div className="mt-5 bg-white border border-[#eceae4] rounded-[16px] overflow-hidden">
                    {details.costBreakdown.rows.map((r, i) => (
                      <div
                        key={i}
                        className={`flex justify-between items-center px-5 py-4 ${
                          i !== details.costBreakdown.rows.length - 1
                            ? "border-b border-[#f0eee8]"
                            : "bg-[#fbf3df]"
                        }`}
                      >
                        <span className="text-[13px] md:text-[14px] text-[#5c5950] font-medium">
                          {r.k}
                        </span>
                        <span className="text-[15px] md:text-[16px] font-extrabold text-[#15233b]">
                          {r.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ROADMAP */}
              {details.roadmap && (
                <div className="mt-10">
                  <SectionTitle
                    eyebrow="What's next"
                    title="Roadmap for 2026 and beyond"
                  />
                  <div className="grid sm:grid-cols-3 gap-3 md:gap-4 mt-5">
                    {details.roadmap.map((r, i) => (
                      <div
                        key={i}
                        className="bg-white border border-[#eceae4] rounded-[14px] p-5"
                      >
                        <div className="w-9 h-9 rounded-[10px] bg-[#fbf3df] text-[#9a5a1a] flex items-center justify-center">
                          <Sparkles size={16} />
                        </div>
                        <div className="text-[13.5px] text-[#4b4840] mt-3 leading-relaxed">
                          {r}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* DEFAULT IMAGE if no rich details */}
          {!details && (
            <div className="mt-7 rounded-[18px] overflow-hidden border border-[#eceae4] bg-[#ece9e2]">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-[260px] md:h-[360px] object-cover"
              />
            </div>
          )}

          {/* QR */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white border border-[#eceae4] rounded-[16px] p-4 md:p-5">
            <div
              className="w-[84px] h-[84px] rounded-[12px] flex-shrink-0 border-4 border-white"
              style={{
                background:
                  "repeating-conic-gradient(#15233b 0% 25%, #fff 0% 50%) 0 / 13px 13px",
                boxShadow: "0 0 0 1px #e7e5df"
              }}
            />
            <div>
              <div className="text-[14px] font-extrabold text-[#15233b]">
                Scan to donate via UPI
              </div>
              <div className="text-[12px] text-[#837f76] mt-1">
                GPay · PhonePe · Paytm · BHIM
              </div>
              <div className="mt-2 font-mono text-[11px] bg-[#f4f2ec] text-[#5c5950] px-2 py-[3px] rounded-md inline-block">
                {clubInfo.upi}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-24 self-start space-y-5">
          <div className="bg-white border border-[#eceae4] rounded-[18px] p-5">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#17458b]">
              <Target size={14} /> Quick donate
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[500, 1500, 2500].map((a) => (
                <button
                  key={a}
                  onClick={() =>
                    navigate(`/donate?project=${project.id}&amount=${a}`)
                  }
                  className="py-3 rounded-[12px] border border-[#e7e5df] hover:border-[#d99a1c] hover:bg-[#fbf3df] text-[14px] font-extrabold text-[#15233b] transition-colors"
                >
                  ₹{a >= 1000 ? `${(a / 1000).toString().replace(/\.0$/, "")}K` : a}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate(`/donate?project=${project.id}`)}
              className="mt-3 w-full bg-[#17458b] hover:bg-[#0e2a52] text-white font-extrabold text-[15px] py-[14px] rounded-[14px] transition-colors flex items-center justify-center gap-2"
            >
              <IndianRupee size={16} /> Donate any amount
            </button>
            <div className="text-center text-[11px] text-[#9a958a] mt-2">
              No login · 80G receipt on WhatsApp
            </div>
          </div>

          <div className="bg-white border border-[#eceae4] rounded-[18px] p-5">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#9a5a1a]">
              Recent donors
            </div>
            <div className="mt-3 space-y-3">
              {recentDonors.slice(0, 4).map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-[12px]"
                    style={{ background: d.color }}
                  >
                    {d.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-[#15233b]">
                      {d.name}
                    </div>
                    <div className="text-[11px] text-[#837f76]">{d.time}</div>
                  </div>
                  <div className="text-[13px] font-extrabold text-[#15233b]">
                    {d.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-[#eceae4] p-4 z-30">
        <button
          onClick={() => navigate(`/donate?project=${project.id}`)}
          className="w-full bg-[#17458b] hover:bg-[#0e2a52] text-white font-extrabold text-[16px] py-[15px] rounded-[14px] transition-colors"
        >
          Donate via UPI / Card / Net Banking
        </button>
        <div className="text-center text-[11px] text-[#9a958a] mt-2">
          No login needed · 80G receipt &amp; WhatsApp confirmation
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImg();
                }}
                className="absolute left-3 md:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Previous"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImg();
                }}
                className="absolute right-3 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <img
            src={gallery[lightbox].src}
            alt={gallery[lightbox].caption || `Roti Project ${lightbox + 1}`}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {gallery[lightbox].caption && (
            <div
              className="absolute bottom-14 left-0 right-0 text-center text-white text-[14px] md:text-[15px] font-semibold px-6 max-w-[800px] mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery[lightbox].caption}
            </div>
          )}
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-[12px] font-semibold">
            {lightbox + 1} / {gallery.length}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div>
      <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9a5a1a]">
        {eyebrow}
      </div>
      <h2 className="text-[22px] md:text-[26px] font-extrabold text-[#15233b] tracking-tight mt-1 leading-tight">
        {title}
      </h2>
    </div>
  );
}

function Section({ title, body }) {
  return (
    <div className="mt-10">
      <h2 className="text-[20px] md:text-[24px] font-extrabold text-[#15233b] tracking-tight">
        {title}
      </h2>
      <p className="text-[15px] md:text-[16px] text-[#4b4840] leading-[1.75] mt-3">
        {body}
      </p>
    </div>
  );
}

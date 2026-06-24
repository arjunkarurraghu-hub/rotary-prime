import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Award } from "lucide-react";
import { events, clubInfo, stats, impactStories, clubMoments } from "../mock";
import FalconCrest from "../components/FalconCrest";

export function Club() {
  return (
    <div className="bg-white">
      <section className="max-w-[1100px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9a5a1a]">
          Our Club
        </div>
        <h1 className="text-[32px] md:text-[44px] font-extrabold text-[#15233b] tracking-tight mt-2 leading-tight">
          The Falcons of District 3191.
        </h1>
        <p className="text-[16px] md:text-[17px] text-[#5c5950] mt-5 max-w-[680px] leading-relaxed">
          Rotary Bangalore Prime is a service club of business and professional
          leaders. Our 2026–27 team — the Falcons — carries the motto
          <span className="font-bold text-[#15233b]"> "Create Lasting Impact"</span>{" "}
          into every project, fundraiser and community moment.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {[
            { icon: Users, label: "Members", value: "50" },
            { icon: Award, label: "Years strong", value: "7" },
            { icon: MapPin, label: "Meeting", value: "Chancery Pavillion" }
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[#f7f6f2] border border-[#eceae4] rounded-[18px] p-5"
            >
              <s.icon size={22} className="text-[#17458b]" />
              <div className="text-[12px] font-semibold uppercase tracking-wider text-[#837f76] mt-3">
                {s.label}
              </div>
              <div className="text-[20px] font-extrabold text-[#15233b] mt-1">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-[#0e2a52] to-[#071a35] rounded-[24px] p-6 md:p-10 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 30%, #d6a72a 0%, transparent 55%)"
              }}
            />
            <div className="relative">
              <img
                src="/brand/falcons_crest.jpg"
                alt="Falcons crest — Rotary District 3191"
                className="w-full max-w-[360px] mx-auto rounded-[18px] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]"
              />
              <div className="text-[13px] font-bold text-[#d6a72a] tracking-[0.18em] mt-5">
                ROTARY DISTRICT 3191 · 2026–2027
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-[22px] md:text-[26px] font-extrabold text-[#15233b] leading-tight">
              Service above self.
            </h3>
            <p className="text-[15px] text-[#5c5950] mt-4 leading-relaxed">
              From the Roti Project that has served over 1.2 lakh meals at
              Jayadeva Heart Institute, to Sanjeevani Health Camps and tree
              plantation drives — our work is concrete, measurable, and
              transparent.
            </p>
            <p className="text-[15px] text-[#5c5950] mt-4 leading-relaxed">
              Want to volunteer or attend a meeting? We meet every Wednesday at
              7:30 PM at Hotel Chancery Pavillion, Residency Road.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export function Impact() {
  return (
    <div className="bg-white">
      <section className="max-w-[1100px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9a5a1a]">
          Impact 2026–27
        </div>
        <h1 className="text-[32px] md:text-[44px] font-extrabold text-[#15233b] tracking-tight mt-2 leading-tight">
          Every rupee, accounted for.
        </h1>

        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {[
            { v: stats.raisedThisYear, l: "raised this year" },
            { v: stats.activeProjects, l: "active projects" },
            { v: stats.donors, l: "donors" }
          ].map((s, i) => (
            <div
              key={i}
              className="bg-[#f7f6f2] border border-[#eceae4] rounded-[18px] p-6 text-center"
            >
              <div className="text-[36px] font-extrabold text-[#15233b]">
                {s.v}
              </div>
              <div className="text-[13px] text-[#837f76] mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <h2 className="text-[22px] md:text-[26px] font-extrabold text-[#15233b] mt-14">
          Stories from the field
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-6">
          {impactStories.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-[#eceae4] rounded-[18px] overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="text-[11px] font-bold tracking-wider uppercase text-[#17458b]">
                  {s.project}
                </div>
                <div className="text-[16px] font-extrabold text-[#15233b] mt-2">
                  {s.title}
                </div>
                <div className="text-[12px] text-[#837f76] mt-3">{s.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CLUB MOMENTS */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9a5a1a]">
                Club Moments
              </div>
              <h2 className="text-[24px] md:text-[28px] font-extrabold text-[#15233b] tracking-tight mt-1 leading-tight">
                Behind the scenes with the Falcons.
              </h2>
            </div>
            <p className="text-[14px] text-[#5c5950] max-w-[420px] leading-relaxed">
              Ceremonies, partnerships, planning sessions — the everyday moments that make our service work possible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-7">
            {clubMoments.map((m) => (
              <div
                key={m.id}
                className="group bg-white border border-[#eceae4] rounded-[18px] overflow-hidden hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#ece9e2] relative">
                  <img
                    src={m.src}
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-black/55 backdrop-blur rounded-full px-2.5 py-1">
                      {m.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[14px] font-extrabold text-[#15233b] leading-snug">
                    {m.title}
                  </div>
                  <div className="text-[12.5px] text-[#5c5950] mt-1 leading-relaxed">
                    {m.caption}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function Events() {
  const navigate = useNavigate();
  return (
    <div className="bg-white">
      <section className="max-w-[900px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9a5a1a]">
          Upcoming events
        </div>
        <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#15233b] tracking-tight mt-2 leading-tight">
          Come along, give a hand.
        </h1>

        <div className="mt-8 space-y-4">
          {events.map((e) => (
            <div
              key={e.id}
              className="bg-[#f7f6f2] border border-[#eceae4] rounded-[18px] p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 hover:border-[#17458b] transition-colors"
            >
              <div className="w-14 h-14 rounded-[14px] bg-[#17458b] text-white flex flex-col items-center justify-center flex-shrink-0">
                <Calendar size={20} />
              </div>
              <div className="flex-1">
                <div className="text-[18px] font-extrabold text-[#15233b]">
                  {e.title}
                </div>
                <div className="text-[13px] text-[#837f76] mt-1">
                  {e.date} · {e.time} · {e.venue}
                </div>
              </div>
              <button
                onClick={() => navigate("/donate")}
                className="bg-[#d99a1c] hover:bg-[#c08715] text-[#3a2a05] font-extrabold text-[14px] px-5 py-3 rounded-[12px] transition-colors"
              >
                Sponsor
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

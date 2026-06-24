import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Receipt, MessageCircle } from "lucide-react";
import { projects, categories, stats, clubInfo, recentDonors, impactStories } from "../mock";
import ProjectCard from "../components/ProjectCard";
import FalconCrest from "../components/FalconCrest";

export default function Home() {
  const [active, setActive] = useState("all");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.category === active);
  }, [active]);

  useEffect(() => {
    if (window.location.hash === "#projects") {
      setTimeout(() => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="max-w-[1340px] mx-auto px-5 md:px-10 py-10 md:py-[60px]">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <div className="inline-block text-[11px] md:text-[12px] font-bold tracking-[0.08em] uppercase text-[#9a5a1a] bg-[#fbf3df] px-[14px] py-[6px] rounded-full">
              {clubInfo.tagline}
            </div>
            <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-extrabold text-[#15233b] tracking-tight leading-[1.05] mt-5">
              Fund the projects
              <br />
              changing lives across
              <br className="hidden sm:block" />{" "}
              <span className="text-[#17458b]">Bengaluru.</span>
            </h1>
            <p className="text-[15px] md:text-[17px] text-[#5c5950] leading-[1.6] mt-[18px] max-w-[520px]">
              Every rupee goes straight to a Rotary Bangalore Prime project. Pay
              by UPI, card or net banking — no login needed — and get an 80G
              receipt on WhatsApp instantly.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-[14px] mt-7">
              <button
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 bg-[#17458b] hover:bg-[#0e2a52] text-white font-bold text-[15px] md:text-[16px] px-6 md:px-[30px] py-[14px] rounded-[13px] transition-colors"
              >
                Explore projects <ArrowRight size={18} />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border border-[#d9d6cf] hover:border-[#15233b] bg-white text-[#15233b] font-bold text-[15px] md:text-[16px] px-6 md:px-7 py-[14px] rounded-[13px] transition-colors"
              >
                How it works
              </button>
            </div>
            <div className="flex flex-wrap gap-7 md:gap-10 mt-9 md:mt-[38px]">
              <div>
                <div className="text-[22px] md:text-[28px] font-extrabold text-[#15233b]">
                  {stats.raisedThisYear}
                </div>
                <div className="text-[12px] md:text-[13px] text-[#837f76] font-medium">
                  raised this year
                </div>
              </div>
              <div>
                <div className="text-[22px] md:text-[28px] font-extrabold text-[#15233b]">
                  {stats.activeProjects}
                </div>
                <div className="text-[12px] md:text-[13px] text-[#837f76] font-medium">
                  active projects
                </div>
              </div>
              <div>
                <div className="text-[22px] md:text-[28px] font-extrabold text-[#15233b]">
                  {stats.donors}
                </div>
                <div className="text-[12px] md:text-[13px] text-[#837f76] font-medium">
                  donors
                </div>
              </div>
            </div>
          </div>

          {/* FIELD-PHOTO COLLAGE — Roti Project in action */}
          <div className="order-first lg:order-last w-full">
            <div className="relative grid grid-cols-5 grid-rows-5 gap-3 md:gap-4 h-[420px] md:h-[520px]">
              <button
                onClick={() => navigate("/project/food-for-smiles")}
                className="col-span-3 row-span-3 rounded-[20px] overflow-hidden bg-[#ece9e2] relative group shadow-[0_18px_44px_-22px_rgba(20,35,59,0.45)]"
              >
                <img
                  src="/roti/roti1_distribution.jpg"
                  alt="Roti Project — daily dispatch"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase text-[#3a2a05] bg-[#d6a72a] rounded-full px-3 py-1">
                    Featured project
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <div className="text-white text-[15px] md:text-[18px] font-extrabold leading-snug">
                    Food for Smiles — Roti Project
                  </div>
                  <div className="text-[#e3eaf5] text-[12px] md:text-[13px] mt-1">
                    8L+ rotis served · Zero Hunger initiative
                  </div>
                </div>
              </button>

              <div className="col-span-2 row-span-3 rounded-[20px] overflow-hidden bg-[#ece9e2] relative group">
                <img
                  src="/roti/roti3_medical_inst.jpg"
                  alt="Hospital outreach"
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-[12px] md:text-[13px] font-bold leading-tight">
                  Sri Madhusudan Sai Institute
                </div>
              </div>

              <div className="col-span-2 row-span-2 rounded-[20px] overflow-hidden bg-[#ece9e2] relative group">
                <img
                  src="/roti/roti2_outreach_left.jpg"
                  alt="Hospital outreach"
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-white text-[11px] md:text-[12px] font-bold leading-tight">
                  Welcome kits at OPD
                </div>
              </div>

              <div className="col-span-3 row-span-2 rounded-[20px] overflow-hidden bg-[#ece9e2] relative group">
                <img
                  src="/roti/roti4_air_homes.jpg"
                  alt="AiR Humanitarian Homes"
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-white text-[11px] md:text-[12px] font-bold leading-tight">
                  AiR Humanitarian Homes inauguration
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="bg-[#f7f6f2] border-t border-[#eceae4]"
      >
        <div className="max-w-[1340px] mx-auto px-5 md:px-10 py-10 md:py-[50px]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6">
            <div className="text-[24px] md:text-[26px] font-extrabold text-[#15233b] tracking-tight">
              Club Projects 2026–27
            </div>
            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`whitespace-nowrap px-[17px] py-[9px] rounded-full text-[13px] md:text-[14px] font-semibold transition-colors ${
                    active === c.id
                      ? "bg-[#15233b] text-white"
                      : "bg-white border border-[#e7e5df] text-[#5c5950] hover:border-[#15233b] hover:text-[#15233b]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[22px]">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#837f76]">
              No projects in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white">
        <div className="max-w-[1340px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="text-center max-w-[640px] mx-auto">
            <div className="inline-block text-[11px] font-bold tracking-[0.08em] uppercase text-[#17458b] bg-[#e7eefb] px-[14px] py-[6px] rounded-full">
              How it works
            </div>
            <h2 className="text-[28px] md:text-[34px] font-extrabold text-[#15233b] tracking-tight mt-4">
              Give in a minute. Get your 80G receipt instantly.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-10 md:mt-12">
            {[
              { icon: Sparkles, t: "Pick a project", d: "Browse 6 active club projects and choose what moves you." },
              { icon: ShieldCheck, t: "Pay securely", d: "UPI, card, or net banking. No account or login needed." },
              { icon: Receipt, t: "Get 80G receipt", d: "Tax-saving receipt delivered to WhatsApp & email instantly." },
              { icon: MessageCircle, t: "See your impact", d: "Photos and progress updates as your money is put to work." }
            ].map((s, i) => (
              <div
                key={i}
                className="bg-[#f7f6f2] border border-[#eceae4] rounded-[18px] p-5 md:p-6 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-[12px] bg-[#17458b]/10 flex items-center justify-center">
                  <s.icon size={22} className="text-[#17458b]" />
                </div>
                <div className="text-[16px] font-extrabold text-[#15233b] mt-4">
                  {i + 1}. {s.t}
                </div>
                <div className="text-[13.5px] text-[#5c5950] mt-1 leading-relaxed">
                  {s.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT STORIES */}
      <section id="impact" className="bg-[#f7f6f2] border-t border-[#eceae4]">
        <div className="max-w-[1340px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="flex justify-between items-end pb-7">
            <div>
              <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9a5a1a]">
                Recent impact
              </div>
              <h2 className="text-[24px] md:text-[28px] font-extrabold text-[#15233b] tracking-tight mt-1">
                What your giving made happen
              </h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {impactStories.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-[#eceae4] rounded-[18px] overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-44 bg-[#ece9e2] overflow-hidden">
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
                  <div className="text-[16px] font-extrabold text-[#15233b] mt-2 leading-snug">
                    {s.title}
                  </div>
                  <div className="text-[12px] text-[#837f76] mt-3">{s.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT DONORS */}
      <section className="bg-white">
        <div className="max-w-[1340px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 items-start">
            <div>
              <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9a5a1a]">
                Recent donors
              </div>
              <h2 className="text-[26px] md:text-[32px] font-extrabold text-[#15233b] tracking-tight mt-2 leading-tight">
                A community of {stats.donors}+ givers, building Bengaluru together.
              </h2>
              <p className="text-[15px] text-[#5c5950] mt-4 leading-relaxed">
                Join Falcons in funding the projects that matter. Your name is shown only if you opt in — anonymous giving is welcome.
              </p>
              <button
                onClick={() => navigate("/donate")}
                className="mt-6 bg-[#d99a1c] hover:bg-[#c08715] text-[#3a2a05] font-extrabold text-[15px] px-7 py-[14px] rounded-[13px] transition-colors"
              >
                Join them
              </button>
            </div>
            <div className="bg-[#f7f6f2] border border-[#eceae4] rounded-[20px] p-2 md:p-3">
              {recentDonors.map((d, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-3 md:p-4 ${
                    i !== recentDonors.length - 1 ? "border-b border-[#eceae4]" : ""
                  }`}
                >
                  <div
                    className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-[13px]"
                    style={{ background: d.color }}
                  >
                    {d.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-[#15233b]">
                      {d.name}
                    </div>
                    <div className="text-[12px] text-[#837f76]">{d.time}</div>
                  </div>
                  <div className="text-[15px] font-extrabold text-[#15233b]">
                    {d.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#17458b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #d6a72a 0%, transparent 40%)" }} />
        <div className="max-w-[1340px] mx-auto px-5 md:px-10 py-14 md:py-20 text-center relative">
          <h2 className="text-[28px] md:text-[40px] font-extrabold text-white tracking-tight leading-tight max-w-[800px] mx-auto">
            Be part of the Falcons story. Give today.
          </h2>
          <p className="text-[15px] md:text-[17px] text-[#a9c2ea] mt-4 max-w-[600px] mx-auto">
            Every contribution — big or small — funds a real project in Bengaluru. 100% transparent. 80G certified.
          </p>
          <button
            onClick={() => navigate("/donate")}
            className="mt-8 bg-[#d99a1c] hover:bg-[#c08715] text-[#3a2a05] font-extrabold text-[16px] md:text-[17px] px-9 py-[16px] rounded-[14px] transition-colors"
          >
            Donate now
          </button>
        </div>
      </section>
    </div>
  );
}

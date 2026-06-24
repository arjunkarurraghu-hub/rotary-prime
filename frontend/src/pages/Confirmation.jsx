import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Check, FileText, Download, Share2 } from "lucide-react";
import { projects, clubInfo } from "../mock";
import FalconCrest from "../components/FalconCrest";

export default function Confirmation() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const projectId = params.get("project");
  const amount = parseInt(params.get("amount")) || 0;
  const name = params.get("name") || "Friend";
  const wa = params.get("wa") === "1";
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const refNumber = `${project.id.toUpperCase().replace(/-/g, "").slice(0, 8)}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#e7ded6] flex items-start justify-center">
      <div className="w-full max-w-[460px] bg-[#e7ded6] min-h-screen md:my-6 md:rounded-[28px] md:border md:border-[#d3c9bf] md:shadow-2xl overflow-hidden md:min-h-0">
        {/* WhatsApp Header */}
        <div className="bg-[#075E54] px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-white text-2xl leading-none">
            ‹
          </button>
          <FalconCrest size={40} />
          <div className="flex-1">
            <div className="text-[15px] font-bold text-white">Rotary Bangalore Prime</div>
            <div className="text-[11px] text-[#bfe0da]">Falcons · official donations</div>
          </div>
          <span className="text-white text-lg">⋮</span>
        </div>

        {/* Chat body */}
        <div className="p-4 pb-32">
          <div className="text-center mb-4">
            <span className="text-[11px] text-[#5b6a66] bg-[#d8e6c8] px-3 py-[3px] rounded-md">
              TODAY
            </span>
          </div>

          {/* Success bubble */}
          <div className="bg-white rounded-tl-sm rounded-[14px] p-4 shadow-sm max-w-[300px] animate-[fadeIn_0.4s_ease-out]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1f8b57] flex items-center justify-center">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
              <div className="text-[14px] text-[#1f2c33] font-bold">
                Thank you, {name}!
              </div>
            </div>
            <div className="text-[14px] text-[#1f2c33] leading-snug mt-2">
              We've received your donation of{" "}
              <strong>₹{amount.toLocaleString("en-IN")}</strong> to{" "}
              <strong>{project.title}</strong>.
            </div>

            {/* Receipt card */}
            <div className="mt-3 bg-[#f6f8f5] border border-[#e4ebe1] rounded-[12px] p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-[#17458b]" />
                <span className="text-[13px] font-extrabold text-[#15233b]">
                  80G Tax Receipt
                </span>
              </div>
              <Row k="Amount" v={`₹${amount.toLocaleString("en-IN")}`} />
              <Row k="Reference" v={refNumber} />
              <Row k="Date" v={today} />
              <Row k="Project" v={project.title} />
            </div>
            <div className="text-right text-[10px] text-[#9aa6a0] mt-2">
              {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} ✓✓
            </div>
          </div>

          {/* Follow-up bubble */}
          <div className="bg-white rounded-[14px] p-3 px-4 shadow-sm max-w-[300px] mt-2 animate-[fadeIn_0.5s_ease-out_0.2s_both]">
            <div className="text-[14px] text-[#1f2c33] leading-snug">
              We'll send photos &amp; progress as meals are served. Reply{" "}
              <strong>STOP</strong> to opt out.
            </div>
            <div className="text-right text-[10px] text-[#9aa6a0] mt-1">
              {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} ✓✓
            </div>
          </div>

          {/* Quick reply chips */}
          <div className="flex gap-2 mt-3 flex-wrap justify-end">
            {[
              { label: "View receipt", icon: FileText },
              { label: "See impact", icon: Share2 },
              { label: "Donate again", icon: Download }
            ].map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  if (c.label === "Donate again") navigate("/");
                  else if (c.label === "See impact")
                    navigate(`/project/${project.id}`);
                }}
                className="bg-white text-[#075E54] border border-[#cdeae4] hover:bg-[#075E54] hover:text-white text-[13px] font-bold px-4 py-[8px] rounded-full transition-colors"
              >
                {c.label}
              </button>
            ))}
          </div>

          {!wa && (
            <div className="text-center mt-6 text-[12px] text-[#5b6a66]">
              (WhatsApp updates disabled — receipt sent only via email.)
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-[13px] text-[#075E54] font-bold underline"
            >
              Back to Rotary Bangalore Prime
            </Link>
          </div>
        </div>

        {/* Bottom input bar */}
        <div className="fixed md:absolute bottom-0 left-0 right-0 max-w-[460px] mx-auto p-3 flex gap-2 items-center bg-[#e7ded6]">
          <div className="flex-1 bg-white rounded-full px-4 py-3 text-[14px] text-[#9aa6a0]">
            Message
          </div>
          <div className="w-11 h-11 rounded-full bg-[#075E54] text-white flex items-center justify-center">
            ➤
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between text-[12.5px] py-[3px] gap-3">
      <span className="text-[#7a8580]">{k}</span>
      <span className="font-bold text-[#1f2c33] text-right break-all">{v}</span>
    </div>
  );
}

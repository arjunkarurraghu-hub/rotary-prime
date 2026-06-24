import React from "react";
import { Phone } from "lucide-react";
import { clubInfo } from "../mock";
import FalconCrest from "./FalconCrest";

export default function Footer() {
  return (
    <footer className="bg-[#15233b] text-white">
      <div className="max-w-[1340px] mx-auto px-5 md:px-10 py-7 flex flex-col md:flex-row md:justify-between md:items-center gap-5">
        <div className="flex items-center gap-3">
          <FalconCrest size={32} />
          <div className="text-[13px] md:text-[14px] text-[#b9c4d6]">
            {clubInfo.meetingPlace} · {clubInfo.meetingTime}
          </div>
        </div>
        <button
          onClick={() =>
            window.open(
              `https://wa.me/919800000000?text=Hello%20Rotary%20Bangalore%20Prime`,
              "_blank"
            )
          }
          className="flex items-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 rounded-[11px] px-4 py-[10px] transition-colors"
        >
          <Phone size={16} className="text-[#25D366]" />
          <span className="text-[14px] font-semibold text-white">
            Chat with us on WhatsApp
          </span>
        </button>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1340px] mx-auto px-5 md:px-10 py-4 text-[12px] text-[#7d8aa3] flex flex-col md:flex-row justify-between gap-2">
          <div>© 2026 Rotary Bangalore Prime · Falcons 2026–27</div>
          <div>80G certified · PAN: AAATR0000R · CSR eligible</div>
        </div>
      </div>
    </footer>
  );
}

import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Shield, Smartphone } from "lucide-react";
import { projects, presetAmounts, impactByAmount } from "../mock";

export default function Donate() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const projectId = params.get("project") || projects[0].id;
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const initialAmount = parseInt(params.get("amount")) || 2500;
  const [amount, setAmount] = useState(initialAmount);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [whatsappReceipt, setWhatsappReceipt] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const activeAmount = useMemo(() => {
    if (custom) {
      const v = parseInt(custom);
      return isNaN(v) ? 0 : v;
    }
    return amount;
  }, [amount, custom]);

  const impact = useMemo(() => {
    if (activeAmount >= 10000) return impactByAmount[10000];
    if (activeAmount >= 5000) return impactByAmount[5000];
    if (activeAmount >= 2500) return impactByAmount[2500];
    if (activeAmount >= 1000) return impactByAmount[1000];
    if (activeAmount >= 500) return impactByAmount[500];
    return "Every rupee helps a family.";
  }, [activeAmount]);

  const handleSelect = (val) => {
    setAmount(val);
    setCustom("");
  };

  const handlePay = () => {
    if (activeAmount < 100) {
      alert("Please enter at least ₹100");
      return;
    }
    navigate(
      `/confirmation?project=${project.id}&amount=${activeAmount}&name=${
        encodeURIComponent(anonymous ? "Anonymous" : name || "Friend")
      }&wa=${whatsappReceipt ? 1 : 0}&freq=${frequency}`
    );
  };

  return (
    <div className="bg-[#f7f6f2] min-h-screen">
      <div className="max-w-[760px] mx-auto px-5 md:px-8 py-6 md:py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#15233b] hover:text-[#17458b] font-bold text-[15px] transition-colors"
        >
          <ArrowLeft size={20} /> Your donation
        </button>

        {/* PROJECT STRIP */}
        <div className="mt-5 bg-white border border-[#eceae4] rounded-[16px] p-3 md:p-4 flex items-center gap-3">
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-[11px] flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: project.iconBg }}
          >
            {project.icon}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-[#17458b] uppercase tracking-wider">
              {project.categoryLabel}
            </div>
            <div className="text-[14px] md:text-[15px] font-bold text-[#15233b] truncate">
              {project.title}
            </div>
          </div>
        </div>

        {/* AMOUNT DISPLAY */}
        <div className="text-center mt-7">
          <div className="text-[12px] font-bold tracking-[0.08em] uppercase text-[#837f76]">
            You're giving
          </div>
          <div className="text-[44px] md:text-[56px] font-extrabold text-[#15233b] tracking-tight mt-1">
            ₹{activeAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[13px] md:text-[14px] text-[#17458b] font-semibold mt-1">
            {impact}
          </div>
        </div>

        {/* PRESETS */}
        <div className="mt-6 grid grid-cols-3 gap-2 md:gap-3">
          {presetAmounts.map((a) => {
            const isActive = amount === a && !custom;
            return (
              <button
                key={a}
                onClick={() => handleSelect(a)}
                className={`py-4 text-center rounded-[14px] text-[15px] md:text-[16px] font-extrabold transition-colors ${
                  isActive
                    ? "border-2 border-[#d99a1c] bg-[#fbf3df] text-[#15233b]"
                    : "border border-[#e7e5df] bg-white text-[#15233b] hover:border-[#d99a1c]"
                }`}
              >
                ₹{a.toLocaleString("en-IN")}
              </button>
            );
          })}
          <div
            className={`py-4 px-3 text-center rounded-[14px] text-[15px] font-bold flex items-center justify-center transition-colors ${
              custom
                ? "border-2 border-[#d99a1c] bg-[#fbf3df]"
                : "border border-[#e7e5df] bg-white"
            }`}
          >
            <span className="text-[#15233b] mr-1">₹</span>
            <input
              type="number"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Custom"
              className="w-full bg-transparent outline-none text-center text-[#15233b] placeholder:text-[#837f76]"
            />
          </div>
        </div>

        {/* FREQUENCY */}
        <div className="mt-6 bg-[#ece9e2] rounded-[14px] p-1 flex">
          {[
            { id: "one-time", label: "One-time" },
            { id: "monthly", label: "Monthly" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFrequency(f.id)}
              className={`flex-1 text-center py-3 rounded-[11px] text-[14px] font-bold transition-all ${
                frequency === f.id
                  ? "bg-white text-[#15233b] shadow-sm"
                  : "text-[#837f76] hover:text-[#15233b]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* DETAILS */}
        <div className="mt-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={anonymous}
              className="bg-white border border-[#eceae4] rounded-[14px] px-4 py-[13px] text-[14px] text-[#15233b] placeholder:text-[#9a958a] outline-none focus:border-[#17458b] disabled:opacity-50"
            />
            <input
              type="tel"
              placeholder="WhatsApp number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white border border-[#eceae4] rounded-[14px] px-4 py-[13px] text-[14px] text-[#15233b] placeholder:text-[#9a958a] outline-none focus:border-[#17458b]"
            />
          </div>
          <label className="flex items-center gap-3 bg-white border border-[#eceae4] rounded-[14px] px-4 py-[13px] cursor-pointer">
            <div
              className={`w-[22px] h-[22px] rounded-[7px] flex items-center justify-center transition-colors ${
                whatsappReceipt ? "bg-[#17458b]" : "bg-[#ece9e2]"
              }`}
              onClick={() => setWhatsappReceipt(!whatsappReceipt)}
            >
              {whatsappReceipt && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <span className="flex-1 text-[13px] md:text-[14px] text-[#4b4840] font-medium">
              Send my 80G receipt &amp; updates on WhatsApp
            </span>
          </label>
          <label className="flex items-center gap-3 bg-white border border-[#eceae4] rounded-[14px] px-4 py-[13px] cursor-pointer">
            <div
              className={`w-[22px] h-[22px] rounded-[7px] flex items-center justify-center transition-colors ${
                anonymous ? "bg-[#17458b]" : "bg-[#ece9e2]"
              }`}
              onClick={() => setAnonymous(!anonymous)}
            >
              {anonymous && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <span className="flex-1 text-[13px] md:text-[14px] text-[#4b4840] font-medium">
              Donate anonymously
            </span>
          </label>
        </div>

        {/* TRUST */}
        <div className="mt-6 flex flex-wrap gap-3 text-[12px] text-[#5c5950]">
          <div className="flex items-center gap-2 bg-white border border-[#eceae4] rounded-full px-3 py-[6px]">
            <Shield size={13} className="text-[#1f8b57]" /> 80G certified
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#eceae4] rounded-full px-3 py-[6px]">
            <Smartphone size={13} className="text-[#17458b]" /> Secure UPI
          </div>
        </div>

        <div className="h-32 md:h-8" />
      </div>

      {/* STICKY PAY BUTTON */}
      <div className="sticky bottom-0 bg-white border-t border-[#eceae4] p-4 md:p-5">
        <div className="max-w-[760px] mx-auto">
          <button
            onClick={handlePay}
            className="w-full bg-[#d99a1c] hover:bg-[#c08715] text-[#3a2a05] font-extrabold text-[16px] md:text-[17px] py-[17px] rounded-[16px] transition-colors"
          >
            Pay ₹{activeAmount.toLocaleString("en-IN")}{" "}
            {frequency === "monthly" ? "/ month" : ""} with UPI
          </button>
        </div>
      </div>
    </div>
  );
}

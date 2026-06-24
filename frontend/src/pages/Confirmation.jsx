import React, { useEffect, useRef, useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Check,
  FileText,
  Download,
  Share2,
  Award,
  Trophy,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { projects } from "../mock";
import TaxReceipt80G from "../components/receipts/TaxReceipt80G";
import DonorCertificate from "../components/receipts/DonorCertificate";
import { downloadElementAsPdf } from "../utils/pdfExport";

export default function Confirmation() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const projectId = params.get("project");
  const amount = parseInt(params.get("amount")) || 0;
  const name = params.get("name") || "Friend";
  const wa = params.get("wa") === "1";
  const project = projects.find((p) => p.id === projectId) || projects[0];

  // Use a stable ref number across renders
  const refNumber = useMemo(
    () =>
      `${project.id.toUpperCase().replace(/-/g, "").slice(0, 6)}-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
    [project.id]
  );

  const today = new Date();
  const todayStr = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  // Determine certificate tier
  let tier = null;
  if (amount >= 50000) tier = "gold";
  else if (amount >= 10000) tier = "silver";

  const receiptRef = useRef(null);
  const certRef = useRef(null);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const downloadReceipt = async () => {
    setBusy("receipt");
    try {
      await downloadElementAsPdf(
        receiptRef.current,
        `80G-Receipt-${refNumber}.pdf`
      );
    } finally {
      setBusy(null);
    }
  };

  const downloadCert = async () => {
    setBusy("cert");
    try {
      await downloadElementAsPdf(
        certRef.current,
        `${tier === "gold" ? "Gold" : "Silver"}-Donor-Certificate-${refNumber}.pdf`,
        { orientation: "landscape" }
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      {/* TOP BAR */}
      <div className="bg-[#0e2a52] text-white">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-5 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#a9c2ea] hover:text-white text-[14px] font-semibold"
          >
            <ArrowLeft size={18} /> Back to home
          </button>
          <div className="ml-auto text-[11px] font-bold tracking-[0.12em] uppercase text-[#d6a72a]">
            Donation Successful
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-8 md:py-12">
        {/* HERO SUCCESS */}
        <div className="bg-white border border-[#eceae4] rounded-[24px] p-6 md:p-10 shadow-[0_18px_44px_-24px_rgba(20,35,59,0.3)] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 90% 10%, #d6a72a 0%, transparent 50%)"
            }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#1f8b57] text-white flex items-center justify-center flex-shrink-0 shadow-lg">
              <Check size={32} strokeWidth={3} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#1f8b57]">
                Thank you for your generosity
              </div>
              <h1 className="text-[26px] md:text-[36px] font-extrabold text-[#15233b] tracking-tight mt-1 leading-tight">
                ₹{amount.toLocaleString("en-IN")} received from {name}.
              </h1>
              <p className="text-[14px] md:text-[15px] text-[#5c5950] mt-2">
                Your contribution is going straight to{" "}
                <strong className="text-[#15233b]">{project.title}</strong>. A
                receipt has been generated below — 80G tax deductible.
              </p>
            </div>
            {tier && (
              <div
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-extrabold tracking-[0.12em] uppercase ${
                  tier === "gold"
                    ? "bg-gradient-to-r from-[#f5cf52] to-[#d4a020] text-[#3a2a05]"
                    : "bg-gradient-to-r from-[#c7ccd2] to-[#9aa3ad] text-[#0e2a52]"
                }`}
              >
                {tier === "gold" ? <Trophy size={14} /> : <Award size={14} />}
                {tier} patron unlocked
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
            <button
              onClick={downloadReceipt}
              disabled={busy === "receipt"}
              className="flex items-center justify-center gap-2 bg-[#17458b] hover:bg-[#0e2a52] text-white font-extrabold text-[14px] py-[14px] rounded-[14px] transition-colors disabled:opacity-60"
            >
              <Download size={16} />
              {busy === "receipt" ? "Preparing…" : "Download 80G Receipt"}
            </button>
            {tier && (
              <button
                onClick={downloadCert}
                disabled={busy === "cert"}
                className={`flex items-center justify-center gap-2 font-extrabold text-[14px] py-[14px] rounded-[14px] transition-colors disabled:opacity-60 ${
                  tier === "gold"
                    ? "bg-gradient-to-r from-[#d4a020] to-[#f5cf52] hover:brightness-95 text-[#3a2a05]"
                    : "bg-gradient-to-r from-[#9aa3ad] to-[#c7ccd2] hover:brightness-95 text-[#0e2a52]"
                }`}
              >
                <Sparkles size={16} />
                {busy === "cert"
                  ? "Preparing…"
                  : `Download ${tier === "gold" ? "Gold" : "Silver"} Certificate`}
              </button>
            )}
            <button
              onClick={() => navigate(`/project/${project.id}`)}
              className="flex items-center justify-center gap-2 bg-white border border-[#e7e5df] hover:border-[#15233b] text-[#15233b] font-bold text-[14px] py-[14px] rounded-[14px] transition-colors"
            >
              <Share2 size={16} /> See project impact
            </button>
          </div>

          {/* Quick facts */}
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#eceae4]">
            <Fact k="Receipt no." v={refNumber} />
            <Fact k="Date" v={todayStr} />
            <Fact k="Project" v={project.title} />
            <Fact k="Tax benefit" v="Section 80G eligible" />
          </div>
        </div>

        {/* WHATSAPP UPDATE STRIP */}
        {wa && (
          <div className="mt-6 bg-[#e7f6ee] border border-[#bce0c8] rounded-[14px] px-4 py-3 flex items-center gap-3 text-[13px] text-[#1a5a3a]">
            <span className="text-[#1f8b57]">●</span>
            <span>
              <strong>WhatsApp confirmation sent</strong> — you'll receive photos
              and progress updates as your contribution is put to work.
            </span>
          </div>
        )}

        {/* RECEIPT PREVIEW */}
        <div className="mt-10">
          <SectionHead
            eyebrow="80G Tax Receipt"
            title="Your tax-deductible receipt"
            subtitle="Eligible for deduction under Section 80G of the Income Tax Act, 1961."
          />
          <div className="mt-5 bg-[#eceae4] rounded-[20px] p-3 md:p-6 overflow-hidden">
            <div className="overflow-auto">
              <div
                className="origin-top-left transform mx-auto"
                style={{
                  transform: "scale(var(--rec-scale, 1))",
                  transformOrigin: "top left",
                  width: "794px"
                }}
              >
                <TaxReceipt80G
                  ref={receiptRef}
                  name={name}
                  amount={amount}
                  refNumber={refNumber}
                  date={today}
                  mode="UPI"
                  project={project.title}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CERTIFICATE PREVIEW */}
        {tier && (
          <div className="mt-10">
            <SectionHead
              eyebrow={tier === "gold" ? "Gold Donor" : "Silver Donor"}
              title={
                tier === "gold"
                  ? "Your Gold Patron certificate"
                  : "Your Silver Patron certificate"
              }
              subtitle={
                tier === "gold"
                  ? "Awarded to donors contributing ₹50,000 and above — our highest tier of recognition."
                  : "Awarded to donors contributing ₹10,000 and above — thank you for being a valued contributor."
              }
            />
            <div className="mt-5 bg-[#eceae4] rounded-[20px] p-3 md:p-6 overflow-auto">
              <div
                className="origin-top-left transform mx-auto"
                style={{ width: "1123px" }}
              >
                <DonorCertificate
                  ref={certRef}
                  name={name}
                  amount={amount}
                  project={project.title}
                  date={today}
                  tier={tier}
                  refNumber={refNumber}
                />
              </div>
            </div>
          </div>
        )}

        {/* Upsell to higher tier */}
        {tier === "silver" && (
          <div className="mt-6 bg-gradient-to-r from-[#fbf3df] to-[#fdebbe] border border-[#f0e2bf] rounded-[18px] p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <Trophy size={28} className="text-[#9a5a1a] flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[16px] font-extrabold text-[#3a2a05]">
                Unlock the Gold Patron certificate at ₹50,000
              </div>
              <div className="text-[13px] text-[#6a4d12] mt-1">
                Top up to upgrade your recognition tier — and double your impact on the Roti Project.
              </div>
            </div>
            <button
              onClick={() => navigate(`/donate?project=${project.id}&amount=50000`)}
              className="bg-[#d99a1c] hover:bg-[#c08715] text-[#3a2a05] font-extrabold text-[14px] px-5 py-3 rounded-[12px]"
            >
              Top up to Gold
            </button>
          </div>
        )}
        {!tier && amount > 0 && (
          <div className="mt-6 bg-[#f1f3f7] border border-[#dadde2] rounded-[18px] p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
            <Award size={28} className="text-[#5a6573] flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[16px] font-extrabold text-[#15233b]">
                Donate ₹10,000+ to receive a Silver Patron certificate
              </div>
              <div className="text-[13px] text-[#5c5950] mt-1">
                Recognition certificates start at ₹10,000 (Silver) and ₹50,000 (Gold).
              </div>
            </div>
            <button
              onClick={() => navigate(`/donate?project=${project.id}&amount=10000`)}
              className="bg-[#17458b] hover:bg-[#0e2a52] text-white font-extrabold text-[14px] px-5 py-3 rounded-[12px]"
            >
              Give ₹10,000
            </button>
          </div>
        )}

        {/* WhatsApp-style follow up — kept compact */}
        <div className="mt-10 max-w-[640px] mx-auto bg-[#dcd2c5] rounded-[20px] p-4 border border-[#c9bda9]">
          <div className="bg-[#075E54] text-white rounded-t-[12px] px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-[13px]">
              RBP
            </div>
            <div className="text-[13px]">
              <div className="font-bold">Rotary Bangalore Prime</div>
              <div className="text-[10px] text-[#bfe0da]">Falcons · official donations</div>
            </div>
          </div>
          <div className="bg-[#e7ded6] p-4 rounded-b-[12px] space-y-2">
            <div className="bg-white rounded-tl-sm rounded-[12px] p-3 max-w-[300px] text-[13px] text-[#1f2c33]">
              🙏 Thank you, <strong>{name}</strong>! We've received your donation
              of <strong>₹{amount.toLocaleString("en-IN")}</strong> to{" "}
              <strong>{project.title}</strong>. Your 80G receipt and{" "}
              {tier ? `${tier} certificate are` : "receipt is"} attached above.
            </div>
            <div className="bg-white rounded-[12px] p-3 max-w-[300px] text-[13px] text-[#1f2c33]">
              We'll send photos and progress updates as your contribution is put
              to work. Reply <strong>STOP</strong> to opt out. 💛
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-[14px] text-[#17458b] font-bold underline">
            Back to Rotary Bangalore Prime
          </Link>
        </div>
      </div>
    </div>
  );
}

function Fact({ k, v }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#837f76]">
        {k}
      </div>
      <div className="text-[13px] font-bold text-[#15233b] mt-1 break-words">
        {v}
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, subtitle }) {
  return (
    <div>
      <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#9a5a1a]">
        {eyebrow}
      </div>
      <h2 className="text-[22px] md:text-[28px] font-extrabold text-[#15233b] tracking-tight mt-1 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[14px] text-[#5c5950] mt-1 max-w-[600px]">{subtitle}</p>
      )}
    </div>
  );
}

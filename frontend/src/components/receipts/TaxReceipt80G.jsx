import React, { forwardRef } from "react";
import { amountInWords, inrFormat } from "../../utils/numberToWords";

// A4 portrait 80G tax receipt for Rotary Bangalore Prime Trust.
// Render at fixed 794x1123 px (A4 @ 96dpi) so the PDF export captures cleanly.
const TaxReceipt80G = forwardRef(function TaxReceipt80G(
  { name, amount, refNumber, date, mode = "UPI", project },
  ref
) {
  const today = date || new Date();
  const dateStr = today.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const words = amountInWords(amount);

  return (
    <div
      ref={ref}
      className="bg-white text-[#15233b] mx-auto"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "56px 64px",
        fontFamily: "Hanken Grotesk, sans-serif",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      {/* Decorative top band */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          background: "linear-gradient(90deg,#17458b 0%,#17458b 60%,#d99a1c 60%,#d99a1c 100%)"
        }}
      />

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src="/rbp_logo_full.png"
          alt="Rotary Bangalore Prime"
          style={{ height: 64, width: "auto" }}
          crossOrigin="anonymous"
        />
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#9a5a1a", textTransform: "uppercase" }}>
            Falcons 2026–27 · District 3191
          </div>
          <div style={{ fontSize: 13, color: "#5c5950", marginTop: 2 }}>
            Hotel Chancery Pavillion, Residency Road
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#17458b", letterSpacing: 4, textTransform: "uppercase" }}>
          Official 80G Tax Receipt
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, marginTop: 4, letterSpacing: -0.5 }}>
          ROTARY BANGALORE PRIME TRUST
        </div>
        <div style={{ height: 3, width: 72, background: "#d99a1c", margin: "10px auto 0" }} />
      </div>

      {/* Meta */}
      <div
        style={{
          marginTop: 30,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: 8,
          columnGap: 24,
          fontSize: 13
        }}
      >
        <Field k="Date" v={dateStr} />
        <Field k="Receipt No." v={refNumber} />
        <Field k="PAN" v="ACSPA5925A" />
        <Field k="Mode of payment" v={mode} />
        <Field
          k="Address"
          v="45/11, 3rd Floor, 2nd Cross, Yeshwanthpur Industrial Suburb, Bengaluru — 560 022"
          full
        />
      </div>

      {/* Receipt body */}
      <div
        style={{
          marginTop: 28,
          background: "#fbf3df",
          border: "1px solid #f0e2bf",
          borderRadius: 12,
          padding: "24px 26px",
          fontSize: 15,
          lineHeight: 1.7,
          color: "#3a2a05"
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "#9a5a1a" }}>
          Receipt
        </div>
        <div style={{ marginTop: 10, color: "#15233b" }}>
          Received with thanks from <strong>Smt. / Sri / M/s. {name || "Donor"}</strong> a sum of{" "}
          <strong>Rs. {words} Only</strong> ({" "}
          <strong>₹ {inrFormat(amount)}</strong> ) by <strong>{mode}</strong> on{" "}
          <strong>{dateStr}</strong>, drawn towards <strong>Voluntary Donation</strong>
          {project ? (
            <>
              {" "}
              for the project <strong>{project}</strong>.
            </>
          ) : (
            "."
          )}
        </div>
      </div>

      {/* Big amount block */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24
        }}
      >
        <div
          style={{
            flex: 1,
            border: "2px solid #15233b",
            borderRadius: 12,
            padding: "16px 20px"
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#837f76", textTransform: "uppercase", letterSpacing: 2 }}>
            Total Donation
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>
            ₹ {inrFormat(amount)} /-
          </div>
        </div>
        <div style={{ textAlign: "center", minWidth: 200 }}>
          <div
            style={{
              height: 56,
              borderBottom: "1.5px solid #15233b",
              marginBottom: 4
            }}
          />
          <div style={{ fontSize: 13, fontWeight: 700 }}>For Rotary Bangalore Prime Trust</div>
          <div style={{ fontSize: 12, color: "#837f76" }}>Chairman</div>
        </div>
      </div>

      {/* Compliance */}
      <div
        style={{
          marginTop: 28,
          background: "#f4f2ec",
          border: "1px dashed #c9c2b3",
          borderRadius: 10,
          padding: "16px 20px",
          fontSize: 12,
          color: "#4b4840",
          lineHeight: 1.7
        }}
      >
        <div style={{ fontWeight: 800, color: "#15233b", fontSize: 13, marginBottom: 6 }}>
          Income Tax Act Compliance
        </div>
        Registration under the Income Tax Act, 12-Clause (iv) of first proviso to sub-section (5) of section 80G.
        Valid from <strong>09/07/2021</strong>.
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontWeight: 700, color: "#15233b" }}>Unique Registration No.</span>
            <span style={{ fontFamily: "ui-monospace, monospace", marginLeft: 8 }}>AADTT5774F22BL01</span>
          </div>
          <div>
            <span style={{ fontWeight: 700, color: "#15233b" }}>Date of Issue</span>
            <span style={{ fontFamily: "ui-monospace, monospace", marginLeft: 8 }}>02-05-2023</span>
          </div>
        </div>
        <div style={{ marginTop: 6 }}>
          Donations to Rotary Bangalore Prime Trust are eligible for deduction under Section 80G of the Income Tax Act, 1961.
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 40,
          borderTop: "1px solid #eceae4",
          paddingTop: 14,
          fontSize: 11,
          color: "#9a958a",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>This is a system-generated receipt and does not require a physical signature.</div>
        <div>rotarybangaloreprime.org</div>
      </div>
    </div>
  );
});

function Field({ k, v, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / span 2" : "auto" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#837f76", textTransform: "uppercase", letterSpacing: 1.5 }}>
        {k}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#15233b", marginTop: 2 }}>{v}</div>
    </div>
  );
}

export default TaxReceipt80G;

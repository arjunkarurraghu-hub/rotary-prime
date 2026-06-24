import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Projects", path: "/#projects" },
  { label: "Our Club", path: "/club" },
  { label: "Impact", path: "/impact" },
  { label: "CSR", path: "/#csr" },
  { label: "Events", path: "/events" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (path) => {
    setOpen(false);
    if (path.startsWith("/#")) {
      const id = path.split("#")[1];
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ease-out ${
        scrolled
          ? "bg-white/85 backdrop-blur-md shadow-[0_6px_20px_-12px_rgba(20,35,59,0.18)] border-b border-[#eceae4]/80"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div
        className={`max-w-[1340px] mx-auto flex justify-between items-center px-5 md:px-10 transition-all duration-300 ease-out ${
          scrolled ? "py-2" : "py-3 md:py-4"
        }`}
      >
        <Link to="/" className="flex items-center min-w-0">
          <img
            src="/rbp_logo_full.png"
            alt="Rotary Bangalore Prime · Create Lasting Impact"
            className={`w-auto object-contain transition-all duration-300 ease-out ${
              scrolled
                ? "h-10 sm:h-11 md:h-12"
                : "h-12 sm:h-14 md:h-16"
            }`}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNav(l.path)}
              className="text-[15px] font-medium text-[#6b675e] hover:text-[#15233b] transition-colors"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/donate")}
            className={`bg-[#d99a1c] hover:bg-[#c08715] text-[#3a2a05] font-extrabold text-[15px] rounded-[11px] transition-all duration-300 ${
              scrolled ? "px-5 py-[8px]" : "px-5 py-[10px]"
            }`}
          >
            Donate
          </button>
        </nav>

        <button
          className="lg:hidden p-2 -mr-2 text-[#15233b]"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#eceae4] bg-white">
          <div className="px-5 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNav(l.path)}
                className="text-left py-3 px-2 text-[15px] font-semibold text-[#15233b] border-b border-[#f0eee8]"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/donate");
              }}
              className="mt-3 bg-[#d99a1c] hover:bg-[#c08715] text-[#3a2a05] font-extrabold text-[15px] py-3 rounded-[11px]"
            >
              Donate
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

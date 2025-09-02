import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Kandidaten" },
  { to: "/pipelines", label: "Pipelines" },
  { to: "/reports", label: "Berichte" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const item = (to: string, label: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        "px-3 py-2 rounded-md text-sm font-medium transition " +
        (isActive
          ? "bg-sky-100 text-sky-700"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900")
      }
      onClick={() => setOpen(false)} 
    >
      {label}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 shadow-md">
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" />

      <nav className="bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-6">
          {/* Logo */}
          <div className="text-xl font-black tracking-tight">
            <Link
              to="/"
              className="bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
            >
              TalentHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="ml-auto hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((it) => item(it.to, it.label))}

            <div className="h-6 w-px bg-gray-300/60 mx-3" />

            <Link
              to="/import"
              className="px-3 py-2 rounded-md text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              CSV importieren
            </Link>
            <Link
              to="/new"
              className="px-3 py-2 rounded-md text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition"
            >
              Neuen Kandidaten
            </Link>
          </div>

          {/* Mobile Burger Button */}
          <button
            className="md:hidden ml-auto inline-flex items-center justify-center rounded-md border px-3 py-2 text-gray-700"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü öffnen"
            aria-expanded={open}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="md:hidden border-t bg-white/90 backdrop-blur">
            <div className="px-4 py-3 flex flex-col gap-2">
              {NAV_ITEMS.map((it) => item(it.to, it.label))}

              <div className="flex flex-col gap-2 pt-3">
                <Link
                  to="/import"
                  className="w-full text-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  CSV importieren
                </Link>
                <Link
                  to="/new"
                  className="w-full text-center rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white hover:bg-sky-600"
                  onClick={() => setOpen(false)}
                >
                  Neuen Kandidaten
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

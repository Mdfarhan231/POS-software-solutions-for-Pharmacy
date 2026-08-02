"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Calculator,
  Calendar,
  ChevronDown,
  Filter,
  Info,
  LogOut,
  Menu,
  Plus,
  ShoppingBag,
  UserCheck,
  Wallet,
} from "lucide-react";
import CalculatorModal from "@/components/modals/CalculatorModal";

export default function TopHeaderBar({
  onToggleSidebar,
  onOpenPOS,
  onLogout,
}) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [language, setLanguage] = useState("bn");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const dateUpdate = window.setTimeout(() => {
      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
        .format(new Date())
        .replaceAll("/", "-");

      setCurrentDate(formattedDate);
    }, 0);

    return () => window.clearTimeout(dateUpdate);
  }, []);

  return (
    <>
      <header className="z-30 shrink-0 border-b border-[#520d1a] bg-[#6b1224] text-white shadow-md">
        <div className="flex min-h-[52px] items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="rounded-lg p-1.5 text-rose-100 transition hover:bg-[#540c1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              title="Toggle navigation menu"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-lg font-black tracking-tight text-white">
                PharmaDesk
              </span>
              <button
                type="button"
                className="text-rose-200/80 transition hover:text-white"
                title="About PharmaDesk"
                aria-label="About PharmaDesk"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={onOpenPOS}
              className="shrink-0 rounded-lg bg-[#540c1b] p-1.5 font-bold text-white transition hover:bg-[#450915] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              title="Quick add sale"
              aria-label="Quick add sale"
            >
              <Plus className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowCalculator(true)}
              className="shrink-0 rounded-lg bg-[#540c1b] p-1.5 font-bold text-white transition hover:bg-[#450915] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              title="Open calculator"
              aria-label="Open calculator"
            >
              <Calculator className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onOpenPOS}
              className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-black tracking-wide text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>+ SALE</span>
            </button>

            <button
              type="button"
              onClick={onOpenPOS}
              className="shrink-0 rounded-lg bg-[#540c1b] p-1.5 font-bold text-white transition hover:bg-[#450915] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              title="Open cash register"
              aria-label="Open cash register"
            >
              <Wallet className="h-4 w-4" />
            </button>

            <div className="hidden shrink-0 items-center gap-1 rounded-lg border border-rose-900/40 bg-[#540c1b] px-2.5 py-1 text-xs font-bold text-rose-100 sm:flex">
              <Calendar className="h-3.5 w-3.5" />
              <span>{currentDate || "-- -- ----"}</span>
            </div>

            <label className="relative shrink-0">
              <span className="sr-only">Select language</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                <option value="bn">ভাষা বেছে নিন</option>
                <option value="en">English</option>
              </select>
            </label>

            <button
              type="button"
              className="relative shrink-0 rounded-lg bg-[#540c1b] p-1.5 text-white transition hover:bg-[#450915] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#6b1224] bg-emerald-400" />
            </button>

            <div className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-rose-900/40 bg-[#540c1b] px-3 py-1 text-xs font-bold text-white md:flex">
              <UserCheck className="h-3.5 w-3.5 text-rose-300" />
              <span>PharmaDesk</span>
            </div>

            <button
              type="button"
              className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500 bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:flex"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filter by date</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="shrink-0 rounded-lg bg-[#540c1b] p-1.5 text-rose-100 transition hover:bg-[#450915] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {showCalculator ? (
        <CalculatorModal onClose={() => setShowCalculator(false)} />
      ) : null}
    </>
  );
}

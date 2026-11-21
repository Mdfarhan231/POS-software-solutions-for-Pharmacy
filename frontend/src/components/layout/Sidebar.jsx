"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
} from "lucide-react";
import {
  SIDEBAR_MENU_ITEMS,
  SIDEBAR_SIMPLE_ITEMS,
} from "@/components/layout/navigation";

export default function Sidebar({ activeTab, setActiveTab, isOpen }) {
  const [openSubmenu, setOpenSubmenu] = useState("purchases");

  if (!isOpen) return null;

  function navigate(tab) {
    setActiveTab(tab);

    const activeMenu = SIDEBAR_MENU_ITEMS.find((item) =>
      item.activeTabs?.includes(tab)
    );
    if (activeMenu) setOpenSubmenu(activeMenu.id);
  }

  return (
    <aside className="fixed bottom-0 left-0 top-[52px] z-40 flex w-64 shrink-0 select-none flex-col justify-between border-r border-slate-800 bg-[#1e2238] text-slate-300 shadow-2xl lg:static lg:z-auto lg:h-auto lg:shadow-none">
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-3 text-xs font-semibold">
        <button
          type="button"
          onClick={() => navigate("dashboard")}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition ${
            activeTab === "dashboard"
              ? "bg-[#7a1528] font-bold text-white shadow-md"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </button>

        {SIDEBAR_MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isExpanded = openSubmenu === item.id;
          const isActive = item.activeTabs?.includes(activeTab);

          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setOpenSubmenu((current) =>
                    current === item.id ? null : item.id
                  );
                  if (item.defaultTab) setActiveTab(item.defaultTab);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition ${
                  isActive
                    ? "bg-[#7a1528] font-bold text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </span>
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>

              {isExpanded ? (
                <div className="space-y-1 py-1 pl-9 pr-2 text-[11px] text-slate-400">
                  {item.children.map((child) => (
                    <button
                      key={child.tab}
                      type="button"
                      onClick={() => navigate(child.tab)}
                      className={`block w-full rounded-md py-1 text-left transition hover:text-white ${
                        activeTab === child.tab
                          ? "font-bold text-white"
                          : child.highlight
                            ? "font-bold text-emerald-400 hover:text-emerald-300"
                            : ""
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        {SIDEBAR_SIMPLE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => navigate(item.tab)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? "bg-[#7a1528] font-bold text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${item.accent ? "text-sky-400" : ""}`} />
                <span>{item.label}</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-3 text-center text-[10px] text-slate-500">
        PharmaDesk Enterprise &bull; v4.2.0
      </div>
    </aside>
  );
}

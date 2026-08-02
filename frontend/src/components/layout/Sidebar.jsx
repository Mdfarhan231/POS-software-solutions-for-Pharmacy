"use client";

import { useState } from "react";
import {
  ArrowRightLeft,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Contact,
  DollarSign,
  Home,
  Landmark,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Users,
} from "lucide-react";

const MENU_ITEMS = [
  {
    id: "user_mgmt",
    label: "User Management",
    icon: Users,
    children: [
      { label: "Users List", tab: "users" },
      { label: "Roles & Permissions", tab: "roles" },
      { label: "Sales Commission Agents", tab: "agents" },
    ],
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: Contact,
    defaultTab: "customers",
    activeTabs: ["suppliers", "customers", "customer-groups"],
    children: [
      { label: "Suppliers", tab: "suppliers" },
      { label: "Customers", tab: "customers" },
      { label: "Customer Groups", tab: "customer-groups" },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    defaultTab: "inventory",
    activeTabs: ["inventory", "add-product", "print-labels", "variations"],
    children: [
      { label: "List Products", tab: "inventory" },
      { label: "Add Product", tab: "add-product" },
      { label: "Print Labels", tab: "print-labels" },
      { label: "Variations", tab: "variations" },
    ],
  },
  {
    id: "purchases",
    label: "Purchases",
    icon: ShoppingBag,
    defaultTab: "purchases",
    activeTabs: ["purchases", "add-purchase", "purchase-return"],
    children: [
      { label: "List Purchases", tab: "purchases" },
      { label: "Add Purchase", tab: "add-purchase" },
      { label: "Purchase Return", tab: "purchase-return" },
    ],
  },
  {
    id: "sell",
    label: "Sell",
    icon: ShoppingCart,
    defaultTab: "pos",
    activeTabs: ["pos", "sales", "drafts"],
    children: [
      { label: "+ POS Screen", tab: "pos", highlight: true },
      { label: "All Sales", tab: "sales" },
      { label: "Drafts & Quotations", tab: "drafts" },
    ],
  },
];

const SIMPLE_ITEMS = [
  { label: "Stock Transfers", tab: "stock-transfers", icon: ArrowRightLeft },
  { label: "Stock Adjustment", tab: "stock-adjustment", icon: SlidersHorizontal },
  { label: "Expenses", tab: "expenses", icon: DollarSign },
  { label: "Payment Accounts", tab: "payment-accounts", icon: Landmark },
  { label: "Reports & Analytics", tab: "reports", icon: BarChart3, accent: true },
  { label: "Settings", tab: "settings", icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen }) {
  const [openSubmenu, setOpenSubmenu] = useState("sell");

  if (!isOpen) return null;

  function toggleSubmenu(menuId) {
    setOpenSubmenu((current) => (current === menuId ? null : menuId));
  }

  function navigate(tab) {
    setActiveTab(tab);
  }

  return (
    <aside className="fixed inset-y-0 left-0 top-[52px] z-40 flex w-64 shrink-0 select-none flex-col justify-between border-r border-slate-800 bg-[#1e2238] text-slate-300 shadow-2xl lg:static lg:top-auto lg:z-auto lg:h-full lg:shadow-none">
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

        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isExpanded = openSubmenu === item.id;
          const isActive = item.activeTabs?.includes(activeTab);

          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => {
                  toggleSubmenu(item.id);
                  if (item.defaultTab) navigate(item.defaultTab);
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

        {SIMPLE_ITEMS.map((item) => {
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

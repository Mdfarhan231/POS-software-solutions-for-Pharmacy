import { Construction } from "lucide-react";

const TITLES = {
  users: "Users List",
  roles: "Roles & Permissions",
  agents: "Sales Commission Agents",
  suppliers: "Suppliers",
  customers: "Customers",
  "customer-groups": "Customer Groups",
  inventory: "Product Inventory",
  "add-product": "Add Product",
  "print-labels": "Print Labels",
  variations: "Product Variations",
  purchases: "Purchases",
  "add-purchase": "Add Purchase",
  "purchase-return": "Purchase Return",
  pos: "POS Screen",
  sales: "All Sales",
  drafts: "Drafts & Quotations",
  "stock-transfers": "Stock Transfers",
  "stock-adjustment": "Stock Adjustment",
  expenses: "Expenses",
  "payment-accounts": "Payment Accounts",
  reports: "Reports & Analytics",
  settings: "Settings",
};

export default function ComingSoonView({ activeTab, onOpenPOS }) {
  const title = TITLES[activeTab] || "PharmaDesk Module";

  return (
    <section className="grid min-h-[60vh] place-items-center">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-[#7a1528]">
          <Construction className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-slate-900">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          The navigation and application shell are ready. This module can now be
          connected to its own page components and Laravel API endpoints.
        </p>
        {activeTab !== "pos" ? (
          <button
            type="button"
            onClick={onOpenPOS}
            className="mt-6 rounded-xl bg-[#7a1528] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#610f1e]"
          >
            Open POS Screen
          </button>
        ) : null}
      </div>
    </section>
  );
}

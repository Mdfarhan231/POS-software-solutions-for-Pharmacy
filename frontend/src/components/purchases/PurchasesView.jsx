"use client";

import { useMemo, useState } from "react";
import { FilePlus2, Plus, Search } from "lucide-react";
import { formatCurrency } from "@/lib/pos-utils";

export default function PurchasesView({ purchases, onAddPurchase }) {
  const [query, setQuery] = useState("");

  const filteredPurchases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return purchases.filter((purchase) =>
      [purchase.supplierName, purchase.reference, purchase.invoiceNumber].some(
        (value) => String(value || "").toLowerCase().includes(normalizedQuery)
      )
    );
  }, [purchases, query]);

  const totalPurchaseValue = purchases.reduce(
    (sum, purchase) => sum + Number(purchase.totalAmount || 0),
    0
  );
  const balanceDue = purchases.reduce(
    (sum, purchase) => sum + Number(purchase.dueAmount || 0),
    0
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a1528]">
            Supplier invoices &amp; stock received
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Purchases
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Every entry is linked to a supplier and adds its batches to inventory.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddPurchase}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7a1528] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#610f1e]"
        >
          <Plus className="h-4 w-4" /> Add Purchase
        </button>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Purchase records" value={purchases.length} />
        <SummaryCard label="Total purchased" value={formatCurrency(totalPurchaseValue)} />
        <SummaryCard label="Supplier balance due" value={formatCurrency(balanceDue)} accent />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-slate-900">Purchase history</h2>
            <p className="mt-0.5 text-xs text-slate-500">Supplier name and invoice reference are saved with each purchase.</p>
          </div>
          <label className="relative w-full sm:max-w-xs">
            <span className="sr-only">Search purchases</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search supplier or invoice"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs outline-none focus:border-[#7a1528] focus:ring-2 focus:ring-rose-900/10"
            />
          </label>
        </div>

        {filteredPurchases.length === 0 ? (
          <div className="grid min-h-64 place-items-center px-5 py-10 text-center">
            <div className="max-w-sm">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-[#7a1528]">
                <FilePlus2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">
                {purchases.length === 0 ? "No purchases recorded yet" : "No matching purchases"}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {purchases.length === 0
                  ? "Add a supplier invoice to record the medicine batches and increase inventory."
                  : "Try another supplier name or invoice reference."}
              </p>
              {purchases.length === 0 ? (
                <button type="button" onClick={onAddPurchase} className="mt-4 rounded-lg bg-[#7a1528] px-4 py-2 text-sm font-semibold text-white hover:bg-[#610f1e]">
                  Add first purchase
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3 font-semibold">Purchase / Invoice</th>
                  <th className="px-4 py-3 font-semibold">Supplier</th>
                  <th className="px-4 py-3 font-semibold">Purchase date</th>
                  <th className="px-4 py-3 text-right font-semibold">Items</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 text-right font-semibold">Due</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="block font-mono font-bold text-[#7a1528]">{purchase.reference}</span>
                      {purchase.invoiceNumber ? <span className="mt-0.5 block text-[11px] text-slate-400">Invoice {purchase.invoiceNumber}</span> : null}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{purchase.supplierName}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(purchase.purchaseDate)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">{purchase.items.length}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-slate-900">{formatCurrency(purchase.totalAmount)}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-[#7a1528]">{formatCurrency(purchase.dueAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${purchase.dueAmount > 0 ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>
                        {purchase.dueAmount > 0 ? "Due" : "Paid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value, accent }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className={`mt-2 font-mono text-xl font-black tabular-nums ${accent ? "text-[#7a1528]" : "text-slate-900"}`}>
        {value}
      </p>
    </article>
  );
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

"use client";

import { PackageOpen, Plus } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/pos-utils";

export default function InventoryView({ inventory, onAddPurchase }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a1528]">
            Stock by received batch
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Product Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Items entered through purchases appear here with their supplier and batch details.
          </p>
        </div>
        <button type="button" onClick={onAddPurchase} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7a1528] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#610f1e]">
          <Plus className="h-4 w-4" /> Receive stock
        </button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {inventory.length === 0 ? (
          <div className="grid min-h-64 place-items-center px-5 py-10 text-center">
            <div className="max-w-sm">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-[#7a1528]">
                <PackageOpen className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-bold text-slate-900">No purchased stock yet</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Save a purchase with a supplier, product, batch, and quantity to add it to inventory.
              </p>
              <button type="button" onClick={onAddPurchase} className="mt-4 rounded-lg bg-[#7a1528] px-4 py-2 text-sm font-semibold text-white hover:bg-[#610f1e]">
                Add a purchase
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3 font-semibold">Medicine / Product</th>
                  <th className="px-4 py-3 font-semibold">Batch</th>
                  <th className="px-4 py-3 font-semibold">Supplier</th>
                  <th className="px-4 py-3 font-semibold">Expiry</th>
                  <th className="px-4 py-3 text-right font-semibold">Received</th>
                  <th className="px-4 py-3 font-semibold">Unit</th>
                  <th className="px-4 py-3 text-right font-semibold">Cost / Unit</th>
                  <th className="px-4 py-3 text-right font-semibold">Retail / Unit</th>
                  <th className="px-4 py-3 font-semibold">Purchase Ref.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.imageData ? (
                          <Image
                            src={item.imageData}
                            alt={`${item.productName} product`}
                            width={40}
                            height={40}
                            unoptimized
                            className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-0.5"
                          />
                        ) : (
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                            <PackageOpen className="h-4 w-4" />
                          </div>
                        )}
                        <span className="font-semibold text-slate-900">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{item.batchNumber}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{item.supplierName}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(item.expiryDate)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-slate-900">{Number(item.quantity).toLocaleString()}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">{item.unit}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">{formatCurrency(item.purchasePrice)}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">{formatCurrency(item.sellingPrice)}</td>
                    <td className="px-4 py-3 font-mono text-[#7a1528]">{item.reference}</td>
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

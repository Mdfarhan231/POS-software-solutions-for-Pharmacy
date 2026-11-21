"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Eye,
  MapPin,
  PauseCircle,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { formatCurrency } from "@/lib/pos-utils";

const FILTERS = ["All", "Active", "On Hold"];
const searchValue = (value) => String(value || "").toLowerCase();

export default function SupplierTable({
  suppliers = [],
  selectedSupplierId,
  onSelectSupplierForPurchase,
  onOpenAddSupplier,
  onInspectSupplier,
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const metrics = useMemo(
    () => ({
      total: suppliers.length,
      active: suppliers.filter((supplier) => supplier.status === "Active").length,
      totalSpend: suppliers.reduce(
        (sum, supplier) => sum + Number(supplier.totalPurchases || 0),
        0
      ),
      totalDue: suppliers.reduce(
        (sum, supplier) => sum + Number(supplier.balanceDue || 0),
        0
      ),
    }),
    [suppliers]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          supplier.name,
          supplier.code,
          supplier.contactPerson,
          supplier.phone,
          supplier.drugLicense,
          supplier.address,
        ].some((value) => searchValue(value).includes(normalizedQuery));
      const matchesStatus =
        statusFilter === "All" || supplier.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, suppliers]);

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-4 rounded-t-xl border-b border-neutral-200 bg-[#0B0B0E] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-tight">
            Supplier Details &amp; Ledger
          </h1>
          <p className="mt-0.5 text-xs text-neutral-400">
            Supplier contacts, purchase totals, and outstanding balances
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddSupplier}
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[#6B1224] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#84182E]"
        >
          <Plus className="h-4 w-4" />
          Add New Supplier
        </button>
      </div>

      <div className="grid grid-cols-2 divide-y divide-neutral-200 border-b border-neutral-200 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <Metric label="Total Suppliers" value={metrics.total} />
        <Metric label="Active Suppliers" value={metrics.active} valueClass="text-emerald-700" />
        <Metric label="Cumulative Purchases" value={formatCurrency(metrics.totalSpend)} />
        <Metric label="Accounts Payable Due" value={formatCurrency(metrics.totalDue)} valueClass="text-[#6B1224]" />
      </div>

      <div className="flex flex-col gap-3 border-b border-neutral-200 bg-neutral-50/70 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-xs">
          <span className="sr-only">Search suppliers</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search supplier, license, phone..."
            className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-xs text-neutral-900 focus:border-[#6B1224] focus:outline-none focus:ring-2 focus:ring-[#6B1224]/15"
          />
        </label>

        <div className="flex items-center gap-1 self-start rounded-lg border border-neutral-200 bg-white p-1 sm:self-auto">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === filter
                  ? "bg-[#6B1224] text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1060px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-100/80 text-neutral-700">
              <th className="px-4 py-3 font-semibold">Supplier &amp; License</th>
              <th className="px-4 py-3 font-semibold">Primary Contact</th>
              <th className="px-4 py-3 font-semibold">Dispatch Address</th>
              <th className="px-4 py-3 font-semibold">Pay Term</th>
              <th className="px-4 py-3 text-right font-semibold">Total Purchases</th>
              <th className="px-4 py-3 text-right font-semibold">Balance Due</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-neutral-500">
                  {suppliers.length === 0
                    ? "No suppliers yet. Add a supplier to start recording purchases."
                    : "No suppliers match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((supplier) => {
                const isSelected = supplier.id === selectedSupplierId;

                return (
                  <tr
                    key={supplier.id}
                    className={`transition-colors ${
                      isSelected ? "bg-[#FBF4F5]" : "hover:bg-[#FBF4F5]/45"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">{supplier.name}</span>
                        {isSelected ? (
                          <span className="font-mono text-[10px] font-semibold text-[#6B1224]">
                            Selected for purchase
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-neutral-500">
                        {supplier.code} · {supplier.drugLicense || "No license"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900">
                        {supplier.contactPerson || "—"}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-neutral-500">
                        <Phone className="h-3 w-3 text-neutral-400" />
                        <span>{supplier.phone || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      <div className="flex max-w-[240px] items-start gap-1.5">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400" />
                        <span className="line-clamp-2">{supplier.address || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-700">
                      <div>
                        {supplier.payTermValue || 0} {supplier.payTermUnit || "days"}
                      </div>
                      <div className="mt-0.5 text-[11px] text-neutral-400">
                        Last: {supplier.lastSupplyDate || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-neutral-900">
                      {formatCurrency(supplier.totalPurchases)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">
                      <span className={Number(supplier.balanceDue) > 0 ? "text-[#6B1224]" : "text-emerald-700"}>
                        {formatCurrency(supplier.balanceDue)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {supplier.status === "On Hold" ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#6B1224]">
                          <PauseCircle className="h-3.5 w-3.5 shrink-0" /> On Hold
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onInspectSupplier(supplier)}
                          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                          <Eye className="h-3 w-3" /> Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectSupplierForPurchase(supplier)}
                          disabled={supplier.status === "On Hold"}
                          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-[#0B0B0E] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#6B1224] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ArrowUpRight className="h-3 w-3" />
                          {isSelected ? "Selected" : "Use Supplier"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Metric({ label, value, valueClass = "text-neutral-900" }) {
  return (
    <div className="px-5 py-3.5">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className={`mt-1 font-mono text-lg font-bold tabular-nums ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

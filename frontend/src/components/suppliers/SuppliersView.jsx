"use client";

import { useState } from "react";
import { X } from "lucide-react";
import SupplierTable from "@/components/suppliers/SupplierTable";
import { createId } from "@/lib/pos-utils";

export default function SuppliersView({
  suppliers,
  selectedSupplierId,
  onUseSupplier,
  onCreateSupplier,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [inspectedSupplier, setInspectedSupplier] = useState(null);
  const [formError, setFormError] = useState("");

  async function handleCreate(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();

    const supplier = {
      id: createId(),
      code: `SUP-${String(suppliers.length + 1).padStart(4, "0")}`,
      name,
      contactPerson: String(formData.get("contactPerson") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      drugLicense: String(formData.get("drugLicense") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      payTermValue: Number(formData.get("payTermValue") || 0),
      payTermUnit: String(formData.get("payTermUnit") || "days"),
      totalPurchases: 0,
      balanceDue: 0,
      status: String(formData.get("status") || "Active"),
      lastSupplyDate: "",
    };

    try {
      await onCreateSupplier(supplier);
      setIsAdding(false);
      setFormError("");
      event.currentTarget.reset();
    } catch (error) {
      const validationMessage = Object.values(error?.errors || {})
        .flat()
        .find(Boolean);
      setFormError(
        validationMessage || error?.message || "Could not save this supplier."
      );
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a1528]">
          Supplier management
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Suppliers
        </h1>
      </div>

      <SupplierTable
        suppliers={suppliers}
        selectedSupplierId={selectedSupplierId}
        onSelectSupplierForPurchase={onUseSupplier}
        onOpenAddSupplier={() => setIsAdding(true)}
        onInspectSupplier={setInspectedSupplier}
      />

      {isAdding ? (
        <Modal title="Add New Supplier" onClose={() => setIsAdding(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {formError ? (
              <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {formError}
              </p>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Supplier name" required>
                <input name="name" required autoFocus className={inputClass} placeholder="Supplier or distributor name" />
              </Field>
              <Field label="Drug license number">
                <input name="drugLicense" className={inputClass} placeholder="License number" />
              </Field>
              <Field label="Contact person">
                <input name="contactPerson" className={inputClass} placeholder="Contact name" />
              </Field>
              <Field label="Phone">
                <input name="phone" type="tel" className={inputClass} placeholder="Phone number" />
              </Field>
              <Field label="Payment term">
                <div className="flex gap-2">
                  <input name="payTermValue" type="number" min="0" defaultValue="0" className={`${inputClass} min-w-0`} />
                  <select name="payTermUnit" className={inputClass}>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </Field>
              <Field label="Status">
                <select name="status" className={inputClass}>
                  <option>Active</option>
                  <option>On Hold</option>
                </select>
              </Field>
              <Field label="Dispatch address" className="sm:col-span-2">
                <textarea name="address" rows={2} className={inputClass} placeholder="Street, city, area" />
              </Field>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setIsAdding(false)} className={secondaryButtonClass}>
                Cancel
              </button>
              <button type="submit" className={primaryButtonClass}>
                Save Supplier
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {inspectedSupplier ? (
        <Modal title="Supplier Details" onClose={() => setInspectedSupplier(null)}>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label="Supplier" value={inspectedSupplier.name} />
            <Detail label="Supplier code" value={inspectedSupplier.code} />
            <Detail label="Drug license" value={inspectedSupplier.drugLicense || "—"} />
            <Detail label="Contact person" value={inspectedSupplier.contactPerson || "—"} />
            <Detail label="Phone" value={inspectedSupplier.phone || "—"} />
            <Detail label="Status" value={inspectedSupplier.status} />
            <Detail label="Address" value={inspectedSupplier.address || "—"} />
            <Detail label="Balance due" value={`৳${Number(inspectedSupplier.balanceDue || 0).toFixed(2)}`} />
          </dl>
        </Modal>
      ) : null}
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#7a1528] focus:ring-2 focus:ring-rose-900/10";
const primaryButtonClass = "rounded-lg bg-[#7a1528] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#610f1e]";
const secondaryButtonClass = "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4">
      <section role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Field({ label, required, className = "", children }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-xs font-semibold text-slate-700">
        {label}{required ? <span className="ml-1 text-rose-700">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

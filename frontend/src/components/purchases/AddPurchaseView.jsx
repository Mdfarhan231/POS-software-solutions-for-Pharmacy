"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  PackagePlus,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";
import { createId, formatCurrency } from "@/lib/pos-utils";

const createEmptyItem = (id) => ({
  id,
  productName: "",
  batchNumber: "",
  expiryDate: "",
  quantity: "1",
  unit: "unit",
  purchasePrice: "",
  sellingPrice: "",
  imageData: "",
});

export default function AddPurchaseView({
  suppliers,
  selectedSupplier,
  onSave,
  onCancel,
  onOpenSuppliers,
}) {
  const [supplierId, setSupplierId] = useState(
    selectedSupplier?.id == null ? "" : String(selectedSupplier.id)
  );
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [amountPaid, setAmountPaid] = useState("0");
  const [items, setItems] = useState([createEmptyItem("item-1")]);
  const [errorMessage, setErrorMessage] = useState("");

  const availableSuppliers = suppliers.filter(
    (supplier) => supplier.status !== "On Hold"
  );
  const selectedSupplierRecord = suppliers.find(
    (supplier) => String(supplier.id) === String(supplierId)
  );
  const totalAmount = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0) * Number(item.purchasePrice || 0),
        0
      ),
    [items]
  );
  const dueAmount = Math.max(0, totalAmount - Number(amountPaid || 0));

  function updateItem(itemId, field, value) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  }

  async function handleImageChange(itemId, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setErrorMessage("");
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Choose an image file for the product photo.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Product images must be 8 MB or smaller.");
      return;
    }

    try {
      const imageData = await compressImage(file);
      updateItem(itemId, "imageData", imageData);
    } catch {
      setErrorMessage("This image could not be loaded. Try another image file.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!selectedSupplierRecord) {
      setErrorMessage("Choose a supplier before recording this purchase.");
      return;
    }

    if (!purchaseDate) {
      setErrorMessage("Choose the purchase date.");
      return;
    }

    if (Number(amountPaid) > totalAmount) {
      setErrorMessage("Amount paid cannot be greater than the purchase total.");
      return;
    }

    const normalizedItems = items.map((item) => ({
      productName: item.productName.trim(),
      batchNumber: item.batchNumber.trim(),
      expiryDate: item.expiryDate,
      quantity: Number(item.quantity),
      unit: item.unit,
      purchasePrice: Number(item.purchasePrice),
      sellingPrice: Number(item.sellingPrice || 0),
      imageData: item.imageData,
      lineTotal: Number(item.quantity) * Number(item.purchasePrice),
    }));

    const id = createId();
    const reference = invoiceNumber.trim() || `PUR-${id.slice(0, 8).toUpperCase()}`;

    try {
      await onSave({
      id,
      supplierId: selectedSupplierRecord.id,
      supplierName: selectedSupplierRecord.name,
      invoiceNumber: invoiceNumber.trim(),
      reference,
      purchaseDate,
      items: normalizedItems,
      totalAmount,
      amountPaid: Number(amountPaid || 0),
      dueAmount,
      status: dueAmount > 0 ? "Due" : "Paid",
      createdAt: new Date().toISOString(),
      });
    } catch (error) {
      const validationMessage = Object.values(error?.errors || {})
        .flat()
        .find(Boolean);
      setErrorMessage(
        validationMessage || error?.message || "Could not save this purchase."
      );
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#7a1528]"
      >
        <ArrowLeft className="h-4 w-4" /> Purchases
      </button>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a1528]">
            Inventory receiving
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Add Purchase
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Record the supplier invoice and add the received batches to inventory.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-[#6b1224] sm:self-auto">
          <Truck className="h-4 w-4" /> Supplier purchase
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <SectionTitle icon={Truck} title="Supplier & invoice" subtitle="Every purchase is saved with its supplier." />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Supplier" required>
              <select
                value={supplierId}
                onChange={(event) => setSupplierId(event.target.value)}
                required
                className={inputClass}
              >
                <option value="">Select supplier</option>
                {availableSuppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
              {availableSuppliers.length === 0 ? (
                <button type="button" onClick={onOpenSuppliers} className="mt-2 text-xs font-semibold text-[#7a1528] hover:underline">
                  Add an active supplier first →
                </button>
              ) : null}
            </Field>
            <Field label="Supplier invoice number">
              <input
                value={invoiceNumber}
                onChange={(event) => setInvoiceNumber(event.target.value)}
                className={inputClass}
                placeholder="Optional supplier reference"
              />
            </Field>
            <Field label="Purchase date" required>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(event) => setPurchaseDate(event.target.value)}
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <SectionTitle icon={PackagePlus} title="Items received" subtitle="Each line creates a batch in inventory." />
            <button
              type="button"
              onClick={() => setItems((current) => [...current, createEmptyItem(createId())])}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#7a1528]/25 bg-rose-50 px-3 py-2 text-xs font-bold text-[#7a1528] transition hover:bg-rose-100"
            >
              <Plus className="h-4 w-4" /> Add item
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {items.map((item, index) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">Item {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))}
                    disabled={items.length === 1}
                    aria-label={`Remove item ${index + 1}`}
                    className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Field label="Medicine / product name" required className="sm:col-span-2">
                    <input value={item.productName} onChange={(event) => updateItem(item.id, "productName", event.target.value)} required className={inputClass} placeholder="Product name and strength" />
                  </Field>
                  <Field label="Batch number" required>
                    <input value={item.batchNumber} onChange={(event) => updateItem(item.id, "batchNumber", event.target.value)} required className={inputClass} placeholder="Supplier batch number" />
                  </Field>
                  <Field label="Expiry date" required>
                    <input type="date" value={item.expiryDate} onChange={(event) => updateItem(item.id, "expiryDate", event.target.value)} required className={inputClass} />
                  </Field>
                  <Field label="Quantity received" required>
                    <input type="number" min="1" step="1" value={item.quantity} onChange={(event) => updateItem(item.id, "quantity", event.target.value)} required className={inputClass} />
                  </Field>
                  <Field label="Unit">
                    <select value={item.unit} onChange={(event) => updateItem(item.id, "unit", event.target.value)} className={inputClass}>
                      <option value="unit">Unit</option>
                      <option value="strip">Strip</option>
                      <option value="box">Box</option>
                      <option value="bottle">Bottle</option>
                      <option value="pack">Pack</option>
                      <option value="piece">Piece</option>
                    </select>
                  </Field>
                  <Field label="Purchase price / unit" required>
                    <input type="number" min="0.01" step="0.01" value={item.purchasePrice} onChange={(event) => updateItem(item.id, "purchasePrice", event.target.value)} required className={inputClass} placeholder="0.00" />
                  </Field>
                  <Field label="Retail price / unit">
                    <input type="number" min="0" step="0.01" value={item.sellingPrice} onChange={(event) => updateItem(item.id, "sellingPrice", event.target.value)} className={inputClass} placeholder="Optional" />
                  </Field>
                  <div className="flex items-end justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 xl:col-span-1">
                    <span className="text-xs font-medium text-slate-500">Line total</span>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {formatCurrency(Number(item.quantity || 0) * Number(item.purchasePrice || 0))}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                  {item.imageData ? (
                    <Image
                      src={item.imageData}
                      alt={item.productName ? `${item.productName} product` : "Product preview"}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 rounded-lg border border-slate-200 bg-white object-contain p-1"
                    />
                  ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-[10px] font-semibold text-slate-400">
                      No image
                    </div>
                  )}
                  <input
                    id={`purchase-image-${item.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(item.id, event)}
                    className="hidden"
                    tabIndex={-1}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(`purchase-image-${item.id}`)?.click()
                    }
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#7a1528] hover:text-[#7a1528]"
                  >
                    {item.imageData ? "Change product image" : "Upload product image"}
                  </button>
                  {item.imageData ? (
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, "imageData", "")}
                      className="text-xs font-semibold text-slate-500 hover:text-rose-700"
                    >
                      Remove image
                    </button>
                  ) : null}
                  <p className="basis-full text-[11px] text-slate-400 sm:basis-auto">
                    Optional · images are resized before saving
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <SectionTitle icon={CalendarDays} title="Payment" subtitle="Track how much was paid to the supplier." />
            <div className="mt-5 max-w-sm">
              <Field label="Amount paid now">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountPaid}
                  onChange={(event) => setAmountPaid(event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-sm font-bold text-slate-900">Purchase summary</h2>
            <SummaryRow label="Items" value={items.length} />
            <SummaryRow label="Total" value={formatCurrency(totalAmount)} strong />
            <SummaryRow label="Paid" value={formatCurrency(amountPaid)} />
            <div className="border-t border-slate-200 pt-3">
              <SummaryRow label="Balance due" value={formatCurrency(dueAmount)} strong highlight />
            </div>
          </div>
        </section>

        {errorMessage ? (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-col-reverse justify-end gap-3 pb-2 sm:flex-row">
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={availableSuppliers.length === 0} className="rounded-xl bg-[#7a1528] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#610f1e] disabled:cursor-not-allowed disabled:opacity-50">
            Save Purchase &amp; Add to Inventory
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#7a1528] focus:ring-2 focus:ring-rose-900/10";

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

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-rose-50 p-2 text-[#7a1528]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, strong, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-3 text-sm ${strong ? "font-bold" : ""}`}>
      <span className="text-slate-500">{label}</span>
      <span className={`font-mono tabular-nums ${highlight ? "text-[#7a1528]" : "text-slate-900"}`}>
        {value}
      </span>
    </div>
  );
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      const maxDimension = 640;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas is unavailable"));
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image could not be decoded"));
    };

    image.src = objectUrl;
  });
}

import { api } from "@/lib/api";

function unwrapResource(response) {
  return response?.data ?? response;
}

export async function getSuppliers() {
  const response = await api.get("/suppliers");
  return unwrapResource(response);
}

export async function createSupplier(supplier) {
  const response = await api.post("/suppliers", {
    name: supplier.name,
    drug_license: supplier.drugLicense || null,
    contact_person: supplier.contactPerson || null,
    phone: supplier.phone || null,
    address: supplier.address || null,
    pay_term_value: supplier.payTermValue || 0,
    pay_term_unit: supplier.payTermUnit || "days",
    status: supplier.status || "Active",
  });

  return unwrapResource(response);
}

export async function getPurchases() {
  const response = await api.get("/purchases");
  return unwrapResource(response);
}

export async function createPurchase(purchase) {
  const response = await api.post("/purchases", {
    supplier_id: purchase.supplierId,
    reference: purchase.reference,
    invoice_number: purchase.invoiceNumber || null,
    purchase_date: purchase.purchaseDate,
    amount_paid: purchase.amountPaid,
    notes: purchase.notes || null,
    items: purchase.items.map((item) => ({
      product_name: item.productName,
      batch_number: item.batchNumber,
      expiry_date: item.expiryDate,
      quantity: item.quantity,
      unit: item.unit,
      purchase_price: item.purchasePrice,
      selling_price: item.sellingPrice,
      image_data: item.imageData || null,
    })),
  });

  return unwrapResource(response);
}

export async function getInventory() {
  const response = await api.get("/inventory");
  return unwrapResource(response);
}

export async function getPosData() {
  const [suppliers, purchases, inventory] = await Promise.all([
    getSuppliers(),
    getPurchases(),
    getInventory(),
  ]);

  return { suppliers, purchases, inventory };
}

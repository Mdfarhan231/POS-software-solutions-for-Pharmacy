export const EMPTY_POS_DATA = {
  purchases: [],
  inventory: [],
  suppliers: [],
};

export function formatCurrency(value) {
  const amount = Number(value || 0);
  return `৳${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

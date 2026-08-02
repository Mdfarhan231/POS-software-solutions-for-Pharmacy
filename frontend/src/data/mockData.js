export const SALES_LAST_30_DAYS = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;
  const amount = 3200 + ((index * 1173) % 5700) + (index % 5) * 460;

  return {
    date: `${String(day).padStart(2, "0")} Jul`,
    formattedDate: `${String(day).padStart(2, "0")} July 2026`,
    amount,
  };
});

export const TOP_PURCHASE_COMPANIES = [
  { name: "Square Pharmaceuticals Ltd.", amount: 64200 },
  { name: "Beximco Pharma", amount: 57800 },
  { name: "Incepta Pharmaceuticals", amount: 49150 },
  { name: "Renata Limited", amount: 42300 },
  { name: "Healthcare Pharmaceuticals", amount: 36750 },
];

export const TOP_MEDICINES_THIS_MONTH = [
  { name: "Napa 500 mg", value: 28, color: "#0284c7" },
  { name: "Seclo 20 mg", value: 23, color: "#7c3aed" },
  { name: "Ace 500 mg", value: 19, color: "#059669" },
  { name: "Fexo 120 mg", value: 17, color: "#d97706" },
  { name: "Monas 10 mg", value: 13, color: "#be123c" },
];

export const FINANCIAL_YEAR_SALES = [
  { month: "Jul", amount: 128000 },
  { month: "Aug", amount: 136500 },
  { month: "Sep", amount: 131400 },
  { month: "Oct", amount: 148200 },
  { month: "Nov", amount: 156900 },
  { month: "Dec", amount: 164300 },
  { month: "Jan", amount: 171200 },
  { month: "Feb", amount: 167800 },
  { month: "Mar", amount: 179600 },
  { month: "Apr", amount: 185400 },
  { month: "May", amount: 192700 },
  { month: "Jun", amount: 201300 },
];

export const STOCK_ALERT_ITEMS = [
  {
    id: 1,
    brandName: "Napa 500 mg",
    manufacturer: "Beximco Pharmaceuticals Ltd.",
    rackLocation: "Rack A-03",
    stockLeft: 8,
    unit: "strips",
  },
  {
    id: 2,
    brandName: "Seclo 20 mg",
    manufacturer: "Square Pharmaceuticals Ltd.",
    rackLocation: "Rack B-11",
    stockLeft: 5,
    unit: "boxes",
  },
  {
    id: 3,
    brandName: "Fexo 120 mg",
    manufacturer: "Incepta Pharmaceuticals Ltd.",
    rackLocation: "Rack C-05",
    stockLeft: 3,
    unit: "strips",
  },
];

export const EXPIRY_ALERT_ITEMS = [
  {
    id: 1,
    brandName: "Cef-3 200 mg",
    batchNo: "CEF24091",
    rackLocation: "Rack D-08",
    expiryDate: "15 Aug 2026",
    stockLeft: 12,
    unit: "strips",
  },
  {
    id: 2,
    brandName: "DP Done 10 mg",
    batchNo: "DPD24612",
    rackLocation: "Rack E-02",
    expiryDate: "28 Aug 2026",
    stockLeft: 7,
    unit: "boxes",
  },
  {
    id: 3,
    brandName: "Orsaline-N",
    batchNo: "ORS25018",
    rackLocation: "Rack F-04",
    expiryDate: "10 Sep 2026",
    stockLeft: 20,
    unit: "sachets",
  },
];

export const RECENT_SALES_ORDERS = [
  {
    orderNo: "SO-7842",
    customer: "Mrs. Nusrat Jahan",
    contact: "01700-000001",
    date: "01 Aug 2026, 7:35 PM",
    status: "Processing",
  },
  {
    orderNo: "SO-7841",
    customer: "Mr. Tanvir Hasan",
    contact: "01800-000002",
    date: "01 Aug 2026, 7:18 PM",
    status: "Ready",
  },
  {
    orderNo: "SO-7840",
    customer: "Walk-in Customer",
    contact: "No contact",
    date: "01 Aug 2026, 6:56 PM",
    status: "Draft",
  },
];

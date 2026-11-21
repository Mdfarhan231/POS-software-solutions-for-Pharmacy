import {
  ArrowRightLeft,
  BarChart3,
  Contact,
  DollarSign,
  Landmark,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Users,
} from "lucide-react";

export const SIDEBAR_MENU_ITEMS = [
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

export const SIDEBAR_SIMPLE_ITEMS = [
  { label: "Stock Transfers", tab: "stock-transfers", icon: ArrowRightLeft },
  { label: "Stock Adjustment", tab: "stock-adjustment", icon: SlidersHorizontal },
  { label: "Expenses", tab: "expenses", icon: DollarSign },
  { label: "Payment Accounts", tab: "payment-accounts", icon: Landmark },
  { label: "Reports & Analytics", tab: "reports", icon: BarChart3, accent: true },
  { label: "Settings", tab: "settings", icon: Settings },
];

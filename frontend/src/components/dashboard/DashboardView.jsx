"use client";

import {
  AlertTriangle,
  FileText,
  Info,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Truck,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  EXPIRY_ALERT_ITEMS,
  FINANCIAL_YEAR_SALES,
  RECENT_SALES_ORDERS,
  SALES_LAST_30_DAYS,
  STOCK_ALERT_ITEMS,
  TOP_MEDICINES_THIS_MONTH,
  TOP_PURCHASE_COMPANIES,
} from "@/data/mockData";

const METRICS = [
  {
    title: "Total Sales",
    amount: "৳ 153,420.00",
    helper: "+12.4% vs last month",
    helperClass: "text-emerald-600",
    icon: ShoppingCart,
    iconClass: "border-cyan-100 bg-cyan-50 text-cyan-600",
    trend: true,
  },
  {
    title: "Net Profit",
    amount: "৳ 128,950.00",
    helper: "Net profit after expenses",
    icon: Wallet,
    iconClass: "border-purple-100 bg-purple-50 text-purple-600",
    info: true,
  },
  {
    title: "Invoice Due",
    amount: "৳ 12,450.00",
    amountClass: "text-[#6b1224]",
    helper: "3 pending customer balances",
    helperClass: "text-amber-600",
    icon: FileText,
    iconClass: "border-emerald-100 bg-emerald-50 text-emerald-600",
  },
  {
    title: "Total Sell Return",
    amount: "৳ 1,200.00",
    helper: "Paid: ৳ 1,200.00",
    icon: Truck,
    iconClass: "border-amber-100 bg-amber-50 text-amber-600",
  },
  {
    title: "Total Purchase",
    amount: "৳ 84,200.00",
    helper: "Stock inventory additions",
    icon: ShoppingCart,
    iconClass: "border-cyan-100 bg-cyan-50 text-cyan-600",
  },
  {
    title: "Purchase Due",
    amount: "৳ 8,400.00",
    helper: "2 supplier payables due",
    helperClass: "text-rose-600",
    icon: ShoppingBag,
    iconClass: "border-purple-100 bg-purple-50 text-purple-600",
  },
  {
    title: "Total Purchase Return",
    amount: "৳ 650.00",
    helper: "Return paid: ৳ 650.00",
    icon: RefreshCw,
    iconClass: "border-emerald-100 bg-emerald-50 text-emerald-600",
  },
  {
    title: "Expense",
    amount: "৳ 6,800.00",
    helper: "Utilities & store operation",
    icon: TrendingUp,
    iconClass: "border-amber-100 bg-amber-50 text-amber-600",
    rotateIcon: true,
  },
];

const EXPORT_ACTIONS = [
  "Export to CSV",
  "Export to Excel",
  "Print",
  "Column visibility",
  "Export to PDF",
];

function MetricCard({ metric }) {
  const Icon = metric.icon;

  return (
    <article className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="min-w-0 space-y-1 pr-3">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {metric.title}
          </span>
          {metric.info ? <Info className="h-3 w-3 text-slate-400" /> : null}
        </div>
        <div className={`text-2xl font-black ${metric.amountClass || "text-slate-900"}`}>
          {metric.amount}
        </div>
        <p
          className={`flex items-center gap-1 text-[10px] font-semibold ${
            metric.helperClass || "text-slate-400"
          }`}
        >
          {metric.trend ? <TrendingUp className="h-3 w-3" /> : null}
          <span>{metric.helper}</span>
        </p>
      </div>
      <div
        className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border shadow-sm ${metric.iconClass}`}
      >
        <Icon className={`h-7 w-7 ${metric.rotateIcon ? "rotate-180" : ""}`} />
      </div>
    </article>
  );
}

function PanelHeader({ title, subtitle, icon: Icon, trailing }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
      <div className="flex min-w-0 items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-amber-500" /> : null}
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {trailing}
    </div>
  );
}

function ExportToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-2 text-[11px] font-semibold text-slate-600">
      {EXPORT_ACTIONS.map((action) => (
        <button
          key={action}
          type="button"
          className="rounded border border-slate-200 bg-white px-2.5 py-1 transition hover:bg-slate-100"
        >
          {action}
        </button>
      ))}
    </div>
  );
}

export default function DashboardView({ onNavigatePOS }) {
  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a1528]">
            Pharmacy overview
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Dashboard
          </h1>
        </div>
        <p className="text-xs font-medium text-slate-500">
          Live operational snapshot for PharmaDesk Pharmacy
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <article className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-8">
          <PanelHeader
            title="Sales Last 30 Days"
            subtitle="Daily sales performance in BDT (৳)"
            trailing={
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 sm:flex">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                <span>PharmaDesk Pharmacy</span>
              </div>
            }
          />

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={SALES_LAST_30_DAYS}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  interval={2}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickFormatter={(value) =>
                    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
                  }
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;

                    const item = payload[0].payload;
                    return (
                      <div className="space-y-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white shadow-xl">
                        <p className="font-bold text-slate-300">{item.formattedDate}</p>
                        <p className="text-sm font-extrabold text-sky-300">
                          PharmaDesk Pharmacy: ৳ {item.amount.toLocaleString()}
                        </p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#0284c7", strokeWidth: 2, stroke: "#ffffff" }}
                  activeDot={{
                    r: 6,
                    fill: "#0284c7",
                    stroke: "#ffffff",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-4">
          <PanelHeader
            title="Top 5 Purchase Companies"
            subtitle="Highest procurement volume by supplier"
          />

          <div className="my-auto space-y-4">
            {TOP_PURCHASE_COMPANIES.map((company) => {
              const percentage = Math.min(100, (company.amount / 65000) * 100);

              return (
                <div key={company.name} className="space-y-1">
                  <div className="flex justify-between gap-3 text-xs font-semibold text-slate-700">
                    <span className="max-w-[170px] truncate">{company.name}</span>
                    <span className="shrink-0 font-bold text-slate-900">
                      ৳ {company.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-right">
            <button
              type="button"
              onClick={onNavigatePOS}
              className="text-xs font-bold text-[#7a1528] hover:underline"
            >
              + Create Purchase Order →
            </button>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <article className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-7">
          <PanelHeader
            title="Sales Current Financial Year"
            subtitle="Monthly breakdown for FY 2026"
            trailing={
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                2026 Season
              </span>
            }
          />

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={FINANCIAL_YEAR_SALES}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                />
                <Tooltip formatter={(value) => [`৳ ${Number(value).toLocaleString()}`, "Sales"]} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-5">
          <PanelHeader
            title="Top 5 Medicine This Month"
            subtitle="Highest selling products share"
          />

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative h-52 w-52 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOP_MEDICINES_THIS_MONTH}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={40}
                    paddingAngle={3}
                  >
                    {TOP_MEDICINES_THIS_MONTH.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full flex-1 space-y-2 text-xs">
              {TOP_MEDICINES_THIS_MONTH.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg p-1.5 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-2 pr-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate font-semibold text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="shrink-0 font-extrabold text-slate-900">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PaymentDueTable
          title="Sales Payment Due"
          columns={["Customer", "Invoice No.", "Due Amount", "Action"]}
          rows={[
            ["Mrs. Nusrat Jahan", "INV-2026-00482", "৳ 350.00"],
            ["Mr. Tanvir Hasan", "INV-2026-00478", "৳ 1,200.00"],
          ]}
          actionLabel="Collect Due"
          actionClass="bg-[#7a1528] hover:bg-[#610f1e]"
        />

        <PaymentDueTable
          title="Purchase Payment Due"
          columns={["Supplier", "Reference No", "Due Amount", "Action"]}
          rows={[
            ["Square Pharmaceuticals Ltd.", "PO-2026-902", "৳ 5,400.00"],
            ["Beximco Pharma", "PO-2026-881", "৳ 3,000.00"],
          ]}
          actionLabel="Pay Supplier"
          actionClass="bg-slate-800 hover:bg-slate-900"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <AlertList
          title="Product Stock Alert"
          items={STOCK_ALERT_ITEMS}
          renderItem={(item) => (
            <>
              <div className="min-w-0">
                <h3 className="truncate font-bold text-slate-900">{item.brandName}</h3>
                <p className="truncate text-[11px] text-slate-500">{item.manufacturer}</p>
                <span className="font-mono text-[10px] text-slate-400">
                  {item.rackLocation}
                </span>
              </div>
              <span className="shrink-0 rounded bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                {item.stockLeft} {item.unit} left
              </span>
            </>
          )}
        />

        <AlertList
          title="Stock Expiry Alert"
          items={EXPIRY_ALERT_ITEMS}
          renderItem={(item) => (
            <>
              <div className="min-w-0">
                <h3 className="truncate font-bold text-slate-900">{item.brandName}</h3>
                <p className="truncate text-[11px] text-slate-500">
                  Batch: {item.batchNo} &bull; {item.rackLocation}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="block text-[11px] font-bold text-amber-700">
                  {item.expiryDate}
                </span>
                <span className="text-[10px] text-slate-500">
                  {item.stockLeft} {item.unit} left
                </span>
              </div>
            </>
          )}
        />

        <article className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <PanelHeader
            title="Sales Order"
            trailing={<span className="text-xs font-semibold text-slate-500">Live Queue</span>}
          />
          <div className="max-h-64 space-y-2.5 overflow-y-auto">
            {RECENT_SALES_ORDERS.map((order) => (
              <div
                key={order.orderNo}
                className="space-y-1 rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono font-bold text-[#7a1528]">
                    Order #{order.orderNo}
                  </span>
                  <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                    {order.status}
                  </span>
                </div>
                <p className="font-medium text-slate-700">
                  {order.customer} &bull; {order.contact}
                </p>
                <p className="text-[10px] text-slate-400">{order.date}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function PaymentDueTable({ title, columns, rows, actionLabel, actionClass }) {
  return (
    <article className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <PanelHeader
        title={title}
        icon={AlertTriangle}
        trailing={<Info className="h-4 w-4 text-sky-500" />}
      />
      <ExportToolbar />
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 font-bold text-slate-500">
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap p-2.5">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {rows.map((row) => (
              <tr key={row[1]}>
                <td className="whitespace-nowrap p-3 font-semibold text-slate-800">{row[0]}</td>
                <td className="whitespace-nowrap p-3 font-mono text-slate-500">{row[1]}</td>
                <td className="whitespace-nowrap p-3 font-bold text-[#6b1224]">{row[2]}</td>
                <td className="whitespace-nowrap p-3">
                  <button
                    type="button"
                    className={`rounded px-2.5 py-1 text-[11px] font-bold text-white transition ${actionClass}`}
                  >
                    {actionLabel}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function AlertList({ title, items, renderItem }) {
  return (
    <article className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <PanelHeader
        title={title}
        icon={AlertTriangle}
        trailing={<Info className="h-4 w-4 text-sky-500" />}
      />
      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-xs"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </article>
  );
}

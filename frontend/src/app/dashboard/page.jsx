"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComingSoonView from "@/components/common/ComingSoonView";
import DashboardView from "@/components/dashboard/DashboardView";
import InventoryView from "@/components/inventory/InventoryView";
import Sidebar from "@/components/layout/Sidebar";
import TopHeaderBar from "@/components/layout/TopHeaderBar";
import AddPurchaseView from "@/components/purchases/AddPurchaseView";
import PurchasesView from "@/components/purchases/PurchasesView";
import SuppliersView from "@/components/suppliers/SuppliersView";
import { EMPTY_POS_DATA } from "@/lib/pos-utils";
import { clearAuthSession } from "@/lib/auth-storage";
import { getCurrentUser, logout } from "@/services/auth.service";
import {
  createPurchase,
  createSupplier,
  getPosData,
} from "@/services/pos.service";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posData, setPosData] = useState(EMPTY_POS_DATA);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dataLoadError, setDataLoadError] = useState("");

  useEffect(() => {
    const authCheck = window.setTimeout(() => {
      const storedUser = getCurrentUser();

      if (!storedUser) {
        router.replace("/login");
        return;
      }

      setUser(storedUser);
      setIsSidebarOpen(window.innerWidth >= 1024);
    }, 0);

    return () => window.clearTimeout(authCheck);
  }, [router]);

  useEffect(() => {
    if (!user) return undefined;

    let isActive = true;
    const dataLoad = window.setTimeout(() => {
      getPosData()
        .then((data) => {
          if (isActive) {
            setPosData(data);
            setDataLoadError("");
          }
        })
        .catch((error) => {
          if (isActive) {
            if (error?.status === 401) {
              clearAuthSession();
              router.replace("/login");
              return;
            }
            setDataLoadError(
              error?.message || "Could not load suppliers, purchases, and inventory."
            );
          }
        });
    }, 0);

    return () => {
      isActive = false;
      window.clearTimeout(dataLoad);
    };
  }, [router, user]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function navigateTo(tab) {
    setActiveTab(tab);

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }

  async function handleAddSupplier(supplier) {
    const savedSupplier = await createSupplier(supplier);
    setPosData((current) => ({
      ...current,
      suppliers: [savedSupplier, ...current.suppliers],
    }));
    setDataLoadError("");
  }

  function handleUseSupplier(supplier) {
    setSelectedSupplier(supplier);
    navigateTo("add-purchase");
  }

  async function handleSavePurchase(purchase) {
    const savedPurchase = await createPurchase(purchase);
    setPosData((current) => {
      const inventoryEntries = savedPurchase.items.map((item) => ({
        ...item,
        purchaseId: savedPurchase.id,
        supplierId: savedPurchase.supplierId,
        supplierName: savedPurchase.supplierName,
        reference: savedPurchase.reference,
        purchaseDate: savedPurchase.purchaseDate,
      }));
      const suppliers = current.suppliers.map((supplier) =>
        supplier.id === savedPurchase.supplierId
          ? {
              ...supplier,
              totalPurchases:
                Number(supplier.totalPurchases || 0) + savedPurchase.totalAmount,
              balanceDue:
                Number(supplier.balanceDue || 0) + savedPurchase.dueAmount,
              lastSupplyDate: savedPurchase.purchaseDate,
            }
          : supplier
      );

      return {
        ...current,
        purchases: [savedPurchase, ...current.purchases],
        inventory: [...inventoryEntries, ...current.inventory],
        suppliers,
      };
    });
    setDataLoadError("");
    setSelectedSupplier(null);
    navigateTo("purchases");
  }

  function handleCancelPurchase() {
    setSelectedSupplier(null);
    navigateTo("purchases");
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <div
          aria-label="Loading dashboard"
          className="h-8 w-8 animate-spin rounded-full border-4 border-[#7a1528] border-t-transparent"
        />
      </main>
    );
  }

  return (
    <div className="fixed inset-0 flex min-w-80 flex-col overflow-hidden bg-slate-100">
      <TopHeaderBar
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        onOpenPOS={() => navigateTo("pos")}
        onLogout={handleLogout}
      />

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 z-30 bg-slate-950/40 lg:hidden"
          />
        ) : null}

        <Sidebar
          activeTab={activeTab}
          setActiveTab={navigateTo}
          isOpen={isSidebarOpen}
        />

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          {dataLoadError ? (
            <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              {dataLoadError}
            </div>
          ) : null}
          {activeTab === "dashboard" ? (
            <DashboardView
              onNavigatePOS={() => navigateTo("pos")}
              onNavigatePurchases={() => navigateTo("add-purchase")}
              purchases={posData.purchases}
            />
          ) : activeTab === "purchases" ? (
            <PurchasesView
              purchases={posData.purchases}
              onAddPurchase={() => navigateTo("add-purchase")}
            />
          ) : activeTab === "add-purchase" ? (
            <AddPurchaseView
              suppliers={posData.suppliers}
              selectedSupplier={selectedSupplier}
              onSave={handleSavePurchase}
              onCancel={handleCancelPurchase}
              onOpenSuppliers={() => navigateTo("suppliers")}
            />
          ) : activeTab === "suppliers" ? (
            <SuppliersView
              suppliers={posData.suppliers}
              selectedSupplierId={selectedSupplier?.id}
              onUseSupplier={handleUseSupplier}
              onCreateSupplier={handleAddSupplier}
            />
          ) : activeTab === "inventory" ? (
            <InventoryView
              inventory={posData.inventory}
              onAddPurchase={() => navigateTo("add-purchase")}
            />
          ) : (
            <ComingSoonView
              activeTab={activeTab}
              onOpenPOS={() => navigateTo("pos")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

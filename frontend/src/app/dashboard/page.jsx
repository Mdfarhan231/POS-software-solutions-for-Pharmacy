"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComingSoonView from "@/components/common/ComingSoonView";
import DashboardView from "@/components/dashboard/DashboardView";
import Sidebar from "@/components/layout/Sidebar";
import TopHeaderBar from "@/components/layout/TopHeaderBar";
import { getCurrentUser, logout } from "@/services/auth.service";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex h-screen min-w-80 flex-col overflow-hidden bg-slate-100">
      <TopHeaderBar
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        onOpenPOS={() => navigateTo("pos")}
        onLogout={handleLogout}
      />

      <div className="relative flex min-h-0 flex-1">
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
          {activeTab === "dashboard" ? (
            <DashboardView onNavigatePOS={() => navigateTo("pos")} />
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

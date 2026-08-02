"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/auth/LoginPage";
import { getCurrentUser } from "@/services/auth.service";

export default function LoginRoutePage() {
  const router = useRouter();

  useEffect(() => {
    if (getCurrentUser()) {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleLoginSuccess() {
    router.replace("/dashboard");
  }

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}

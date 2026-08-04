"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  ShieldCheck,
  Sparkles,
  Store,
  User as UserIcon,
  X,
  Zap,
} from "lucide-react";
import FormField from "@/components/ui/FormField";
import InputIcon from "@/components/ui/InputIcon";
import { login, requestPasswordReset } from "@/services/auth.service";

const HERO_BANNER_PATH = "/images/pharmacy_hero_banner_1785561974272.jpg";
const LOGO_PATH = "/images/pharmadesk_logo_1785561988066.jpg";
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== "false";

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("pharmadesk123");
  const [counter, setCounter] = useState("Counter 01 - Main Pharmacy");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  async function performLogin(loginValues) {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await login(loginValues);
      onLoginSuccess(result.user);
    } catch (error) {
      setErrorMessage(error?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    await performLogin({
      username: username.trim(),
      password,
      counter,
      rememberMe,
    });
  }

  async function handleQuickDemo() {
    const demoCredentials = {
      username: "demo",
      password: "pharmadesk123",
      counter: "Counter 01 - Main Pharmacy",
      rememberMe: true,
    };

    setUsername(demoCredentials.username);
    setPassword(demoCredentials.password);
    setCounter(demoCredentials.counter);
    setRememberMe(demoCredentials.rememberMe);

    await performLogin(demoCredentials);
  }

  async function handleResetSubmit(event) {
    event.preventDefault();

    const email = resetEmail.trim();
    if (!email) return;

    setErrorMessage("");
    setIsResetting(true);

    try {
      await requestPasswordReset(email);
      setResetSent(true);
    } catch (error) {
      setErrorMessage(
        error?.message || "Could not send password recovery instructions."
      );
      setShowForgotModal(false);
    } finally {
      setIsResetting(false);
    }
  }

  function closeResetModal() {
    setShowForgotModal(false);
    setResetSent(false);
    setResetEmail("");
  }

  return (
    <main className="flex min-h-screen w-full flex-col bg-[#f8f3f4] font-sans text-slate-900 selection:bg-[#7a1528] selection:text-white md:flex-row">
      <section className="relative flex overflow-hidden bg-[#6b1224] p-8 text-white shadow-2xl md:w-1/2 md:p-12 lg:w-7/12 lg:p-16">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
          <Image
            src={HERO_BANNER_PATH}
            alt="Modern pharmacy interior with pharmacists and medicine shelves"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 z-0 bg-linear-to-tr from-[#3f0813] via-[#6b1224]/90 to-[#8a1c32]/85" />

        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 flex min-h-[620px] w-full flex-col justify-between">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-inner backdrop-blur-md">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
                PharmaDesk v3.4 Enterprise Ready
              </span>
            </div>

            <div className="hidden items-center space-x-2 text-xs text-rose-100/80 sm:flex">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Security-ready pharmacy workflow</span>
            </div>
          </header>

          <div className="my-auto max-w-2xl space-y-6 py-12">
            <div className="inline-flex items-center space-x-2 rounded-md border border-rose-400/30 bg-linear-to-r from-rose-500/20 to-rose-700/20 px-3 py-1 text-sm font-medium text-rose-200">
              <Sparkles className="h-4 w-4 text-rose-300" />
              <span>Next-Gen Pharmacy POS System</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              PharmaDesk <span className="text-rose-300">POS</span>
            </h1>

            <p className="text-xl font-light leading-relaxed text-rose-100/90 sm:text-2xl">
              A reliable system to manage your pharmacy
            </p>

            <p className="max-w-lg text-sm font-normal leading-relaxed text-rose-200/70 sm:text-base">
              Streamline high-speed counter billing, batch and expiry tracking,
              barcode scanning, and daily sales analytics in one platform.
            </p>

            <div className="grid grid-cols-1 gap-4 border-t border-rose-500/20 pt-6 sm:grid-cols-2">
              <Feature
                icon={<Zap className="h-5 w-5" />}
                title="Ultra-Fast Billing"
                description="Receipt-friendly workflows and keyboard shortcuts"
              />
              <Feature
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Expiry Alert Engine"
                description="Help prevent expired medicine from being sold"
              />
            </div>
          </div>

          <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-rose-200/70 sm:flex-row">
            <span>
              &copy; {new Date().getFullYear()} PharmaDesk Solutions. All rights
              reserved.
            </span>
            <div className="flex items-center space-x-4">
              <span>Support 24/7</span>
              <span>•</span>
              <span>User Guide</span>
            </div>
          </footer>
        </div>
      </section>

      <section className="flex flex-col justify-between bg-[#fcf8f9] p-6 sm:p-10 md:w-1/2 md:p-14 lg:w-5/12 lg:p-16">
        <div className="flex justify-end">
          <div className="flex items-center space-x-2 rounded-full border border-rose-100 bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-[#7a1528]" />
            <span>
              Authentication:{" "}
              <strong className="font-semibold text-emerald-600">
                {USE_MOCK_AUTH ? "Demo mode" : "API mode"}
              </strong>
            </span>
          </div>
        </div>

        <div className="mx-auto my-auto w-full max-w-md space-y-6 py-8">
          <div className="rounded-2xl border border-rose-100/80 bg-white p-7 shadow-xl shadow-rose-950/5 sm:p-9">
            <div className="mb-8 space-y-3 text-center">
              <div className="relative mb-1 inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-rose-100 bg-rose-50 p-2 shadow-sm">
                <Image
                  src={LOGO_PATH}
                  alt="PharmaDesk logo"
                  width={48}
                  height={48}
                  priority
                  className="h-full w-full rounded-xl object-contain"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#6b1224]">
                  PharmaDesk
                </h2>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-rose-900/60">
                  Pharmacy HealthSuite POS
                </p>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="animate-shake mb-6 flex items-start space-x-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="User ID / Email" htmlFor="username">
                <div className="relative">
                  <InputIcon>
                    <UserIcon className="h-4 w-4" />
                  </InputIcon>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter demo or username"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7a1528] disabled:cursor-not-allowed disabled:opacity-70"
                    required
                  />
                </div>
              </FormField>

              <FormField label="Password" htmlFor="password">
                <div className="relative">
                  <InputIcon>
                    <Lock className="h-4 w-4" />
                  </InputIcon>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7a1528] disabled:cursor-not-allowed disabled:opacity-70"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((visible) => !visible)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormField>

              <FormField label="Counter / Terminal" htmlFor="counter">
                <div className="relative">
                  <InputIcon>
                    <Store className="h-4 w-4" />
                  </InputIcon>
                  <select
                    id="counter"
                    value={counter}
                    onChange={(event) => setCounter(event.target.value)}
                    disabled={isLoading}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7a1528] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <option value="Counter 01 - Main Pharmacy">
                      Counter 01 - Main Store
                    </option>
                    <option value="Counter 02 - Express Rx">
                      Counter 02 - Express Rx
                    </option>
                    <option value="Counter 03 - Night Shift">
                      Counter 03 - Night Shift
                    </option>
                    <option value="Back Office - Inventory Desk">
                      Back Office - Inventory Manager
                    </option>
                  </select>
                </div>
              </FormField>

              <div className="flex items-center justify-between gap-4 pb-1 pt-1">
                <label className="flex select-none items-center space-x-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-slate-300 text-[#7a1528] focus:ring-[#7a1528] disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  disabled={isLoading}
                  className="text-right text-xs font-semibold text-[#7a1528] hover:text-[#520d1a] hover:underline focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Forgot Your Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#7a1528] px-4 py-3 font-semibold text-white shadow-lg shadow-rose-950/20 transition hover:bg-[#610f1e] hover:shadow-xl active:scale-[0.99] active:bg-[#4a0b17] disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Log in</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleQuickDemo}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-[#7a1528] transition hover:bg-rose-100/80 disabled:cursor-not-allowed disabled:opacity-75"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Quick Demo Log In (Pharmacist Mode)</span>
                </button>
              </div>
            </form>

            <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-center">
              <p className="text-[11px] font-medium text-slate-500">
                Demo Username:{" "}
                <span className="font-bold text-slate-800">demo</span>
                {"  |  "}
                Password:{" "}
                <span className="font-bold text-slate-800">
                  pharmadesk123
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="pb-4 pt-8 text-center">
          <p className="text-xs font-medium text-slate-500">
            Powered by:{" "}
            <span className="font-bold text-[#7a1528]">
              PharmaDesk Solutions Ltd.
            </span>
          </p>
        </div>
      </section>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-password-title"
            className="relative w-full max-w-md rounded-2xl border border-rose-100 bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close password reset dialog"
              onClick={closeResetModal}
              disabled={isResetting}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center space-x-3">
              <div className="rounded-xl bg-rose-50 p-3 text-[#7a1528]">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h3
                  id="reset-password-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Reset Your Password
                </h3>
                <p className="text-xs text-slate-500">
                  We will send password recovery instructions
                </p>
              </div>
            </div>

            {resetSent ? (
              <div className="space-y-3 py-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 animate-bounce text-emerald-500" />
                <h4 className="font-bold text-slate-800">
                  Recovery Email Sent!
                </h4>
                <p className="text-xs text-slate-600">
                  Please check your mailbox for password reset instructions.
                </p>
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="mt-2 rounded-lg bg-[#7a1528] px-4 py-2 text-xs font-semibold text-white hover:bg-[#610f1e]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <FormField label="Registered Email" htmlFor="reset-email">
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    placeholder="pharmacist@pharmadesk.com"
                    disabled={isResetting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a1528] disabled:cursor-not-allowed disabled:opacity-70"
                    required
                  />
                </FormField>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={closeResetModal}
                    disabled={isResetting}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="rounded-lg bg-[#7a1528] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#610f1e] disabled:cursor-not-allowed disabled:opacity-75"
                  >
                    {isResetting ? "Sending..." : "Send Recovery Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="shrink-0 rounded-lg border border-white/10 bg-white/10 p-2 text-rose-300">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-rose-200/70">{description}</p>
      </div>
    </div>
  );
}

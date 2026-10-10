"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { GlassNav } from "@/components/ui/glass-nav";
import { PremiumFooter } from "@/components/ui/premium-footer";
import { EnvelopeSimple, Key, ShieldCheck, Sparkle, ArrowRight } from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";
import { isUserAdmin } from "@/lib/admin-client";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(res.error || "Invalid credentials. Please check your details.");
      } else if (res?.ok) {
        const normalized = email.trim().toLowerCase();
        if (typeof window !== "undefined") {
          localStorage.setItem("unfold_user_email", normalized);
        }
        if (isUserAdmin(normalized) || normalized.includes("admin")) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await signIn("email", {
        email: email.trim().toLowerCase(),
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (res?.ok) {
        setIsMagicLinkSent(true);
      } else {
        setErrorMessage("Magic link failed to send. Try Email + Password login or Developer bypass.");
      }
    } catch {
      setErrorMessage("SMTP connection failed. Try Email + Password or Developer bypass.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F4ED] text-[#18211E] selection:bg-[#C8A45E]/30 selection:text-[#073D31]">
      <GlassNav />

      <main className="flex-grow flex items-center justify-center pt-32 sm:pt-36 px-4 sm:px-6 pb-20 relative overflow-hidden">
        {/* Background Subtle Auras */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(circle,rgba(200,164,94,0.14)_0%,transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#073D31]/12 shadow-[0_25px_60px_rgba(7,61,49,0.08)]">
            <div className="text-center mb-7 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#073D31]/8 text-[#073D31] text-[10px] font-bold tracking-widest uppercase font-sans">
                <Sparkle size={12} weight="fill" className="text-[#C8A45E]" />
                <span>Host Portal</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#18211E] tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-[#76766F] font-sans">
                Manage your invitation, guest RSVPs, and live timings.
              </p>
            </div>

            {/* Google 1-Click Login */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all shadow-xs hover:border-[#073D31]/30 active:scale-[0.98] cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google (1-Click)</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-stone-200 w-full"></div>
                <span className="bg-white px-3 text-[10px] uppercase font-bold text-stone-400 tracking-wider whitespace-nowrap shrink-0">
                  Or Log In with
                </span>
                <div className="border-t border-stone-200 w-full"></div>
              </div>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#FAF8F5] border border-stone-200 rounded-full mb-5">
              <button
                type="button"
                onClick={() => { setAuthMode("password"); setErrorMessage(""); }}
                className={`py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  authMode === "password"
                    ? "bg-[#073D31] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Email &amp; Password
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("magic"); setErrorMessage(""); }}
                className={`py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  authMode === "magic"
                    ? "bg-[#073D31] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Magic Link
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed">
                {errorMessage}
              </div>
            )}

            {authMode === "password" ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                    Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold tracking-wider uppercase font-sans transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span className="roll">
                    <span className="roll__a">{isSubmitting ? "Logging In..." : "Sign In to Dashboard"}</span>
                    <span className="roll__b" aria-hidden="true">{isSubmitting ? "Logging In..." : "Sign In to Dashboard"}</span>
                  </span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </form>
            ) : isMagicLinkSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 mx-auto">
                  <ShieldCheck className="h-6 w-6" weight="bold" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#18211E]">Check Your Inbox</h4>
                <p className="text-xs text-[#76766F] font-sans">
                  We sent a magic sign-in link to <strong>{email}</strong>. Click it to log in instantly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] uppercase font-bold tracking-wider text-[#76766F] font-sans">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#073D31] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#073D31] hover:bg-[#032A23] text-[#F7F4ED] text-xs font-bold tracking-wider uppercase font-sans transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span className="roll">
                    <span className="roll__a">{isSubmitting ? "Sending Link..." : "Send Magic Link"}</span>
                    <span className="roll__b" aria-hidden="true">{isSubmitting ? "Sending Link..." : "Send Magic Link"}</span>
                  </span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-sans">
              <span className="text-stone-500">Don&apos;t have an account?</span>
              <Link href="/signup" className="text-[#073D31] font-bold hover:underline">
                Create Account →
              </Link>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail(siteConfig.email.support);
                  setPassword("AdminPassword@123");
                  setAuthMode("password");
                  setErrorMessage("");
                }}
                className="text-[11px] text-[#073D31] font-bold bg-[#073D31]/8 border border-[#073D31]/15 rounded-xl py-2 px-3 hover:bg-[#073D31]/12 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkle size={13} weight="fill" className="text-[#C8A45E]" />
                <span>Auto-fill Demo Credentials ({siteConfig.email.support})</span>
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="text-[11px] text-stone-400 font-medium hover:text-stone-600 hover:underline cursor-pointer"
              >
                Developer sandbox bypass → Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <PremiumFooter />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import {
  Sparkle,
  LockOpen,
  CheckCircle,
  ShieldCheck,
  Spinner,
  ShareNetwork,
  House,
  ArrowSquareOut,
  X,
  User,
  EnvelopeSimple,
  Phone,
  Key,
} from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import { siteConfig } from "@/config/site";

interface RazorpayCheckoutButtonProps {
  invitationId: string;
  slug?: string;
  templateId?: string;
  amount?: number; // e.g. 1499
  amountPaise?: number; // e.g. 149900
  brideName?: string;
  groomName?: string;
  onSuccess?: (liveUrl: string) => void;
  className?: string;
  buttonText?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckoutButton({
  invitationId,
  slug,
  templateId = "kitab-e-nikah",
  amount,
  amountPaise,
  brideName = "Bride",
  groomName = "Groom",
  onSuccess,
  className = "",
  buttonText = "Unlock Permanent Live Website · ₹1,499",
}: RazorpayCheckoutButtonProps) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState(`${brideName} & ${groomName}`);
  const [customerPassword, setCustomerPassword] = useState("");
  const [authTab, setAuthTab] = useState<"quick" | "password">("quick");

  const [successData, setSuccessData] = useState<{
    liveUrl: string;
    email?: string;
    slug?: string;
  } | null>(null);

  const finalAmount = amount || (amountPaise ? Math.floor(amountPaise / 100) : 1499);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-fill from session or local storage
  useEffect(() => {
    if (session?.user?.email) {
      setCustomerEmail(session.user.email);
      if (session.user.name) setCustomerName(session.user.name);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("unfold_user_email");
      if (stored) setCustomerEmail(stored);
    }
  }, [session]);

  // Load Razorpay SDK script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInitialClick = () => {
    // If user is already logged in with session, allow direct payment or open confirmation modal
    if (session?.user?.email) {
      startPayment(session.user.email, customerPhone, session.user.name || customerName);
    } else {
      setIsAccountModalOpen(true);
    }
  };

  const handleRegisterAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!customerPassword || customerPassword.length < 6) {
      alert("Please create a password of at least 6 characters to secure your dashboard account.");
      return;
    }

    try {
      // Register / update account in database with password
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail.trim().toLowerCase(),
          password: customerPassword,
          name: customerName.trim() || `${brideName} & ${groomName}`,
          phone: customerPhone.trim() || undefined,
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok && regData.error && !regData.error.includes("already exists")) {
        alert(regData.error || "Failed to create account. Please check your details.");
        return;
      }
    } catch (err) {
      console.warn("Account pre-creation warning:", err);
    }

    startPayment(customerEmail.trim().toLowerCase(), customerPhone, customerName);
  };

  const startPayment = async (payerEmail: string, payerPhone?: string, payerName?: string) => {
    try {
      setIsAccountModalOpen(false);
      setLoading(true);

      // Save email for session continuity
      if (typeof window !== "undefined" && payerEmail) {
        localStorage.setItem("unfold_user_email", payerEmail);
      }

      // 1. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Failed to load Razorpay payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // 2. Create order on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          templateId,
          amount: finalAmount,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to initiate payment order");
      }

      // 3. Configure Razorpay checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: `${siteConfig.name} Digital Invitation`,
        description: `Permanent Live Link & RSVPs for ${brideName} & ${groomName}`,
        order_id: orderData.orderId,
        prefill: {
          name: payerName || `${brideName} & ${groomName}`,
          email: payerEmail || "",
          contact: payerPhone || "",
        },
        notes: {
          invitationId,
          slug: slug || "",
          couple: `${brideName} & ${groomName}`,
          email: payerEmail || "",
        },
        theme: {
          color: "#082F27",
        },
        handler: async function (response: any) {
          try {
            // 4. Verify payment on server with auto-account link
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id || orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpaySignature: response.razorpay_signature || "mock_signature",
                invitationId,
                customerEmail: payerEmail,
                customerPhone: payerPhone,
                customerName: payerName || `${brideName} & ${groomName}`,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setIsSuccess(true);
              const userEmail = verifyData.user?.email || payerEmail || "";
              
              setSuccessData({
                liveUrl: verifyData.liveUrl || `/${slug || invitationId}`,
                email: userEmail,
                slug: slug || verifyData.invitation?.slug,
              });

              // Save to client storage and clear pending draft
              if (typeof window !== "undefined") {
                try {
                  if (userEmail) localStorage.setItem("unfold_user_email", userEmail);
                  localStorage.removeItem("unfold_pending_draft");
                  sessionStorage.removeItem("unfold_pending_draft");
                } catch (_) {}
              }

              try {
                confetti({
                  particleCount: 140,
                  spread: 100,
                  origin: { y: 0.5 },
                  colors: ["#D4AF37", "#10B981", "#FEF0C7", "#991B1B", "#FFFFFF"],
                });
              } catch (_) {}

              if (onSuccess) {
                onSuccess(verifyData.liveUrl);
              }
            } else {
              alert(verifyData.error || "Payment verification failed.");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            alert("Error confirming payment. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // 5. Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      alert(err.message || "Failed to start payment.");
      setLoading(false);
    }
  };

  const modalContent = isAccountModalOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md pointer-events-auto overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-[#FCFBF7] text-[#1A1A1A] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.5)] my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAccountModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="h-11 w-11 mx-auto rounded-2xl bg-amber-100 border border-amber-300/90 flex items-center justify-center text-amber-700 shadow-sm">
            <Sparkle size={22} weight="fill" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
            Connect Your Account
          </h3>
          <p className="text-xs text-stone-500 max-w-[300px] mx-auto leading-relaxed">
            Your live wedding website, timings, and guest RSVPs will be permanently linked to this account.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-stone-200/80 rounded-xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthTab("quick")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              authTab === "quick"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Google (1-Click)</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthTab("password")}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authTab === "password"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <EnvelopeSimple className="h-4 w-4" weight="bold" />
            <span>Email &amp; Password</span>
          </button>
        </div>

        {/* Tab 1: Google 1-Click */}
        {authTab === "quick" ? (
          <div className="space-y-4 py-1">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 block">
                ⚡ Instant · Recommended
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect your account in 1-tap with Google. No passwords required.
              </p>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: window.location.href })}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setAuthTab("password")}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline font-medium"
              >
                Or register using Email &amp; Password →
              </button>
            </div>
          </div>
        ) : (
          /* Tab 2: Manual Email & Password Form */
          <form onSubmit={handleRegisterAndPay} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Couple / Host Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Diya & Shaan"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-250 bg-white text-stone-900 text-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="diya.shaan@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-250 bg-white text-stone-900 text-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Mobile Number (For WhatsApp / SMS Alerts)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 91234 56789"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-250 bg-white text-stone-900 text-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Create Password *
                </label>
                <span className="text-[10px] text-amber-700 font-bold">Required (min 6 chars)</span>
              </div>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-250 bg-white text-stone-900 text-xs focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B89730] text-[#1B1202] font-serif font-bold text-xs transition-all shadow-lg hover:brightness-105 active:scale-95 mt-2"
            >
              <span>Create Account &amp; Pay ₹{finalAmount}</span>
              <Sparkle size={16} weight="fill" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>Already registered?</span>
              <Link href="/login" className="text-amber-700 font-bold hover:underline">
                Log In directly →
              </Link>
            </div>
          </form>
        )}

        <p className="text-[10px] text-center text-stone-400 pt-3 border-t border-stone-200 mt-4">
          🔒 256-Bit SSL Encrypted Payment via Razorpay UPI &amp; Cards
        </p>
      </div>
    </div>,
    document.body
  ) : null;

  const successModalContent = successData && mounted ? createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
      <div className="relative w-full max-w-md bg-[#FCFBF7] text-[#1A1A1A] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-scale-up">
        <button
          onClick={() => setSuccessData(null)}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-inner">
          <CheckCircle size={36} weight="fill" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-700 bg-amber-100/70 border border-amber-300/60 px-3 py-0.5 rounded-full">
            🎉 Lifetime Access Active
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
            Your Invitation is Live!
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All watermark badges and demo timers are permanently removed. Your guests can now view and RSVP anytime.
          </p>
        </div>

        {/* Account Auto-Link Confirmation Box */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-left text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <ShieldCheck size={16} weight="fill" className="text-amber-700" />
            <span>Dashboard Account Connected</span>
          </div>
          <p className="text-[11px] text-amber-900">
            Linked to <strong>{successData.email}</strong>. You can manage RSVPs, change timings, or download guest lists anytime.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <a
            href={successData.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#082F27] text-white hover:bg-[#0C4337] font-semibold text-xs transition-all shadow-md"
          >
            <span>View Live Invitation</span>
            <ArrowSquareOut size={16} />
          </a>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-all"
          >
            <House size={16} />
            <span>Go to My Dashboard</span>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        onClick={handleInitialClick}
        disabled={loading || isSuccess}
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-serif font-bold tracking-wide transition-all shadow-lg active:scale-95 disabled:opacity-75 disabled:pointer-events-none ${
          isSuccess
            ? "bg-emerald-600 text-white shadow-emerald-500/25"
            : "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B89730] text-[#1B1202] hover:brightness-105 shadow-amber-500/30"
        } ${className}`}
      >
        {loading ? (
          <>
            <Spinner className="animate-spin text-current" size={18} />
            <span>Securing Payment...</span>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle size={18} weight="fill" />
            <span>Payment Verified · Unlocked!</span>
          </>
        ) : (
          <>
            <LockOpen size={18} weight="bold" />
            <span>{buttonText}</span>
            <Sparkle size={16} weight="fill" />
          </>
        )}
      </button>

      {/* Render Portal Modals */}
      {modalContent}
      {successModalContent}
    </>
  );
}


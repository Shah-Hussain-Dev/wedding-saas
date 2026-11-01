"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { EnvelopeSimple, Sparkle, User, X } from "@phosphor-icons/react";

interface CustomizerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  defaultName?: string;
  onBeforeAuth: () => void;
}

type AuthTab = "google" | "email";
type EmailMode = "login" | "signup";

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
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
  );
}

export function CustomizerAuthModal({
  isOpen,
  onClose,
  onAuthenticated,
  defaultName = "",
  onBeforeAuth,
}: CustomizerAuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>("google");
  const [emailMode, setEmailMode] = useState<EmailMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(defaultName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (defaultName) setName(defaultName);
  }, [defaultName]);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage("");
  }, [isOpen, authTab, emailMode]);

  if (!isOpen || !mounted) return null;

  const finishAuth = () => {
    const normalized = email.trim().toLowerCase();
    if (normalized) localStorage.setItem("unfold_user_email", normalized);
    onClose();
    onAuthenticated();
  };

  const handleGoogle = () => {
    onBeforeAuth();
    signIn("google", { callbackUrl: window.location.href });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    onBeforeAuth();

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Invalid email or password. Try again or create an account.");
      } else if (res?.ok) {
        finishAuth();
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    onBeforeAuth();

    try {
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim() || "Wedding Host",
        }),
      });
      const regData = await regRes.json();
      if (!regRes.ok && regData.error && !String(regData.error).includes("already exists")) {
        setErrorMessage(regData.error || "Could not create account.");
        setIsSubmitting(false);
        return;
      }

      if (!regRes.ok && String(regData.error || "").includes("already exists")) {
        setErrorMessage("This email is already registered. Please log in instead.");
        setEmailMode("login");
        setIsSubmitting(false);
        return;
      }

      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Account created but sign-in failed. Try logging in.");
        setEmailMode("login");
      } else if (res?.ok) {
        finishAuth();
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const title =
    authTab === "google"
      ? "Sign in to save"
      : emailMode === "signup"
        ? "Create your account"
        : "Welcome back";

  const subtitle =
    authTab === "google"
      ? "Your invitation draft stays on this device—we'll link it to your account so you can edit anytime from your dashboard."
      : emailMode === "signup"
        ? "Sign up free to save your invitation to your dashboard. Your form data stays exactly as you entered it."
        : "Log in to save your invitation. Your current form data will not be lost.";

  return createPortal(
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative my-auto w-full max-w-md rounded-3xl border-2 border-[#C8A45E]/40 bg-[#FCFBF7] p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-200/60"
          aria-label="Close"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="mb-5 space-y-1.5 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/90 bg-amber-100 text-amber-700">
            <Sparkle size={22} weight="fill" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">{title}</h3>
          <p className="mx-auto max-w-[320px] text-xs leading-relaxed text-stone-500">{subtitle}</p>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-xl bg-stone-200/80 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthTab("google")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${authTab === "google" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
          >
            <GoogleIcon className="h-3.5 w-3.5" />
            Google
          </button>
          <button
            type="button"
            onClick={() => setAuthTab("email")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${authTab === "email" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
          >
            <EnvelopeSimple className="h-4 w-4" weight="bold" />
            Email
          </button>
        </div>

        {authTab === "google" ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-stone-300 bg-white py-3.5 text-xs font-bold text-stone-800 shadow-md hover:bg-stone-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <p className="text-center text-[11px] text-stone-500">
              New or returning? Google works for both.{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthTab("email");
                  setEmailMode("signup");
                }}
                className="font-bold text-[#073D31] underline underline-offset-2"
              >
                Sign up with email
              </button>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-2 rounded-full border border-stone-200 bg-[#FAF8F5] p-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setEmailMode("signup")}
                className={`rounded-full py-2 transition-all ${emailMode === "signup" ? "bg-[#073D31] text-white shadow-sm" : "text-stone-500"}`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => setEmailMode("login")}
                className={`rounded-full py-2 transition-all ${emailMode === "login" ? "bg-[#073D31] text-white shadow-sm" : "text-stone-500"}`}
              >
                Log in
              </button>
            </div>

            <form
              onSubmit={emailMode === "signup" ? handleEmailSignup : handleEmailLogin}
              className="space-y-3.5"
            >
              {emailMode === "signup" ? (
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Your name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3 text-sm"
                      placeholder="Couple or host name"
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm"
                  placeholder="At least 6 characters"
                />
              </div>

              {emailMode === "signup" ? (
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Confirm password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm"
                    placeholder="Re-enter password"
                  />
                </div>
              ) : null}

              {errorMessage ? (
                <p className="text-xs font-semibold text-rose-700">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#073D31] py-3.5 text-xs font-bold text-[#F7F4ED] disabled:opacity-60"
              >
                {isSubmitting
                  ? "Please wait…"
                  : emailMode === "signup"
                    ? "Create account & save"
                    : "Log in & save"}
              </button>

              <p className="text-center text-[11px] text-stone-500">
                {emailMode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setEmailMode("login")}
                      className="font-bold text-[#073D31] underline underline-offset-2"
                    >
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    New to WedInvites?{" "}
                    <button
                      type="button"
                      onClick={() => setEmailMode("signup")}
                      className="font-bold text-[#073D31] underline underline-offset-2"
                    >
                      Create free account
                    </button>
                  </>
                )}
              </p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

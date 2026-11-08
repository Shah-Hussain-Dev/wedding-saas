"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FloppyDisk, LockOpen, PencilSimple, SignIn } from "@phosphor-icons/react";
import {
  persistCustomizerPendingSubmit,
  consumeCustomizerResumeSubmit,
  writeCustomizerDraft,
} from "@/lib/customizer-preview-sync";
import { validateCustomizerDraft, isCustomizerDraftComplete } from "@/lib/customizer-validation";
import { submitCustomizerInvitation } from "@/lib/customizer-invitation-submit";
import { CustomizerAuthModal } from "@/components/customizer/CustomizerAuthModal";
import { CustomizerPaymentModal } from "@/components/customizer/CustomizerPaymentModal";
import { useTemplatePricing } from "@/lib/hooks/use-template-pricing";
import confetti from "canvas-confetti";
import {
  CustomizerSubmitSuccessModal,
  type CustomizerSuccessInvite,
} from "@/components/customizer/CustomizerSubmitSuccessModal";
import { ShareInvitationModal } from "@/components/sharing/ShareInvitationModal";

interface CustomizerSubmitFlowProps {
  templateId: string;
  getDraft: () => Record<string, unknown>;
  invitationId?: string | null;
  variant?: "preview" | "hidden";
  customizeHref?: string;
  onValidationError?: (message: string) => void;
}

export function CustomizerSubmitFlow({
  templateId,
  getDraft,
  invitationId = null,
  variant = "preview",
  customizeHref,
  onValidationError,
}: CustomizerSubmitFlowProps) {
  const { data: session, status: sessionStatus } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedInvite, setSavedInvite] = useState<CustomizerSuccessInvite | null>(null);
  const [savedInvitationId, setSavedInvitationId] = useState<string | null>(invitationId);

  const { getPricingDetails } = useTemplatePricing();
  const pricingDetail = useMemo(
    () => getPricingDetails(templateId),
    [getPricingDetails, templateId]
  );

  const draft = getDraft();
  const brideName = String(draft.brideName ?? "Bride");
  const groomName = String(draft.groomName ?? "Groom");
  const isFormComplete = isCustomizerDraftComplete(draft);
  const isLoggedIn = Boolean(session?.user?.email);
  const isPaid = Boolean(draft.orderStatus === "paid" || (draft.order as any)?.status === "paid");

  const persistBeforeAuth = useCallback(() => {
    const payload = getDraft();
    writeCustomizerDraft(templateId, payload);
    persistCustomizerPendingSubmit(templateId, payload);
  }, [getDraft, templateId]);

  const saveInvitationSilent = useCallback(async () => {
    if (!session?.user?.email) return null;
    const latest = getDraft();
    const activeId =
      savedInvitationId && !savedInvitationId.startsWith("demo-")
        ? savedInvitationId
        : invitationId && !invitationId.startsWith("demo-")
          ? invitationId
          : latest.id && !String(latest.id).startsWith("demo-")
            ? String(latest.id)
            : null;

    const isLatestPaid = Boolean(latest.orderStatus === "paid" || (latest.order as any)?.status === "paid");

    const result = await submitCustomizerInvitation({
      draft: latest,
      templateId,
      sessionEmail: session.user.email,
      invitationId: activeId,
      isAlreadyPaid: isLatestPaid,
      isPublished: Boolean(latest.isPublished && isLatestPaid),
    });

    if (result.ok && result.finalId) {
      setSavedInvitationId(result.finalId);
    }
    return result;
  }, [getDraft, invitationId, savedInvitationId, session?.user?.email, templateId]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    if (!consumeCustomizerResumeSubmit()) return;
    const latest = getDraft();
    if (isCustomizerDraftComplete(latest)) {
      if (isPaid) {
        setIsSuccessModalOpen(true);
      } else {
        void saveInvitationSilent().then((res) => {
          if (res?.ok) setIsPaymentModalOpen(true);
        });
      }
    }
  }, [sessionStatus, getDraft, isPaid, saveInvitationSilent]);

  const requestSubmitFlow = useCallback(async () => {
    const latest = getDraft();
    const message = validateCustomizerDraft(latest);
    if (message) {
      onValidationError?.(message);
      return;
    }
    if (!session?.user?.email) {
      persistBeforeAuth();
      setIsAuthModalOpen(true);
      return;
    }
    if (isPaid) {
      await saveInvitationSilent();
      setIsSuccessModalOpen(true);
      return;
    }
    // PAYMENT IS FIRST PRIORITY:
    setIsSubmitting(true);
    const result = await saveInvitationSilent();
    setIsSubmitting(false);
    if (result?.ok) {
      setIsPaymentModalOpen(true);
    }
  }, [getDraft, isPaid, onValidationError, persistBeforeAuth, saveInvitationSilent, session?.user?.email]);

  const handleAuthSuccess = useCallback(async () => {
    consumeCustomizerResumeSubmit();
    if (isPaid) {
      await saveInvitationSilent();
      setIsSuccessModalOpen(true);
      return;
    }
    // PAYMENT IS FIRST PRIORITY AFTER LOGIN:
    setIsSubmitting(true);
    const result = await saveInvitationSilent();
    setIsSubmitting(false);
    if (result?.ok) {
      setIsPaymentModalOpen(true);
    }
  }, [isPaid, saveInvitationSilent]);

  const handlePayInvitation = useCallback(async () => {
    if (!session?.user?.email) {
      setIsPaymentModalOpen(false);
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsPaying(true);
      const saveRes = await saveInvitationSilent();
      const activeInvitationId = saveRes?.finalId || savedInvitationId || invitationId;
      const activeSlug = saveRes?.finalSlug || String(draft.slug || "");
      const payerEmail = session.user.email;
      const payerName = session.user.name || `${brideName} & ${groomName}`;
      const amount = pricingDetail.priceInr || 1199;

      const loadScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
          if (typeof window === "undefined") return resolve(false);
          if ((window as any).Razorpay) return resolve(true);
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay payment gateway. Please check your internet connection.");
        setIsPaying(false);
        return;
      }

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: activeInvitationId,
          slug: activeSlug,
          templateId,
          brideName,
          groomName,
          customerEmail: payerEmail,
          customerName: payerName,
          amount,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to initiate payment order");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "WedInvites Digital Invitation",
        description: `Lifetime Live Link & RSVPs for ${brideName} & ${groomName}`,
        order_id: orderData.orderId,
        prefill: {
          name: payerName,
          email: payerEmail,
        },
        notes: {
          invitationId: activeInvitationId,
          slug: activeSlug,
          templateId,
          brideName,
          groomName,
          couple: `${brideName} & ${groomName}`,
          email: payerEmail,
        },
        theme: {
          color: "#073D31",
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id || orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpaySignature: response.razorpay_signature || "mock_signature",
                invitationId: activeInvitationId,
                slug: activeSlug,
                templateId,
                brideName,
                groomName,
                customerEmail: payerEmail,
                customerName: payerName,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setIsPaymentModalOpen(false);
              setIsPaying(false);

              try {
                confetti({
                  particleCount: 160,
                  spread: 100,
                  origin: { y: 0.45 },
                  colors: ["#D4AF37", "#10B981", "#FEF0C7", "#073D31", "#FFFFFF"],
                });
              } catch (_) {}

              const finalLiveSlug = verifyData.invitation?.slug || activeSlug;
              setSavedInvite({
                id: String(activeInvitationId),
                slug: finalLiveSlug,
                brideName,
                groomName,
                weddingDate: String(draft.weddingDate ?? ""),
                weddingTime: String(draft.weddingTime ?? ""),
                venueName: String(draft.venueName ?? ""),
                venueAddress: String(draft.venueAddress ?? ""),
                templateId,
                alreadySaved: true,
                isPaid: true,
              });
              setIsSuccessModalOpen(true);
            } else {
              alert(verifyData.error || "Payment verification failed.");
              setIsPaying(false);
            }
          } catch (verifyErr) {
            console.error("Payment verification error:", verifyErr);
            alert("Error confirming payment. Please contact support.");
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      alert(err.message || "Failed to start payment.");
      setIsPaying(false);
    }
  }, [brideName, draft, getDraft, groomName, invitationId, pricingDetail.priceInr, saveInvitationSilent, savedInvitationId, session?.user?.email, session?.user?.name, templateId]);

  const handleSaveAsDraftOnly = useCallback(() => {
    setIsPaymentModalOpen(false);
    const latest = getDraft();
    setSavedInvite({
      id: String(savedInvitationId || `local-${latest.slug || "draft"}`),
      slug: String(latest.slug || ""),
      brideName: String(latest.brideName ?? brideName),
      groomName: String(latest.groomName ?? groomName),
      weddingDate: String(latest.weddingDate ?? ""),
      weddingTime: String(latest.weddingTime ?? ""),
      venueName: String(latest.venueName ?? ""),
      venueAddress: String(latest.venueAddress ?? ""),
      templateId,
      alreadySaved: true,
      isPaid: false,
    });
    setIsSuccessModalOpen(true);
  }, [brideName, getDraft, groomName, savedInvitationId, templateId]);

  const primaryLabel = !isLoggedIn
    ? pricingDetail.priceFormatted
      ? `Log in & Unlock · ${pricingDetail.priceFormatted}`
      : "Log in & Unlock"
    : !isPaid
      ? pricingDetail.priceFormatted
        ? `Pay & Unlock · ${pricingDetail.priceFormatted}`
        : "Pay & Unlock"
      : "Save & Update";
  const editHref = customizeHref || `/customize/${templateId}`;

  const bar = variant === "preview" ? (
    <div
      className="pointer-events-none fixed bottom-3 left-3 z-[998] sm:bottom-4 sm:left-4"
      style={{ bottom: "max(12px, env(safe-area-inset-bottom, 12px))" }}
    >
      <div className="pointer-events-auto w-[min(100vw-1.5rem,18rem)] rounded-xl border border-[#073D31]/10 bg-[#FAFAF8]/95 p-1.5 shadow-lg backdrop-blur-md">
        <div className="grid grid-cols-2 gap-1">
          <Link
            href={editHref}
            className="flex min-h-[40px] items-center justify-center gap-1 rounded-lg border border-[#073D31]/12 bg-white px-2 font-sans text-[10px] font-bold text-[#073D31] hover:border-[#073D31]/25"
          >
            <PencilSimple size={13} weight="bold" className="shrink-0 text-[#C8A45E]" />
            <span className="truncate">Edit</span>
          </Link>
          {isFormComplete ? (
            <button
              type="button"
              onClick={requestSubmitFlow}
              disabled={isSubmitting}
              className="flex min-h-[40px] items-center justify-center gap-1 rounded-lg bg-[#073D31] px-2 font-sans text-[10px] font-bold text-[#F7F4ED] transition-colors hover:bg-[#032A23] disabled:opacity-60"
            >
              {!isLoggedIn ? (
                <SignIn size={13} weight="bold" className="shrink-0 text-[#C8A45E]" />
              ) : (
                <FloppyDisk size={13} weight="bold" className="shrink-0" />
              )}
              <span className="truncate">{isSubmitting ? "…" : primaryLabel}</span>
            </button>
          ) : (
            <Link
              href={editHref}
              className="flex min-h-[40px] items-center justify-center rounded-lg border border-[#073D31]/15 bg-[#F7F4ED] px-2 text-center font-sans text-[9px] font-bold leading-tight text-[#073D31] hover:border-[#073D31]/30"
            >
              Finish in editor
            </Link>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {bar}
      <CustomizerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthSuccess}
        defaultName={`${brideName} & ${groomName}`}
        onBeforeAuth={persistBeforeAuth}
      />
      <CustomizerPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPay={handlePayInvitation}
        onSaveAsDraft={handleSaveAsDraftOnly}
        isPaying={isPaying}
        coupleLabel={`${brideName} & ${groomName}`}
        templateId={templateId}
        pricing={pricingDetail}
        slug={String(draft.slug || "")}
      />
      <CustomizerSubmitSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        invite={savedInvite}
        onShare={() => {
          setIsSuccessModalOpen(false);
          setIsShareModalOpen(true);
        }}
        hidePreviewAction
        onPay={handlePayInvitation}
        priceFormatted={pricingDetail.priceFormatted}
      />
      {savedInvite ? (
        <ShareInvitationModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          invite={savedInvite}
        />
      ) : null}
    </>
  );
}

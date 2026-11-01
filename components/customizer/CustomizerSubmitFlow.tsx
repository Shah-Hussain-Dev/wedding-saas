"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FloppyDisk, PencilSimple, SignIn } from "@phosphor-icons/react";
import {
  persistCustomizerPendingSubmit,
  consumeCustomizerResumeSubmit,
  writeCustomizerDraft,
} from "@/lib/customizer-preview-sync";
import { validateCustomizerDraft, isCustomizerDraftComplete } from "@/lib/customizer-validation";
import { submitCustomizerInvitation } from "@/lib/customizer-invitation-submit";
import { CustomizerAuthModal } from "@/components/customizer/CustomizerAuthModal";
import { CustomizerSubmitConfirmModal } from "@/components/customizer/CustomizerSubmitConfirmModal";
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedInvite, setSavedInvite] = useState<CustomizerSuccessInvite | null>(null);
  const [savedInvitationId, setSavedInvitationId] = useState<string | null>(invitationId);

  const draft = getDraft();
  const brideName = String(draft.brideName ?? "Bride");
  const groomName = String(draft.groomName ?? "Groom");
  const isFormComplete = isCustomizerDraftComplete(draft);
  const isLoggedIn = Boolean(session?.user?.email);

  const persistBeforeAuth = useCallback(() => {
    const payload = getDraft();
    writeCustomizerDraft(templateId, payload);
    persistCustomizerPendingSubmit(templateId, payload);
  }, [getDraft, templateId]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    if (!consumeCustomizerResumeSubmit()) return;
    const latest = getDraft();
    if (isCustomizerDraftComplete(latest)) {
      setIsConfirmModalOpen(true);
    }
  }, [sessionStatus, getDraft]);

  const requestSubmitFlow = useCallback(() => {
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
    setIsConfirmModalOpen(true);
  }, [getDraft, onValidationError, persistBeforeAuth, session?.user?.email]);

  const handleAuthSuccess = useCallback(() => {
    consumeCustomizerResumeSubmit();
    setIsConfirmModalOpen(true);
  }, []);

  const handleSaveInvitation = useCallback(async () => {
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

    setIsSubmitting(true);

    const activeId =
      savedInvitationId && !savedInvitationId.startsWith("demo-")
        ? savedInvitationId
        : invitationId && !invitationId.startsWith("demo-")
          ? invitationId
          : latest.id && !String(latest.id).startsWith("demo-")
            ? String(latest.id)
            : null;

    const result = await submitCustomizerInvitation({
      draft: latest,
      templateId,
      sessionEmail: session.user.email,
      invitationId: activeId,
      isAlreadyPaid: Boolean(latest.isPaid),
      isPublished: Boolean(latest.isPublished),
    });

    if (result.unauthorized || result.forbidden) {
      persistBeforeAuth();
      setIsAuthModalOpen(true);
      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
      return;
    }

    if (session.user.email && typeof window !== "undefined") {
      localStorage.setItem("unfold_user_email", session.user.email.toLowerCase());
    }

    setSavedInvitationId(result.finalId);
    setSavedInvite({
      id: result.finalId,
      slug: result.finalSlug,
      brideName: String(latest.brideName ?? brideName),
      groomName: String(latest.groomName ?? groomName),
      weddingDate: String(latest.weddingDate ?? ""),
      weddingTime: String(latest.weddingTime ?? ""),
      venueName: String(latest.venueName ?? ""),
      venueAddress: String(latest.venueAddress ?? ""),
      templateId,
    });
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
    setIsSubmitting(false);
  }, [
    brideName,
    getDraft,
    groomName,
    invitationId,
    onValidationError,
    persistBeforeAuth,
    savedInvitationId,
    session?.user?.email,
    templateId,
  ]);

  const primaryLabel = !isLoggedIn ? "Log in & Finish" : "Finish & Submit";
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
      <CustomizerSubmitConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => void handleSaveInvitation()}
        isSubmitting={isSubmitting}
        coupleLabel={`${brideName} & ${groomName}`}
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

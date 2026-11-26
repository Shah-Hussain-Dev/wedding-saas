"use client";

import React, { useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import WeddingInvitationBuilder from "@/pdf/WeddingInvitationBuilder";
import { adaptTemplateDataToPdfState } from "@/pdf/template-adapter";
import type { PdfCardInvitationData } from "./BaratCardRenderer";

const Builder = WeddingInvitationBuilder as React.ComponentType<{
  initialData?: any;
  onChange?: (data: any) => void;
  storageKey?: string;
  isModal?: boolean;
  modalTitle?: string | null;
  onClose?: () => void;
}>;

export interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  initialData?: PdfCardInvitationData | any;
  isReadOnly?: boolean;
  hideReligionSelector?: boolean;
}

/**
 * Universal Multi-Page Vector PDF Invitation Modal.
 * Connected directly to all 17 templates, the customizer wizard, user dashboard,
 * and marketing showcase.
 * Provides 2-3 page max authentic stationery with direct Canva-style editing,
 * 3D elements, map hyperlinks, and pristine vector PDF print export.
 */
export function PdfPreviewModal({
  isOpen,
  onClose,
  templateId,
  initialData = {},
  isReadOnly = false,
  hideReligionSelector = false,
}: PdfPreviewModalProps) {
  // Adapt template data into the 2-3 page PDF studio state
  const adaptedState = useMemo(() => {
    return adaptTemplateDataToPdfState(templateId, initialData);
  }, [templateId, initialData]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [isOpen]);

  // Handle Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-0 m-0"
        role="dialog"
        aria-modal="true"
        aria-label="PDF Invitation Stationery Preview"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full h-full max-w-[100vw] max-h-[100vh] overflow-hidden bg-slate-900 shadow-2xl flex flex-col"
        >
          <Builder
            initialData={adaptedState}
            isModal={true}
            modalTitle={`${adaptedState.bride} & ${adaptedState.groom} — Matching Stationery`}
            onClose={onClose}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

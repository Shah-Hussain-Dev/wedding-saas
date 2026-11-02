export const customizerDraftKey = (templateId: string) =>
  `unfold_customizer_draft_${(templateId || "").trim().replace(/_/g, "-").toLowerCase()}`;

export const CUSTOMIZER_DRAFT_EVENT = "unfold-customizer-draft";
export const CUSTOMIZER_RESUME_KEY = "unfold_customizer_resume";

export function writeCustomizerDraft(templateId: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(payload);
    localStorage.setItem(customizerDraftKey(templateId), json);
    localStorage.setItem(`unfold_invitation_${templateId}`, json);
    const slug = payload.slug;
    if (typeof slug === "string" && slug.trim()) {
      localStorage.setItem(`unfold_invitation_${slug}`, json);
    }
    window.dispatchEvent(
      new CustomEvent(CUSTOMIZER_DRAFT_EVENT, { detail: { templateId } })
    );
  } catch {
    /* ignore quota errors */
  }
}

export function readCustomizerDraft(templateId: string): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      localStorage.getItem(customizerDraftKey(templateId)) ||
      sessionStorage.getItem("unfold_pending_draft") ||
      localStorage.getItem("unfold_pending_draft");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function persistCustomizerPendingSubmit(
  templateId: string,
  payload: Record<string, unknown>
) {
  writeCustomizerDraft(templateId, payload);
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(payload);
    localStorage.setItem("unfold_pending_draft", json);
    sessionStorage.setItem("unfold_pending_draft", json);
    sessionStorage.setItem(CUSTOMIZER_RESUME_KEY, "submit");
  } catch {
    /* ignore */
  }
}

export function consumeCustomizerResumeSubmit(): boolean {
  if (typeof window === "undefined") return false;
  const flag = sessionStorage.getItem(CUSTOMIZER_RESUME_KEY);
  if (flag === "submit") {
    sessionStorage.removeItem(CUSTOMIZER_RESUME_KEY);
    return true;
  }
  return false;
}

/** Copy current form draft to another template id (names, dates, etc. preserved). */
export function migrateCustomizerDraftToTemplate(
  _fromTemplateId: string,
  toTemplateId: string,
  payload: Record<string, unknown>
) {
  const migrated: Record<string, unknown> = {
    ...payload,
    templateId: toTemplateId,
    updatedAt: new Date().toISOString(),
  };
  writeCustomizerDraft(toTemplateId, migrated);
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(migrated);
    localStorage.setItem("unfold_pending_draft", json);
    sessionStorage.setItem("unfold_pending_draft", json);
  } catch {
    /* ignore */
  }
}

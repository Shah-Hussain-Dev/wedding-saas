export interface SubmitCustomizerInvitationResult {
  ok: boolean;
  unauthorized?: boolean;
  forbidden?: boolean;
  finalSlug: string;
  finalId: string;
  payload: Record<string, unknown>;
  apiRecord?: Record<string, unknown>;
  alreadySaved?: boolean;
}

function normalizeSlug(raw: string, brideName: string, groomName: string): string {
  const base = raw || `${brideName}-${groomName}`;
  return base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function persistInvitationLocal(
  record: Record<string, unknown>,
  slugKey: string,
  idKey?: string
) {
  if (typeof window === "undefined") return;
  try {
    const payloadStr = JSON.stringify(record);
    localStorage.setItem(`unfold_invitation_${slugKey}`, payloadStr);
    if (idKey) localStorage.setItem(`unfold_invitation_${idKey}`, payloadStr);
    localStorage.setItem("unfold_pending_draft", payloadStr);
    sessionStorage.setItem("unfold_pending_draft", payloadStr);
  } catch {
    /* ignore */
  }
}

export async function submitCustomizerInvitation(options: {
  draft: Record<string, unknown>;
  templateId: string;
  sessionEmail: string;
  invitationId?: string | null;
  isAlreadyPaid?: boolean;
  isPublished?: boolean;
}): Promise<SubmitCustomizerInvitationResult> {
  const { draft, templateId, sessionEmail, invitationId, isAlreadyPaid = false, isPublished = false } =
    options;

  const brideName = String(draft.brideName ?? "").trim();
  const groomName = String(draft.groomName ?? "").trim();
  const normalizedSlug = normalizeSlug(String(draft.slug ?? ""), brideName, groomName);

  const payload: Record<string, unknown> = {
    ...draft,
    templateId,
    slug: normalizedSlug,
    isPaid: isAlreadyPaid,
    isPublished: isAlreadyPaid && isPublished,
    userEmail: sessionEmail,
    email: sessionEmail,
    createdAt: draft.createdAt || new Date().toISOString(),
  };

  let finalSlug = normalizedSlug;
  let finalId = String(
    invitationId ||
      draft.id ||
      `demo-${Date.now()}`
  );

  const activeId =
    invitationId && !String(invitationId).startsWith("demo-")
      ? invitationId
      : draft.id && !String(draft.id).startsWith("demo-")
        ? String(draft.id)
        : null;

  try {
    if (activeId) {
      const res = await fetch(`/api/invitations/${activeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        return { ok: false, unauthorized: true, finalSlug, finalId, payload };
      }
      if (res.status === 403) {
        return { ok: false, forbidden: true, finalSlug, finalId, payload };
      }

      if (res.ok) {
        const updated = (await res.json()) as Record<string, unknown>;
        finalSlug = String(updated.slug || normalizedSlug);
        finalId = String(updated.id || activeId);
        const fullRecord = { ...payload, ...updated };
        persistInvitationLocal(fullRecord, finalSlug, finalId);
        return {
          ok: true,
          finalSlug,
          finalId,
          payload: fullRecord,
          apiRecord: updated,
          alreadySaved: true,
        };
      }
    } else {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        return { ok: false, unauthorized: true, finalSlug, finalId, payload };
      }

      if (res.ok) {
        const created = (await res.json()) as Record<string, unknown>;
        if (created.slug) finalSlug = String(created.slug);
        if (created.id) finalId = String(created.id);
        const fullRecord = { ...payload, ...created };
        persistInvitationLocal(fullRecord, finalSlug, finalId);
        return {
          ok: true,
          finalSlug,
          finalId,
          payload: fullRecord,
          apiRecord: created,
          alreadySaved: Boolean(created.alreadySaved),
        };
      }
    }
  } catch {
    persistInvitationLocal(payload, normalizedSlug, activeId || undefined);
    return { ok: true, finalSlug: normalizedSlug, finalId, payload };
  }

  persistInvitationLocal(payload, normalizedSlug, activeId || undefined);
  return { ok: true, finalSlug: normalizedSlug, finalId, payload };
}

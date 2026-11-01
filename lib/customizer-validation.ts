export function validateCustomizerDraft(draft: Record<string, unknown>): string | null {
  const brideName = String(draft.brideName ?? "").trim();
  const groomName = String(draft.groomName ?? "").trim();
  const slug = String(draft.slug ?? "").trim();
  const weddingDate = String(draft.weddingDate ?? "").trim();
  const venueName = String(draft.venueName ?? "").trim();
  const venueAddress = String(draft.venueAddress ?? "").trim();

  if (!brideName) return "Please enter the bride's name in the customizer.";
  if (!groomName) return "Please enter the groom's name in the customizer.";
  if (!slug) return "Please set your invitation web link in the customizer.";
  if (!weddingDate) return "Please select your wedding date in the customizer.";
  if (!venueName) return "Please enter your venue name in the customizer.";
  if (!venueAddress) return "Please enter the venue address in the customizer.";
  return null;
}

export function isCustomizerDraftComplete(draft: Record<string, unknown>): boolean {
  return validateCustomizerDraft(draft) === null;
}

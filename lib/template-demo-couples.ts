/** Demo couple labels for marketing — avoids importing the full templates barrel on the client. */
export const TEMPLATE_DEMO_COUPLES: Record<string, { groomName: string; brideName: string }> = {
  "imperial-palace": { groomName: "Kabir", brideName: "Tara" },
  "royal-majesty": { groomName: "Aditya", brideName: "Avantika" },
  "noor-e-nikah": { groomName: "Shaan", brideName: "Diya" },
  "azure-nikah": { groomName: "Zayd", brideName: "Samira" },
  "celestial-rose": { groomName: "Shubham", brideName: "Ananya" },
  "rose-gold-blush": { groomName: "Ishaan", brideName: "Anaya" },
};

export function formatDemoCoupleLabel(templateId: string): string | null {
  const pair = TEMPLATE_DEMO_COUPLES[templateId];
  if (!pair) return null;
  return `${pair.groomName} & ${pair.brideName}`;
}

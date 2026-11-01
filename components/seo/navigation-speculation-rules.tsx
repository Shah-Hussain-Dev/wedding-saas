/**
 * Conservative prerender for high-intent same-origin navigations (Core Web Vitals / performance skill).
 * Scoped to catalog routes only — avoids prerendering checkout/dashboard.
 */
export function NavigationSpeculationRules() {
  const rules = JSON.stringify({
    prerender: [
      {
        where: { href_matches: "/templates" },
        eagerness: "moderate",
      },
      {
        where: { href_matches: "/templates/*" },
        eagerness: "moderate",
      },
    ],
  });

  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: rules }}
    />
  );
}

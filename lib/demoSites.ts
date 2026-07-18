export const demoSites = {
  healthplus: {
    id: "healthplus",
    name: "HealthPlus Medical Portal",
    shortName: "HealthPlus",
    address: "patient.healthplus.demo",
  },
  pharmacy: {
    id: "pharmacy",
    name: "Neighborhood Pharmacy",
    shortName: "Pharmacy",
    address: "pharmacy.easyweb.demo",
  },
  utility: {
    id: "utility",
    name: "City Utility Billing",
    shortName: "Utility Billing",
    address: "billing.utility.demo",
  },
} as const;

export type DemoSiteId = keyof typeof demoSites;

export function findDemoSite(value: string): DemoSiteId | null {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const match = Object.values(demoSites).find(
    (site) => site.address === normalized,
  );
  return match?.id ?? null;
}

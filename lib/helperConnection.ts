export type RiskCategory = "password" | "payment";
export type HelpRequestStatus = "active" | "reviewed";

export type HelpRequest = {
  id: string;
  websiteName: string;
  address: string;
  reason: string;
  riskCategory: RiskCategory;
  createdAt: string;
  status: HelpRequestStatus;
};

export type HelperResponse = {
  id: string;
  requestId: string;
  message: string;
  sentAt: string;
  dismissed: boolean;
};

export type HelperConnectionState = {
  pairingCode: string;
  connectionStatus: "waiting" | "connected";
  onboardingComplete: boolean;
  skippedPairing: boolean;
  seniorDisplayName: string;
  helperDisplayName: string;
  helpRequests: HelpRequest[];
  helperResponses: HelperResponse[];
};

export type NewHelpRequest = Pick<
  HelpRequest,
  "websiteName" | "address" | "reason" | "riskCategory"
>;

export const helperResponsePresets = [
  "Please leave this website.",
  "Do not enter your password.",
  "Do not enter your card information.",
  "Call me before continuing.",
] as const;

export const initialHelperConnectionState: HelperConnectionState = {
  pairingCode: "0137",
  connectionStatus: "waiting",
  onboardingComplete: false,
  skippedPairing: false,
  seniorDisplayName: "",
  helperDisplayName: "",
  helpRequests: [],
  helperResponses: [],
};

const STORAGE_KEY = "easyweb.helper-connection.v3";
const LEGACY_STORAGE_KEYS = [
  "easyweb.helper-connection.v2",
  "easyweb.helper-connection.v1",
];

export function readHelperConnection(): HelperConnectionState {
  if (typeof window === "undefined") return initialHelperConnectionState;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const legacyStored = LEGACY_STORAGE_KEYS
      .map((key) => window.localStorage.getItem(key))
      .find((value) => value !== null);
    const valueToParse = stored ?? legacyStored;
    if (!valueToParse) return initialHelperConnectionState;
    const parsed = JSON.parse(valueToParse) as Partial<HelperConnectionState>;

    if (
      typeof parsed.pairingCode !== "string" ||
      !/^\d{4}$/.test(parsed.pairingCode) ||
      (parsed.connectionStatus !== "waiting" && parsed.connectionStatus !== "connected") ||
      typeof parsed.seniorDisplayName !== "string" ||
      typeof parsed.helperDisplayName !== "string" ||
      !Array.isArray(parsed.helpRequests) ||
      !Array.isArray(parsed.helperResponses)
    ) {
      return initialHelperConnectionState;
    }

    return {
      ...(parsed as HelperConnectionState),
      seniorDisplayName: stored ? parsed.seniorDisplayName.trim() : "",
      onboardingComplete:
        parsed.onboardingComplete === true || parsed.connectionStatus === "connected",
      skippedPairing: parsed.skippedPairing === true,
    };
  } catch {
    return initialHelperConnectionState;
  }
}

export function saveHelperConnection(state: HelperConnectionState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function subscribeToHelperConnection(
  onChange: (state: HelperConnectionState) => void,
) {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    onChange(readHelperConnection());
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

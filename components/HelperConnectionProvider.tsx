"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  initialHelperConnectionState,
  type HelperConnectionState,
  type NewHelpRequest,
  readHelperConnection,
  saveHelperConnection,
  subscribeToHelperConnection,
} from "@/lib/helperConnection";

type HelperConnectionContextValue = {
  state: HelperConnectionState;
  connectHelper: (pairingCode: string, helperName: string) => boolean;
  createHelpRequest: (request: NewHelpRequest) => boolean;
  dismissResponse: (responseId: string) => void;
  markRequestReviewed: (requestId: string) => void;
  regeneratePairingCode: () => void;
  sendHelperResponse: (requestId: string, message: string) => void;
};

const HelperConnectionContext = createContext<HelperConnectionContextValue | null>(null);

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makePairingCode() {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return String(value[0] % 10000).padStart(4, "0");
  }
  return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
}

export function HelperConnectionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HelperConnectionState>(initialHelperConnectionState);

  useEffect(() => {
    const initialize = window.setTimeout(() => setState(readHelperConnection()), 0);
    const unsubscribe = subscribeToHelperConnection(setState);
    return () => {
      window.clearTimeout(initialize);
      unsubscribe();
    };
  }, []);

  const updateState = useCallback((nextState: HelperConnectionState) => {
    setState(nextState);
    saveHelperConnection(nextState);
  }, []);

  const connectHelper = useCallback(
    (pairingCode: string, helperName: string) => {
      if (pairingCode !== state.pairingCode) return false;
      updateState({
        ...state,
        connectionStatus: "connected",
        helperDisplayName: helperName.trim() || "Emily",
      });
      return true;
    },
    [state, updateState],
  );

  const regeneratePairingCode = useCallback(() => {
    updateState({
      ...state,
      pairingCode: makePairingCode(),
      connectionStatus: "waiting",
    });
  }, [state, updateState]);

  const createHelpRequest = useCallback(
    (request: NewHelpRequest) => {
      if (state.connectionStatus !== "connected") return false;
      const alreadyActive = state.helpRequests.some(
        (existing) => existing.address === request.address && existing.status === "active",
      );
      if (alreadyActive) return true;

      updateState({
        ...state,
        helpRequests: [
          ...state.helpRequests,
          {
            ...request,
            id: makeId("request"),
            createdAt: new Date().toISOString(),
            status: "active",
          },
        ],
      });
      return true;
    },
    [state, updateState],
  );

  const sendHelperResponse = useCallback(
    (requestId: string, message: string) => {
      updateState({
        ...state,
        helperResponses: [
          ...state.helperResponses,
          {
            id: makeId("response"),
            requestId,
            message,
            sentAt: new Date().toISOString(),
            dismissed: false,
          },
        ],
      });
    },
    [state, updateState],
  );

  const markRequestReviewed = useCallback(
    (requestId: string) => {
      updateState({
        ...state,
        helpRequests: state.helpRequests.map((request) =>
          request.id === requestId ? { ...request, status: "reviewed" } : request,
        ),
      });
    },
    [state, updateState],
  );

  const dismissResponse = useCallback(
    (responseId: string) => {
      updateState({
        ...state,
        helperResponses: state.helperResponses.map((response) =>
          response.id === responseId ? { ...response, dismissed: true } : response,
        ),
      });
    },
    [state, updateState],
  );

  const value = useMemo(
    () => ({
      state,
      connectHelper,
      createHelpRequest,
      dismissResponse,
      markRequestReviewed,
      regeneratePairingCode,
      sendHelperResponse,
    }),
    [
      state,
      connectHelper,
      createHelpRequest,
      dismissResponse,
      markRequestReviewed,
      regeneratePairingCode,
      sendHelperResponse,
    ],
  );

  return (
    <HelperConnectionContext.Provider value={value}>
      {children}
    </HelperConnectionContext.Provider>
  );
}

export function useHelperConnection() {
  const context = useContext(HelperConnectionContext);
  if (!context) {
    throw new Error("useHelperConnection must be used within HelperConnectionProvider");
  }
  return context;
}

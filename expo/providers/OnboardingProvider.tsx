import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { t as translate, type LangCode } from "@/lib/i18n";

const STORAGE_KEY = "sherehe.onboarding.v1";

export type Role = "host" | "guest" | "unknown";

export interface OnboardingState {
  completed: boolean;
  language: LangCode;
  role: Role;
  authed: boolean;
  authMethod?: "google" | "apple" | "phone" | "email" | "guest";
  notificationsEnabled: boolean;
  photosEnabled: boolean;
  interests: string[];
  displayName?: string;
}

const DEFAULT: OnboardingState = {
  completed: false,
  language: "en",
  role: "unknown",
  authed: false,
  notificationsEnabled: false,
  photosEnabled: false,
  interests: [],
};

export const [OnboardingProvider, useOnboarding] = createContextHook(() => {
  const query = useQuery({
    queryKey: ["onboarding"],
    queryFn: async (): Promise<OnboardingState> => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) return { ...DEFAULT, ...(JSON.parse(raw) as Partial<OnboardingState>) };
      } catch (e) {
        console.log("[onboarding] load failed", e);
      }
      return DEFAULT;
    },
  });

  const state = query.data ?? DEFAULT;

  const persist = useCallback(async (next: OnboardingState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.log("[onboarding] save failed", e);
    }
  }, []);

  const update = useCallback(
    async (patch: Partial<OnboardingState>) => {
      const next = { ...state, ...patch };
      await persist(next);
      query.refetch();
    },
    [state, persist, query]
  );

  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    query.refetch();
  }, [query]);

  const tt = useCallback((key: string) => translate(key, state.language), [state.language]);

  const isLoading = query.isLoading;

  return useMemo(
    () => ({
      ...state,
      isLoading,
      update,
      reset,
      t: tt,
    }),
    [state, isLoading, update, reset, tt]
  );
});

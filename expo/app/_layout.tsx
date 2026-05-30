import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";

import { EventsProvider } from "@/providers/EventsProvider";
import { OnboardingProvider, useOnboarding } from "@/providers/OnboardingProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

/**
 * Catch unhandled promise rejections from third-party libraries (PostHog
 * analytics, AI SDK, etc.) so they don't surface as red-box crashes in dev
 * or full-screen error-boundary fallbacks.
 */
if (typeof globalThis !== "undefined") {
  const trackingError = (e: unknown) => {
    const msg = e instanceof Error ? e.message : String(e ?? "");
    // Suppress cosmetic network blips that are already handled elsewhere.
    if (
      msg === "Failed to fetch" ||
      msg === "Network request failed" ||
      msg === "AbortError" ||
      msg.includes("AbortError")
    ) {
      console.log("[app] suppressed unhandled rejection:", msg);
      return;
    }
    console.warn("[app] unhandled promise rejection:", msg);
  };

  // Web / React Native both support this as of Hermes 0.12+
  if (typeof globalThis.addEventListener === "function") {
    globalThis.addEventListener("unhandledrejection", (event: Event) => {
      const e = event as Event & { reason?: unknown };
      if (e.reason) {
        e.preventDefault?.();
        trackingError(e.reason);
      }
    });
  }
}

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { completed, isLoading } = useOnboarding();
  const router = useRouter();
  const segments = useSegments() as string[];

  useEffect(() => {
    if (isLoading) return;
    const inOnboarding = segments[0] === "onboarding";
    if (!completed && !inOnboarding) {
      router.replace("/onboarding" as never);
    }
  }, [completed, isLoading, segments, router]);

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0A0A0B" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#0A0A0B" },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="create" options={{ presentation: "modal", title: "New Event" }} />
      <Stack.Screen name="event/[id]" options={{ headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="invite/[id]" options={{ headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="camera/[id]" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="gallery/[id]" options={{ headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="pass/[id]" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="checkin/[id]" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="paywall" options={{ presentation: "modal", headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <EventsProvider>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0A0A0B" }}>
            <StatusBar style="light" />
            <OnboardingGate>
              <RootLayoutNav />
            </OnboardingGate>
          </GestureHandlerRootView>
        </EventsProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}

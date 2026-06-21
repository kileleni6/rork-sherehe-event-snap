import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Calendar, Camera, Images, User } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { C } from "@/constants/colors";
import { triggerHaptic } from "@/lib/haptics";
import { useOnboarding } from "@/providers/OnboardingProvider";

export default function TabLayout() {
  const { t } = useOnboarding();
  const insets = useSafeAreaInsets();

  // Floating tab bar respecting platform safe areas.
  // iOS home indicator needs ~34 px; Android gesture nav needs ~16 px.
  const bottomPad = Platform.OS === "ios" ? Math.max(insets.bottom, 28) : Math.max(insets.bottom, 16);
  const tabBarHeight = 56 + bottomPad;

  return (
    <Tabs
      screenListeners={{
        tabPress: () => triggerHaptic("selection"),
      }}
      screenOptions={{
        tabBarActiveTintColor: C.pink,
        tabBarInactiveTintColor: C.mute,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.3 },
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          backgroundColor: Platform.OS === "ios" ? "transparent" : C.bg,
          elevation: 0,
          height: tabBarHeight,
          paddingBottom: bottomPad,
          paddingTop: 8,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={70}
              tint="dark"
              style={[StyleSheet.absoluteFillObject, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hair }]}
            >
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(10,10,11,0.55)" }]} />
            </BlurView>
          ) : (
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: C.bg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hair }]} />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t("tab_events"), tabBarIcon: ({ color }) => <Calendar color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="camera"
        options={{ title: t("tab_camera"), tabBarIcon: ({ color }) => <Camera color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="gallery"
        options={{ title: t("tab_gallery"), tabBarIcon: ({ color }) => <Images color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: t("tab_profile"), tabBarIcon: ({ color }) => <User color={color} size={22} /> }}
      />
    </Tabs>
  );
}

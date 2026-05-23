import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Calendar, Camera, Images, User } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { C } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.pink,
        tabBarInactiveTintColor: C.mute,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.3 },
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          backgroundColor: Platform.OS === "ios" ? "transparent" : "#0A0A0B",
          elevation: 0,
          height: 84,
          paddingBottom: 24,
          paddingTop: 10,
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
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "#0A0A0B", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.hair }]} />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Events", tabBarIcon: ({ color }) => <Calendar color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="camera"
        options={{ title: "Camera", tabBarIcon: ({ color }) => <Camera color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="gallery"
        options={{ title: "Gallery", tabBarIcon: ({ color }) => <Images color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color }) => <User color={color} size={22} /> }}
      />
    </Tabs>
  );
}

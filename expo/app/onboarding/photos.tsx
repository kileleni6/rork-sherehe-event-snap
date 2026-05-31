import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Camera, Image as ImageIcon, Shield } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { OnboardShell } from "@/components/OnboardShell";
import { GhostButton, PrimaryButton } from "@/components/ui";
import { C } from "@/constants/colors";
import { useOnboarding } from "@/providers/OnboardingProvider";

export default function PhotosScreen() {
  const router = useRouter();
  const { update, t } = useOnboarding();

  const enable = async () => {
    try {
      if (Platform.OS !== "web") {
        Haptics.selectionAsync().catch(() => {});
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
    } catch (e) {
      console.log("[photos perm]", e);
    }
    await update({ photosEnabled: true });
    router.push("/onboarding/interests" as never);
  };

  const skip = async () => {
    await update({ photosEnabled: false });
    router.push("/onboarding/interests" as never);
  };

  return (
    <OnboardShell
      step={5}
      total={9}
      kicker="MEDIA"
      title={t("photo_title")}
      subtitle={t("photo_sub")}
      footer={
        <View style={{ gap: 10 }}>
          <PrimaryButton title={t("enable_photo")} icon={Camera} onPress={enable} />
          <GhostButton title={t("skip_now")} onPress={skip} />
        </View>
      }
    >
      <View style={styles.heroRow}>
        <LinearGradient colors={[C.pinkHi, C.pinkDeep]} style={styles.heroChip}>
          <Camera color={C.text} size={32} />
        </LinearGradient>
        <LinearGradient colors={["#3D0A24", "#1A0410"]} style={styles.heroChip}>
          <ImageIcon color={C.pinkHi} size={32} />
        </LinearGradient>
        <LinearGradient colors={["#F4C97B", "#B68A2E"]} style={styles.heroChip}>
          <Shield color="#1A1A1A" size={32} />
        </LinearGradient>
      </View>

      <View style={styles.privacy}>
        <Shield color={C.success} size={16} />
        <Text style={styles.privacyText}>
          Photos stay in your event's private gallery. You decide when they're revealed.
        </Text>
      </View>
    </OnboardShell>
  );
}

const styles = StyleSheet.create({
  heroRow: { flexDirection: "row", gap: 12, justifyContent: "center", paddingVertical: 18 },
  heroChip: {
    width: 90,
    height: 110,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    backgroundColor: "rgba(61,214,140,0.08)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(61,214,140,0.25)",
    marginTop: 14,
  },
  privacyText: { flex: 1, color: C.subtext, fontSize: 13, lineHeight: 19 },
});

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Bell, CalendarClock, Lock, MailCheck } from "lucide-react-native";
import React from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";

import { OnboardShell } from "@/components/OnboardShell";
import { GhostButton, PrimaryButton } from "@/components/ui";
import { C } from "@/constants/colors";
import { registerForPushAsync } from "@/lib/notifications";
import { useOnboarding } from "@/providers/OnboardingProvider";

export default function NotificationsScreen() {
  const router = useRouter();
  const { update, t } = useOnboarding();

  const enable = async () => {
    const reg = await registerForPushAsync();
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(
        reg.granted ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
      ).catch(() => {});
    }
    await update({ notificationsEnabled: reg.granted });
    if (Platform.OS === "web") {
      Alert.alert(t("notif_enabled_title"), t("notif_enabled_body"));
    }
    if (reg.token) {
      console.log("[notifications] expo push token", reg.token);
    }
    router.push("/onboarding/photos" as never);
  };

  const skip = async () => {
    await update({ notificationsEnabled: false });
    router.push("/onboarding/photos" as never);
  };

  return (
    <OnboardShell
      step={4}
      total={9}
      kicker="ALERTS"
      title={t("notif_title")}
      subtitle={t("notif_sub")}
      footer={
        <View style={{ gap: 10 }}>
          <PrimaryButton title={t("enable_notif")} icon={Bell} onPress={enable} />
          <GhostButton title={t("skip_now")} onPress={skip} />
        </View>
      }
    >
      <View style={styles.heroWrap}>
        <LinearGradient
          colors={["rgba(255,45,122,0.18)", "rgba(255,45,122,0)"]}
          style={styles.heroBg}
        />
        <View style={styles.heroIcon}>
          <Bell color={C.text} size={42} />
        </View>
      </View>

      <View style={{ gap: 12, marginTop: 12 }}>
        {[
          { i: MailCheck, t: "RSVP reminders", s: "Tap once to confirm or decline." },
          { i: CalendarClock, t: "Event countdown", s: "Don't miss a moment." },
          { i: Lock, t: "Gallery unlocked", s: "The instant memories drop." },
        ].map((row) => {
          const Icon = row.i;
          return (
            <View key={row.t} style={styles.row}>
              <View style={styles.rowIcon}>
                <Icon color={C.pinkHi} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{row.t}</Text>
                <Text style={styles.rowSub}>{row.s}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </OnboardShell>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  heroBg: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 999,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: C.pink,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.pink,
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.hair,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,45,122,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { color: C.text, fontWeight: "700" as const, fontSize: 14 },
  rowSub: { color: C.subtext, fontSize: 12, marginTop: 2 },
});

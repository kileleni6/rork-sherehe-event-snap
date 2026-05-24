import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Apple, ShieldCheck } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { OnboardShell } from "@/components/OnboardShell";
import { C } from "@/constants/colors";
import { useOnboarding } from "@/providers/OnboardingProvider";

function GoogleG() {
  return (
    <View style={styles.gIcon}>
      <Text style={{ fontWeight: "900" as const, color: "#1A1A1A", fontSize: 14 }}>G</Text>
    </View>
  );
}

export default function AuthScreen() {
  const router = useRouter();
  const { update, t } = useOnboarding();

  const pick = async (method: "google" | "apple") => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    await update({ authed: true, authMethod: method });
    router.push("/onboarding/notifications" as never);
  };

  return (
    <OnboardShell
      step={4}
      total={8}
      kicker="ACCOUNT"
      title={t("sign_in")}
      subtitle="Sign in to save events across devices and keep your guest lists safe."
    >
      <View style={{ gap: 12 }}>
        <Pressable onPress={() => pick("google")} style={[styles.btn, { backgroundColor: C.text }]}>
          <GoogleG />
          <Text style={[styles.btnText, { color: "#1A1A1A" }]}>{t("cont_google")}</Text>
        </Pressable>

        <Pressable onPress={() => pick("apple")} style={[styles.btn, { backgroundColor: "#000", borderWidth: 1, borderColor: C.hair }]}>
          <Apple color={C.text} size={20} fill={C.text} />
          <Text style={[styles.btnText, { color: C.text }]}>{t("cont_apple")}</Text>
        </Pressable>
      </View>

      <View style={styles.trust}>
        <View style={styles.trustIcon}>
          <ShieldCheck color={C.success} size={18} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.trustTitle}>Private by default</Text>
          <Text style={styles.trustSub}>
            We never post on your behalf. Your guest list, photos and RSVPs stay in your event.
          </Text>
        </View>
      </View>

      <Text style={styles.legal}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </OnboardShell>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  btnText: { fontSize: 15, fontWeight: "700" as const },
  gIcon: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: C.text,
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  trust: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.hair,
    padding: 16,
    marginTop: 22,
  },
  trustIcon: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(61,214,140,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  trustTitle: { color: C.text, fontWeight: "700" as const, fontSize: 14, marginBottom: 2 },
  trustSub: { color: C.subtext, fontSize: 12, lineHeight: 17 },
  legal: { color: C.mute, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 22, paddingHorizontal: 12 },
});

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Apple, AtSign, Phone } from "lucide-react-native";
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

  const pick = async (method: "google" | "apple" | "phone" | "email" | "guest") => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    await update({ authed: method !== "guest", authMethod: method });
    router.push("/onboarding/notifications" as never);
  };

  return (
    <OnboardShell
      step={4}
      total={8}
      kicker="ACCOUNT"
      title={t("sign_in")}
      subtitle={t("signin_sub")}
    >
      <View style={{ gap: 12 }}>
        <Pressable onPress={() => pick("google")} style={[styles.btn, { backgroundColor: C.text }]}>
          <GoogleG />
          <Text style={[styles.btnText, { color: "#1A1A1A" }]}>{t("cont_google")}</Text>
        </Pressable>

        {Platform.OS === "ios" ? (
          <Pressable onPress={() => pick("apple")} style={[styles.btn, { backgroundColor: "#000", borderWidth: 1, borderColor: C.hair }]}>
            <Apple color={C.text} size={20} fill={C.text} />
            <Text style={[styles.btnText, { color: C.text }]}>{t("cont_apple")}</Text>
          </Pressable>
        ) : null}

        <Pressable onPress={() => pick("phone")} style={[styles.btn, styles.btnGhost]}>
          <Phone color={C.text} size={18} />
          <Text style={[styles.btnText, { color: C.text }]}>{t("cont_phone")}</Text>
        </Pressable>

        <Pressable onPress={() => pick("email")} style={[styles.btn, styles.btnGhost]}>
          <AtSign color={C.text} size={18} />
          <Text style={[styles.btnText, { color: C.text }]}>{t("cont_email")}</Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        <Pressable onPress={() => pick("guest")} hitSlop={8} style={styles.skipWrap}>
          <Text style={styles.skipText}>{t("skip_now")}</Text>
        </Pressable>
      </View>

      <Text style={styles.legal}>
        By continuing, you agree to our Terms of Service and Privacy Policy. Authentication is for demo purposes in this preview build.
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
  btnGhost: { backgroundColor: C.card, borderWidth: 1, borderColor: C.hair },
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
  divider: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 6 },
  line: { flex: 1, height: 1, backgroundColor: C.hair },
  or: { color: C.mute, fontSize: 12, letterSpacing: 1, fontWeight: "700" as const },
  skipWrap: { alignItems: "center", paddingVertical: 8 },
  skipText: { color: C.subtext, fontSize: 14, fontWeight: "600" as const, textDecorationLine: "underline" },
  legal: { color: C.mute, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 24, paddingHorizontal: 12 },
});

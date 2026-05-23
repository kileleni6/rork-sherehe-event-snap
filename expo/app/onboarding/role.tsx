import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowRight, Check, Crown, Users } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { OnboardShell } from "@/components/OnboardShell";
import { PrimaryButton } from "@/components/ui";
import { C } from "@/constants/colors";
import { useOnboarding, type Role } from "@/providers/OnboardingProvider";

export default function RoleScreen() {
  const router = useRouter();
  const { role, update, t } = useOnboarding();
  const [selected, setSelected] = useState<Role>(role === "unknown" ? "host" : role);

  const choose = (r: Role) => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    setSelected(r);
  };

  const next = async () => {
    await update({ role: selected });
    router.push("/onboarding/auth" as never);
  };

  const opts: { id: Role; title: string; sub: string; icon: typeof Crown; gradient: [string, string] }[] = [
    {
      id: "host",
      title: t("role_host"),
      sub: t("role_host_sub"),
      icon: Crown,
      gradient: [C.pinkHi, C.pinkDeep],
    },
    {
      id: "guest",
      title: t("role_guest"),
      sub: t("role_guest_sub"),
      icon: Users,
      gradient: ["#1A0410", "#3D0A24"],
    },
  ];

  return (
    <OnboardShell
      step={3}
      total={8}
      kicker="ROLE"
      title={t("who_are_you")}
      subtitle={t("role_sub")}
      footer={<PrimaryButton title={t("continue")} icon={ArrowRight} onPress={next} />}
    >
      <View style={{ gap: 14 }}>
        {opts.map((o) => {
          const active = selected === o.id;
          const Icon = o.icon;
          return (
            <Pressable
              key={o.id}
              onPress={() => choose(o.id)}
              style={[styles.card, active ? styles.cardActive : null]}
            >
              <LinearGradient
                colors={o.gradient}
                style={styles.iconWrap}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon color={C.text} size={26} />
              </LinearGradient>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.title}>{o.title}</Text>
                <Text style={styles.sub}>{o.sub}</Text>
              </View>
              {active ? (
                <View style={styles.check}>
                  <Check color={C.text} size={14} />
                </View>
              ) : (
                <View style={styles.checkEmpty} />
              )}
            </Pressable>
          );
        })}
      </View>
    </OnboardShell>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    backgroundColor: C.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.hair,
  },
  cardActive: { borderColor: C.pink, backgroundColor: "rgba(255,45,122,0.06)" },
  iconWrap: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  title: { color: C.text, fontWeight: "800" as const, fontSize: 18, letterSpacing: -0.3 },
  sub: { color: C.subtext, fontSize: 13, lineHeight: 18 },
  check: { width: 26, height: 26, borderRadius: 999, backgroundColor: C.pink, alignItems: "center", justifyContent: "center" },
  checkEmpty: { width: 26, height: 26, borderRadius: 999, borderWidth: 1.5, borderColor: C.hair },
});

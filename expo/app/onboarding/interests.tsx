import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { OnboardShell } from "@/components/OnboardShell";
import { GhostButton, PrimaryButton } from "@/components/ui";
import { C } from "@/constants/colors";
import { useOnboarding } from "@/providers/OnboardingProvider";

const OPTIONS = [
  { id: "wedding", emoji: "💍", label: "Weddings" },
  { id: "birthday", emoji: "🎂", label: "Birthdays" },
  { id: "baby", emoji: "👶", label: "Baby showers" },
  { id: "graduation", emoji: "🎓", label: "Graduations" },
  { id: "corporate", emoji: "🏢", label: "Corporate" },
  { id: "vacation", emoji: "🏝️", label: "Travel" },
  { id: "engagement", emoji: "💎", label: "Engagement" },
  { id: "religious", emoji: "🕊️", label: "Religious" },
  { id: "concert", emoji: "🎤", label: "Concerts" },
  { id: "festival", emoji: "🎪", label: "Festivals" },
  { id: "private", emoji: "🥂", label: "Private" },
  { id: "brand", emoji: "✨", label: "Brand" },
];

export default function InterestsScreen() {
  const router = useRouter();
  const { interests, update, t } = useOnboarding();
  const [picked, setPicked] = useState<string[]>(interests);

  const toggle = (id: string) => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const next = async () => {
    await update({ interests: picked });
    router.push("/onboarding/ready" as never);
  };

  const skip = async () => {
    await update({ interests: [] });
    router.push("/onboarding/ready" as never);
  };

  return (
    <OnboardShell
      step={7}
      total={8}
      kicker="INTERESTS"
      title={t("interests_title")}
      subtitle={t("interests_sub")}
      footer={
        <View style={{ gap: 10 }}>
          <PrimaryButton
            title={t("continue")}
            icon={ArrowRight}
            onPress={next}
            disabled={picked.length === 0}
          />
          <GhostButton title={t("skip_now")} onPress={skip} />
        </View>
      }
    >
      <View style={styles.grid}>
        {OPTIONS.map((o) => {
          const active = picked.includes(o.id);
          return (
            <Pressable
              key={o.id}
              onPress={() => toggle(o.id)}
              style={[styles.chip, active ? styles.chipActive : null]}
            >
              <Text style={styles.emoji}>{o.emoji}</Text>
              <Text style={[styles.label, active ? { color: C.text } : null]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.hint}>Tap as many as you like — we'll suggest templates based on your picks.</Text>
    </OnboardShell>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    width: "31%",
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.hair,
    alignItems: "center",
    gap: 6,
  },
  chipActive: { backgroundColor: "rgba(255,45,122,0.12)", borderColor: C.pink },
  emoji: { fontSize: 24 },
  label: { color: C.subtext, fontSize: 12, fontWeight: "700" as const, textAlign: "center" },
  hint: { color: C.mute, fontSize: 12, marginTop: 16, textAlign: "center" },
});

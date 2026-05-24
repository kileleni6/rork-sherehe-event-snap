import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Check, Crown, Sparkles } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { OnboardShell } from "@/components/OnboardShell";
import { PrimaryButton } from "@/components/ui";
import { C } from "@/constants/colors";
import { useEvents } from "@/providers/EventsProvider";
import { useOnboarding } from "@/providers/OnboardingProvider";

type TierId = "small" | "medium" | "large";

interface Tier {
  id: TierId;
  name: string;
  blurb: string;
  price: string;
  per: string;
  guests: string;
  storage: string;
  highlight?: boolean;
}

const TIERS: Tier[] = [
  { id: "small", name: "Intimate", blurb: "Up to 25 guests", price: "$19", per: "one-time", guests: "25 guests", storage: "5 GB" },
  { id: "medium", name: "Celebration", blurb: "Up to 100 guests", price: "$49", per: "one-time", guests: "100 guests", storage: "25 GB", highlight: true },
  { id: "large", name: "Grand", blurb: "Up to 500 guests", price: "$129", per: "one-time", guests: "500 guests", storage: "Unlimited" },
];

const PERKS = [
  "All 50+ premium invitation templates",
  "HD photo downloads & album ZIP",
  "Custom branding (remove SHEREHE mark)",
  "Advanced RSVP analytics & insights",
  "AI invitation writer & best-moments curation",
];

export default function OnboardingPaywallScreen() {
  const router = useRouter();
  const { update } = useOnboarding();
  const { setProfile } = useEvents();
  const [tier, setTier] = useState<TierId>("medium");

  const shine = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(shine, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
    ).start();
  }, [shine]);
  const shimmer = shine.interpolate({ inputRange: [0, 1], outputRange: [-200, 260] });

  const finish = async (premium: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    if (premium) await setProfile({ premium: true });
    await update({ completed: true });
    router.replace("/(tabs)" as never);
  };

  const subscribe = () => finish(true);
  const skip = () => finish(false);

  return (
    <OnboardShell
      step={8}
      total={8}
      kicker="UNLOCK"
      title="Host like a star"
      subtitle="One payment per event. Pick your size — or start free and upgrade later."
      footer={
        <View style={{ gap: 10 }}>
          <PrimaryButton
            title={`Unlock ${TIERS.find((t) => t.id === tier)?.name} · ${TIERS.find((t) => t.id === tier)?.price}`}
            icon={Crown}
            onPress={subscribe}
          />
          <Pressable onPress={skip} hitSlop={8} style={{ alignSelf: "center", paddingVertical: 4 }}>
            <Text style={styles.skip}>Start free — single event</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.heroCard}>
        <LinearGradient
          colors={["#3D0A24", "#8B0030", C.pinkDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View
          style={[
            styles.shimmer,
            { transform: [{ translateX: shimmer }, { rotate: "18deg" }] },
          ]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.18)", "rgba(255,255,255,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <View style={styles.crownBadge}>
          <Crown color={C.gold} size={14} />
          <Text style={styles.crownText}>SHEREHE PRO</Text>
        </View>
        <Sparkles color={C.gold} size={28} />
        <Text style={styles.heroTitle}>Make it unforgettable</Text>
        <Text style={styles.heroSub}>Premium templates, bigger guest lists, HD memories.</Text>
      </View>

      <View style={{ gap: 12, marginTop: 22 }}>
        {TIERS.map((t) => {
          const active = tier === t.id;
          return (
            <Pressable key={t.id} onPress={() => setTier(t.id)} style={[styles.tier, active ? styles.tierActive : null]}>
              {t.highlight ? (
                <View style={styles.popular}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              ) : null}
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.tierName}>{t.name}</Text>
                <Text style={styles.tierBlurb}>{t.blurb}</Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{t.guests}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{t.storage}</Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.tierPrice}>{t.price}</Text>
                <Text style={styles.tierPer}>{t.per}</Text>
                <View style={[styles.radio, active ? styles.radioOn : null]}>
                  {active ? <Check color={C.text} size={14} /> : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.perks}>
        {PERKS.map((p) => (
          <View key={p} style={styles.perkRow}>
            <View style={styles.perkCheck}>
              <Check color={C.bg} size={12} />
            </View>
            <Text style={styles.perkText}>{p}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.legal}>
        Pay with Apple Pay, Google Pay or card via Stripe. Cancel anytime — it's a one-time per event.
      </Text>
    </OnboardShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 22,
    padding: 22,
    overflow: "hidden",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(244,201,123,0.3)",
  },
  shimmer: {
    position: "absolute",
    top: -40,
    width: 120,
    height: 320,
  },
  crownBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(244,201,123,0.4)",
  },
  crownText: { color: C.gold, fontSize: 10, fontWeight: "800" as const, letterSpacing: 2 },
  heroTitle: { color: C.text, fontSize: 24, fontWeight: "800" as const, letterSpacing: -0.5, textAlign: "center", marginTop: 4 },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, textAlign: "center", lineHeight: 18, paddingHorizontal: 8 },

  tier: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.hair,
  },
  tierActive: { borderColor: C.gold, backgroundColor: "rgba(244,201,123,0.06)" },
  popular: {
    position: "absolute",
    top: -10,
    left: 16,
    backgroundColor: C.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  popularText: { color: "#0A0A0B", fontSize: 9, fontWeight: "800" as const, letterSpacing: 1 },
  tierName: { color: C.text, fontSize: 18, fontWeight: "800" as const, letterSpacing: -0.3 },
  tierBlurb: { color: C.subtext, fontSize: 12 },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.hair,
  },
  tagText: { color: C.text, fontSize: 10, fontWeight: "600" as const },
  tierPrice: { color: C.text, fontSize: 20, fontWeight: "800" as const },
  tierPer: { color: C.subtext, fontSize: 10, marginTop: -2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: C.hair,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  radioOn: { backgroundColor: C.pink, borderColor: C.pink },

  perks: { marginTop: 20, gap: 12, padding: 16, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.hair },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  perkCheck: { width: 20, height: 20, borderRadius: 999, backgroundColor: C.gold, alignItems: "center", justifyContent: "center" },
  perkText: { color: C.text, fontSize: 13, flex: 1, fontWeight: "500" as const },

  legal: { color: C.mute, fontSize: 11, textAlign: "center", marginTop: 16, lineHeight: 16, paddingHorizontal: 8 },
  skip: { color: C.subtext, fontSize: 13, fontWeight: "600" as const, textDecorationLine: "underline" },
});

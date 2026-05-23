import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { Check, Crown, Sparkles, X } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui";
import { C } from "@/constants/colors";
import { useEvents } from "@/providers/EventsProvider";

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
  {
    id: "small",
    name: "Intimate",
    blurb: "Up to 25 guests",
    price: "$19",
    per: "one-time",
    guests: "25 guests",
    storage: "5 GB",
  },
  {
    id: "medium",
    name: "Celebration",
    blurb: "Up to 100 guests",
    price: "$49",
    per: "one-time",
    guests: "100 guests",
    storage: "25 GB",
    highlight: true,
  },
  {
    id: "large",
    name: "Grand",
    blurb: "Up to 500 guests",
    price: "$129",
    per: "one-time",
    guests: "500 guests",
    storage: "Unlimited",
  },
];

const PERKS = [
  "All premium invitation templates",
  "HD photo downloads & album ZIP",
  "Custom branding (remove SHEREHE mark)",
  "Advanced RSVP analytics",
  "AI invitation writer & best-moments curation",
  "Priority background uploads",
];

export default function PaywallScreen() {
  const router = useRouter();
  const { setProfile } = useEvents();
  const [tier, setTier] = useState<TierId>("medium");

  const subscribe = async () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await setProfile({ premium: true });
    router.back();
  };

  return (
    <View style={ps.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={["#1A0410", "#3D0A24", "#8B0030", "#0A0A0B"]}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View style={ps.topBar}>
          <View style={{ width: 38 }} />
          <View style={ps.crownBadge}>
            <Crown color={C.gold} size={14} />
            <Text style={ps.crownText}>SHEREHE PRO</Text>
          </View>
          <Pressable onPress={() => router.back()} style={ps.closeBtn} hitSlop={10}>
            <X color={C.text} size={20} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <View style={ps.hero}>
            <Sparkles color={C.gold} size={30} />
            <Text style={ps.heroTitle}>Host like a star</Text>
            <Text style={ps.heroSub}>
              Unlock luxury templates, bigger guest lists, custom branding and HD memories — one payment per event.
            </Text>
          </View>

          <View style={{ gap: 12, marginTop: 22 }}>
            {TIERS.map((t) => {
              const active = tier === t.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTier(t.id)}
                  style={[ps.tier, active ? ps.tierActive : null]}
                >
                  {t.highlight ? (
                    <View style={ps.popular}>
                      <Text style={ps.popularText}>MOST POPULAR</Text>
                    </View>
                  ) : null}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={ps.tierName}>{t.name}</Text>
                    <Text style={ps.tierBlurb}>{t.blurb}</Text>
                    <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                      <View style={ps.tierTag}><Text style={ps.tierTagText}>{t.guests}</Text></View>
                      <View style={ps.tierTag}><Text style={ps.tierTagText}>{t.storage}</Text></View>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={ps.tierPrice}>{t.price}</Text>
                    <Text style={ps.tierPer}>{t.per}</Text>
                    <View style={[ps.radio, active ? ps.radioOn : null]}>
                      {active ? <Check color={C.text} size={14} /> : null}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={ps.perks}>
            {PERKS.map((p) => (
              <View key={p} style={ps.perkRow}>
                <View style={ps.perkCheck}>
                  <Check color={C.bg} size={12} />
                </View>
                <Text style={ps.perkText}>{p}</Text>
              </View>
            ))}
          </View>

          <Text style={ps.legal}>One-time per event. Pay with Apple Pay, Google Pay or card via Stripe.</Text>
        </ScrollView>

        <View style={ps.footer}>
          <PrimaryButton title={`Unlock ${TIERS.find((t) => t.id === tier)?.name} · ${TIERS.find((t) => t.id === tier)?.price}`} onPress={subscribe} />
          <Pressable onPress={() => router.back()} style={{ alignSelf: "center", marginTop: 10 }}>
            <Text style={ps.maybe}>Maybe later</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const ps = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingTop: 6 },
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
  crownText: { color: C.gold, fontSize: 11, fontWeight: "800" as const, letterSpacing: 2 },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: { alignItems: "center", gap: 10, marginTop: 24 },
  heroTitle: { color: C.text, fontSize: 36, fontWeight: "800" as const, letterSpacing: -0.7, textAlign: "center" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 14, textAlign: "center", lineHeight: 20, paddingHorizontal: 14 },
  tier: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tierActive: { borderColor: C.gold, backgroundColor: "rgba(244,201,123,0.08)" },
  popular: {
    position: "absolute",
    top: -10,
    left: 16,
    backgroundColor: C.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  popularText: { color: "#0A0A0B", fontSize: 10, fontWeight: "800" as const, letterSpacing: 1 },
  tierName: { color: C.text, fontSize: 19, fontWeight: "800" as const, letterSpacing: -0.3 },
  tierBlurb: { color: "rgba(255,255,255,0.75)", fontSize: 13 },
  tierTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tierTagText: { color: C.text, fontSize: 11, fontWeight: "600" as const },
  tierPrice: { color: C.text, fontSize: 22, fontWeight: "800" as const },
  tierPer: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: -2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  radioOn: { backgroundColor: C.pink, borderColor: C.pink },
  perks: { marginTop: 22, gap: 12 },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  perkCheck: { width: 20, height: 20, borderRadius: 999, backgroundColor: C.gold, alignItems: "center", justifyContent: "center" },
  perkText: { color: C.text, fontSize: 14, flex: 1, fontWeight: "500" as const },
  legal: { color: "rgba(255,255,255,0.55)", fontSize: 11, textAlign: "center", marginTop: 20, lineHeight: 16, paddingHorizontal: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    backgroundColor: "rgba(10,10,11,0.85)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  maybe: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" as const },
});

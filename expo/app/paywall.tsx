import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { Check, Crown, HardDrive, Sparkles, Tag as TagIcon, Users, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui";
import { C } from "@/constants/colors";
import { configurePurchases, isPurchasesAvailable, purchasePackageByKey, restorePurchases } from "@/lib/purchases";
import { useEvents } from "@/providers/EventsProvider";
import { useOnboarding } from "@/providers/OnboardingProvider";

type TierId = "starter" | "celebration" | "premium" | "large" | "enterprise" | "super";

interface Tier {
  id: TierId;
  name: string;
  blurb: string;
  price: string;
  per: "free" | "one_time";
  guests: string;
  storage: string;
  /** RevenueCat package lookup_key (offering "default") */
  rcPackage?: "celebration" | "premium" | "large" | "enterprise" | "super";
  /** RevenueCat product store identifier */
  rcProductId?: string;
  highlight?: boolean;
  free?: boolean;
}

const TIERS: Tier[] = [
  { id: "starter",     name: "Starter",          blurb: "Up to 5 guests",       price: "Free",      per: "free",     guests: "5 guests",       storage: "1 GB",       free: true },
  { id: "celebration", name: "Celebration",      blurb: "Up to 100 guests",     price: "$24.99",    per: "one_time", guests: "100 guests",     storage: "25 GB",      highlight: true, rcPackage: "celebration", rcProductId: "sherehe_celebration" },
  { id: "premium",     name: "Premium Event",    blurb: "Up to 250 guests",     price: "$89.99",    per: "one_time", guests: "250 guests",     storage: "75 GB",                       rcPackage: "premium",     rcProductId: "sherehe_premium" },
  { id: "large",       name: "Large Event",      blurb: "Up to 500 guests",     price: "$149.99",   per: "one_time", guests: "500 guests",     storage: "150 GB",                      rcPackage: "large",       rcProductId: "sherehe_large" },
  { id: "enterprise",  name: "Enterprise Event", blurb: "Up to 1,000 guests",   price: "$299.99",   per: "one_time", guests: "1,000 guests",   storage: "500 GB",                      rcPackage: "enterprise",  rcProductId: "sherehe_enterprise" },
  { id: "super",       name: "Super Event",      blurb: "Up to 2,000 guests",   price: "$499.99",   per: "one_time", guests: "2,000 guests",   storage: "Unlimited",                   rcPackage: "super",       rcProductId: "sherehe_super" },
];

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setProfile, profile, retentionDays } = useEvents();
  const { t } = useOnboarding();
  const [tier, setTier] = useState<TierId>("celebration");
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [restoring, setRestoring] = useState<boolean>(false);

  useEffect(() => {
    configurePurchases().catch(() => {});
  }, []);

  const selected = useMemo(() => TIERS.find((x) => x.id === tier), [tier]);

  // If the host is already on a paid plan, surface that and let them simply close.
  if (profile.premium) {
    return (
      <View style={ps.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient
          colors={["#1A0410", "#3D0A24", "#8B0030", "#0A0A0B"]}
          locations={[0, 0.3, 0.6, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
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
          <View style={ps.alreadyWrap}>
            <Sparkles color={C.gold} size={36} />
            <Text style={ps.alreadyTitle}>You're already Pro</Text>
            <Text style={ps.alreadySub}>
              All Pro features are unlocked on this account — premium templates, HD downloads, custom branding, RSVP analytics and AI tools.
            </Text>
            <PrimaryButton title={t("close")} onPress={() => router.back()} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const subscribe = async () => {
    if (!selected) return;
    if (selected.free) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      await setProfile({ premium: false });
      router.back();
      return;
    }
    if (!selected.rcPackage) return;

    setPurchasing(true);
    try {
      const result = await purchasePackageByKey(selected.rcPackage, selected.rcProductId);
      if (result.success) {
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        await setProfile({ premium: true });
        if (result.mocked && Platform.OS !== "web") {
          console.log("[paywall] mock unlock (Expo Go)");
        }
        router.back();
      } else if (result.error === "user_cancelled") {
        // silent — user backed out of the native sheet
      } else {
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        Alert.alert(t("paywall_purchase_failed_title"), t("paywall_purchase_failed_body"));
      }
    } finally {
      setPurchasing(false);
    }
  };

  const restore = async () => {
    setRestoring(true);
    try {
      const r = await restorePurchases();
      if (r.entitled) {
        await setProfile({ premium: true });
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        Alert.alert(t("paywall_restored_title"), t("paywall_restored_body"));
      } else if (r.mocked) {
        Alert.alert(t("paywall_restore_unavailable_title"), t("paywall_restore_unavailable_body"));
      } else {
        Alert.alert(t("paywall_no_purchases_title"), t("paywall_no_purchases_body"));
      }
    } finally {
      setRestoring(false);
    }
  };

  const ctaTitle = selected?.free
    ? t("paywall_cta_start_free", { name: selected.name })
    : t("paywall_cta_unlock", { name: selected?.name ?? "", price: selected?.price ?? "" });

  const perLabel = (per: Tier["per"]) =>
    per === "free" ? t("paywall_free_forever") : t("paywall_one_time");

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

        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
          <View style={ps.hero}>
            <Sparkles color={C.gold} size={30} />
            <Text style={ps.heroTitle}>{t("paywall_hero_title")}</Text>
            <Text style={ps.heroSub}>{t("paywall_hero_sub")}</Text>
          </View>

          {/* How pricing works */}
          <View style={ps.howCard}>
            <Text style={ps.howTitle}>{t("paywall_intro_title")}</Text>
            <Text style={ps.howBody}>{t("paywall_intro_p1")}</Text>
            <Text style={ps.howBody}>{t("paywall_intro_p2")}</Text>

            <View style={ps.howRow}>
              <View style={ps.howIcon}><Users color={C.pinkHi} size={14} /></View>
              <Text style={ps.howRowText}>{t("paywall_bullet_guests")}</Text>
            </View>
            <View style={ps.howRow}>
              <View style={ps.howIcon}><Sparkles color={C.gold} size={14} /></View>
              <Text style={ps.howRowText}>{t("paywall_bullet_features")}</Text>
            </View>
            <View style={ps.howRow}>
              <View style={ps.howIcon}><HardDrive color={C.success} size={14} /></View>
              <Text style={ps.howRowText}>{t("paywall_bullet_storage")}</Text>
            </View>
            <View style={ps.howRow}>
              <View style={ps.howIcon}><TagIcon color={C.text} size={14} /></View>
              <Text style={ps.howRowText}>{t("paywall_bullet_event")}</Text>
            </View>

            <View style={ps.retentionBadge}>
              <HardDrive color={C.subtext} size={12} />
              <Text style={ps.retentionText}>
                {t("paywall_storage_note", { days: retentionDays })}
              </Text>
            </View>
          </View>

          <Text style={ps.sectionLabel}>{t("paywall_select_tier")}</Text>

          <View style={{ gap: 12 }}>
            {TIERS.map((tr) => {
              const active = tier === tr.id;
              return (
                <Pressable
                  key={tr.id}
                  onPress={() => setTier(tr.id)}
                  style={[ps.tier, active ? ps.tierActive : null]}
                >
                  {tr.highlight ? (
                    <View style={ps.popular}>
                      <Text style={ps.popularText}>{t("paywall_most_popular")}</Text>
                    </View>
                  ) : null}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={ps.tierName}>{tr.name}</Text>
                    <Text style={ps.tierBlurb}>{tr.blurb}</Text>
                    <View style={{ flexDirection: "row", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      <View style={ps.tierTag}><Text style={ps.tierTagText}>{tr.guests}</Text></View>
                      <View style={ps.tierTag}><Text style={ps.tierTagText}>{tr.storage}</Text></View>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={[ps.tierPrice, tr.free ? { color: C.gold } : null]}>{tr.price}</Text>
                    <Text style={ps.tierPer}>{perLabel(tr.per)}</Text>
                    <View style={[ps.radio, active ? ps.radioOn : null]}>
                      {active ? <Check color={C.text} size={14} /> : null}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={ps.perks}>
            {[
              t("paywall_perk_templates"),
              t("paywall_perk_hd"),
              t("paywall_perk_brand"),
              t("paywall_perk_analytics"),
              t("paywall_perk_ai"),
              t("paywall_perk_priority"),
            ].map((p) => (
              <View key={p} style={ps.perkRow}>
                <View style={ps.perkCheck}>
                  <Check color={C.bg} size={12} />
                </View>
                <Text style={ps.perkText}>{p}</Text>
              </View>
            ))}
          </View>

          <Text style={ps.legal}>{t("paywall_legal")}</Text>
        </ScrollView>

        <View style={[ps.footer, { paddingBottom: 18 + Math.max(insets.bottom, 6) }]}>
          <PrimaryButton
            title={purchasing ? t("paywall_processing") : ctaTitle}
            icon={Crown}
            onPress={subscribe}
            disabled={purchasing || restoring}
          />
          <View style={ps.footerRow}>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={ps.maybe}>{t("paywall_maybe_later")}</Text>
            </Pressable>
            <Text style={ps.footerDot}>·</Text>
            <Pressable onPress={restore} hitSlop={8} disabled={restoring || purchasing}>
              {restoring ? (
                <ActivityIndicator color="rgba(255,255,255,0.7)" size="small" />
              ) : (
                <Text style={ps.maybe}>{t("paywall_restore")}</Text>
              )}
            </Pressable>
          </View>
          {!isPurchasesAvailable() ? (
            <Text style={ps.devNote}>{t("paywall_expo_go_note")}</Text>
          ) : null}
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
  hero: { alignItems: "center", gap: 10, marginTop: 8 },
  heroTitle: { color: C.text, fontSize: 32, fontWeight: "800" as const, letterSpacing: -0.7, textAlign: "center" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 14, textAlign: "center", lineHeight: 20, paddingHorizontal: 14 },

  howCard: {
    marginTop: 22,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 10,
  },
  howTitle: { color: C.text, fontSize: 16, fontWeight: "800" as const, letterSpacing: -0.2 },
  howBody: { color: "rgba(255,255,255,0.78)", fontSize: 13, lineHeight: 19 },
  howRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginTop: 4 },
  howIcon: {
    width: 24, height: 24, borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center", justifyContent: "center",
    marginTop: 1,
  },
  howRowText: { color: C.text, fontSize: 13, lineHeight: 18, flex: 1, fontWeight: "500" as const },
  retentionBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 10, paddingVertical: 8, marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 10,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  retentionText: { color: C.subtext, fontSize: 11, lineHeight: 15, flex: 1 },

  sectionLabel: { color: C.text, fontSize: 13, fontWeight: "800" as const, letterSpacing: 1.5, marginTop: 22, marginBottom: 10 },

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
  tierName: { color: C.text, fontSize: 18, fontWeight: "800" as const, letterSpacing: -0.3 },
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
  tierPrice: { color: C.text, fontSize: 20, fontWeight: "800" as const },
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
  footerRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 10 },
  footerDot: { color: "rgba(255,255,255,0.35)", fontSize: 13 },
  devNote: { color: "rgba(255,255,255,0.45)", fontSize: 10, textAlign: "center", marginTop: 8, lineHeight: 14, paddingHorizontal: 12 },

  alreadyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 },
  alreadyTitle: { color: C.text, fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.4, textAlign: "center" },
  alreadySub: { color: "rgba(255,255,255,0.8)", fontSize: 14, textAlign: "center", lineHeight: 21, marginBottom: 12 },
});

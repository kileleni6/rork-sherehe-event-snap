import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Bell, ChevronRight, Crown, HelpCircle, LogOut, Shield, Sparkles, Wand2 } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, GhostButton, PrimaryButton, Tag } from "@/components/ui";
import { C } from "@/constants/colors";
import { useEvents } from "@/providers/EventsProvider";

interface RowProps {
  icon: React.ReactNode;
  title: string;
  sub?: string;
  onPress?: () => void;
}
function Row({ icon, title, sub, onPress }: RowProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1 }]}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      <ChevronRight color={C.mute} size={18} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, events, setProfile } = useEvents();
  const totalPhotos = events.reduce((s, e) => s + e.photos.length, 0);
  const totalGuests = events.reduce((s, e) => s + e.rsvps.length, 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(255,45,122,0.3)", "transparent"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320 }}
      />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.headerCard}>
            <LinearGradient
              colors={[C.pinkHi, C.pink, C.pinkDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
            </LinearGradient>
            <Text style={styles.name}>{profile.name}</Text>
            {profile.premium ? <Tag label="✦ Pro member" tone="gold" /> : <Tag label="Free plan" tone="mute" />}

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{events.length}</Text>
                <Text style={styles.statLabel}>Events</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{totalGuests}</Text>
                <Text style={styles.statLabel}>RSVPs</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{totalPhotos}</Text>
                <Text style={styles.statLabel}>Photos</Text>
              </View>
            </View>
          </View>

          {!profile.premium ? (
            <Pressable
              onPress={() => router.push("/paywall")}
              style={({ pressed }) => [styles.upgrade, { opacity: pressed ? 0.92 : 1 }]}
            >
              <LinearGradient
                colors={["#3D0A24", "#8B0030", "#FF2D7A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <Crown color={C.gold} size={26} />
              <View style={{ flex: 1 }}>
                <Text style={styles.upgradeTitle}>Go Pro</Text>
                <Text style={styles.upgradeSub}>Premium templates, more guests, HD downloads</Text>
              </View>
              <ChevronRight color={C.text} size={22} />
            </Pressable>
          ) : null}

          <Card style={{ gap: 4, padding: 6 }}>
            <Row
              icon={<Wand2 color={C.pinkHi} size={18} />}
              title="AI invitation writer"
              sub="Generate poetic invite copy"
            />
            <Row icon={<Sparkles color={C.gold} size={18} />} title="Best moments" sub="Curated reels from each event" />
            <Row icon={<Bell color={C.text} size={18} />} title="Notifications" sub="RSVPs, reveals, reminders" />
            <Row icon={<Shield color={C.text} size={18} />} title="Privacy" sub="Private by default" />
            <Row icon={<HelpCircle color={C.text} size={18} />} title="Help & support" />
          </Card>

          <GhostButton
            title={profile.premium ? "Switch to Free (demo)" : "Activate Pro (demo)"}
            icon={LogOut}
            onPress={() => setProfile({ premium: !profile.premium })}
          />
          <PrimaryButton title="Manage events" onPress={() => router.push("/(tabs)" as never)} />
          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  headerCard: { alignItems: "center", gap: 10, paddingVertical: 18 },
  avatar: { width: 88, height: 88, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  avatarText: { color: C.text, fontSize: 34, fontWeight: "800" as const },
  name: { color: C.text, fontSize: 24, fontWeight: "800" as const, letterSpacing: -0.3 },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 6,
    backgroundColor: C.card,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.hair,
  },
  stat: { alignItems: "center", minWidth: 60 },
  statValue: { color: C.text, fontSize: 20, fontWeight: "800" as const },
  statLabel: { color: C.subtext, fontSize: 11, letterSpacing: 0.4, marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: C.hair },
  upgrade: {
    overflow: "hidden",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(244,201,123,0.3)",
  },
  upgradeTitle: { color: C.text, fontSize: 18, fontWeight: "800" as const },
  upgradeSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.cardHi,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { color: C.text, fontSize: 15, fontWeight: "600" as const },
  rowSub: { color: C.subtext, fontSize: 12, marginTop: 2 },
});

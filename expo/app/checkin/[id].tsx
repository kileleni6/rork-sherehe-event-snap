import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  ScanLine,
  Search,
  Undo2,
  Users,
  X,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { Card, GhostButton, SectionTitle, Tag } from "@/components/ui";
import { C } from "@/constants/colors";
import { useEvents } from "@/providers/EventsProvider";

export default function CheckInScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { findById, checkInGuest } = useEvents();
  const event = findById(id);

  const [query, setQuery] = useState<string>("");
  const [scanInput, setScanInput] = useState<string>("");
  const [lastChecked, setLastChecked] = useState<{ name: string; at: number } | null>(null);

  if (!event) {
    return (
      <View style={s.container}>
        <Text style={{ color: C.text, padding: 30 }}>Event not found.</Text>
      </View>
    );
  }

  const attending = event.rsvps.filter((r) => r.status !== "no");
  const arrived = attending.filter((r) => typeof r.checkedInAt === "number");
  const pending = attending.filter((r) => typeof r.checkedInAt !== "number");
  const expectedCount = attending.reduce((sum, r) => sum + 1 + (r.guests ?? 0), 0);

  const filteredPending = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pending;
    return pending.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.passCode.toLowerCase().includes(q)
    );
  }, [pending, query]);

  const checkIn = async (rsvpId: string, name: string) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    await checkInGuest(event.id, rsvpId, Date.now());
    setLastChecked({ name, at: Date.now() });
    setTimeout(() => setLastChecked(null), 2500);
  };

  const undo = async (rsvpId: string) => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    await checkInGuest(event.id, rsvpId, 0);
  };

  const submitScan = async () => {
    const raw = scanInput.trim();
    if (!raw) return;
    // Accepts either a raw passCode (e.g. "ZURI24") or the QR payload "SHEREHE:eventId:CODE"
    const code = raw.includes(":") ? raw.split(":").pop() ?? raw : raw;
    const match = event.rsvps.find(
      (r) => r.passCode.toUpperCase() === code.toUpperCase()
    );
    setScanInput("");
    if (!match) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      Alert.alert("Pass not found", `No guest matches code "${code}".`);
      return;
    }
    if (typeof match.checkedInAt === "number") {
      if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
      Alert.alert(
        "Already checked in",
        `${match.name} arrived at ${new Date(match.checkedInAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}.`
      );
      return;
    }
    await checkIn(match.id, match.name);
  };

  const arrivedPct = expectedCount > 0 ? (arrived.length / expectedCount) * 100 : 0;

  return (
    <View style={s.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={["rgba(255,45,122,0.18)", "transparent"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 240 }}
      />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View style={s.topBar}>
          <Pressable onPress={() => router.back()} style={s.iconBtn} hitSlop={10}>
            <ChevronLeft color={C.text} size={22} />
          </Pressable>
          <View style={{ alignItems: "center" }}>
            <Text style={s.topKicker}>CHECK IN</Text>
            <Text style={s.topTitle} numberOfLines={1}>{event.name}</Text>
          </View>
          <View style={s.iconBtn} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 40 + Math.max(insets.bottom, 8) }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Live counter */}
          <Card style={s.counterCard}>
            <View style={s.counterTop}>
              <View>
                <Text style={s.counterValue}>
                  {arrived.length}
                  <Text style={s.counterTotal}> / {expectedCount}</Text>
                </Text>
                <Text style={s.counterLabel}>Guests arrived</Text>
              </View>
              <View style={s.counterIcon}>
                <Users color={C.pinkHi} size={24} />
              </View>
            </View>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: `${arrivedPct}%` }]} />
            </View>
            <View style={s.counterMeta}>
              <View style={s.counterMetaItem}>
                <View style={[s.dot, { backgroundColor: C.success }]} />
                <Text style={s.counterMetaText}>{arrived.length} in</Text>
              </View>
              <View style={s.counterMetaItem}>
                <View style={[s.dot, { backgroundColor: C.gold }]} />
                <Text style={s.counterMetaText}>{pending.length} expected</Text>
              </View>
            </View>
          </Card>

          {/* Scan / paste code */}
          <SectionTitle style={{ marginTop: 22 }}>Scan a pass</SectionTitle>
          <Text style={s.helperText}>
            Type or paste the 6-character code from the guest's pass. On a real device you can also point the camera at their QR.
          </Text>
          <View style={s.scanCard}>
            <View style={s.scanIcon}>
              <ScanLine color={C.pinkHi} size={22} />
            </View>
            <TextInput
              placeholder="e.g. ZURI24"
              placeholderTextColor={C.mute}
              value={scanInput}
              onChangeText={(v) => setScanInput(v.toUpperCase().replace(/[^A-Z0-9:]/g, "").slice(0, 24))}
              autoCapitalize="characters"
              autoCorrect={false}
              onSubmitEditing={submitScan}
              returnKeyType="done"
              style={s.scanInput}
            />
            <Pressable
              onPress={submitScan}
              disabled={!scanInput.trim()}
              style={[s.scanBtn, { opacity: scanInput.trim() ? 1 : 0.4 }]}
            >
              <Text style={s.scanBtnText}>Check in</Text>
            </Pressable>
          </View>

          {lastChecked ? (
            <View style={s.toast}>
              <CheckCircle2 color={C.success} size={18} />
              <Text style={s.toastText}>
                {lastChecked.name} checked in at{" "}
                {new Date(lastChecked.at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
              </Text>
            </View>
          ) : null}

          {/* Search expected */}
          <SectionTitle style={{ marginTop: 22 }}>Not yet arrived</SectionTitle>
          <View style={s.searchRow}>
            <Search color={C.mute} size={16} />
            <TextInput
              placeholder="Search by name or code"
              placeholderTextColor={C.mute}
              value={query}
              onChangeText={setQuery}
              style={s.searchInput}
              autoCorrect={false}
            />
            {query ? (
              <Pressable onPress={() => setQuery("")} hitSlop={8}>
                <X color={C.mute} size={16} />
              </Pressable>
            ) : null}
          </View>

          <View style={{ gap: 8, marginTop: 12 }}>
            {filteredPending.map((r) => (
              <View key={r.id} style={s.guestRow}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{r.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.guestName}>{r.name}</Text>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 2, alignItems: "center" }}>
                    <Text style={s.passCode}>{r.passCode}</Text>
                    {r.guests > 0 ? (
                      <Text style={s.guestExtra}>+{r.guests} guest{r.guests === 1 ? "" : "s"}</Text>
                    ) : null}
                  </View>
                </View>
                <Pressable onPress={() => checkIn(r.id, r.name)} style={s.checkBtn}>
                  <CheckCircle2 color={C.text} size={16} />
                  <Text style={s.checkBtnText}>Check in</Text>
                </Pressable>
              </View>
            ))}
            {filteredPending.length === 0 ? (
              <View style={s.empty}>
                <CheckCircle2 color={C.success} size={22} />
                <Text style={s.emptyTitle}>
                  {pending.length === 0 ? "Everyone's here" : "No matches"}
                </Text>
                <Text style={s.emptySub}>
                  {pending.length === 0
                    ? "Every expected guest has been checked in."
                    : "Try a different name or code."}
                </Text>
              </View>
            ) : null}
          </View>

          {arrived.length > 0 ? (
            <>
              <SectionTitle style={{ marginTop: 24 }}>Arrivals</SectionTitle>
              <View style={{ gap: 8, marginTop: 8 }}>
                {[...arrived]
                  .sort((a, b) => (b.checkedInAt ?? 0) - (a.checkedInAt ?? 0))
                  .map((r) => (
                    <View key={r.id} style={[s.guestRow, { borderColor: "rgba(61,214,140,0.25)" }]}>
                      <View style={[s.avatar, { backgroundColor: "rgba(61,214,140,0.18)" }]}>
                        <CheckCircle2 color={C.success} size={16} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.guestName}>{r.name}</Text>
                        <View style={{ flexDirection: "row", gap: 6, marginTop: 2, alignItems: "center" }}>
                          <Clock color={C.subtext} size={11} />
                          <Text style={s.guestExtra}>
                            {new Date(r.checkedInAt ?? 0).toLocaleTimeString(undefined, {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </Text>
                          {r.guests > 0 ? <Tag label={`+${r.guests}`} tone="mute" /> : null}
                        </View>
                      </View>
                      <Pressable onPress={() => undo(r.id)} hitSlop={6} style={s.undoBtn}>
                        <Undo2 color={C.subtext} size={14} />
                      </Pressable>
                    </View>
                  ))}
              </View>
            </>
          ) : null}

          <GhostButton title="Done" onPress={() => router.back()} style={{ marginTop: 26 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 12, paddingVertical: 8,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  topKicker: { color: C.pinkHi, fontSize: 9, letterSpacing: 2, fontWeight: "800" as const },
  topTitle: { color: C.text, fontWeight: "700" as const, fontSize: 15, maxWidth: 220 },
  counterCard: { gap: 12 },
  counterTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  counterValue: { color: C.text, fontSize: 38, fontWeight: "800" as const, letterSpacing: -1, fontVariant: ["tabular-nums"] },
  counterTotal: { color: C.mute, fontSize: 22, fontWeight: "700" as const },
  counterLabel: { color: C.subtext, fontSize: 12, fontWeight: "600" as const, marginTop: 2 },
  counterIcon: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: "rgba(255,45,122,0.16)",
    alignItems: "center", justifyContent: "center",
  },
  progressBar: { height: 8, backgroundColor: C.cardHi, borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: C.pink },
  counterMeta: { flexDirection: "row", gap: 14 },
  counterMetaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  counterMetaText: { color: C.subtext, fontSize: 12, fontWeight: "600" as const },
  dot: { width: 8, height: 8, borderRadius: 999 },
  helperText: { color: C.subtext, fontSize: 12, lineHeight: 17, marginTop: 6, marginBottom: 12 },
  scanCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 8, paddingLeft: 14,
    backgroundColor: C.card, borderRadius: 16,
    borderWidth: 1, borderColor: C.hair,
  },
  scanIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,45,122,0.16)",
    alignItems: "center", justifyContent: "center",
  },
  scanInput: {
    flex: 1, color: C.text, fontSize: 16, fontWeight: "700" as const,
    letterSpacing: 2, paddingVertical: 8,
  },
  scanBtn: {
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12,
    backgroundColor: C.pink,
  },
  scanBtnText: { color: C.text, fontWeight: "800" as const, fontSize: 13 },
  toast: {
    marginTop: 12, flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: "rgba(61,214,140,0.12)", borderRadius: 14,
    borderWidth: 1, borderColor: "rgba(61,214,140,0.3)",
  },
  toastText: { color: C.text, fontSize: 13, fontWeight: "600" as const, flex: 1 },
  searchRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: C.card, borderRadius: 14,
    borderWidth: 1, borderColor: C.hair, marginTop: 8,
  },
  searchInput: { flex: 1, color: C.text, fontSize: 14, paddingVertical: 2 },
  guestRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 12, borderRadius: 16,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.hair,
  },
  avatar: {
    width: 38, height: 38, borderRadius: 999,
    backgroundColor: C.cardHi,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: C.text, fontWeight: "800" as const, fontSize: 14 },
  guestName: { color: C.text, fontSize: 14, fontWeight: "700" as const },
  passCode: { color: C.pinkHi, fontSize: 11, fontWeight: "800" as const, letterSpacing: 2 },
  guestExtra: { color: C.subtext, fontSize: 11, fontWeight: "600" as const },
  checkBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999, backgroundColor: C.pink,
  },
  checkBtnText: { color: C.text, fontSize: 12, fontWeight: "800" as const },
  undoBtn: {
    width: 32, height: 32, borderRadius: 999,
    backgroundColor: C.cardHi,
    alignItems: "center", justifyContent: "center",
  },
  empty: {
    alignItems: "center", gap: 6, paddingVertical: 28,
    backgroundColor: C.card, borderRadius: 18,
    borderWidth: 1, borderStyle: "dashed", borderColor: C.hair,
  },
  emptyTitle: { color: C.text, fontWeight: "700" as const, fontSize: 14, marginTop: 4 },
  emptySub: { color: C.subtext, fontSize: 12, textAlign: "center", paddingHorizontal: 18 },
});

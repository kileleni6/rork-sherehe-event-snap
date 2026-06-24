import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertTriangle,
  ChevronLeft,
  Download,
  Flag,
  Lock,
  MoreHorizontal,
  Share2,
  Sparkles,
  Unlock,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, GhostButton, PrimaryButton, SectionTitle, Tag } from "@/components/ui";
import { C } from "@/constants/colors";
import { updateSupabasePhoto } from "@/lib/supabase";
import { useEvents } from "@/providers/EventsProvider";
import { useOnboarding } from "@/providers/OnboardingProvider";
import type { Photo } from "@/types/event";

const { width: SCREEN_W } = Dimensions.get("window");
const GAP = 6;
const COLS = 3;
const TILE = (SCREEN_W - 32 - GAP * (COLS - 1)) / COLS;

function CountdownTimer({ target, labels }: { target: number; labels: { d: string; h: string; m: string; s: string } }) {
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const day = 24 * 3600 * 1000;
  const d = Math.floor(diff / day);
  const h = Math.floor((diff % day) / (3600 * 1000));
  const m = Math.floor((diff % (3600 * 1000)) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  return (
    <View style={cs.cdRow}>
      <CdBlock label={labels.d} value={d} />
      <CdBlock label={labels.h} value={h} />
      <CdBlock label={labels.m} value={m} />
      <CdBlock label={labels.s} value={sec} />
    </View>
  );
}

function CdBlock({ label, value }: { label: string; value: number }) {
  return (
    <View style={cs.cdBlock}>
      <Text style={cs.cdValue}>{String(value).padStart(2, "0")}</Text>
      <Text style={cs.cdLabel}>{label}</Text>
    </View>
  );
}

export default function GalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { findById, unlockGallery, removePhoto, updateEvent } = useEvents();
  const { t, formatDateTime } = useOnboarding();
  const event = findById(id);
  const [viewing, setViewing] = useState<Photo | null>(null);
  const [fade] = useState<Animated.Value>(new Animated.Value(0));
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [reportPhoto, setReportPhoto] = useState<Photo | null>(null);
  const [reportReason, setReportReason] = useState<string>("");
  const [reporting, setReporting] = useState<boolean>(false);

  const sorted = useMemo(() => (event ? [...event.photos].sort((a, b) => b.takenAt - a.takenAt) : []), [event]);

  const handleUnlock = useCallback(async () => {
    if (!event) return;
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await unlockGallery(event.id);
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [event, unlockGallery, fade]);

  // UGC: Report a photo
  const handleReport = useCallback((photo: Photo) => {
    setReportPhoto(photo);
    setReportReason("");
    setReportOpen(true);
  }, []);

  const submitReport = useCallback(async () => {
    if (!reportPhoto || !reportReason.trim()) return;
    setReporting(true);

    try {
      // Flag the photo in the database
      await updateSupabasePhoto(reportPhoto.id, { flagged: true } as Partial<Photo>);

      // Also flag locally
      await updateEvent(event!.id, {
        photos: event!.photos.map((p) =>
          p.id === reportPhoto.id ? { ...p, flagged: true } : p
        ),
      });

      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

      Alert.alert(
        "Reported",
        "Thank you for helping keep SHEREHE safe. This photo has been flagged for review. The event host will be notified.",
        [{ text: "OK" }]
      );
    } catch (e) {
      console.log("[gallery] report failed", e);
      Alert.alert("Error", "Could not submit the report right now. Please try again.");
    } finally {
      setReporting(false);
      setReportOpen(false);
      setReportPhoto(null);
    }
  }, [reportPhoto, reportReason, event, updateEvent]);

  if (!event) {
    return (
      <View style={cs.container}>
        <Text style={{ color: C.text, padding: 30 }}>{t("gallery_event_not_found")}</Text>
      </View>
    );
  }

  const unlocked = event.revealAt <= Date.now();

  return (
    <View style={cs.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View style={cs.topBar}>
          <Pressable onPress={() => router.back()} style={cs.iconBtn} hitSlop={10}>
            <ChevronLeft color={C.text} size={22} />
          </Pressable>
          <Text style={cs.topTitle} numberOfLines={1}>{event.name}</Text>
          <Pressable style={cs.iconBtn} hitSlop={10}>
            <MoreHorizontal color={C.text} size={20} />
          </Pressable>
        </View>

        {!unlocked ? (
          <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
            <View style={cs.lockHero}>
              <LinearGradient
                colors={["#1A0410", "#3D0A24", "#8B0030"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={cs.lockShield}>
                <Lock color={C.text} size={42} />
              </View>
              <Text style={cs.lockKicker}>{t("gallery_sealed_kicker")}</Text>
              <Text style={cs.lockTitle}>{t("gallery_reveal_coming")}</Text>
              <Text style={cs.lockSub}>
                {event.photos.length === 1
                  ? t("gallery_reveal_sub_one", { n: event.photos.length })
                  : t("gallery_reveal_sub_many", { n: event.photos.length })}
              </Text>

              <CountdownTimer
                target={event.revealAt}
                labels={{ d: t("gallery_days"), h: t("gallery_hrs"), m: t("gallery_min"), s: t("gallery_sec") }}
              />
            </View>

            <Card style={{ marginTop: 18, gap: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Sparkles color={C.gold} size={20} />
                <Text style={cs.aiText}>{t("gallery_host_unlock_note")}</Text>
              </View>
              <PrimaryButton title={t("gallery_unlock_now")} icon={Unlock} onPress={handleUnlock} />
              <GhostButton title={t("gallery_back_event")} onPress={() => router.back()} />
            </Card>

            <SectionTitle style={{ marginTop: 22 }}>{t("gallery_whats_inside")}</SectionTitle>
            <View style={cs.previewRow}>
              {sorted.slice(0, 4).map((p) => (
                <View key={p.id} style={cs.previewTile}>
                  <Image
                    source={{ uri: p.uri }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    blurRadius={28}
                  />
                  <View style={cs.previewLock}>
                    <Lock color={C.text} size={16} />
                  </View>
                </View>
              ))}
            </View>

            {/* Content guidelines notice */}
            <Card style={{ marginTop: 20, gap: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <AlertTriangle color={C.gold} size={16} />
                <Text style={{ color: C.text, fontWeight: "700" as const, fontSize: 13 }}>Community Guidelines</Text>
              </View>
              <Text style={{ color: C.subtext, fontSize: 12, lineHeight: 17 }}>
                SHEREHE galleries are shared spaces. Photos that contain nudity, violence, hate speech, or harassment will be removed. If you see something inappropriate, tap and hold any photo to report it.
              </Text>
            </Card>
          </ScrollView>
        ) : (
          <>
            <View style={cs.unlockedHeader}>
              <View>
                <Tag label={t("gallery_unlocked_tag")} tone="success" />
                <Text style={cs.unlockedTitle}>
                  {t("gallery_memories_count", { n: sorted.length })}
                </Text>
                <Text style={cs.unlockedSub}>{t("gallery_hint")}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable style={cs.iconBtn}>
                  <Download color={C.text} size={18} />
                </Pressable>
                <Pressable style={cs.iconBtn}>
                  <Share2 color={C.text} size={18} />
                </Pressable>
              </View>
            </View>

            <FlatList
              data={sorted}
              keyExtractor={(p) => p.id}
              numColumns={COLS}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, gap: GAP }}
              columnWrapperStyle={{ gap: GAP }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setViewing(item)}
                  onLongPress={() => {
                    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                    Alert.alert(
                      "Photo options",
                      "What would you like to do?",
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Report photo", style: "destructive", onPress: () => handleReport(item) },
                        { text: "Remove (host only)", style: "destructive", onPress: () => removePhoto(event.id, item.id) },
                      ]
                    );
                  }}
                  style={{ width: TILE, height: TILE, borderRadius: 12, overflow: "hidden", backgroundColor: C.card }}
                >
                  <Image source={{ uri: item.uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                  {item.flagged ? (
                    <View style={cs.flaggedBadge}>
                      <Flag color={C.text} size={10} />
                    </View>
                  ) : null}
                </Pressable>
              )}
              ListEmptyComponent={
                <Card style={{ alignItems: "center", paddingVertical: 40, marginTop: 20 }}>
                  <Text style={{ color: C.subtext }}>{t("gallery_empty")}</Text>
                </Card>
              }
            />
          </>
        )}
      </SafeAreaView>

      {/* Photo viewer */}
      <Modal visible={!!viewing} transparent animationType="fade" onRequestClose={() => setViewing(null)}>
        <View style={cs.viewerBg}>
          <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
            <View style={cs.viewerHeader}>
              <Pressable onPress={() => setViewing(null)} style={cs.iconBtn}>
                <X color={C.text} size={20} />
              </Pressable>
              <Text style={cs.viewerName}>{viewing?.guestName ?? ""}</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  style={[cs.iconBtn, { borderColor: "rgba(255,86,86,0.4)" }]}
                  onPress={() => {
                    if (viewing) {
                      setViewing(null);
                      setTimeout(() => handleReport(viewing), 300);
                    }
                  }}
                >
                  <Flag color={C.danger} size={16} />
                </Pressable>
              </View>
            </View>
            {viewing ? (
              <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
                <Image
                  source={{ uri: viewing.uri }}
                  style={{ width: "100%", aspectRatio: 0.75, borderRadius: 16 }}
                  contentFit="cover"
                />
                {viewing.flagged ? (
                  <View style={cs.flaggedNotice}>
                    <Flag color={C.gold} size={14} />
                    <Text style={cs.flaggedText}>This photo has been flagged for review</Text>
                  </View>
                ) : null}
                <Text style={cs.viewerMeta}>
                  {t("gallery_captured_at", { date: formatDateTime(viewing.takenAt) })}
                </Text>
              </View>
            ) : null}
          </SafeAreaView>
        </View>
      </Modal>

      {/* Report modal */}
      <Modal visible={reportOpen} transparent animationType="slide" onRequestClose={() => setReportOpen(false)}>
        <View style={cs.modalBackdrop}>
          <View style={cs.reportSheet}>
            <View style={cs.reportHeader}>
              <Text style={cs.reportTitle}>Report photo</Text>
              <Pressable onPress={() => { setReportOpen(false); setReportPhoto(null); }} style={cs.iconBtn}>
                <X color={C.text} size={18} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
              <View style={cs.reportWarn}>
                <AlertTriangle color={C.gold} size={18} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: "700" as const, fontSize: 13 }}>Why are you reporting this?</Text>
                  <Text style={{ color: C.subtext, fontSize: 12, marginTop: 2 }}>
                    Reports are reviewed within 24 hours. The event host is notified automatically.
                  </Text>
                </View>
              </View>

              {[
                { id: "nudity", label: "Nudity or sexual content" },
                { id: "violence", label: "Violence or graphic content" },
                { id: "harassment", label: "Harassment or bullying" },
                { id: "hate", label: "Hate speech or discrimination" },
                { id: "spam", label: "Spam or unwanted content" },
                { id: "other", label: "Something else" },
              ].map((reason) => (
                <Pressable
                  key={reason.id}
                  onPress={() => setReportReason(reason.id === reportReason ? "" : reason.id)}
                  style={[
                    cs.reportOption,
                    reportReason === reason.id ? cs.reportOptionActive : null,
                  ]}
                >
                  <Text style={cs.reportOptionText}>{reason.label}</Text>
                  <View style={[
                    cs.reportRadio,
                    reportReason === reason.id ? cs.reportRadioActive : null,
                  ]}>
                    {reportReason === reason.id ? <View style={cs.reportRadioDot} /> : null}
                  </View>
                </Pressable>
              ))}

              <TextInput
                value={reportReason === "other" ? reportReason : ""}
                onChangeText={(t) => setReportReason("other")}
                placeholder="Add more details (optional)..."
                placeholderTextColor={C.mute}
                multiline
                style={cs.reportInput}
              />

              <Pressable
                onPress={submitReport}
                disabled={!reportReason || reporting}
                style={[cs.reportSubmit, (!reportReason || reporting) ? { opacity: 0.4 } : null]}
              >
                <Flag color={C.text} size={16} />
                <Text style={cs.reportSubmitText}>
                  {reporting ? "Submitting..." : "Submit report"}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const cs = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.hair,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { color: C.text, fontWeight: "700" as const, fontSize: 16, flex: 1, textAlign: "center", marginHorizontal: 8 },
  lockHero: {
    overflow: "hidden",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(244,201,123,0.25)",
  },
  lockShield: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    marginBottom: 8,
  },
  lockKicker: { color: C.gold, letterSpacing: 3, fontWeight: "800" as const, fontSize: 11 },
  lockTitle: { color: C.text, fontSize: 28, fontWeight: "800" as const, letterSpacing: -0.5, textAlign: "center" },
  lockSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, textAlign: "center", lineHeight: 19, paddingHorizontal: 12 },
  cdRow: { flexDirection: "row", gap: 8, marginTop: 16 },
  cdBlock: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    minWidth: 64,
  },
  cdValue: { color: C.text, fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.5 },
  cdLabel: { color: "rgba(255,255,255,0.65)", fontSize: 9, fontWeight: "700" as const, letterSpacing: 1.5, marginTop: 2 },
  aiText: { color: C.subtext, flex: 1, fontSize: 13, lineHeight: 18 },
  previewRow: { marginTop: 14, flexDirection: "row", gap: 8 },
  previewTile: { flex: 1, aspectRatio: 0.85, borderRadius: 12, overflow: "hidden", backgroundColor: C.cardHi },
  previewLock: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  unlockedHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginVertical: 12 },
  unlockedTitle: { color: C.text, fontSize: 24, fontWeight: "800" as const, marginTop: 6, letterSpacing: -0.4 },
  unlockedSub: { color: C.subtext, fontSize: 12, marginTop: 2 },
  viewerBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)" },
  viewerHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 8 },
  viewerName: { color: C.text, fontWeight: "700" as const },
  viewerMeta: { color: C.subtext, fontSize: 12, marginTop: 16, textAlign: "center" },

  // UGC Moderation
  flaggedBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: C.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  flaggedNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    padding: 10,
    backgroundColor: "rgba(244,201,123,0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(244,201,123,0.2)",
  },
  flaggedText: { color: C.gold, fontSize: 12, fontWeight: "600" as const },

  // Report modal
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  reportSheet: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: C.hair,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  reportTitle: { color: C.text, fontSize: 18, fontWeight: "800" as const, letterSpacing: -0.3 },
  reportWarn: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(244,201,123,0.08)",
    borderWidth: 1,
    borderColor: "rgba(244,201,123,0.15)",
  },
  reportOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.hair,
  },
  reportOptionActive: { borderColor: C.pink, backgroundColor: "rgba(255,45,122,0.08)" },
  reportOptionText: { color: C.text, fontSize: 14, fontWeight: "600" as const },
  reportRadio: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: C.hair,
    alignItems: "center",
    justifyContent: "center",
  },
  reportRadioActive: { borderColor: C.pink },
  reportRadioDot: { width: 12, height: 12, borderRadius: 999, backgroundColor: C.pink },
  reportInput: {
    backgroundColor: C.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: C.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: C.hair,
    minHeight: 80,
    textAlignVertical: "top" as const,
  },
  reportSubmit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    backgroundColor: C.danger,
    borderRadius: 14,
  },
  reportSubmitText: { color: C.text, fontSize: 15, fontWeight: "800" as const, letterSpacing: 0.3 },
});

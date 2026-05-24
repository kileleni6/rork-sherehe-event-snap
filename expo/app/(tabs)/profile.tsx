import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Bell,
  Check,
  ChevronRight,
  Crown,
  Globe,
  HelpCircle,
  LogOut,
  RotateCcw,
  Shield,
  Sparkles,
  Wand2,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, GhostButton, PrimaryButton, Tag } from "@/components/ui";
import { C } from "@/constants/colors";
import { LANGUAGES, type LangCode } from "@/lib/i18n";
import { useEvents } from "@/providers/EventsProvider";
import { useOnboarding } from "@/providers/OnboardingProvider";

interface RowProps {
  icon: React.ReactNode;
  title: string;
  sub?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
}
function Row({ icon, title, sub, trailing, onPress }: RowProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1 }]}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      {trailing ?? <ChevronRight color={C.mute} size={18} />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, events, setProfile } = useEvents();
  const { language, update, reset, t, notificationsEnabled } = useOnboarding();
  const [langOpen, setLangOpen] = useState<boolean>(false);

  const totalPhotos = events.reduce((s, e) => s + e.photos.length, 0);
  const totalGuests = events.reduce((s, e) => s + e.rsvps.length, 0);
  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  const handleAiWriter = () => {
    if (events[0]) {
      router.push(`/event/${events[0].id}` as never);
    } else {
      Alert.alert(
        "AI invitation writer",
        "Create an event first — you'll see the AI write button on the message field."
      );
    }
  };

  const handleBestMoments = () => {
    if (events[0]) {
      router.push(`/gallery/${events[0].id}` as never);
    } else {
      Alert.alert("Best moments", "Capture photos at your first event to unlock curated reels.");
    }
  };

  const handleNotifications = () => {
    Alert.alert(
      t("profile_notifications"),
      notificationsEnabled
        ? "Notifications are enabled. Manage them from your device settings."
        : "Notifications are off. Open device settings to enable them.",
      [
        { text: "Cancel", style: "cancel" },
        ...(Platform.OS !== "web"
          ? [{ text: "Open settings", onPress: () => Linking.openSettings().catch(() => {}) }]
          : []),
      ]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      "Privacy",
      "All events are private by default. Guest lists, photos and RSVPs never leave your event."
    );
  };

  const handleHelp = () => {
    Alert.alert("Help & support", "Need a hand? Email hello@sherehe.app and we'll get back fast.", [
      { text: "Close", style: "cancel" },
      {
        text: "Email us",
        onPress: () => Linking.openURL("mailto:hello@sherehe.app").catch(() => {}),
      },
    ]);
  };

  const handleRestart = () => {
    Alert.alert(
      t("profile_restart"),
      "This will sign you out of the local profile and show the welcome screens again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restart",
          style: "destructive",
          onPress: async () => {
            await reset();
            router.replace("/onboarding" as never);
          },
        },
      ]
    );
  };

  const chooseLang = async (code: LangCode) => {
    await update({ language: code });
    setLangOpen(false);
  };

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
            {profile.premium ? (
              <Tag label={t("profile_pro")} tone="gold" />
            ) : (
              <Tag label={t("profile_free")} tone="mute" />
            )}

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{events.length}</Text>
                <Text style={styles.statLabel}>{t("profile_events")}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{totalGuests}</Text>
                <Text style={styles.statLabel}>{t("profile_rsvps")}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{totalPhotos}</Text>
                <Text style={styles.statLabel}>{t("profile_photos")}</Text>
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
                <Text style={styles.upgradeTitle}>{t("profile_go_pro")}</Text>
                <Text style={styles.upgradeSub}>{t("profile_go_pro_sub")}</Text>
              </View>
              <ChevronRight color={C.text} size={22} />
            </Pressable>
          ) : null}

          <Card style={{ gap: 4, padding: 6 }}>
            <Row
              icon={<Wand2 color={C.pinkHi} size={18} />}
              title={t("profile_ai_writer")}
              sub={t("profile_ai_writer_sub")}
              onPress={handleAiWriter}
            />
            <Row
              icon={<Sparkles color={C.gold} size={18} />}
              title={t("profile_best_moments")}
              sub={t("profile_best_moments_sub")}
              onPress={handleBestMoments}
            />
            <Row
              icon={<Globe color={C.text} size={18} />}
              title={t("profile_language")}
              sub={`${currentLang.flag}  ${currentLang.native}`}
              onPress={() => setLangOpen(true)}
            />
            <Row
              icon={<Bell color={C.text} size={18} />}
              title={t("profile_notifications")}
              sub={t("profile_notifications_sub")}
              onPress={handleNotifications}
            />
            <Row
              icon={<Shield color={C.text} size={18} />}
              title={t("profile_privacy")}
              sub={t("profile_privacy_sub")}
              onPress={handlePrivacy}
            />
            <Row
              icon={<HelpCircle color={C.text} size={18} />}
              title={t("profile_help")}
              onPress={handleHelp}
            />
            <Row
              icon={<RotateCcw color={C.subtext} size={18} />}
              title={t("profile_restart")}
              onPress={handleRestart}
            />
          </Card>

          <GhostButton
            title={profile.premium ? t("profile_pro_toggle_on") : t("profile_pro_toggle_off")}
            icon={LogOut}
            onPress={() => setProfile({ premium: !profile.premium })}
          />
          <PrimaryButton title={t("profile_manage")} onPress={() => router.push("/(tabs)" as never)} />
          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>

      <Modal visible={langOpen} animationType="slide" transparent onRequestClose={() => setLangOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("profile_language")}</Text>
              <Pressable onPress={() => setLangOpen(false)} hitSlop={8} style={styles.closeBtn}>
                <X color={C.text} size={18} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 40 }}>
              {LANGUAGES.map((l) => {
                const active = l.code === language;
                return (
                  <Pressable
                    key={l.code}
                    onPress={() => chooseLang(l.code)}
                    style={[styles.langRow, active ? styles.langRowActive : null]}
                  >
                    <Text style={{ fontSize: 24 }}>{l.flag}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.langNative}>{l.native}</Text>
                      <Text style={styles.langName}>{l.name}</Text>
                    </View>
                    {active ? (
                      <View style={styles.langCheck}>
                        <Check color={C.text} size={14} />
                      </View>
                    ) : (
                      <View style={styles.langCheckEmpty} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: C.hair,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  modalTitle: { color: C.text, fontSize: 18, fontWeight: "800" as const, letterSpacing: -0.3 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.hair,
  },
  langRowActive: { borderColor: C.pink, backgroundColor: "rgba(255,45,122,0.08)" },
  langNative: { color: C.text, fontWeight: "700" as const, fontSize: 15 },
  langName: { color: C.mute, fontSize: 12, marginTop: 2 },
  langCheck: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: C.pink,
    alignItems: "center",
    justifyContent: "center",
  },
  langCheckEmpty: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: C.hair,
  },
});

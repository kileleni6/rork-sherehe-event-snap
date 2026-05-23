import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Check, ChevronLeft, Copy, Link as LinkIcon, Mail, MessageCircle, Share2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InvitationCard } from "@/components/InvitationCard";
import { Card, Chip, GhostButton, PrimaryButton, SectionTitle } from "@/components/ui";
import { C } from "@/constants/colors";
import { getTemplate, useEvents } from "@/providers/EventsProvider";
import type { RsvpStatus } from "@/types/event";

export default function InviteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { findById, addRsvp } = useEvents();
  const event = findById(id);
  const [name, setName] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [status, setStatus] = useState<RsvpStatus>("yes");
  const [note, setNote] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const tpl = useMemo(() => (event ? getTemplate(event.template) : undefined), [event]);

  if (!event || !tpl) {
    return (
      <View style={s.container}>
        <Text style={{ color: C.text, padding: 30 }}>Invitation not found.</Text>
      </View>
    );
  }

  const url = `https://sherehe.app/i/${event.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&color=FFFFFF&bgcolor=14141A&qzone=1&data=${encodeURIComponent(url)}`;

  const submit = async () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await addRsvp(event.id, {
      name: name || "Guest",
      status,
      guests: status === "yes" ? guests : 0,
      note: note || undefined,
    });
    setSubmitted(true);
  };

  const share = async (target: "share" | "copy") => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    if (target === "share") {
      try {
        await Share.share({ message: `You're invited to ${event.name}! ${url}` });
      } catch {}
    }
  };

  return (
    <View style={s.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={[tpl.bg[0], "transparent"]} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320 }} />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View style={s.topBar}>
          <Pressable onPress={() => router.back()} style={s.headerBtn} hitSlop={10}>
            <ChevronLeft color={C.text} size={22} />
          </Pressable>
          <Text style={s.topTitle}>Invitation</Text>
          <Pressable onPress={() => share("share")} style={s.headerBtn} hitSlop={10}>
            <Share2 color={C.text} size={18} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
          <InvitationCard event={event} template={tpl} />

          <SectionTitle style={{ marginTop: 28 }}>Share the moment</SectionTitle>
          <Text style={s.muteSub}>Guests can RSVP without installing the app.</Text>

          <Card style={{ marginTop: 14, alignItems: "center", gap: 14, paddingVertical: 22 }}>
            <View style={s.qrFrame}>
              <Image source={{ uri: qrUrl }} style={{ width: "100%", height: "100%" }} contentFit="contain" />
            </View>
            <View style={s.urlPill}>
              <LinkIcon color={C.subtext} size={14} />
              <Text style={s.urlText} numberOfLines={1}>{url}</Text>
              <Pressable onPress={() => share("copy")} hitSlop={8}>
                <Copy color={C.pinkHi} size={16} />
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <Chip label="WhatsApp" icon="💬" onPress={() => share("share")} />
              <Chip label="SMS" icon="💌" onPress={() => share("share")} />
              <Chip label="Email" icon="📧" onPress={() => share("share")} />
              <Chip label="More" icon="↗" onPress={() => share("share")} />
            </View>
          </Card>

          <SectionTitle style={{ marginTop: 28 }}>RSVP preview</SectionTitle>
          <Text style={s.muteSub}>This is exactly what your guests see.</Text>

          {submitted ? (
            <Card style={{ alignItems: "center", padding: 24, gap: 8, marginTop: 14 }}>
              <View style={s.successCircle}>
                <Check color={C.text} size={28} />
              </View>
              <Text style={s.successTitle}>You're on the list ✦</Text>
              <Text style={s.successSub}>We've added your RSVP. The disposable camera unlocks at the event.</Text>
              <GhostButton title="Add another response" onPress={() => setSubmitted(false)} style={{ marginTop: 10 }} />
            </Card>
          ) : (
            <Card style={{ gap: 12, marginTop: 14 }}>
              <Text style={s.label}>Your name</Text>
              <TextInput
                placeholder="e.g. Imani"
                placeholderTextColor={C.mute}
                value={name}
                onChangeText={setName}
                style={s.input}
              />

              <Text style={s.label}>Will you attend?</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {(["yes", "maybe", "no"] as const).map((st) => (
                  <Pressable
                    key={st}
                    onPress={() => setStatus(st)}
                    style={[s.statusBtn, status === st ? s.statusBtnActive : null]}
                  >
                    <Text style={[s.statusText, status === st ? { color: C.text } : null]}>
                      {st === "yes" ? "Going" : st === "maybe" ? "Maybe" : "Can't"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {status === "yes" ? (
                <>
                  <Text style={s.label}>How many of you?</Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {[1, 2, 3, 4].map((g) => (
                      <Pressable
                        key={g}
                        onPress={() => setGuests(g)}
                        style={[s.guestPill, guests === g ? s.guestPillActive : null]}
                      >
                        <Text style={[s.guestPillText, guests === g ? { color: C.text } : null]}>+{g}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              ) : null}

              <Text style={s.label}>Note to host (optional)</Text>
              <TextInput
                placeholder="Bringing dancing shoes…"
                placeholderTextColor={C.mute}
                value={note}
                onChangeText={setNote}
                style={[s.input, { height: 80, textAlignVertical: "top" }]}
                multiline
              />

              <PrimaryButton title="Submit RSVP" onPress={submit} style={{ marginTop: 8 }} />
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>

      <View style={s.footer}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <GhostButton title="Copy link" icon={Copy} onPress={() => share("copy")} style={{ flex: 1 }} />
          <PrimaryButton title="Share" icon={MessageCircle} onPress={() => share("share")} style={{ flex: 1.2 }} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 8 },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { color: C.text, fontWeight: "700" as const, fontSize: 16 },
  muteSub: { color: C.subtext, fontSize: 13, marginTop: 6 },
  qrFrame: {
    width: 220,
    height: 220,
    backgroundColor: C.bgElev,
    borderRadius: 24,
    overflow: "hidden",
    padding: 14,
    borderWidth: 1,
    borderColor: C.hair,
  },
  urlPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: C.cardHi,
    borderRadius: 999,
    maxWidth: "100%",
  },
  urlText: { color: C.text, fontSize: 13, fontWeight: "500" as const, maxWidth: 180 },
  label: { color: C.subtext, fontSize: 12, fontWeight: "600" as const, marginTop: 4, letterSpacing: 0.3 },
  input: {
    backgroundColor: C.cardHi,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: C.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: C.hair,
  },
  statusBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: C.cardHi, alignItems: "center", borderWidth: 1, borderColor: C.hair },
  statusBtnActive: { backgroundColor: C.pink, borderColor: C.pink },
  statusText: { color: C.subtext, fontWeight: "700" as const },
  guestPill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: C.cardHi, borderWidth: 1, borderColor: C.hair, minWidth: 54, alignItems: "center" },
  guestPillActive: { backgroundColor: C.pink, borderColor: C.pink },
  guestPillText: { color: C.subtext, fontWeight: "700" as const },
  successCircle: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: C.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  successTitle: { color: C.text, fontSize: 18, fontWeight: "800" as const },
  successSub: { color: C.subtext, fontSize: 13, textAlign: "center", lineHeight: 19, paddingHorizontal: 12 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(10,10,11,0.92)",
    borderTopWidth: 1,
    borderTopColor: C.hair,
  },
});

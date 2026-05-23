import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Images, Lock, Unlock } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { C } from "@/constants/colors";
import { useEvents } from "@/providers/EventsProvider";
import type { Event } from "@/types/event";

function GalleryTile({ event, onPress }: { event: Event; onPress: () => void }) {
  const unlocked = event.revealAt <= Date.now();
  const preview = event.photos.slice(0, 4);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, { transform: [{ scale: pressed ? 0.99 : 1 }] }]}
    >
      <View style={styles.mosaic}>
        {preview.length === 0 ? (
          <View style={styles.mosaicEmpty}>
            <Images color={C.mute} size={28} />
          </View>
        ) : (
          preview.map((p, i) => (
            <View key={p.id} style={[styles.mosaicCell, mosaicLayout(i, preview.length)]}>
              <Image source={{ uri: p.uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            </View>
          ))
        )}
        {!unlocked ? (
          <View style={styles.lockOverlay}>
            <LinearGradient colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.85)"]} style={StyleSheet.absoluteFillObject as never} />
            <Lock color={C.text} size={28} />
            <Text style={styles.lockText}>Reveals {new Date(event.revealAt).toLocaleDateString()}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.tileBody}>
        <Text style={styles.tileTitle} numberOfLines={1}>
          {event.name}
        </Text>
        <View style={styles.tileMeta}>
          {unlocked ? (
            <Unlock color={C.success} size={12} />
          ) : (
            <Lock color={C.subtext} size={12} />
          )}
          <Text style={styles.tileMetaText}>
            {event.photos.length} photos · {unlocked ? "Open" : "Locked"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function mosaicLayout(i: number, total: number) {
  if (total === 1) return { width: "100%" as const, height: "100%" as const };
  if (total === 2) return { width: "50%" as const, height: "100%" as const };
  if (total === 3) return i === 0 ? { width: "100%" as const, height: "50%" as const } : { width: "50%" as const, height: "50%" as const };
  return { width: "50%" as const, height: "50%" as const };
}

export default function GalleryTabScreen() {
  const { upcoming } = useEvents();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>SHARED MEMORIES</Text>
          <Text style={styles.title}>Galleries</Text>
          <Text style={styles.sub}>Locked until reveal. Then everyone sees the night, together.</Text>

          <View style={styles.grid}>
            {upcoming.map((e) => (
              <GalleryTile key={e.id} event={e} onPress={() => router.push(`/gallery/${e.id}` as never)} />
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  kicker: { color: C.pinkHi, letterSpacing: 3, fontWeight: "800" as const, fontSize: 11 },
  title: { color: C.text, fontSize: 34, fontWeight: "800" as const, letterSpacing: -0.6, marginTop: 6 },
  sub: { color: C.subtext, fontSize: 14, marginTop: 8, lineHeight: 20 },
  grid: { marginTop: 18, gap: 14 },
  tile: {
    backgroundColor: C.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.hair,
  },
  mosaic: {
    height: 200,
    width: "100%",
    backgroundColor: C.cardHi,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mosaicCell: { overflow: "hidden", borderWidth: 1, borderColor: C.bg },
  mosaicEmpty: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  lockOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", gap: 8 },
  lockText: { color: C.text, fontWeight: "700" as const, letterSpacing: 0.4 },
  tileBody: { padding: 14, gap: 4 },
  tileTitle: { color: C.text, fontSize: 16, fontWeight: "700" as const },
  tileMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  tileMetaText: { color: C.subtext, fontSize: 12 },
});

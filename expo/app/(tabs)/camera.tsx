import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Camera as CameraIcon, ChevronRight, Plus } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui";
import { C } from "@/constants/colors";
import { useEvents } from "@/providers/EventsProvider";

export default function CameraTabScreen() {
  const { upcoming } = useEvents();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(255,45,122,0.25)", "transparent"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 280 }}
      />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>DISPOSABLE</Text>
          <Text style={styles.title}>Pick an event{"\n"}to capture</Text>
          <Text style={styles.sub}>
            Each guest has a limited roll. Photos lock until the host opens the gallery.
          </Text>

          <View style={{ gap: 14, marginTop: 18 }}>
            {upcoming.map((e) => {
              const shotsUsed = e.photos.length;
              return (
                <Pressable
                  key={e.id}
                  onPress={() => router.push(`/camera/${e.id}` as never)}
                  style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.99 : 1 }] }]}
                >
                  <Image source={{ uri: e.cover }} style={styles.cardImg} contentFit="cover" />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.85)"]}
                    style={StyleSheet.absoluteFillObject as never}
                  />
                  <View style={styles.cardBody}>
                    <View style={styles.filmStrip}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <View key={i} style={styles.filmHole} />
                      ))}
                    </View>
                    <Text style={styles.cardTitle}>{e.name}</Text>
                    <View style={styles.cardMeta}>
                      <CameraIcon color={C.gold} size={14} />
                      <Text style={styles.cardMetaText}>
                        {shotsUsed}/{e.shotsPerGuest} shots used
                      </Text>
                      <View style={styles.dot} />
                      <Text style={styles.cardMetaText}>{e.venue}</Text>
                    </View>
                  </View>
                  <View style={styles.openBtn}>
                    <ChevronRight color={C.text} size={20} />
                  </View>
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton
            title="New event"
            icon={Plus}
            onPress={() => router.push("/create")}
            style={{ marginTop: 16 }}
          />
          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  kicker: { color: C.pinkHi, letterSpacing: 3, fontWeight: "800" as const, fontSize: 11 },
  title: { color: C.text, fontSize: 34, fontWeight: "800" as const, letterSpacing: -0.6, marginTop: 6 },
  sub: { color: C.subtext, fontSize: 14, marginTop: 8, lineHeight: 20 },
  card: {
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.hair,
  },
  cardImg: { width: "100%", height: "100%" },
  cardBody: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 18, gap: 6 },
  filmStrip: { flexDirection: "row", gap: 8, marginBottom: 4 },
  filmHole: { width: 6, height: 6, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.5)" },
  cardTitle: { color: C.text, fontSize: 22, fontWeight: "800" as const, letterSpacing: -0.3 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  cardMetaText: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "500" as const },
  dot: { width: 3, height: 3, borderRadius: 3, backgroundColor: C.mute },
  openBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
});

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Check, Sparkles } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Platform, StyleSheet, Text, View } from "react-native";

import { OnboardShell } from "@/components/OnboardShell";
import { PrimaryButton } from "@/components/ui";
import { C } from "@/constants/colors";
import { useOnboarding } from "@/providers/OnboardingProvider";

export default function ReadyScreen() {
  const router = useRouter();
  const { update, t, role } = useOnboarding();

  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }),
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, [scale, rotate]);

  const finish = async () => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    await update({ completed: true });
    if (role === "host") router.replace("/create" as never);
    else router.replace("/(tabs)" as never);
  };

  const rot = rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <OnboardShell
      step={8}
      total={8}
      kicker="ALL SET"
      title={t("ready_title")}
      subtitle={t("ready_sub")}
      footer={<PrimaryButton title={t("create_first")} icon={Sparkles} onPress={finish} />}
      showBack={false}
    >
      <View style={styles.center}>
        <Animated.View style={[styles.ring, { transform: [{ rotate: rot }] }]}>
          <LinearGradient
            colors={[C.pinkHi, C.gold, C.pinkDeep, C.pinkHi]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.ringInner} />
        </Animated.View>

        <Animated.View style={[styles.checkWrap, { transform: [{ scale }] }]}>
          <Check color={C.text} size={56} strokeWidth={3} />
        </Animated.View>

        <View style={{ gap: 8, marginTop: 24, alignItems: "center" }}>
          <Text style={styles.heroLine}>SHEREHE is ready.</Text>
          <Text style={styles.heroSub}>Build it in under 60 seconds.</Text>
        </View>
      </View>
    </OnboardShell>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 30, gap: 4 },
  ring: {
    width: 180,
    height: 180,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  ringInner: {
    position: "absolute",
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    borderRadius: 999,
    backgroundColor: C.bg,
  },
  checkWrap: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: C.pink,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.pink,
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  heroLine: { color: C.text, fontSize: 18, fontWeight: "800" as const },
  heroSub: { color: C.subtext, fontSize: 14 },
});

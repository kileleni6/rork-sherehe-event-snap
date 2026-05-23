import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { memo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { C } from "@/constants/colors";

interface Props {
  step: number; // 1-based
  total: number;
  kicker?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export const OnboardShell = memo(function OnboardShell({
  step,
  total,
  kicker,
  title,
  subtitle,
  children,
  footer,
  showBack = true,
  onBack,
}: Props) {
  const router = useRouter();
  const back = () => {
    if (onBack) onBack();
    else router.back();
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(255,45,122,0.18)", "rgba(10,10,11,0)", "rgba(10,10,11,0)"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
      />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View style={styles.topBar}>
          {showBack && step > 1 ? (
            <Pressable onPress={back} style={styles.topBtn} hitSlop={10}>
              <ChevronLeft color={C.text} size={22} />
            </Pressable>
          ) : (
            <View style={styles.topBtn} />
          )}
          <View style={styles.progressRow}>
            {Array.from({ length: total }, (_, i) => (
              <View
                key={i}
                style={[styles.pip, { backgroundColor: i < step ? C.pink : C.hair }]}
              />
            ))}
          </View>
          <View style={styles.topBtn}>
            <Text style={styles.stepCount}>
              {step}/{total}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 40, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={{ marginTop: 24, flex: 1 }}>{children}</View>
        </ScrollView>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  topBtn: {
    minWidth: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  stepCount: { color: C.mute, fontSize: 12, fontWeight: "700" as const },
  progressRow: { flexDirection: "row", gap: 5, flex: 1, marginHorizontal: 10 },
  pip: { flex: 1, height: 3, borderRadius: 4 },
  kicker: {
    color: C.pinkHi,
    letterSpacing: 2.5,
    fontWeight: "800" as const,
    fontSize: 11,
    marginBottom: 10,
  },
  title: {
    color: C.text,
    fontSize: 34,
    fontWeight: "800" as const,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  subtitle: {
    color: C.subtext,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  footer: {
    padding: 20,
    paddingBottom: 28,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: C.hair,
    backgroundColor: "rgba(10,10,11,0.92)",
  },
});

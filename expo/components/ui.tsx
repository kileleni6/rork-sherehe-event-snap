import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import type { LucideIcon } from "lucide-react-native";
import React, { memo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";

import { C } from "@/constants/colors";

interface PrimaryButtonProps {
  title: string;
  onPress?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PrimaryButton = memo(function PrimaryButton({
  title,
  onPress,
  icon: Icon,
  disabled,
  style,
  testID,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      style={({ pressed }) => [
        styles.btnWrap,
        { opacity: disabled ? 0.5 : pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        style,
      ]}
    >
      <LinearGradient
        colors={[C.pinkHi, C.pink, C.pinkDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.btn}
      >
        {Icon ? <Icon color={C.text} size={18} /> : null}
        <Text style={styles.btnText}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
});

interface GhostButtonProps {
  title: string;
  onPress?: () => void;
  icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
}

export const GhostButton = memo(function GhostButton({
  title,
  onPress,
  icon: Icon,
  style,
}: GhostButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.ghost, { opacity: pressed ? 0.85 : 1 }, style]}
    >
      {Icon ? <Icon color={C.text} size={18} /> : null}
      <Text style={styles.ghostText}>{title}</Text>
    </Pressable>
  );
});

export const Card = memo(function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
});

export const Chip = memo(function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : null,
        { opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {icon ? <Text style={styles.chipEmoji}>{icon}</Text> : null}
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
});

export function GlassBar({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <BlurView intensity={40} tint="dark" style={[styles.glassBar, style]}>
      {children}
    </BlurView>
  );
}

export function SectionTitle({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

export function Hair() {
  return <View style={styles.hair} />;
}

export function Tag({ label, tone = "pink" }: { label: string; tone?: "pink" | "gold" | "mute" | "success" }) {
  const colorMap = {
    pink: { bg: "rgba(255,45,122,0.14)", fg: C.pinkHi },
    gold: { bg: "rgba(244,201,123,0.14)", fg: C.gold },
    mute: { bg: "rgba(255,255,255,0.06)", fg: C.subtext },
    success: { bg: "rgba(61,214,140,0.14)", fg: C.success },
  } as const;
  const c = colorMap[tone];
  return (
    <View style={[styles.tag, { backgroundColor: c.bg }]}>
      <Text style={[styles.tagText, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btnWrap: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: C.pink,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnText: {
    color: C.text,
    fontSize: 16,
    fontWeight: "700" as const,
    letterSpacing: 0.2,
  },
  ghost: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: C.hair,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  ghostText: {
    color: C.text,
    fontSize: 15,
    fontWeight: "600" as const,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: C.hair,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: C.hair,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chipActive: {
    backgroundColor: C.pink,
    borderColor: C.pink,
  },
  chipEmoji: { fontSize: 14 },
  chipText: { color: C.subtext, fontSize: 13, fontWeight: "600" as const },
  chipTextActive: { color: C.text },
  glassBar: {
    overflow: "hidden",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sectionTitle: {
    color: C.text,
    fontSize: 20,
    fontWeight: "800" as const,
    letterSpacing: -0.3,
  },
  hair: { height: 1, backgroundColor: C.hair, marginVertical: 8 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  tagText: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.4, textTransform: "uppercase" },
});

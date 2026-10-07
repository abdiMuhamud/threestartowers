import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { images } from "@/content/images";
import { formatKesShort, fromPrice, type Property } from "@/content/properties";
import { useSaved } from "@/lib/saved";
import { colors, fonts, radius } from "@/theme";
import { PressableScale, Sheen } from "./motion";

/** Branded stand-in for developments whose renders have not been published yet. */
export function ComingSoonArt({ area }: { area: string }) {
  return (
    <LinearGradient colors={["#4a2c20", "#23140f"]} style={styles.soon}>
      <Image source={require("../../assets/logo-mark-light.png")} style={styles.soonMark} contentFit="contain" />
      <Text style={styles.soonArea}>{area}</Text>
      <Text style={styles.soonLabel}>ROSEWOOD · COMING SOON</Text>
      <Sheen delay={600} />
    </LinearGradient>
  );
}

export function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export function specChips(p: Property): string[] {
  if (!p.unitTypes.length) return ["Details coming soon"];
  const beds = p.unitTypes.map((u) => u.bedrooms);
  const sizes = p.unitTypes.map((u) => u.sizeSqft);
  return [
    `${Math.min(...sizes).toLocaleString()}–${Math.max(...sizes).toLocaleString()} sq ft`,
    `${Math.min(...beds)}–${Math.max(...beds)} Beds`,
    ...(p.floors ? [`${p.floors} Floors`] : []),
    "Parking",
  ];
}

export default function PropertyCard({ property: p, compact }: { property: Property; compact?: boolean }) {
  const { isSaved, toggle } = useSaved();
  const from = fromPrice(p);
  const selling = p.status === "selling";
  const open = () => router.push({ pathname: "/property/[slug]", params: { slug: p.slug } });

  return (
    <PressableScale onPress={open} style={compact ? styles.compact : undefined}>
      <View style={[styles.media, compact && { height: 150 }]}>
        {p.hero ? (
          <Image source={images[p.hero]} style={StyleSheet.absoluteFill} contentFit="cover" transition={400} />
        ) : (
          <ComingSoonArt area={p.area} />
        )}
        {selling && <Sheen />}
        <View style={styles.topRight}>
          <Pressable style={styles.round} onPress={() => toggle(p.slug)} hitSlop={8} accessibilityLabel="Save">
            <Ionicons name={isSaved(p.slug) ? "heart" : "heart-outline"} size={20} color={isSaved(p.slug) ? colors.brown : colors.ink} />
          </Pressable>
          {!compact && (
            <View style={[styles.round, { backgroundColor: colors.ink }]}>
              <Ionicons name="arrow-up-outline" size={20} color={colors.goldLight} style={{ transform: [{ rotate: "45deg" }] }} />
            </View>
          )}
        </View>
        <View style={styles.badge}>
          <View style={[styles.dot, selling && { backgroundColor: colors.gold }]} />
          <Text style={styles.badgeText}>{selling ? "Now selling" : "Coming soon"}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>
          {p.name.replace("Rosewood Residence", "Rosewood")}
        </Text>
        <Text style={styles.price}>{from ? formatKesShort(from) : "Enquire"}</Text>
      </View>
      <Text style={styles.address} numberOfLines={1}>
        {p.address}
      </Text>
      {!compact && (
        <View style={styles.chips}>
          {specChips(p).map((c) => (
            <Chip key={c} label={c} />
          ))}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  compact: { width: 250 },
  media: { height: 270, borderRadius: radius.card, overflow: "hidden", backgroundColor: colors.sand },
  topRight: { position: "absolute", top: 14, right: 14, flexDirection: "row", gap: 8 },
  round: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(252,249,244,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    left: 14,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: "rgba(252,249,244,0.9)",
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.muted },
  badgeText: { fontFamily: fonts.body, fontSize: 13, color: colors.ink },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, paddingHorizontal: 6, gap: 12 },
  name: { flex: 1, fontFamily: fonts.body, fontSize: 21, color: colors.ink },
  price: { fontFamily: fonts.medium, fontSize: 19, color: colors.ink },
  address: { fontFamily: fonts.light, fontSize: 14, color: colors.muted, marginTop: 2, paddingHorizontal: 6 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12, paddingHorizontal: 2 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  chipText: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  soon: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", gap: 6, overflow: "hidden" },
  soonMark: { width: 72, height: 78 },
  soonArea: { fontFamily: fonts.displayItalic, fontSize: 32, color: "#f4e8cf" },
  soonLabel: { fontFamily: fonts.medium, fontSize: 10, letterSpacing: 3, color: colors.gold },
});

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapWebView from "@/components/MapWebView";
import { Chip, ComingSoonArt, specChips } from "@/components/PropertyCard";
import { FadeInUp, PressableScale, Sheen } from "@/components/motion";
import { images } from "@/content/images";
import { company, directionsLink, formatKes, formatKesShort, fromPrice, getProperty, whatsappLink } from "@/content/properties";
import { reportPropertyView } from "@/lib/api";
import { useSaved } from "@/lib/saved";
import { colors, fonts, radius } from "@/theme";

const HERO = 400;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.h2}>{title}</Text>
      {children}
    </View>
  );
}

export default function PropertyDetails() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const p = getProperty(slug);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isSaved, toggle } = useSaved();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (p) reportPropertyView(p.slug);
  }, [p]);

  if (!p) {
    return (
      <View style={[styles.screen, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.h2}>Residence not found</Text>
      </View>
    );
  }

  const from = fromPrice(p);
  const selling = p.status === "selling";
  const slideW = width - 40;
  const message = `Hello Three Star Towers, I'm interested in ${p.name}. ${selling ? "I would like to book a viewing." : "Please register my interest."}`;
  const onSlide = (e: NativeSyntheticEvent<NativeScrollEvent>) => setPage(Math.round(e.nativeEvent.contentOffset.x / slideW));

  // The hero drifts and scales as the page scrolls, for a sense of depth.
  const heroMotion = {
    transform: [
      { translateY: scrollY.interpolate({ inputRange: [-200, 0, HERO], outputRange: [-60, 0, HERO * 0.28] }) },
      { scale: scrollY.interpolate({ inputRange: [-200, 0, HERO], outputRange: [1.25, 1, 1], extrapolateRight: "clamp" }) },
    ],
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.round} onPress={() => router.back()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </Pressable>
        <Text style={styles.topTitle}>Property Details</Text>
        <Pressable style={styles.round} onPress={() => toggle(p.slug)} accessibilityLabel="Save">
          <Ionicons name={isSaved(p.slug) ? "heart" : "heart-outline"} size={20} color={colors.brown} />
        </Pressable>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.hero, heroMotion]}>
          {p.gallery.length > 0 ? (
            <>
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onSlide}>
                {p.gallery.map((g) => (
                  <Image key={g.image} source={images[g.image]} style={{ width: slideW, height: HERO }} contentFit="cover" transition={300} />
                ))}
              </ScrollView>
              <View style={styles.counter}>
                <Ionicons name="images-outline" size={15} color={colors.ink} />
                <Text style={styles.counterText}>
                  {page + 1}/{p.gallery.length} · {p.gallery[page]?.caption}
                </Text>
              </View>
              <Sheen width={slideW} delay={900} />
            </>
          ) : (
            <ComingSoonArt area={p.area} />
          )}
        </Animated.View>

        <FadeInUp style={styles.body}>
          <View style={styles.statusRow}>
            <View style={[styles.dot, selling && { backgroundColor: colors.gold }]} />
            <Text style={styles.status}>{selling ? "Now selling" : "Coming soon"}</Text>
            <Text style={styles.area}>{p.area}</Text>
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{p.name.replace("Rosewood Residence", "Rosewood")}</Text>
            <Text style={styles.price}>{from ? formatKesShort(from) : "Enquire"}</Text>
          </View>
          <Text style={styles.address}>{p.address}</Text>
          <View style={styles.chips}>
            {specChips(p).map((c) => (
              <Chip key={c} label={c} />
            ))}
          </View>

          <Section title="Description">
            <Text style={styles.tagline}>{p.tagline}</Text>
            {p.description.map((d) => (
              <Text key={d} style={styles.text}>
                {d}
              </Text>
            ))}
          </Section>

          {p.unitTypes.map((u) => (
            <Section key={u.id} title={`${u.name} · ${u.sizeSqft.toLocaleString()} sq ft`}>
              {u.plan && <Image source={images[u.plan]} style={styles.plan} contentFit="contain" />}
              <View style={styles.table}>
                {u.pricing.map((b) => (
                  <View key={b.floors} style={styles.tr}>
                    <Text style={styles.td}>{b.floors}</Text>
                    <Text style={styles.tdPrice}>{formatKes(b.price)}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.small}>{u.units} residences · {u.rooms.length} rooms incl. {u.rooms.slice(0, 4).join(", ").toLowerCase()}…</Text>
            </Section>
          ))}

          {p.paymentPlan && (
            <Section title="Payment plan">
              <View style={styles.planRow}>
                {p.paymentPlan.map((s) => (
                  <View key={s.label} style={{ flex: s.percent, minWidth: 64 }}>
                    <View style={styles.bar} />
                    <Text style={styles.percent}>{s.percent}%</Text>
                    <Text style={styles.planLabel}>{s.label.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
              {p.paymentPlan.map((s) => (
                <Text key={s.label} style={styles.small}>
                  {s.label}: {s.note}
                </Text>
              ))}
              {p.priceNote && <Text style={[styles.small, { marginTop: 8 }]}>{p.priceNote}</Text>}
            </Section>
          )}

          {p.amenities.length > 0 && (
            <Section title="Amenities">
              <View style={styles.chips}>
                {p.amenities.map((a) => (
                  <Chip key={a} label={`★  ${a}`} />
                ))}
              </View>
            </Section>
          )}

          <Section title="Location">
            <View style={styles.mapWrap}>
              <MapWebView properties={[p]} interactive={false} />
            </View>
            {p.coordsApproximate && <Text style={styles.small}>The pin marks the neighbourhood; contact sales for the exact site.</Text>}
            {p.nearby.map((n) => (
              <View key={n.place} style={styles.tr}>
                <Text style={styles.td}>{n.place}</Text>
                <Text style={styles.tdPrice}>{n.time}</Text>
              </View>
            ))}
            <PressableScale onPress={() => Linking.openURL(directionsLink(p))} style={styles.ghost}>
              <Ionicons name="navigate-outline" size={18} color={colors.brown} />
              <Text style={styles.ghostText}>Get directions</Text>
            </PressableScale>
          </Section>
        </FadeInUp>
      </Animated.ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 12 }]}>
        <PressableScale onPress={() => Linking.openURL(`tel:${company.phones[0].replace(/\s/g, "")}`)} style={styles.call}>
          <Text style={styles.callText}>Call</Text>
        </PressableScale>
        <PressableScale onPress={() => Linking.openURL(whatsappLink(message))} style={styles.book}>
          <Text style={styles.bookText}>{selling ? "Book Now" : "Register Interest"}</Text>
          <Sheen width={260} delay={1500} />
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: colors.cream,
    zIndex: 2,
  },
  topTitle: { fontFamily: fonts.body, fontSize: 18, color: colors.ink },
  round: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.sand, alignItems: "center", justifyContent: "center" },
  hero: { height: HERO, marginHorizontal: 20, borderRadius: radius.card, overflow: "hidden", backgroundColor: colors.sand },
  counter: {
    position: "absolute",
    left: 14,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: "rgba(252,249,244,0.9)",
  },
  counterText: { fontFamily: fonts.body, fontSize: 13, color: colors.ink },
  body: { backgroundColor: colors.cream, paddingHorizontal: 22, paddingTop: 18, marginTop: 4 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.muted },
  status: { fontFamily: fonts.body, fontSize: 14, color: colors.ink, flex: 1 },
  area: { fontFamily: fonts.medium, fontSize: 12, letterSpacing: 2, color: colors.gold, textTransform: "uppercase" },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginTop: 10 },
  name: { flex: 1, fontFamily: fonts.body, fontSize: 25, color: colors.ink },
  price: { fontFamily: fonts.medium, fontSize: 22, color: colors.ink },
  address: { fontFamily: fonts.light, fontSize: 14, color: colors.muted, marginTop: 2 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  section: { marginTop: 30 },
  h2: { fontFamily: fonts.medium, fontSize: 18, color: colors.ink, marginBottom: 6 },
  tagline: { fontFamily: fonts.displayItalic, fontSize: 21, lineHeight: 26, color: colors.brown, marginBottom: 8 },
  text: { fontFamily: fonts.light, fontSize: 15, lineHeight: 23, color: colors.muted, marginBottom: 8 },
  small: { fontFamily: fonts.light, fontSize: 13, lineHeight: 19, color: colors.muted, marginTop: 6 },
  plan: { height: 250, borderRadius: radius.md, backgroundColor: colors.white, marginVertical: 8 },
  table: { marginTop: 4 },
  tr: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  td: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  tdPrice: { fontFamily: fonts.medium, fontSize: 15, color: colors.brown },
  planRow: { flexDirection: "row", gap: 8, marginTop: 6, marginBottom: 4 },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.gold },
  percent: { fontFamily: fonts.display, fontSize: 30, color: colors.brown, marginTop: 6 },
  planLabel: { fontFamily: fonts.medium, fontSize: 10, letterSpacing: 2, color: colors.ink },
  mapWrap: { height: 220, borderRadius: radius.md, overflow: "hidden", marginTop: 4 },
  ghost: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  ghostText: { fontFamily: fonts.medium, fontSize: 15, color: colors.brown },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "rgba(246,241,233,0.96)",
  },
  call: { paddingHorizontal: 34, paddingVertical: 18, borderRadius: radius.pill, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  callText: { fontFamily: fonts.medium, fontSize: 16, color: colors.ink },
  book: { flex: 1, minWidth: 190, alignItems: "center", paddingVertical: 18, borderRadius: radius.pill, backgroundColor: colors.brown, overflow: "hidden" },
  bookText: { fontFamily: fonts.medium, fontSize: 16, color: "#fff7ea" },
});

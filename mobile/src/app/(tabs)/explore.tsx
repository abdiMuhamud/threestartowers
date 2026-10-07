import { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapWebView from "@/components/MapWebView";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/content/properties";
import { colors, fonts, radius } from "@/theme";

const CARD = 250;
const GAP = 14;

export default function Explore() {
  const insets = useSafeAreaInsets();
  const list = useRef<FlatList>(null);
  const [active, setActive] = useState(properties[0].slug);

  const select = (slug: string) => {
    setActive(slug);
    const index = properties.findIndex((p) => p.slug === slug);
    if (index >= 0) list.current?.scrollToOffset({ offset: index * (CARD + GAP), animated: true });
  };

  return (
    <View style={styles.screen}>
      <MapWebView properties={properties} onSelect={select} />
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <Text style={styles.title}>Explore Mombasa</Text>
        <Text style={styles.sub}>Tap a pin to see the residence</Text>
      </View>
      <FlatList
        ref={list}
        horizontal
        data={properties}
        keyExtractor={(p) => p.slug}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD + GAP}
        decelerationRate="fast"
        style={[styles.carousel, { bottom: insets.bottom + 84 }]}
        contentContainerStyle={{ paddingHorizontal: 20, gap: GAP }}
        renderItem={({ item }) => (
          <View style={[styles.card, item.slug === active && styles.cardOn]}>
            <PropertyCard property={item} compact />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sand },
  header: {
    position: "absolute",
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: "rgba(252,249,244,0.94)",
  },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  sub: { fontFamily: fonts.light, fontSize: 14, color: colors.muted },
  carousel: { position: "absolute", left: 0, right: 0, flexGrow: 0 },
  card: { padding: 10, borderRadius: 34, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: "transparent" },
  cardOn: { borderColor: colors.gold },
});

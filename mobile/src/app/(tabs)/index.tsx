import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PropertyCard from "@/components/PropertyCard";
import { FadeInUp } from "@/components/motion";
import { company, properties } from "@/content/properties";
import { colors, fonts, radius } from "@/theme";

const filters = ["All", ...Array.from(new Set(properties.map((p) => p.area)))];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
};

export default function Home() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("All");
  const list = useMemo(() => properties.filter((p) => filter === "All" || p.area === filter), [filter]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 110 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View style={styles.round}>
          <Image source={require("../../../assets/logo-mark.png")} style={{ width: 26, height: 28 }} contentFit="contain" />
        </View>
        <View style={styles.location}>
          <Ionicons name="location-sharp" size={15} color={colors.brown} />
          <Text style={styles.locationText}>Mombasa, Kenya</Text>
        </View>
        <Pressable style={styles.round} onPress={() => Linking.openURL(`tel:${company.phones[0].replace(/\s/g, "")}`)} accessibilityLabel="Call sales">
          <Ionicons name="call-outline" size={20} color={colors.ink} />
        </Pressable>
      </View>

      <FadeInUp style={styles.heading}>
        <Text style={styles.greeting}>{greeting()} ☀️</Text>
        <Text style={styles.title}>Find Your Next Home</Text>
      </FadeInUp>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
        {filters.map((f) => {
          const on = f === filter;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.pill, on && styles.pillOn]}>
              <Text style={[styles.pillText, on && styles.pillTextOn]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.list}>
        {list.map((p, i) => (
          <FadeInUp key={`${filter}-${p.slug}`} index={i}>
            <PropertyCard property={p} />
          </FadeInUp>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 },
  round: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.sand, alignItems: "center", justifyContent: "center" },
  location: { flexDirection: "row", alignItems: "center", gap: 6 },
  locationText: { fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  heading: { paddingHorizontal: 22, marginTop: 26 },
  greeting: { fontFamily: fonts.displayItalic, fontSize: 28, color: colors.muted },
  title: { fontFamily: fonts.body, fontSize: 32, color: colors.ink, marginTop: 2 },
  pills: { paddingHorizontal: 20, gap: 8, paddingVertical: 22 },
  pill: { paddingHorizontal: 20, paddingVertical: 11, borderRadius: radius.pill, backgroundColor: colors.sand },
  pillOn: { backgroundColor: colors.brown },
  pillText: { fontFamily: fonts.body, fontSize: 15, color: colors.muted },
  pillTextOn: { color: "#fff7ea" },
  list: { paddingHorizontal: 20, gap: 30 },
});

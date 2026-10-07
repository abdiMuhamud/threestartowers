import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PropertyCard from "@/components/PropertyCard";
import { FadeInUp } from "@/components/motion";
import { properties } from "@/content/properties";
import { useSaved } from "@/lib/saved";
import { colors, fonts } from "@/theme";

export default function Saved() {
  const insets = useSafeAreaInsets();
  const { slugs } = useSaved();
  const list = properties.filter((p) => slugs.includes(p.slug));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 110, paddingHorizontal: 20, flexGrow: 1 }}
    >
      <Text style={styles.title}>Saved</Text>
      {list.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={44} color={colors.gold} />
          <Text style={styles.emptyTitle}>No saved residences yet</Text>
          <Text style={styles.emptyText}>Tap the heart on any residence to keep it here.</Text>
        </View>
      ) : (
        <View style={{ gap: 30, marginTop: 20 }}>
          {list.map((p, i) => (
            <FadeInUp key={p.slug} index={i}>
              <PropertyCard property={p} />
            </FadeInUp>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  title: { fontFamily: fonts.display, fontSize: 38, color: colors.ink },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.ink, marginTop: 8 },
  emptyText: { fontFamily: fonts.light, fontSize: 15, color: colors.muted, textAlign: "center" },
});

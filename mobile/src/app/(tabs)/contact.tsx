import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FadeInUp, PressableScale, Sheen } from "@/components/motion";
import { company, whatsappLink } from "@/content/properties";
import { colors, fonts, radius } from "@/theme";

type IconName = keyof typeof Ionicons.glyphMap;

function Row({ icon, label, value, onPress }: { icon: IconName; label: string; value: string; onPress?: () => void }) {
  return (
    <PressableScale onPress={onPress} disabled={!onPress} style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={colors.brown} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={18} color={colors.muted} />}
    </PressableScale>
  );
}

export default function Contact() {
  const insets = useSafeAreaInsets();
  const hello = "Hello Three Star Towers, I would like to know more about the Rosewood Residences.";

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 110, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <FadeInUp>
        <LinearGradient colors={["#3a241b", "#1a0f0b"]} style={styles.hero}>
          <Image source={require("../../../assets/logo-mark-light.png")} style={{ width: 70, height: 76 }} contentFit="contain" />
          <Text style={styles.heroName}>THREE STAR TOWERS</Text>
          <Text style={styles.heroSub}>{company.strapline}</Text>
          <Sheen width={360} />
        </LinearGradient>
      </FadeInUp>

      <FadeInUp index={1}>
        <PressableScale onPress={() => Linking.openURL(whatsappLink(hello))} style={styles.cta}>
          <Ionicons name="logo-whatsapp" size={20} color={colors.espresso} />
          <Text style={styles.ctaText}>Chat with sales on WhatsApp</Text>
        </PressableScale>
      </FadeInUp>

      <FadeInUp index={2} style={styles.group}>
        {company.phones.map((p) => (
          <Row key={p} icon="call-outline" label="Call" value={p} onPress={() => Linking.openURL(`tel:${p.replace(/\s/g, "")}`)} />
        ))}
        {company.emails.map((e) => (
          <Row key={e} icon="mail-outline" label="Email" value={e} onPress={() => Linking.openURL(`mailto:${e}`)} />
        ))}
      </FadeInUp>

      <FadeInUp index={3} style={styles.group}>
        <Row icon="business-outline" label="Head office" value={company.office} />
        <Row icon="storefront-outline" label="Sales office" value={company.salesOffice} />
        <Row icon="mail-open-outline" label="Post" value={company.poBox} />
        <Row icon="globe-outline" label="Website" value={company.website} onPress={() => Linking.openURL(`https://${company.website}`)} />
      </FadeInUp>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  hero: { borderRadius: radius.card, padding: 30, alignItems: "center", gap: 6, overflow: "hidden" },
  heroName: { fontFamily: fonts.displayBold, fontSize: 22, letterSpacing: 3, color: "#f8efdc", marginTop: 8 },
  heroSub: { fontFamily: fonts.light, fontSize: 14, color: "#cdbd9f", textAlign: "center" },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
    paddingVertical: 17,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  ctaText: { fontFamily: fonts.medium, fontSize: 16, color: colors.espresso },
  group: {
    marginTop: 18,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    paddingHorizontal: 14,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14 },
  rowIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sand, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontFamily: fonts.light, fontSize: 12, color: colors.muted, letterSpacing: 1 },
  rowValue: { fontFamily: fonts.body, fontSize: 16, color: colors.ink },
});

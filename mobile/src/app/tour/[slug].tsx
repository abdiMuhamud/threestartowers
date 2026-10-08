import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { company, getProperty } from "@/content/properties";
import { colors, fonts } from "@/theme";

/**
 * The virtual tour is the website's tour page shown full screen, so the app and
 * the site always offer the same rooms. `app=1` hides the page's own back link.
 */
export default function Tour() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const p = getProperty(slug);

  return (
    <View style={styles.screen}>
      {p?.tour && state !== "failed" && (
        <WebView
          source={{ uri: `https://${company.website}/tour/${p.slug}?app=1` }}
          style={styles.web}
          onLoadEnd={() => setState((s) => (s === "failed" ? s : "ready"))}
          onError={() => setState("failed")}
          onHttpError={() => setState("failed")}
          allowsInlineMediaPlayback
          javaScriptEnabled
          domStorageEnabled
        />
      )}
      {state === "loading" && p?.tour && <ActivityIndicator color={colors.gold} style={StyleSheet.absoluteFill} />}
      {(state === "failed" || !p?.tour) && (
        <View style={styles.message}>
          <Ionicons name="cloud-offline-outline" size={40} color={colors.gold} />
          <Text style={styles.messageText}>The virtual tour needs an internet connection. Please try again.</Text>
        </View>
      )}
      <Pressable style={[styles.back, { top: insets.top + 10 }]} onPress={() => router.back()} accessibilityLabel="Close tour">
        <Ionicons name="close" size={22} color="#f8efdc" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#120a07" },
  web: { flex: 1, backgroundColor: "#120a07" },
  back: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(31,19,14,0.7)",
    borderWidth: 1,
    borderColor: "rgba(236,214,145,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  message: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", gap: 12, padding: 40 },
  messageText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: "#cdbd9f", textAlign: "center" },
});

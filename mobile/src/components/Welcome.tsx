import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { company } from "@/content/properties";
import { useProfile } from "@/lib/profile";
import { colors, fonts, radius } from "@/theme";
import { FadeInUp, PressableScale, Sheen } from "./motion";

const validPhone = (value: string) => /^\+?\d{7,15}$/.test(value.replace(/[\s\-().]/g, ""));

/** First-launch screen: asks for a name and phone number before the listings open. */
export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { register } = useProfile();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!validPhone(phone)) return setError("Please enter a valid phone number.");
    setError("");
    setBusy(true);
    await register(name.trim(), phone.trim());
  };

  return (
    <LinearGradient colors={["#2c1b14", "#170d09"]} style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 50, paddingBottom: insets.bottom + 30 }]}
          keyboardShouldPersistTaps="handled"
        >
          <FadeInUp style={{ alignItems: "center" }}>
            <Image source={require("../../assets/logo-mark-light.png")} style={styles.mark} contentFit="contain" />
            <Text style={styles.brand}>THREE STAR TOWERS</Text>
            <Text style={styles.title}>Karibu</Text>
            <Text style={styles.lede}>Tell us who you are and explore the Rosewood Residences in Mombasa.</Text>
          </FadeInUp>

          <FadeInUp index={2} style={styles.card}>
            <Text style={styles.label}>YOUR NAME</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor={colors.muted}
              autoComplete="name"
              autoCapitalize="words"
              returnKeyType="next"
              style={styles.input}
            />
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="07xx xxx xxx"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              autoComplete="tel"
              returnKeyType="done"
              onSubmitEditing={submit}
              style={styles.input}
            />
            {error !== "" && <Text style={styles.error}>{error}</Text>}
            <PressableScale onPress={submit} disabled={busy} style={[styles.button, busy && { opacity: 0.6 }]}>
              <Text style={styles.buttonText}>{busy ? "One moment…" : "Continue"}</Text>
              <Sheen width={300} delay={1200} />
            </PressableScale>
            <Text style={styles.consent}>
              By continuing you agree that Three Star Towers may contact you about its residences.{" "}
              <Text style={styles.link} onPress={() => Linking.openURL(`https://${company.website}/privacy`)}>
                Privacy notice
              </Text>
            </Text>
          </FadeInUp>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, justifyContent: "center", gap: 34 },
  mark: { width: 84, height: 92 },
  brand: { fontFamily: fonts.displayBold, fontSize: 16, letterSpacing: 4, color: colors.gold, marginTop: 14 },
  title: { fontFamily: fonts.displayItalic, fontSize: 54, color: "#fbf3e1", marginTop: 6 },
  lede: { fontFamily: fonts.light, fontSize: 16, lineHeight: 24, color: "#d9cbb3", textAlign: "center", marginTop: 4 },
  card: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 22 },
  label: { fontFamily: fonts.medium, fontSize: 11, letterSpacing: 2, color: colors.muted, marginBottom: 6 },
  input: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.ink,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  error: { fontFamily: fonts.body, fontSize: 14, color: "#a3261c", marginBottom: 12 },
  button: { alignItems: "center", paddingVertical: 18, borderRadius: radius.pill, backgroundColor: colors.brown, overflow: "hidden" },
  buttonText: { fontFamily: fonts.medium, fontSize: 16, color: "#fff7ea" },
  consent: { fontFamily: fonts.light, fontSize: 12, lineHeight: 18, color: colors.muted, textAlign: "center", marginTop: 14 },
  link: { color: colors.brown, textDecorationLine: "underline" },
});

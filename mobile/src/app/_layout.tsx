import {
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
} from "@expo-google-fonts/cormorant-garamond";
import { Jost_300Light, Jost_400Regular, Jost_500Medium, useFonts } from "@expo-google-fonts/jost";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import Welcome from "@/components/Welcome";
import { reportLaunch } from "@/lib/api";
import { ProfileProvider, useProfile } from "@/lib/profile";
import { SavedProvider } from "@/lib/saved";
import { colors } from "@/theme";

SplashScreen.preventAutoHideAsync();

function Screens({ fontsReady }: { fontsReady: boolean }) {
  const { profile } = useProfile();
  const ready = fontsReady && profile !== undefined;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  // Visitors register once, on first launch, before the listings open.
  if (profile === null) {
    return (
      <>
        <StatusBar style="light" />
        <Welcome />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }} />
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
  });

  useEffect(() => {
    reportLaunch();
  }, []);

  return (
    <ProfileProvider>
      <SavedProvider>
        <Screens fontsReady={loaded || error !== null} />
      </SavedProvider>
    </ProfileProvider>
  );
}

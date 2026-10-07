import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router/js-tabs";
import type { ColorValue } from "react-native";
import { colors, fonts } from "@/theme";

type IconName = keyof typeof Ionicons.glyphMap;

const icon =
  (on: IconName, off: IconName) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => <Ionicons name={focused ? on : off} size={23} color={color} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brown,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.body, fontSize: 12 },
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.line,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          position: "absolute",
          paddingTop: 6,
        },
        sceneStyle: { backgroundColor: colors.cream },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: icon("home", "home-outline") }} />
      <Tabs.Screen name="explore" options={{ title: "Explore", tabBarIcon: icon("map", "map-outline") }} />
      <Tabs.Screen name="saved" options={{ title: "Saved", tabBarIcon: icon("heart", "heart-outline") }} />
      <Tabs.Screen name="contact" options={{ title: "Contact", tabBarIcon: icon("chatbubble-ellipses", "chatbubble-ellipses-outline") }} />
    </Tabs>
  );
}

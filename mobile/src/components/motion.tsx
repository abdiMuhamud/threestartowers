import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

/** Fades and slides children in; `index` staggers items in a list. */
export function FadeInUp({ children, index = 0, style }: { children: ReactNode; index?: number; style?: StyleProp<ViewStyle> }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(t, {
      toValue: 1,
      duration: 700,
      delay: 90 * index,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [t, index]);

  return (
    <Animated.View
      style={[style, { opacity: t, transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] }]}
    >
      {children}
    </Animated.View>
  );
}

/** Pressable that sinks slightly under the finger. */
export function PressableScale({ children, style, ...rest }: PressableProps & { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(s, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Pressable onPressIn={() => to(0.97)} onPressOut={() => to(1)} {...rest}>
      <Animated.View style={[style, { transform: [{ scale: s }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** A soft band of light that sweeps across its parent on a loop. Parent needs overflow: "hidden". */
export function Sheen({ width = 320, delay = 0 }: { width?: number; delay?: number }) {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(x, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.delay(2600),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [x, delay]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [-width, width * 1.4] }) }, { skewX: "-18deg" }] },
      ]}
    >
      <LinearGradient
        colors={["rgba(255,246,216,0)", "rgba(255,246,216,0.35)", "rgba(255,246,216,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: width * 0.45, height: "100%" }}
      />
    </Animated.View>
  );
}

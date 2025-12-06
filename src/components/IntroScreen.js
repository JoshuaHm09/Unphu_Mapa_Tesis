import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

export default function IntroScreen({ onFinish }) {
  const { width, height } = Dimensions.get("window");

  // Tamaño base del diseño en Figma
  const BASE_W = 412;
  const BASE_H = 917;

  // Escalado flexible
  const sW = width / BASE_W;
  const sH = height / BASE_H;

  // ====== SHARED VALUES ======
  const leftX = useSharedValue(-289 * sW);
  const leftY = useSharedValue(-92 * sH);
  const leftRot = useSharedValue(155.94);

  const rightX = useSharedValue(206 * sW);
  const rightY = useSharedValue(-85 * sH);
  const rightRot = useSharedValue(155.94 + 180);

  const whiteOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.8);

  const circleScale = useSharedValue(0);
  const finalFade = useSharedValue(1);

  // ====== SECUENCIA ======
  useEffect(() => {
    // SOLO animación de salida: cortinas abriéndose
    leftX.value = withDelay(
      650,
      withTiming(leftX.value - width * 1.4, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      })
    );

    rightX.value = withDelay(
      650,
      withTiming(rightX.value + width * 1.4, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Fondo blanco aparece
    whiteOpacity.value = withDelay(
      1100,
      withTiming(1, { duration: 800 })
    );

    // Texto aparece
    textOpacity.value = withDelay(
      1300,
      withTiming(1, { duration: 600 })
    );

    textScale.value = withDelay(
      1300,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Bola verde se expande
    circleScale.value = withDelay(
      2100,
      withTiming(8, {
        duration: 800,
        easing: Easing.in(Easing.quad),
      })
    );

    // Fade final
    finalFade.value = withDelay(
      2950,
      withTiming(0, { duration: 450 })
    );

    // Ir al mapa
    setTimeout(onFinish, 3500);
  }, []);

  // ====== Animated Styles ======

  const leftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: leftX.value },
      { translateY: leftY.value },
      { rotate: `${leftRot.value}deg` },
    ],
  }));

  const rightStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: rightX.value },
      { translateY: rightY.value },
      { rotate: `${rightRot.value}deg` },
    ],
  }));

  const whiteStyle = useAnimatedStyle(() => ({
    opacity: whiteOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }],
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: finalFade.value,
  }));

  return (
    <Animated.View style={[styles.container, fadeStyle]}>
      {/* PANEL IZQUIERDO (cortina diagonal) */}
      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: "#079A30",
            width: 495 * sW,
            height: 1101.74 * sH,
            left: -289 * sW,
            top: -92 * sH,
          },
          leftStyle,
        ]}
      />

      {/* PANEL DERECHO (cortina diagonal) */}
      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: "#087727",
            width: 495 * sW,
            height: 1101.74 * sH,
            left: 206 * sW,
            top: -85 * sH,
          },
          rightStyle,
        ]}
      />

      {/* FONDO BLANCO */}
      <Animated.View style={[styles.whiteLayer, whiteStyle]}>
        <Animated.View style={[styles.textWrapper, textStyle]}>
          <Text style={styles.title}>UNPHU</Text>
          <Text style={styles.subtitle}>Campus Map</Text>
        </Animated.View>
      </Animated.View>

      {/* BOLA EXPANDIÉNDOSE */}
      <Animated.View
        style={[
          styles.circle,
          {
            left: width / 2 - 90,
            top: height / 2 - 90,
            backgroundColor: "#087727",
          },
          circleStyle,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#079A30",
    overflow: "hidden",
    zIndex: 9999,
  },

  panel: {
    position: "absolute",
  },

  whiteLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },

  textWrapper: {
    alignItems: "center",
  },

  title: {
    color: "#087727",
    fontSize: 46,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 18,
    color: "#555",
  },

  circle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 180,
    zIndex: 50,
  },
});

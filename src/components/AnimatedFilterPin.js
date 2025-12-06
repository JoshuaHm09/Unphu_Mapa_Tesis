// File: src/components/AnimatedFilterPin.js
import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
} from "react-native-reanimated";
import { Image } from "expo-image";

// Ajusta rutas si fuera necesario
const PINS = {
  bathrooms:  require("../../assets/icons/bathroom_pin_1.png"),
  vending:    require("../../assets/icons/vending_machine_pin.png"),
  parking:    require("../../assets/icons/parqueos_pin.png"),
  labs:       require("../../assets/icons/lab_pin.png"),
  greenAreas: require("../../assets/icons/arbol_pin.png"),
  studyAreas: require("../../assets/icons/libro_pin.png"),
};

export default function AnimatedFilterPin({
  x,
  y,
  type,
  onPress,
  scaleRef,
  size = 110,                 // ← controla el tamaño base del pin
  pulseUpScale = 1.08,       // intensidad del pulso
  popOffset = 6,             // desplazamiento vertical del “pop”
  minZoomScale = 0.85,       // clamp inferior del “escala inversa”
  maxZoomScale = 1.8,        // clamp superior del “escala inversa”
  intervalMs = 5000,         // periodo total aprox del pulso
}) {
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    const upDown = 220;                     // ms subir/bajar
    const rest = Math.max(0, intervalMs - upDown * 2);
    pulse.value = withRepeat(
      withSequence(
        withTiming(pulseUpScale, { duration: upDown }),
        withTiming(1, { duration: upDown }),
        withDelay(rest, withTiming(1, { duration: 0 }))
      ),
      -1,
      false
    );
  }, [intervalMs, pulseUpScale]);

  const aStyle = useAnimatedStyle(() => {
    const zoom = Math.min(Math.max(1 / scaleRef.value, minZoomScale), maxZoomScale);
    const s = zoom * pulse.value;
    const dy = (pulse.value - 1) * -popOffset; // pop leve hacia arriba
    return { transform: [{ translateY: dy }, { scale: s }] };
  });

  const pinSource = PINS[type] || PINS.bathrooms;

  // anclaje por la “punta” del pin
  const left = x - size / 2;
  const top = y - size + 6;

  return (
    <Animated.View style={[aStyle, { position: "absolute", left, top, width: size, height: size }]}>
      <Pressable onPress={onPress} style={{ flex: 1 }}>
        <Image source={pinSource} style={{ width: "100%", height: "100%" }} contentFit="contain" transition={0} />
      </Pressable>
    </Animated.View>
  );
}

// ===== Ejemplo de uso en MapScreen =====
// Reemplaza donde pintas filtros:
// <AnimatedFilterPin x={p.x} y={p.y} type={key} scaleRef={scale} size={80} />

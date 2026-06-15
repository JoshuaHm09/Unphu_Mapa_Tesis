import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PIN_WIDTH = 183;
const PIN_HEIGHT = 227;

export default function MarkerPin({
  x,
  y,
  label,
  iconSource,
  onPress,
  hasEvent = false,
  scaleOverride = 1,
}) {
  const scale = useRef(new Animated.Value(0)).current;
  const tapScale = useRef(new Animated.Value(1)).current;

  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.55)).current;

  const pulseScale2 = useRef(new Animated.Value(1)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.45)).current;

  const pulseScale3 = useRef(new Animated.Value(1)).current;
  const pulseOpacity3 = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }, 10);

    return () => clearTimeout(timer);
  }, [scale]);

  useEffect(() => {
    if (!hasEvent) return;

    const createWave = (scaleValue, opacityValue, delay = 0, startOpacity = 0.55) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleValue, {
              toValue: 2.55,
              duration: 1900,
              useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
              toValue: 0,
              duration: 1900,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleValue, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
              toValue: startOpacity,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );

    pulseScale.setValue(1);
    pulseOpacity.setValue(0.55);

    pulseScale2.setValue(1);
    pulseOpacity2.setValue(0.45);

    pulseScale3.setValue(1);
    pulseOpacity3.setValue(0.35);

    const wave1 = createWave(pulseScale, pulseOpacity, 0, 0.55);
    const wave2 = createWave(pulseScale2, pulseOpacity2, 620, 0.45);
    const wave3 = createWave(pulseScale3, pulseOpacity3, 1240, 0.35);

    wave1.start();
    wave2.start();
    wave3.start();

    return () => {
      wave1.stop();
      wave2.stop();
      wave3.stop();

      pulseScale.setValue(1);
      pulseOpacity.setValue(0.55);

      pulseScale2.setValue(1);
      pulseOpacity2.setValue(0.45);

      pulseScale3.setValue(1);
      pulseOpacity3.setValue(0.35);
    };
  }, [
    hasEvent,
    pulseScale,
    pulseOpacity,
    pulseScale2,
    pulseOpacity2,
    pulseScale3,
    pulseOpacity3,
  ]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(tapScale, {
        toValue: 1.25,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(tapScale, {
        toValue: 1,
        tension: 150,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.wrapper,
        {
          left: x - PIN_WIDTH / 2,
          top: y - PIN_HEIGHT + 20,
        },
      ]}
    >
      {hasEvent && (
        <View pointerEvents="none" style={styles.pulseContainer}>
          <Animated.View
            style={[
              styles.eventPulse,
              {
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              },
            ]}
          />

          <Animated.View
            style={[
              styles.eventPulse,
              {
                transform: [{ scale: pulseScale2 }],
                opacity: pulseOpacity2,
              },
            ]}
          />

          <Animated.View
            style={[
              styles.eventPulse,
              {
                transform: [{ scale: pulseScale3 }],
                opacity: pulseOpacity3,
              },
            ]}
          />
        </View>
      )}

      <Animated.View
        style={{
          zIndex: 2,
          elevation: 2,
          transform: [
            { scale },
            { scale: tapScale },
            { scale: scaleOverride },
          ],
        }}
      >
        <Image
          source={require("../../assets/markers/locator_base.png")}
          style={{ width: PIN_WIDTH, height: PIN_HEIGHT }}
          resizeMode="contain"
        />

        <View style={styles.centerContent}>
          {iconSource ? (
            <Image source={iconSource} style={styles.icon} resizeMode="contain" />
          ) : label ? (
            <Text style={styles.labelText}>{label}</Text>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: PIN_WIDTH,
    height: PIN_HEIGHT,
    zIndex: 99999,
    elevation: 99999,
    pointerEvents: "box-none",
  },

 pulseContainer: {
   position: "absolute",
   left: 0,
   top: 0,
   width: PIN_WIDTH,
   height: PIN_HEIGHT,
   alignItems: "center",
   justifyContent: "center",
   zIndex: 1,
   elevation: 1,
 },

  eventPulse: {
    position: "absolute",
    top: 35,
    width: 115,
    height: 115,
    borderRadius: 57.5,
    borderWidth: 15,
    borderColor: "rgba(74, 222, 128, 0.95)",
    backgroundColor: "rgba(74, 222, 128, 0.15)",
  },

  centerContent: {
    position: "absolute",
    top: 82,
    width: PIN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    width: 90,
    height: 90,
    bottom: 45,
  },

  labelText: {
    fontSize: 90,
    fontWeight: "700",
    color: "#0CB951",
    textAlign: "center",
    bottom: 60,
  },
});
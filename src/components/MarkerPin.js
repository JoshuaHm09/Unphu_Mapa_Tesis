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
  scaleOverride = 1,
}) {
  const scale = useRef(new Animated.Value(0)).current; // animación inicial
  const tapScale = useRef(new Animated.Value(1)).current; // animación de tap

  // Animacion icnical cuando aparece
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }, 4000); // <- para cambiar el delay

    return () => clearTimeout(timer);
  }, []);

  // Animacion de tap
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
      <Animated.View
        style={{
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
            <Image
              source={iconSource}
              style={styles.icon}
              resizeMode="contain"
            />
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
   zIndex: 99999,
   elevation: 99999,
   pointerEvents: "box-none",
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

// src/IntroScreen.js
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function IntroScreen({ onFinish }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const GIF_DURATION = 4200; // ajusta al tiempo real de tu GIF

    setTimeout(() => {
      // Fade-out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onFinish(); // Avisamos que terminó
      });
    }, GIF_DURATION);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image
        source={require("../../assets/splash/Campus_Map.gif")}
        style={styles.gif}
        contentFit="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 99999,
  },
  gif: {
    width: "100%",
    height: "100%",
  },
});

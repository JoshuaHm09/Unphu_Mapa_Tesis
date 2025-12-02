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

export default function MarkerPin({ x, y, label, iconSource, onPress,scaleOverride = 1 }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.wrapper,
        {
          left: x - PIN_WIDTH / 2,
          top: y - PIN_HEIGHT + 20,
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale }, {scale: scaleOverride}] }}>
        {/* PIN BASE */}
        <Image
          source={require("../../assets/markers/locator_base.png")}
          style={{ width: PIN_WIDTH, height: PIN_HEIGHT }}
          resizeMode="contain"
        />

        {/* CONTENIDO INTERNO */}
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
    bottom: 60 ,
  },
});

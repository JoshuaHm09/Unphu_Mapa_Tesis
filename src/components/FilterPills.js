import React from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";

export default function FilterPill({ label, icon, isOn, onToggle, checkIcon }) {
  const anim = useSharedValue(1);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: anim.value }],
    shadowColor: "#000",
    shadowOpacity: isOn ? 0.25 : 0,
    shadowRadius: isOn ? 8 : 0,
    elevation: isOn ? 8 : 0,
  }));

  const handlePress = () => {
    anim.value = withTiming(0.94, { duration: 90 }, () => {
      anim.value = withTiming(1, { duration: 90 });
    });
    onToggle();
  };

  return (
    <Animated.View style={[pillStyle, { marginRight: 10, marginBottom: 12 }]}>
      <Pressable
        onPress={handlePress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: "white",
          borderRadius: 30,
          borderWidth: 1.5,
          borderColor: isOn ? "#34A853" : "#D1D5DB",
        }}
      >
        <Image
          source={isOn ? checkIcon : icon}
          style={{ width: 22, height: 22, marginRight: 6 }}
        />

        <Text style={{ fontSize: 15, fontWeight: "600", color: "#374151" }}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

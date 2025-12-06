import React from "react";
import { View, Text } from "react-native";

export default function ToastMessage({ visible, message }) {
  if (!visible) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 999999999999999,
        elevation: 999999999999,
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 14,
        }}
      >
        <Text style={{ color: "white", fontSize: 14 }}>{message}</Text>
      </View>
    </View>
  );
}

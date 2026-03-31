import React from "react";
import { Pressable, Text } from "react-native";

export default function DirectoryButton({ onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Directorio</Text>
    </Pressable>
  );
}

const styles = {
  button: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
};
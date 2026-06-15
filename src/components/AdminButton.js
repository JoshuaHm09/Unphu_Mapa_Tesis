import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminButton({ onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <MaterialIcons name="logout" size={20} color="#FFFFFF" />

      <Text style={styles.text}>Cerrar sesión</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 50,
    right: 18,

    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    backgroundColor: "#111827",
    borderRadius: 18,

    paddingVertical: 10,
    paddingHorizontal: 14,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,

    zIndex: 999,
  },

  text: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
});
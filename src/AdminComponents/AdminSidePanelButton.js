import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AdminSidePanelButton({ onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.lines}>
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </View>


    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 50,
    height: 50,
    left:-5,
    top: "22%",
    zIndex: 999,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
    gap: 6,
  },
  lines: {
    gap: 3,
    top: 8,
  },
  line: {
    width: 18,
    height: 2.5,
    backgroundColor: "#16a34a",
    borderRadius: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16a34a",
  },
});
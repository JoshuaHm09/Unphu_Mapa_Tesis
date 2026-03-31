import React from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

export default function DirectoryCard({ building, onPress }) {
  const imageSource =
    building?.images?.[0]?.source || building?.images?.[0] || null;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image
        source={imageSource}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {building.name}
        </Text>

        <Text style={styles.subtitle} numberOfLines={2}>
          {building.subtitle || "Información del edificio"}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = {
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  arrow: {
    fontSize: 28,
    color: "#9CA3AF",
    marginLeft: 8,
  },
};
import React from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

function FoodCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.info}>
        <Text style={styles.name}>{item?.name || "Sin nombre"}</Text>
        <Text style={styles.subtitle}>{item?.type || "Sin tipo"}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item?.description || "Sin descripción"}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

export default function AdminFoodScreen({ foodPlaces = [], onBack, onSelectFood }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Comida</Text>
      </View>

      <FlatList
        data={foodPlaces}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FoodCard item={item} onPress={onSelectFood} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No hay lugares de comida disponibles.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  header: {
    height: 80,
    backgroundColor: "#f59e0b",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 10,
  },
  backText: {
    fontSize: 50,
    color: "#fff",
    fontWeight: "800",
  },
  title: {
    top: 5,
    left: 10,
    color: "#fff",
    fontSize: 25,
    fontWeight: "800",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginTop: 3,
  },
  desc: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  arrow: {
    fontSize: 26,
    color: "#666",
    marginLeft: 10,
  },
  emptyWrap: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
    fontWeight: "600",
  },
});
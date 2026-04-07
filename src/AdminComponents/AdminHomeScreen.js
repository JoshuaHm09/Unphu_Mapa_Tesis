import React from "react";
import { SafeAreaView, StyleSheet, Text, Pressable, View } from "react-native";


export default function AdminHomeScreen({ onBack, onPressBuildings, onPressFood }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Admin Panel</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Editar Información</Text>

        <Pressable style={[styles.card, { backgroundColor: "#16a34a" }]} onPress={onPressBuildings}>
          <Text style={styles.icon}>🏢</Text>
          <Text style={styles.cardText}>Edificios</Text>
        </Pressable>

        <Pressable style={[styles.card, { backgroundColor: "#f59e0b" }]} onPress={onPressFood}>
          <Text style={styles.icon}>🍴</Text>
          <Text style={styles.cardText}>Comida</Text>
        </Pressable>
      </View>
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
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backBtn: {
    marginRight: 10,
  },
  backText: {
    top: 5,
    fontSize: 50,
    color: "#fff",
    fontWeight: "800",
  },
  title: {
    left: 10,
    color: "#fff",
    fontSize: 25,
    top: 10,
    fontWeight: "800",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#b0b0b0",
    marginBottom: 20,
  },
  card: {
    height: 70,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  icon: {
    fontSize: 26,
    marginRight: 14,
    color: "#fff",
  },
  cardText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
});
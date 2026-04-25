import React, { useMemo } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

function BuildingCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.info}>
        <Text style={styles.name}>{item?.name || "Sin nombre"}</Text>
        <Text style={styles.subtitle}>{item?.subtitle || "Sin subtítulo"}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item?.description || "Sin descripción"}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

export default function AdminBuildingScreen({
  buildings = [],
  onBack,
  onSelectBuilding,
}) {
  const sortedBuildings = useMemo(() => {
    const getNumericOrder = (building) => {
      const name = String(building?.name || "").trim();
      const subtitle = String(building?.subtitle || "").trim();

      const sources = [name, subtitle];

      for (const text of sources) {
        const match = text.match(/\b(\d{1,2})\b/);
        if (match) {
          const num = Number(match[1]);
          if (!Number.isNaN(num) && num >= 1 && num <= 12) {
            return num;
          }
        }
      }

      return null;
    };

    return [...buildings].sort((a, b) => {
      const aNum = getNumericOrder(a);
      const bNum = getNumericOrder(b);

      const aIsNumbered = aNum !== null;
      const bIsNumbered = bNum !== null;

      if (aIsNumbered && bIsNumbered) {
        return aNum - bNum;
      }

      if (aIsNumbered && !bIsNumbered) {
        return -1;
      }

      if (!aIsNumbered && bIsNumbered) {
        return 1;
      }

      return String(a?.name || "").localeCompare(String(b?.name || ""), "es", {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [buildings]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Edificios</Text>
      </View>

      <FlatList
        data={sortedBuildings}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BuildingCard item={item} onPress={onSelectBuilding} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No hay edificios disponibles.</Text>
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
    backgroundColor: "#16a34a",
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
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Keyboard,
} from "react-native";

import { getRoutePlaceNode } from "../components/routeGraph";
import { findShortestPath } from "../components/findShortestPath";

export default function RouteSearch({
  buildings = [],
  onClose,
  setActiveRoute,
  focusPoint,
}) {
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [activeInput, setActiveInput] = useState(null);

  const [originBuilding, setOriginBuilding] = useState(null);
  const [destinationBuilding, setDestinationBuilding] = useState(null);

  const filteredBuildings = useMemo(() => {
    const query = activeInput === "origin" ? originQuery : destinationQuery;

    if (!query.trim()) return [];

    return buildings
      .filter((building) =>
        building.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 6);
  }, [buildings, originQuery, destinationQuery, activeInput]);

  const handlePickBuilding = (building) => {
    if (activeInput === "origin") {
      setOriginQuery(building.name);
      setOriginBuilding(building);
    }

    if (activeInput === "destination") {
      setDestinationQuery(building.name);
      setDestinationBuilding(building);
    }

    setActiveInput(null);

    Keyboard.dismiss();
  };

 useEffect(() => {
   if (!originBuilding || !destinationBuilding) return;

   const startNodeId = getRoutePlaceNode(
     originBuilding.id,
     destinationBuilding.id,
     originBuilding.id
   );

   const endNodeId = getRoutePlaceNode(
     originBuilding.id,
     destinationBuilding.id,
     destinationBuilding.id
   );

   console.log("START NODE:", startNodeId);
   console.log("END NODE:", endNodeId);

   if (!startNodeId || !endNodeId) return;

   const path = findShortestPath(startNodeId, endNodeId);

   console.log("PATH:", path);

   if (!path || path.length === 0) return;

   setActiveRoute(path);

   const routePoints = path.filter(
     (point) =>
       typeof point.x === "number" &&
       typeof point.y === "number"
   );

   if (routePoints.length === 0 || !focusPoint) return;

   const centerX =
     routePoints.reduce((sum, point) => sum + point.x, 0) / routePoints.length;

   const centerY =
     routePoints.reduce((sum, point) => sum + point.y, 0) / routePoints.length;

   setTimeout(() => {
     focusPoint(centerX, centerY);
   }, 100);
 }, [originBuilding, destinationBuilding]);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>

        <View style={styles.routeIconColumn}>
          <Image
            source={require("../../assets/origen_icon.png")}
            style={styles.originIcon}
          />

          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Image
            source={require("../../assets/destino_icon.png")}
            style={styles.destinationIcon}
          />
        </View>

        <View style={styles.inputsContainer}>
          <TextInput
            placeholder="Punto Origen"
            placeholderTextColor="#5F6368"
            style={styles.input}
            value={originQuery}
            onChangeText={(text) => {
              setOriginQuery(text);
              setActiveInput("origin");
            }}
            onFocus={() => setActiveInput("origin")}
          />

          <View style={styles.divider} />

          <TextInput
            placeholder="Punto Destino"
            placeholderTextColor="#5F6368"
            style={styles.input}
            value={destinationQuery}
            onChangeText={(text) => {
              setDestinationQuery(text);
              setActiveInput("destination");
            }}
            onFocus={() => setActiveInput("destination")}
          />
        </View>
      </View>

      {activeInput && filteredBuildings.length > 0 && (
        <View style={styles.resultsContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredBuildings.map((building) => (
              <Pressable
                key={building.id}
                style={styles.resultItem}
                onPress={() => handlePickBuilding(building)}
              >
                <Text style={styles.resultTitle}>{building.name}</Text>

                {!!building.subtitle && (
                  <Text style={styles.resultSubtitle}>
                    {building.subtitle}
                  </Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 52,
    left: 16,
    right: 16,

    zIndex: 999,
    elevation: 10,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",
    borderRadius: 24,

    paddingVertical: 15,
    paddingLeft: 14,
    paddingRight: 16,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 6,
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 14,
    zIndex: 20,
  },

  closeText: {
    fontSize: 25,
    color: "#666666",
  },

  routeIconColumn: {
    width: 34,
    alignItems: "center",
    marginRight: 10,
  },

  originIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },

  destinationIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  dotsContainer: {
    alignItems: "center",
    marginVertical: 2,
    gap: 2,
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D6D6D6",
  },

  inputsContainer: {
    flex: 1,
    paddingRight: 22,
  },

  input: {
    height: 36,
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    paddingVertical: 0,
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
  },

  resultsContainer: {
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 6,
    maxHeight: 240,
  },

  resultItem: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
  },

  resultTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  resultSubtitle: {
    marginTop: 1,
    fontSize: 12,
    color: "#6B7280",
  },
});
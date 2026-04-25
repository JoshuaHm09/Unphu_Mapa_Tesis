import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../utils/supabase";

import BuildingModal from "../components/BuildingModal";
import FoodPlazaModal from "../components/FoodPlazaModal";
import DirectoryCard from "./DirectoryCard";
import ImageCarousel from "../components/ImageCarousel";
import RoomCard from "../components/RoomCard";
import { styles as mapStyles } from "../mapStyles";
import { UI_ICONS } from "../uiIcons";

export default function DirectoryScreen({ goBackToMap }) {
  const [buildings, setBuildings] = useState([]);
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFoodPlaza, setSelectedFoodPlaza] = useState(null);

  const [favoritesList, setFavoritesList] = useState([]);
  const [lastRemoved, setLastRemoved] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      const raw = await AsyncStorage.getItem("favoritesList");
      if (raw) setFavoritesList(JSON.parse(raw));
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  }, [favoritesList]);

  const toggleFavorite = useCallback((building) => {
    const isFav = favoritesList.some((b) => b.id === building.id);

    if (isFav) {
      setFavoritesList((prev) => prev.filter((b) => b.id !== building.id));
      setLastRemoved(building);
    } else {
      setFavoritesList((prev) => [...prev, building]);
      setLastRemoved(null);
    }
  }, [favoritesList]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: buildingsData, error: buildingsError } = await supabase
        .from("buildings")
        .select("id, name, subtitle, x, y, radius, images, floors");

      const { data: foodData, error: foodError } = await supabase
        .from("food_places")
        .select("*");

      if (buildingsError) {
        console.log("Error cargando buildings:", buildingsError);
      }

      if (foodError) {
        console.log("Error cargando food_places:", foodError);
      }

      if (buildingsData) {
        setBuildings(
          buildingsData.map((b) => ({
            ...b,
            kind: "building",
            images: b.images || [],
            floors: b.floors || {},
          }))
        );
      }

      if (foodData) {
        setFoodPlaces(
          foodData.map((f) => ({
            ...f,
            kind: "food",
            images: f.images || [],
          }))
        );
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const roomCardIcons = useMemo(
  () => ({
        ICON_CHAIR: UI_ICONS.ICON_CHAIR,
        ICON_BATHROOM: UI_ICONS.ICON_BATHROOM,
        ICON_LAB: UI_ICONS.ICON_LAB,
        ICON_AUDITORIO: UI_ICONS.ICON_AUDITORIO,
        ICON_COFFEE: UI_ICONS.ICON_COFFEE,
        ICON_CREDIT: UI_ICONS.ICON_CREDIT,
        ICON_DOG: UI_ICONS.ICON_DOG,
        ICON_ENFERMERIA2: UI_ICONS.ICON_ENFERMERIA2,
        ICON_LIBRARY2: UI_ICONS.ICON_LIBRARY2,
        ICON_VENDING2: UI_ICONS.ICON_VENDING2,
        ICON_COSMETOLOGY: UI_ICONS.ICON_COSMETOLOGY,
        ICON_AMADITA: UI_ICONS.ICON_AMADITA,
        ICON_DESK: UI_ICONS.ICON_DESK,
        ICON_PAPELERIA: UI_ICONS.ICON_PAPELERIA,
        ICON_IT: UI_ICONS.ICON_IT,
        ICON_MATH: UI_ICONS.ICON_MATH,
        ICON_TREE: UI_ICONS.ICON_TREE,
        ICON_TENNIS_1: UI_ICONS.ICON_TENNIS_1,
        ICON_FUTBOL: UI_ICONS.ICON_FUTBOL,
        ICON_RECEPCION: UI_ICONS.ICON_RECEPCION,
        ICON_BASEBALL: UI_ICONS.ICON_BASEBALL,
        ICON_TOURISM: UI_ICONS.ICON_TOURISM,
        ICON_DERECHO: UI_ICONS.ICON_DERECHO,
        ICON_AC_FALSE: UI_ICONS.ICON_AC_FALSE,
        ICON_PROJECTOR_FALSE: UI_ICONS.ICON_PROJECTOR_FALSE,
        ICON_AIR: UI_ICONS.ICON_AIR,
        ICON_PROJECTOR: UI_ICONS.ICON_PROJECTOR,
        ICON_STUDENTS: UI_ICONS.ICON_STUDENTS,
        ICON_BALONCESTO: UI_ICONS.ICON_BALONCESTO,
        ICON_GYM_3: UI_ICONS.ICON_GYM_3,
        ICON_COURRIER: UI_ICONS.ICON_COURRIER,
        ICON_TALLER: UI_ICONS.ICON_TALLER,
        ICON_FACUART: UI_ICONS.ICON_FACUART,
        ICON_ESCUELADISE: UI_ICONS.ICON_ESCUELADISE,
        ICON_EGRESADOSOFI: UI_ICONS.ICON_EGRESADOSOFI,
        ICON_FACULTADARTS: UI_ICONS.ICON_FACULTADARTS,
        ICON_DEPOSITO: UI_ICONS.ICON_DEPOSITO,
        ICON_SALONPROYECCION: UI_ICONS.ICON_SALONPROYECCION,
        ICON_MUSIC: UI_ICONS.ICON_MUSIC,
        ICON_AGROPECUARIA: UI_ICONS.ICON_AGROPECUARIA,
        ICON_TUTORIA: UI_ICONS.ICON_TUTORIA,
        ICON_GEOMATICA: UI_ICONS.ICON_GEOMATICA,
      }),
    []
  );

  const RoomCardInjected = useCallback(
    (props) => <RoomCard {...props} styles={mapStyles} icons={roomCardIcons} />,
    [roomCardIcons]
  );

  const sortedItems = useMemo(() => {
    const buildingOrder = (item) => {
      if (item.kind === "food") return 9999;

      const match = item.name?.match(/\d+/);
      if (match) return parseInt(match[0], 10);

      return 5000;
    };

    const sortedBuildings = [...buildings].sort((a, b) => {
      const aOrder = buildingOrder(a);
      const bOrder = buildingOrder(b);

      if (aOrder !== bOrder) return aOrder - bOrder;

      return (a.name || "").localeCompare(b.name || "");
    });

    const sortedFood = [...foodPlaces].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );

    return [...sortedBuildings, ...sortedFood];
  }, [buildings, foodPlaces]);

  const handlePressItem = (item) => {
    if (item.kind === "food") {
      setSelectedFoodPlaza(item);
      return;
    }

    setSelectedBuilding(item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.mapButton} onPress={goBackToMap}>
          <Text style={styles.mapButtonText}>Campus</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Directorio</Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text style={styles.infoText}>Cargando...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedItems}
          keyExtractor={(item) => `${item.kind}-${item.id}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <DirectoryCard
              building={item}
              onPress={() => handlePressItem(item)}
            />
          )}
        />
      )}

      <BuildingModal
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        favoritesList={favoritesList}
        toggleFavorite={toggleFavorite}
        RoomCard={RoomCardInjected}
        ImageCarousel={ImageCarousel}
      />

      <FoodPlazaModal
        plaza={selectedFoodPlaza}
        onClose={() => setSelectedFoodPlaza(null)}
        ImageCarousel={ImageCarousel}
      />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    backgroundColor: "#fff",
    justifyContent: "center",
    minHeight: 70,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  mapButton: {
    position: "absolute",
    left: 9,
    top: 30,
    backgroundColor: "#111827",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    marginTop: 10,
    fontSize: 15,
    color: "#6B7280",
  },
};
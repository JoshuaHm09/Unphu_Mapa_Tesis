import React, { useState, useEffect, useMemo, useCallback } from "react";
import { styles } from "./mapStyles";
import { Dimensions, View, Modal, Pressable, Text, BackHandler } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";

import DirectoryButton from "./DirectoryScreen/DirectoryButton";
import useAuthSession from "./hooks/useAuthSession";
import useCampusData from "./hooks/useCampusData";
import useFavorites from "./hooks/useFavorites";
import useMapGestures from "./hooks/useMapGestures";

import { getMarkerForBuilding } from "../utils/mapDataHelpers";
import { UI_ICONS } from "./uiIcons";

// Data helpers
import { filterPoints } from "../src/components/filterPoints";
import AnimatedFilterPin from "./components/AnimatedFilterPin";

// UI components
import MarkerPin from "./components/MarkerPin";
import ImageCarousel from "./components/ImageCarousel";
import BottomMenu from "./components/BottomMenu";
import FavoritesModal from "./components/FavoritesModal";
import LegendModal from "./components/LegendModal";
import Filters from "./components/filters";
import BuildingModal from "./components/BuildingModal";
import FoodPlazaModal from "./components/FoodPlazaModal";
import SearchResults from "./components/SearchResults";
import RoomCard from "./components/RoomCard";

// Admin
import AdminSidePanelButton from "./AdminComponents/AdminSidePanelButton";
import AdminHomeScreen from "./AdminComponents/AdminHomeScreen";
import AdminBuildingScreen from "./AdminComponents/AdminBuildingScreen";
import AdminBuildingFormScreen from "./AdminComponents/AdminBuildingFormScreen";
import AdminFoodScreen from "./AdminComponents/AdminFoodScreen";
import AdminFoodFormScreen from "./AdminComponents/AdminFoodFormScreen";
import LoginOverlay from "./LoginAuth/LoginOverlay";

// Mapa
const IMG_W = 4096;
const IMG_H = 5120;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MapScreen({ hideBottomMenu = false, goToDirectory }) {
  const ADMIN_EMAIL = "admintest@gmail.com";

  const insets = useSafeAreaInsets();

  const handleOpenDirectory = () => {
    goToDirectory();
  };

  const { buildings, foodPlaza, fetchBuildings, fetchFoodPlaces } = useCampusData();

  const {
    showLoginOverlay,
    isAdmin,
    handleLogin,
    handleContinueGuest,
  } = useAuthSession(ADMIN_EMAIL);

  const {
    favoritesList,
    toastMessage,
    toastVisible,
    toggleFavorite,
    undoLastRemoved,
  } = useFavorites();

  const {
    minScale,
    scale,
    composedGesture,
    animatedStyle,
    recenterMap,
    focusBuilding,
  } = useMapGestures({
    imgWidth: IMG_W,
    imgHeight: IMG_H,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  });

  const [activeView, setActiveView] = useState("map");
  const [selectedAdminBuilding, setSelectedAdminBuilding] = useState(null);
  const [selectedAdminFood, setSelectedAdminFood] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFoodPlaza, setSelectedFoodPlaza] = useState(null);

  const [filters, setFilters] = useState({
    bathrooms: false,
    vending: false,
    parking: false,
    labs: false,
    greenAreas: false,
    studyAreas: false,
  });

  const [favoritesPressed, setFavoritesPressed] = useState(false);
  const [legendPressed, setLegendPressed] = useState(false);
  const [filtersPressed, setFiltersPressed] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false);
  const [legendModalVisible, setLegendModalVisible] = useState(false);

  // ===== SEARCH STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // ===== ANDROID BACK =====
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      const anyOpen =
        !!selectedBuilding ||
        !!selectedFoodPlaza ||
        !!filtersVisible ||
        !!favoritesModalVisible ||
        !!legendModalVisible;

      if (anyOpen) {
        setSelectedBuilding(null);
        setSelectedFoodPlaza(null);
        setFiltersVisible(false);
        setFavoritesModalVisible(false);
        setLegendModalVisible(false);
        return true;
      }

      return false;
    });

    return () => sub.remove();
  }, [
    selectedBuilding,
    selectedFoodPlaza,
    filtersVisible,
    favoritesModalVisible,
    legendModalVisible,
  ]);

  // RoomCard icons
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
      ICON_BASEBALL: UI_ICONS.ICON_BASEBALL,
      ICON_TOURISM: UI_ICONS.ICON_TOURISM,
      ICON_DERECHO: UI_ICONS.ICON_DERECHO,
      ICON_AC_FALSE: UI_ICONS.ICON_AC_FALSE,
      ICON_PROJECTOR_FALSE: UI_ICONS.ICON_PROJECTOR_FALSE,
      ICON_AIR: UI_ICONS.ICON_AIR,
      ICON_PROJECTOR: UI_ICONS.ICON_PROJECTOR,
      ICON_STUDENTS: UI_ICONS.ICON_STUDENTS,
    }),
    []
  );

  const RoomCardInjected = useCallback(
    (props) => <RoomCard {...props} styles={styles} icons={roomCardIcons} />,
    [roomCardIcons]
  );

  // BottomMenu helpers
  const openOnly = (which) => {
    setFiltersVisible(false);
    setFavoritesModalVisible(false);
    setLegendModalVisible(false);
    setSelectedBuilding(null);
    setSelectedFoodPlaza(null);

    if (which === "filters") setFiltersVisible(true);
    else if (which === "favorites") setFavoritesModalVisible(true);
    else if (which === "legend") setLegendModalVisible(true);
  };

  const openFilters = () => openOnly("filters");
  const openFavorites = () => openOnly("favorites");
  const openLegend = () => openOnly("legend");

  if (activeView === "admin") {
    return (
      <AdminHomeScreen
        onBack={() => setActiveView("map")}
        onPressBuildings={() => setActiveView("admin-buildings")}
        onPressFood={() => setActiveView("admin-food")}
      />
    );
  }

  if (activeView === "admin-buildings") {
    return (
      <AdminBuildingScreen
        buildings={buildings}
        onBack={() => setActiveView("admin")}
        onSelectBuilding={(building) => {
          setSelectedAdminBuilding(building);
          setActiveView("admin-building-form");
        }}
      />
    );
  }

  if (activeView === "admin-building-form" && selectedAdminBuilding) {
    return (
      <AdminBuildingFormScreen
        building={selectedAdminBuilding}
        onBack={() => setActiveView("admin-buildings")}
        onSaved={async (updatedBuilding) => {
          await fetchBuildings();
          setSelectedAdminBuilding(updatedBuilding || null);
          setActiveView("admin-buildings");
        }}
      />
    );
  }

  if (activeView === "admin-food") {
    return (
      <AdminFoodScreen
        foodPlaces={foodPlaza}
        onBack={() => setActiveView("admin")}
        onSelectFood={(food) => {
          setSelectedAdminFood(food);
          setActiveView("admin-food-form");
        }}
      />
    );
  }

  if (activeView === "admin-food-form" && selectedAdminFood) {
    return (
      <AdminFoodFormScreen
        foodPlace={selectedAdminFood}
        onBack={() => setActiveView("admin-food")}
        onSaved={async (updatedFood) => {
          await fetchFoodPlaces();
          setSelectedAdminFood(updatedFood || null);
          setActiveView("admin-food");
        }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <Image
        source={UI_ICONS.BG_PATTERN}
        style={styles.backgroundPattern}
        contentFit="cover"
      />

      {/* SEARCH BAR + RESULTS */}
      <SearchResults
        styles={styles}
        buildings={buildings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
        onPickBuilding={(b) => {
          focusBuilding(b);
          setSelectedBuilding(b);
        }}
      />

      {isAdmin && (
        <AdminSidePanelButton onPress={() => setActiveView("admin")} />
      )}

      {filtersVisible && (
        <Pressable
          style={styles.filterOverlay}
          onPress={() => setFiltersVisible(false)}
        />
      )}

      <Filters
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        filters={filters}
        setFilters={setFilters}
      />

      <GestureDetector gesture={composedGesture}>
        <Animated.View>
          <Animated.View
            style={[
              { width: IMG_W, height: IMG_H, position: "relative" },
              animatedStyle,
            ]}
          >
            <Image source={UI_ICONS.MAP} style={{ flex: 1 }} contentFit="cover" />

            {/* Pins de edificios */}
            {buildings.map((b) => {
              const { label, iconSource } = getMarkerForBuilding(b);

              return (
                <MarkerPin
                  key={`pin-${b.id}`}
                  x={b.x}
                  y={b.y}
                  label={label}
                  iconSource={iconSource}
                  onPress={() => setSelectedBuilding(b)}
                />
              );
            })}

            {/* Pin foodplaza */}
            {foodPlaza.map((f) => {
              const kind = (f.type || f.category || "").toString().toLowerCase();
              const iconSource = kind.includes("caf")
                ? UI_ICONS.ICON_CAFETERIA_SMALL
                : UI_ICONS.ICON_FOODPLAZA_SMALL;

              return (
                <MarkerPin
                  key={`food-pin-${f.id}`}
                  x={f.x}
                  y={f.y}
                  label={null}
                  iconSource={iconSource}
                  onPress={() => setSelectedFoodPlaza(f)}
                />
              );
            })}

            {/* Iconos filtros con el pop */}
            {Object.keys(filters).map(
              (key) =>
                filters[key] &&
                (filterPoints[key] || []).map((p) => (
                  <AnimatedFilterPin
                    key={`${key}-${p.id}`}
                    x={p.x}
                    y={p.y}
                    type={key}
                    scaleRef={scale}
                    onPress={() => {}}
                  />
                ))
            )}

            {/* Áreas pressables: edificios */}
            {buildings.map((b) => (
              <Pressable
                key={`touch-b-${b.id}`}
                style={[
                  styles.pressableArea,
                  {
                    left: b.x - b.radius,
                    top: b.y - b.radius,
                    width: b.radius * 2,
                    height: b.radius * 2,
                    borderRadius: b.radius,
                  },
                ]}
                onPress={() => setSelectedBuilding(b)}
              />
            ))}

            {/* Áreas pressables: foodplaza */}
            {foodPlaza.map((f) => (
              <Pressable
                key={`touch-f-${f.id}`}
                style={[
                  styles.pressableArea,
                  {
                    left: f.x - f.radius,
                    top: f.y - f.radius,
                    width: f.radius * 2,
                    height: f.radius * 2,
                    borderRadius: f.radius,
                  },
                ]}
                onPress={() => setSelectedFoodPlaza(f)}
              />
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <DirectoryButton onPress={handleOpenDirectory} />

      {/* Botón de recentrar */}
      <Pressable style={styles.recenterCircle} onPress={recenterMap}>
        <Image
          source={UI_ICONS.ICON_RECENTER}
          style={styles.recenterIcon}
          contentFit="contain"
        />
      </Pressable>

      {/* Modales */}
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

      {!hideBottomMenu && (
        <BottomMenu
          filtersPressed={filtersPressed}
          favoritesPressed={favoritesPressed}
          legendPressed={legendPressed}
          setFiltersPressed={setFiltersPressed}
          setFavoritesPressed={setFavoritesPressed}
          setLegendPressed={setLegendPressed}
          setFiltersVisible={openFilters}
          setFavoritesModalVisible={openFavorites}
          setLegendModalVisible={openLegend}
        />
      )}

      <FavoritesModal
        visible={favoritesModalVisible}
        onClose={() => {
          setFavoritesModalVisible(false);
          setFavoritesPressed(false);
        }}
        favoritesList={favoritesList}
        handleUndo={undoLastRemoved}
        UNDO_ICON={UI_ICONS.UNDO_ICON}
        CLOSE_ICON={UI_ICONS.CLOSE_ICON}
        BUILDING_ICON_GREEN={UI_ICONS.BUILDING_ICON_GREEN}
        FAVORITE_FILLED_GREEN={UI_ICONS.FAVORITE_FILLED_GREEN}
        onSelectBuilding={(b) => setSelectedBuilding(b)}
        toggleFavorite={toggleFavorite}
      />

      <LegendModal
        visible={legendModalVisible}
        onClose={() => {
          setLegendModalVisible(false);
          setLegendPressed(false);
        }}
        bottomInset={insets.bottom}
        ICON_BUILDING={UI_ICONS.BUILDING_ICON_GREEN}
        ICON_FOOD={UI_ICONS.ICON_COFFEE}
        ICON_FAVORITE={UI_ICONS.FAVORITE_FILLED_GREEN}
        ICON_CENTER={UI_ICONS.ICON_RECENTER}
        CLOSE_ICON={UI_ICONS.CLOSE_ICON}
        ICON_AIR={UI_ICONS.ICON_AIR}
      />

      {/* Mensaje Toast */}
      <Modal transparent visible={toastVisible} animationType="none">
        <View
          pointerEvents="none"
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 120,
            backgroundColor: "transparent",
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
            <Text style={{ color: "white", fontSize: 14 }}>{toastMessage}</Text>
          </View>
        </View>
      </Modal>

      <LoginOverlay
        visible={showLoginOverlay}
        onLogin={handleLogin}
        onContinueGuest={handleContinueGuest}
      />
    </View>
  );
}
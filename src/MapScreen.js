
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { styles } from "./mapStyles";
import { Dimensions, View, Modal, Pressable, Text, BackHandler } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../utils/supabase";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Image } from "expo-image";
import DirectoryButton from "./DirectoryScreen/DirectoryButton";

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

// Mapa
const IMG_W = 4096;
const IMG_H = 5120;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// helper clamp
const clamp = (v, a, b) => {
  "worklet";
  return Math.min(Math.max(v, a), b);
};

const getMarkerForBuilding = (b) => {
  const id = b.id;
  let label = String(id);
  let iconSource = null;

  if (id === 16 || id === 23) (label = null), (iconSource = UI_ICONS.ICON_SOCCER_2);
  else if (id === 21) (label = null), (iconSource = UI_ICONS.ICON_TENNIS_2);
  else if (id === 20) (label = null), (iconSource = UI_ICONS.ICON_BASKET_2);
  else if (id === 22) (label = null), (iconSource = UI_ICONS.ICON_GYM_2);
  else if (id === 17) (label = null), (iconSource = UI_ICONS.ICON_TREE_2);
  else if (id === 15) (label = null), (iconSource = UI_ICONS.ICON_BASEBALL_2);
  else if (id === 12) label = "6A";
  else if (id === 13) label = "12";
  else if (id === 19) label = "B";

  return { label, iconSource };
};

export default function MapScreen({ hideBottomMenu = false, goToDirectory, canAccessAdmin = false }) {
  const insets = useSafeAreaInsets();

    const handleOpenDirectory = () => {
    goToDirectory();
  };


  const [buildings, setBuildings] = useState([]);
  const [foodPlaza, setFoodPlaza] = useState([]);

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

  const [favoritesList, setFavoritesList] = useState([]);
  const [lastRemoved, setLastRemoved] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // ===== SEARCH STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);





  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);
  };

  //  FAVORITOS
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

  const toggleFavorite = useCallback(
    (building) => {
      const isFav = favoritesList.some((b) => b.id === building.id);
      if (isFav) {
        setFavoritesList((prev) => prev.filter((b) => b.id !== building.id));
        setLastRemoved(building);
        showToast("Edificio eliminado de favoritos");
      } else {
        setFavoritesList((prev) => [...prev, building]);
        setLastRemoved(null);
        showToast("Edificio agregado a favoritos");
      }
    },
    [favoritesList]
  );

  // Data de SupaBase
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("buildings")
        .select("id, name, subtitle, x, y, radius, images, floors");
      if (data) {
        setBuildings(
          data.map((b) => ({
            ...b,
            images: b.images || [],
            floors: b.floors || {},
          }))
        );
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("food_places").select("*");
      if (data) setFoodPlaza(data);
    })();
  }, []);

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
  }, [selectedBuilding, selectedFoodPlaza, filtersVisible, favoritesModalVisible, legendModalVisible]);

  // ===== GESTOS  =====
  const minScale = Math.min(SCREEN_WIDTH / IMG_W, SCREEN_HEIGHT / IMG_H);
  const maxScale = 1;

  const scale = useSharedValue(minScale * 1.5);
  const savedScale = useSharedValue(minScale);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  useEffect(() => {
    const initialScale = minScale * 3;
    scale.value = initialScale;

    const offsetX = -(IMG_W * initialScale - SCREEN_WIDTH) / 10000;
    const offsetY = -(IMG_H * initialScale - SCREEN_HEIGHT) / 10;

    translateX.value = offsetX;
    translateY.value = offsetY;
  }, []);

  const clampToBounds = () => {
    "worklet";
    const maxTx = Math.max(0, (IMG_W * scale.value - SCREEN_WIDTH) / 2);
    const maxTy = Math.max(0, (IMG_H * scale.value - SCREEN_HEIGHT) / 2);

    translateX.value = withTiming(clamp(translateX.value, -maxTx, maxTx));
    translateY.value = withTiming(clamp(translateY.value, -maxTy, maxTy));
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((ev) => {
      if (scale.value <= minScale + 0.01) {
        translateX.value = 0;
        translateY.value = 0;
        return;
      }
      translateX.value = savedTranslateX.value + ev.translationX;
      translateY.value = savedTranslateY.value + ev.translationY;
    })
    .onEnd(() => clampToBounds());

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((ev) => {
      scale.value = clamp(savedScale.value * ev.scale, minScale, maxScale);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      clampToBounds();
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  //  RoomCard icons
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

  //  BottomMenu helpers
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

  return (
    <View style={styles.screen}>
      <Image source={UI_ICONS.BG_PATTERN} style={styles.backgroundPattern} contentFit="cover" />

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
         const targetScale = minScale * 3;
         scale.value = withTiming(targetScale);

         const offsetX = (b.x - IMG_W / 2) * targetScale;
         const offsetY = (b.y - IMG_H / 2) * targetScale;

         translateX.value = withTiming(-offsetX);
         translateY.value = withTiming(-offsetY);

         setSelectedBuilding(b);
       }}
     />




      {filtersVisible && <Pressable style={styles.filterOverlay} onPress={() => setFiltersVisible(false)} />}
      <Filters visible={filtersVisible} onClose={() => setFiltersVisible(false)} filters={filters} setFilters={setFilters} />


      <GestureDetector gesture={composedGesture}>
        <Animated.View>
          <Animated.View style={[{ width: IMG_W, height: IMG_H, position: "relative" }, animatedStyle]}>
            <Image source={UI_ICONS.MAP} style={{ flex: 1 }} contentFit="cover" />

            // Pins de edificios
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

            // Pin foodplaza
            {foodPlaza.map((f) => {
              const kind = (f.type || f.category || "").toString().toLowerCase();
              const iconSource = kind.includes("caf") ? UI_ICONS.ICON_CAFETERIA_SMALL : UI_ICONS.ICON_FOODPLAZA_SMALL;

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

            // Iconos Filtros con el pop
            {Object.keys(filters).map(
              (key) =>
                filters[key] &&
                (filterPoints[key] || []).map((p) => (
                  <AnimatedFilterPin key={`${key}-${p.id}`} x={p.x} y={p.y} type={key} scaleRef={scale} onPress={() => {}} />
                ))
            )}

            // Areas pressables: edificios
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

            // Areas pressables: foodplaza
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

       {canAccessAdmin && <DirectoryButton onPress={handleOpenDirectory} />}

      // Boton de recentrar (Tengo que cambiarlo)
      <Pressable
        style={styles.recenterCircle}
        onPress={() => {
          const initialScale = minScale * 1.5;
          scale.value = withTiming(initialScale, { duration: 300 });

          const offsetX = -(IMG_W * initialScale - SCREEN_WIDTH) / 1000;
          const offsetY = -(IMG_H * initialScale - SCREEN_HEIGHT) / 500;

          translateX.value = withTiming(offsetX, { duration: 300 });
          translateY.value = withTiming(offsetY, { duration: 300 });
        }}
      >
        <Image source={UI_ICONS.ICON_RECENTER} style={styles.recenterIcon} contentFit="contain" />
      </Pressable>

      // Modales
      <BuildingModal
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        favoritesList={favoritesList}
        toggleFavorite={toggleFavorite}
        RoomCard={RoomCardInjected}
        ImageCarousel={ImageCarousel}
      />

      <FoodPlazaModal plaza={selectedFoodPlaza} onClose={() => setSelectedFoodPlaza(null)} ImageCarousel={ImageCarousel} />

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
        handleUndo={() => {
          if (lastRemoved) {
            setFavoritesList([...favoritesList, lastRemoved]);
            setLastRemoved(null);
          }
        }}
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

      // Mensaje Toast
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
    </View>
  );
}

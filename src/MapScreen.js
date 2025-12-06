// File: src/MapScreen.js
import React, { useState, useEffect, useMemo } from "react";
import { styles } from "./mapStyles";
import {
  Dimensions,
  View,
  Modal,
  Pressable,
  Text,
  ScrollView,
  TextInput,
  Keyboard,
  BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedFilterPin from "./components/AnimatedFilterPin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../utils/supabase";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";

// Data helpers
import { filterPoints } from "../src/components/filterPoints";

// UI components
import MarkerPin from "./components/MarkerPin";
import ImageCarousel from "./components/ImageCarousel";
import BottomMenu from "./components/BottomMenu";
import FavoritesModal from "./components/FavoritesModal";
import LegendModal from "./components/LegendModal";
import Filters, { FILTER_ICONS } from "./components/filters";
import BuildingModal from "./components/BuildingModal";
import FoodPlazaModal from "./components/FoodPlazaModal";

// ========= ICONOS (completos/restaurados) =========
const ICON_SOCCER_2 = require("../assets/futbol.png");
const ICON_TENNIS_2 = require("../assets/Tennis.png");
const ICON_BASKET_2 = require("../assets/Basket.png");
const ICON_GYM_2 = require("../assets/gym_verde.png");
const ICON_TREE_2 = require("../assets/icons/locator_icon_tree.png");
const ICON_BASEBALL_2 = require("../assets/icons/locator_icon_baseball.png");

const BUILDING_ICON_WHITE = require("../assets/building_icon_white.png");
const BUILDING_ICON_GREEN = require("../assets/building_icon_green.png");
const FAVORITE_UNFILLED_WHITE = require("../assets/favorites_icon_white.png");
const FAVORITE_FILLED_WHITE = require("../assets/favorites_pressed_white.png");
const FAVORITE_FILLED_GREEN = require("../assets/favorite_pressed_green.png");

const UNDO_ICON = require("../assets/undo.png");
const CLOSE_ICON = require("../assets/close.png");

const ICON_AUDITORIO = require("../assets/Auditorio.png");
const ICON_COFFEE = require("../assets/Coffee.png");
const ICON_CREDIT = require("../assets/Credit_Card.png");
const ICON_DOG = require("../assets/Dog_Paw.png");
const ICON_ENFERMERIA2 = require("../assets/Enfermeria.png");
const ICON_LIBRARY2 = require("../assets/Library.png");
const ICON_VENDING2 = require("../assets/Vending_Machine.png");
const ICON_COSMETOLOGY = require("../assets/Cosmetology.png");
const ICON_AMADITA = require("../assets/Amadita.png");
const ICON_DESK = require("../assets/desk.png");
const ICON_PAPELERIA = require("../assets/papeleria.png");
const ICON_SOCCER = require("../assets/Soccer.png");
const ICON_IT = require("../assets/computo.png");
const ICON_MATH = require("../assets/math.png");
const ICON_TREE = require("../assets/Tree.png");
const ICON_BASEBALL = require("../assets/Pelota.png");
const ICON_TOURISM = require("../assets/turista.png");
const ICON_DERECHO = require("../assets/derecho.png");

const ICON_AC_FALSE = require("../assets/AC_False.png");
const ICON_PROJECTOR_FALSE = require("../assets/Projector_False.png");
const ICON_LAB = require("../assets/lab.png");
const ICON_BATHROOM = require("../assets/bathrooom.png");
const ICON_CHAIR = require("../assets/chair.png");
const ICON_AIR = require("../assets/air-conditioner.png");
const ICON_PROJECTOR = require("../assets/projector.png");
const ICON_STUDENTS = require("../assets/students.png");

const BG_PATTERN = require("../assets/bg_pattern.png");
const MAP = require("../assets/Unphu_Mapa_v4.png");
const ICON_RECENTER = require("../assets/center.png");

const ICON_FOODPLAZA_SMALL = require("../assets/icons/locator_icon_foodplaza.png");
const ICON_CAFETERIA_SMALL = require("../assets/icons/locator_icon_cafeteria_2.png");

// ========= Constantes mapa =========
const IMG_W = 4096;
const IMG_H = 5120;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// helper clamp
const clamp = (v, a, b) => {
  "worklet";
  return Math.min(Math.max(v, a), b);
};

// ========= Helpers UI =========
const getAutoDescription = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("baño") || lower.includes("banos")) return "Baños disponibles para estudiantes y personal.";
  if (lower.includes("santo domingo")) return "Máquina Expendedora de Café Santo Domingo.";
  if (lower.includes("laboratorio") || lower.includes("lab")) return "Laboratorio equipado para prácticas y uso académico.";
  if (lower.includes("aula")) return "Aula destinada a clases y actividades académicas.";
  if (lower.includes("recepcion")) return "Área de recepción para asistencia e información.";
  if (lower.includes("vending")) return "Máquina expendedora con snacks y bebidas.";
  if (lower.includes("cafeteria") || lower.includes("café")) return "Área de cafetería para alimentos y bebidas.";
  if (lower.includes("registro") || lower.includes("admisiones")) return "Área administrativa para procesos académicos.";
  if (lower.includes("computo")) return "Sala equipada con computadoras y recursos tecnológicos.";
  if (lower.includes("biblioteca")) return "Área de biblioteca y recursos de estudio.";
  if (lower.includes("salon")) return "Salón destinado a reuniones y actividades académicas.";
  if (lower.includes("economato") || lower.includes("papeleria")) return "Establecimiento comercial para suplir materiales universitarios.";
  if (lower.includes("pet")) return "Área de servicios y atención para mascotas.";
  if (lower.includes("campo")) return "Área deportiva destinada a actividades físicas.";
  return "Espacio académico o administrativo dentro del campus.";
};

const getMarkerForBuilding = (b) => {
  const id = b.id;
  let label = String(id);
  let iconSource = null;
  if (id === 16 || id === 23) (label = null), (iconSource = ICON_SOCCER_2);
  else if (id === 21) (label = null), (iconSource = ICON_TENNIS_2);
  else if (id === 20) (label = null), (iconSource = ICON_BASKET_2);
  else if (id === 22) (label = null), (iconSource = ICON_GYM_2);
  else if (id === 17) (label = null), (iconSource = ICON_TREE_2);
  else if (id === 15) (label = null), (iconSource = ICON_BASEBALL_2);
  else if (id === 12) label = "6A";
  else if (id === 13) label = "12";
  else if (id === 19) label = "B";
  return { label, iconSource };
};

// ========= Componente =========
export default function MapScreen({ hideBottomMenu = false }) {
  const insets = useSafeAreaInsets();

  // State
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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);
  };

  // Favoritos (storage)
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

  const toggleFavorite = React.useCallback(
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

  // Datos
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

  // Back HW
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

  // ===================== Gestos estilo Google Maps =====================
  const fitScale = Math.min(SCREEN_WIDTH / IMG_W, SCREEN_HEIGHT / IMG_H);
  const minScale = fitScale * 1.1;
  const maxScale = 3.0;
  const BLEED_X = 160;
  const BLEED_Y = 320;
  const CLAMP_MS = 120;

  const scale = useSharedValue(minScale * 2.0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const saved = React.useRef({
    startScale: minScale,
    startTx: 0,
    startTy: 0,
  });

  // ✅ centrar un punto específico del mapa a un zoom
  const centerOnPoint = (px, py, s) => {
    "worklet";
    const tx = SCREEN_WIDTH / 2 - px * s;
    const ty = SCREEN_HEIGHT / 2 - py * s;
    return { tx, ty };
  };

  const boundsFor = (s) => {
    "worklet";
    const contentW = IMG_W * s;
    const contentH = IMG_H * s;
    const maxTx = Math.max(0, (contentW - SCREEN_WIDTH) / 2 + BLEED_X);
    const maxTy = Math.max(0, (contentH - SCREEN_HEIGHT) / 2 + BLEED_Y);
    return { maxTx, maxTy };
  };

  const clampXY = () => {
    "worklet";
    const { maxTx, maxTy } = boundsFor(scale.value);
    translateX.value = clamp(translateX.value, -maxTx, maxTx);
    translateY.value = clamp(translateY.value, -maxTy, maxTy);
  };

  const clampXYAnimated = () => {
    "worklet";
    const { maxTx, maxTy } = boundsFor(scale.value);
    translateX.value = withTiming(clamp(translateX.value, -maxTx, maxTx), { duration: CLAMP_MS });
    translateY.value = withTiming(clamp(translateY.value, -maxTy, maxTy), { duration: CLAMP_MS });
  };

  // 🎯 PUNTO INICIAL (B): centraremos este punto del campus
  // Usa los coords de tu edificio/área preferida. Por defecto: 50% ancho, 80% alto.
  const INIT_TARGET_X = IMG_W * 0.25;
  const INIT_TARGET_Y = IMG_H * 0.55;
  const INIT_ZOOM = fitScale * 2.0; // más bajo = más lejos

  useEffect(() => {
    const s = Math.min(Math.max(INIT_ZOOM, minScale), maxScale);
    const { tx, ty } = centerOnPoint(INIT_TARGET_X, INIT_TARGET_Y, s);
    scale.value = s;
    translateX.value = tx;
    translateY.value = ty;
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      saved.current.startTx = translateX.value;
      saved.current.startTy = translateY.value;
    })
    .onUpdate((ev) => {
      translateX.value = saved.current.startTx + ev.translationX;
      translateY.value = saved.current.startTy + ev.translationY;
    })
    .onEnd(() => {
      clampXYAnimated();
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      saved.current.startScale = scale.value;
      saved.current.startTx = translateX.value;
      saved.current.startTy = translateY.value;
    })
    .onUpdate((ev) => {
      const nextScale = clamp(saved.current.startScale * ev.scale, minScale, maxScale);
      const fx = clamp(ev.focalX, 0, SCREEN_WIDTH);
      const fy = clamp(ev.focalY, 0, SCREEN_HEIGHT);
      const cx = (fx - saved.current.startTx) / saved.current.startScale;
      const cy = (fy - saved.current.startTy) / saved.current.startScale;

      translateX.value = fx - cx * nextScale;
      translateY.value = fy - cy * nextScale;
      scale.value = nextScale;

      if (nextScale === minScale) clampXY();
    })
    .onEnd(() => {
      clampXYAnimated();
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // 🔄 Recentrar: último edificio seleccionado o el punto inicial
  const DURATION_MS = 300;
  function recenter() {
    const targetScale = Math.min(Math.max(INIT_ZOOM, minScale), maxScale);
    const { x, y } =
      selectedBuilding?.x && selectedBuilding?.y
        ? { x: selectedBuilding.x, y: selectedBuilding.y }
        : { x: INIT_TARGET_X, y: INIT_TARGET_Y };

    const { tx, ty } = centerOnPoint(x, y, targetScale);
    scale.value = withTiming(targetScale, { duration: DURATION_MS });
    translateX.value = withTiming(tx, { duration: DURATION_MS });
    translateY.value = withTiming(ty, { duration: DURATION_MS }, () => {
      clampXYAnimated();
    });
  }

  // RoomCard (memo para evitar parpadeos)
  const RoomCard = React.memo(function RoomCard({
    name,
    capacity,
    description,
    ac = undefined,
    projector = undefined,
  }) {
    const lower = name.toLowerCase();
    const finalDescription = description ?? getAutoDescription(name);
    const isClassroom = lower.includes("aula");
    const isLab = lower.includes("laboratorio") || lower.includes("lab");
    let mainIcon = { src: ICON_CHAIR, size: 35 };
    if (lower.includes("baño") || lower.includes("banos")) mainIcon = { src: ICON_BATHROOM, size: 35 };
    else if (isLab) mainIcon = { src: ICON_LAB, size: 35 };
    else if (lower.includes("auditorio")) mainIcon = { src: ICON_AUDITORIO, size: 28 };
    else if (lower.includes("cafe") || lower.includes("coffee")) mainIcon = { src: ICON_COFFEE, size: 30 };
    else if (lower.includes("cobro") || lower.includes("pago") || lower.includes("cajero")) mainIcon = { src: ICON_CREDIT, size: 30 };
    else if (lower.includes("veterinaria") || lower.includes("pet")) mainIcon = { src: ICON_DOG, size: 26 };
    else if (lower.includes("medico") || lower.includes("dispensario")) mainIcon = { src: ICON_ENFERMERIA2, size: 30 };
    else if (lower.includes("biblioteca")) mainIcon = { src: ICON_LIBRARY2, size: 30 };
    else if (lower.includes("vending")) mainIcon = { src: ICON_VENDING2, size: 36 };
    else if (lower.includes("estetica")) mainIcon = { src: ICON_COSMETOLOGY, size: 35 };
    else if (lower.includes("amadita")) mainIcon = { src: ICON_AMADITA, size: 35 };
    else if (lower.includes("direccion")) mainIcon = { src: ICON_DESK, size: 35 };
    else if (lower.includes("papeleria")) mainIcon = { src: ICON_PAPELERIA, size: 35 };
    else if (lower.includes("tecnico")) mainIcon = { src: ICON_IT, size: 35 };
    else if (lower.includes("math")) mainIcon = { src: ICON_MATH, size: 35 };
    else if (lower.includes("bosque")) mainIcon = { src: ICON_TREE, size: 35 };
    else if (lower.includes("campo")) mainIcon = { src: ICON_BASEBALL, size: 35 };
    else if (lower.includes("turismo")) mainIcon = { src: ICON_TOURISM, size: 35 };
    else if (lower.includes("derecho")) mainIcon = { src: ICON_DERECHO, size: 35 };

    return (
      <View style={styles.card}>
        <View style={styles.cardIconWrapper}>
          <Image source={mainIcon.src} style={{ width: mainIcon.size, height: mainIcon.size }} contentFit="contain" transition={0} />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardDescription}>{finalDescription}</Text>
          <View style={styles.cardFooter}>
            {(isClassroom || isLab || ac !== undefined) && (
              <View style={ac === false ? styles.badgeOff : styles.badge}>
                <Image source={ac === false ? ICON_AC_FALSE : ICON_AIR} style={styles.badgeIcon} contentFit="contain" transition={0} />
                {ac === false ? <View style={styles.badgeOffOverlay}><Text style={styles.badgeOffX}>X</Text></View> : <Text style={styles.badgeText}>A/C</Text>}
              </View>
            )}
            {(isClassroom || isLab || projector !== undefined) && (
              <View style={projector === false ? styles.badgeOff : styles.badge}>
                <Image source={projector === false ? ICON_PROJECTOR_FALSE : ICON_PROJECTOR} style={styles.badgeIcon} contentFit="contain" transition={0} />
                {projector === false && <View style={styles.badgeOffOverlay}><Text style={styles.badgeOffX}>X</Text></View>}
              </View>
            )}
            {(isClassroom || isLab) && capacity && (
              <View style={styles.badge}>
                <Image source={ICON_STUDENTS} style={[styles.badgeIcon, { width: 16, height: 16 }]} contentFit="contain" transition={0} />
                <Text style={styles.badgeText}>{capacity}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }, (a, b) =>
    a.name === b.name &&
    a.capacity === b.capacity &&
    a.description === b.description &&
    a.ac === b.ac &&
    a.projector === b.projector
  );

  function openOnly(which) {
    setFiltersVisible(false);
    setFavoritesModalVisible(false);
    setLegendModalVisible(false);
    setSelectedBuilding(null);
    setSelectedFoodPlaza(null);
    if (which === "filters") setFiltersVisible(true);
    else if (which === "favorites") setFavoritesModalVisible(true);
    else if (which === "legend") setLegendModalVisible(true);
  }
  function openFilters() { openOnly("filters"); }
  function openFavorites() { openOnly("favorites"); }
  function openLegend() { openOnly("legend"); }

  return (
    <View style={styles.screen}>
      <Image source={BG_PATTERN} style={styles.backgroundPattern} contentFit="cover" />

      {/* TOP BAR + buscador */}
      <View style={styles.topBarWrapper} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Image source={require("../assets/uNPHU_LOGO.jpg")} style={styles.logoImage} contentFit="contain" />
          <View style={styles.searchBarNew}>
            <Image source={require("../assets/lupa.png")} style={styles.searchIconNew} contentFit="contain" />
            <TextInput
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setSearchFocused(true);
                setShowSearchResults(true);
              }}
              onFocus={() => {
                setSearchFocused(true);
                setShowSearchResults(true);
              }}
              placeholder="Buscar Aula, Edificio..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInputNew}
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                  setSearchFocused(false);
                  Keyboard.dismiss();
                }}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>×</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* RESULTADOS DE BÚSQUEDA */}
      {(() => {
        const items = useMemo(() => {
          const all = [];
          buildings.forEach((b) => {
            all.push({
              id: `b-${b.id}`,
              type: "building",
              title: b.name,
              subtitle: b.subtitle || "Edificio",
              building: b,
              matchText: `${b.name} ${b.subtitle || ""}`.toLowerCase(),
            });
            if (b.floors) {
              Object.entries(b.floors).forEach(([floorName, rooms]) => {
                rooms?.forEach((room) => {
                  all.push({
                    id: `room-${b.id}-${room.name}`,
                    type: "room",
                    title: room.name,
                    subtitle: `${b.name} · ${floorName}`,
                    building: b,
                    floorName,
                    matchText: `${room.name} ${b.name} ${floorName}`.toLowerCase(),
                  });
                });
              });
            }
          });
          return all;
        }, [buildings]);

        const filteredResults = searchQuery.trim()
          ? items.filter((item) => item.matchText.includes(searchQuery.toLowerCase()))
          : [];

        return (
          <>
            {showSearchResults && filteredResults.length > 0 && (
              <View style={styles.searchResultsContainer}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  {filteredResults.slice(0, 8).map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.searchResultItem}
                      onPress={() => {
                        const b = item.building;
                        setSearchQuery(item.title);
                        setSearchFocused(false);
                        setShowSearchResults(false);
                        Keyboard.dismiss();

                        const targetScale = clamp(minScale * 3, minScale, maxScale);
                        const fx = SCREEN_WIDTH / 2;
                        const fy = SCREEN_HEIGHT / 2;
                        const cx = b.x;
                        const cy = b.y;
                        translateX.value = withTiming(fx - cx * targetScale, { duration: 260 });
                        translateY.value = withTiming(fy - cy * targetScale, { duration: 260 });
                        scale.value = withTiming(targetScale, { duration: 260 });

                        setSelectedBuilding(b);
                      }}
                    >
                      <Text style={styles.searchResultTitle}>{item.title}</Text>
                      <Text style={styles.searchResultSubtitle}>{item.subtitle}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
            {(searchFocused || showSearchResults) && (
              <Pressable
                style={styles.globalTapClose}
                onPress={() => {
                  setSearchFocused(false);
                  setShowSearchResults(false);
                  Keyboard.dismiss();
                }}
              />
            )}
          </>
        );
      })()}

      {/* OVERLAY FILTROS */}
      {filtersVisible && (
        <Pressable style={styles.filterOverlay} onPress={() => setFiltersVisible(false)} />
      )}
      <Filters
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {/* MAPA */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View>
          <Animated.View style={[{ width: IMG_W, height: IMG_H, position: "relative" }, animatedStyle]}>
            <Image source={MAP} style={{ flex: 1 }} contentFit="cover" />

            {/* PINS: EDIFICIOS */}
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

            {/* PINES DE FOODPLAZA */}
            {foodPlaza.map((f) => {
              const kind = (f.type || f.category || "").toString().toLowerCase();
              const iconSource = kind.includes("caf")
                ? ICON_CAFETERIA_SMALL
                : ICON_FOODPLAZA_SMALL;

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

            {/* ICONOS DE FILTROS (animados) */}
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

            {/* PRESSABLE AREAS: EDIFICIOS */}
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

            {/* PRESSABLE AREAS: FOOD PLAZA */}
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

      {/* BOTON DE RECENTRAR */}
      <Pressable style={styles.recenterCircle} onPress={recenter}>
        <Image source={ICON_RECENTER} style={styles.recenterIcon} contentFit="contain" />
      </Pressable>

      {/* MODALES */}
      <BuildingModal
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        favoritesList={favoritesList}
        toggleFavorite={toggleFavorite}
        RoomCard={RoomCard}
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
        handleUndo={() => {
          if (lastRemoved) {
            setFavoritesList([...favoritesList, lastRemoved]);
            setLastRemoved(null);
          }
        }}
        UNDO_ICON={UNDO_ICON}
        CLOSE_ICON={CLOSE_ICON}
        BUILDING_ICON_GREEN={BUILDING_ICON_GREEN}
        FAVORITE_FILLED_GREEN={FAVORITE_FILLED_GREEN}
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
        ICON_BUILDING={BUILDING_ICON_GREEN}
        ICON_FOOD={ICON_COFFEE}
        ICON_FAVORITE={FAVORITE_FILLED_GREEN}
        ICON_CENTER={ICON_RECENTER}
        CLOSE_ICON={CLOSE_ICON}
        ICON_AIR={ICON_AIR}
      />

      {/* TOAST */}
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

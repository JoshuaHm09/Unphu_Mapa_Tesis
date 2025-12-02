import React, { useState, useRef, useEffect, useMemo } from "react";
import { styles } from "./mapStyles";
import {
  Dimensions,
  View,
  Modal,
  Pressable,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../utils/supabase";
import { Keyboard, BackHandler } from "react-native";
import Filters from "./components/filters";
import { FILTER_ICONS } from "./components/filters";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { filterPoints } from "../src/components/filterPoints";
import MarkerPin from "./components/MarkerPin";

// NUEVOS COMPONENTES
import BottomMenu from "./components/BottomMenu";
import FavoritesModal from "./components/FavoritesModal";
import LegendModal from "./components/LegendModal";

const ICON_SOCCER_2 = require("../assets/icons/locator_icon_soccer.png");
const ICON_TENNIS_2 = require("../assets/icons/locator_icon_tennis.png");
const ICON_BASKET_2 = require("../assets/icons/locator_icon_basketball_2.png");
const ICON_GYM_2 = require("../assets/icons/locator_icon_gym.png");
const ICON_TREE_2 = require("../assets/icons/locator_icon_tree.png");
const ICON_BASEBALL_2 = require("../assets/icons/locator_icon_baseball.png");
const ICON_FOOD_PLAZA = require("../assets/icons/locator_icon_foodplaza.png");
const ICON_CAFETERIA_2 = require("../assets/icons/locator_icon_cafeteria_2.png");

const ICON_FAVORITES_PRESSED = require("../assets/favorites_pressed.png");
const ICON_LEGEND_PRESSED = require("../assets/maps_pressed.png");
const ICON_FILTERS_PRESSED = require("../assets/filters_pressed.png");
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
const BG_PATTERN = require("../assets/bg_pattern.png");
const MAP = require("../assets/Unphu_Mapa_v4.png");
const ICON_AC_FALSE = require("../assets/AC_False.png");
const ICON_PROJECTOR_FALSE = require("../assets/Projector_False.png");
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
const ICON_RECENTER = require("../assets/center.png");
const ICON_FAVORITES = require("../assets/favoritess.png");
const ICON_LEGEND = require("../assets/map_s.png");
const ICON_FILTERS_BTN = require("../assets/filters_icon_2.png");

const IMG_W = 4096;
const IMG_H = 5120;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BUILDING_GREEN = "#34A853";
const FOOD_ORANGE = "#FFA500";

// ICONOS
const ICON_LAB = require("../assets/lab.png");
const ICON_BATHROOM = require("../assets/bathrooom.png");
const ICON_CHAIR = require("../assets/chair.png");
const ICON_AIR = require("../assets/air-conditioner.png");
const ICON_PROJECTOR = require("../assets/projector.png");
const ICON_STUDENTS = require("../assets/students.png");

const clamp = (val, min, max) => {
  "worklet";
  return Math.min(Math.max(val, min), max);
};

// ===== HELPERS PARA TIPO DE SALA Y CAPACIDAD =====

const getAutoDescription = (name) => {
  const lower = name.toLowerCase();

  if (lower.includes("baño") || lower.includes("banos"))
    return "Baños disponibles para estudiantes y personal.";

  if (lower.includes("santo domingo"))
    return "Maquina Expendedora de Cafe Santo Domingo.";

  if (lower.includes("laboratorio") || lower.includes("lab"))
    return "Laboratorio equipado para prácticas y uso académico.";

  if (lower.includes("aula"))
    return "Aula destinada a clases y actividades académicas.";

  if (lower.includes("recepcion"))
    return "Área de recepción para asistencia e información.";

  if (lower.includes("vending"))
    return "Máquina expendedora con snacks y bebidas.";

  if (lower.includes("cafeteria") || lower.includes("café"))
    return "Área de cafetería para alimentos y bebidas.";

  if (lower.includes("registro") || lower.includes("admisiones"))
    return "Área administrativa para procesos académicos.";

  if (lower.includes("computo") || lower.includes("centro de computo"))
    return "Sala equipada con computadoras y recursos tecnológicos.";

  if (lower.includes("biblioteca"))
    return "Área de biblioteca y recursos de estudio.";

  if (lower.includes("salon"))
    return "Salón destinado a reuniones y actividades académicas.";

  if (lower.includes("economato") || lower.includes("papeleria"))
    return "Establecimiento comercial para suplir materiales universitarios.";

  if (lower.includes("pet"))
    return "Área de servicios y atención para mascotas.";

  if (lower.includes("campo"))
    return "Área deportiva destinada a actividades físicas.";

  return "Espacio académico o administrativo dentro del campus.";
};

const getCapacityForType = (type) => {
  if (type === "lab") return 25;
  if (type === "classroom") return 30;
  return null;
};

// ===== HELPERS PARA MARCADORES =====

const getMarkerForBuilding = (building) => {
  const id = building.id;

  let label = String(id);
  let iconSource = null;
  let scaleOverride = 1;

  // Campos de fútbol
  if (id === 16 || id === 23) {
    label = null;
    iconSource = ICON_SOCCER_2;
  }

  // Tenis
  else if (id === 21) {
    label = null;
    iconSource = ICON_TENNIS_2;
  }

  // Basket
  else if (id === 20) {
    label = null;
    iconSource = ICON_BASKET_2;
    scaleOverride = 2;
  }

  // Gimnasio
  else if (id === 22) {
    label = null;
    iconSource = ICON_GYM_2;
  }

  // Bosquecito
  else if (id === 17) {
    label = null;
    iconSource = ICON_TREE_2;
  }

  // Baseball
  else if (id === 15) {
    label = null;
    iconSource = ICON_BASEBALL_2;
  }

  // Edificio 12 → "6A"
  else if (id === 12) {
    label = "6A";
  }

  // Edificio 13 → "12"
  else if (id === 13) {
    label = "12";
  }

  // Edificio 19 → "B"
  else if (id === 19) {
    label = "B";
  }

  return { label, iconSource, scaleOverride };
};

console.log("ENV CHECK:");
console.log("URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log("KEY:", process.env.EXPO_PUBLIC_SUPABASE_KEY?.slice(0, 15));

// ======= STATE PRINCIPAL PARA SUPABASE =======
const MapScreen = () => {
  const insets = useSafeAreaInsets();

  const [buildings, setBuildings] = useState([]);
  const [foodPlaza, setFoodPlaza] = useState([]);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFoodPlaza, setSelectedFoodPlaza] = useState(null);

  // círculos invisibles pero touchables
  const showBuildingCircles = false;
  const showFoodCircles = false;

  // filtros
  const [filters, setFilters] = useState({
    bathrooms: false,
    vending: false,
    parking: false,
    labs: false,
    greenAreas: false,
    studyAreas: false,
  });

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // estados bottom menu / modales
  const [favoritesPressed, setFavoritesPressed] = useState(false);
  const [legendPressed, setLegendPressed] = useState(false);
  const [filtersPressed, setFiltersPressed] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false);
  const [legendModalVisible, setLegendModalVisible] = useState(false);

  const [favoritesList, setFavoritesList] = useState([]);
  const [lastRemoved, setLastRemoved] = useState(null);

  // --- TOAST ---
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 1500);
  };

  const toggleFavorite = (building) => {
    const isFav = favoritesList.some((b) => b.id === building.id);

    if (isFav) {
      const updated = favoritesList.filter((b) => b.id !== building.id);
      setFavoritesList(updated);
      setLastRemoved(building);
      showToast("Edificio eliminado de favoritos");
    } else {
      const updated = [...favoritesList, building];
      setFavoritesList(updated);
      setLastRemoved(null);
      showToast("Edificio agregado a favoritos");
    }
  };

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const raw = await AsyncStorage.getItem("favoritesList");
        if (raw) {
          setFavoritesList(JSON.parse(raw));
        }
      } catch (e) {
        console.log("Error loading favorites", e);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  }, [favoritesList]);

  const handleUndo = () => {
    if (!lastRemoved) {
      alert("No hay acciones para deshacer.");
      return;
    }
    setFavoritesList([...favoritesList, lastRemoved]);
    setLastRemoved(null);
  };

  const renderFavoriteItem = (b, index) => {
    const isGreen = index % 2 === 0;

    return (
      <Pressable
        key={b.id}
        onPress={() => {
          setSelectedFoodPlaza(false);
          setSelectedBuilding(b);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 16,
          backgroundColor: isGreen ? "#34A853" : "white",
          borderBottomWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <Image
          source={isGreen ? BUILDING_ICON_WHITE : BUILDING_ICON_GREEN}
          style={{ width: 22, height: 22 }}
        />

        <Text
          style={{
            flex: 1,
            marginLeft: 12,
            fontSize: 17,
            fontWeight: "600",
            color: isGreen ? "white" : "#34A853",
          }}
        >
          {b.name}
        </Text>

        <Pressable onPress={() => toggleFavorite(b)} style={{ padding: 8 }}>
          <Image
            source={isGreen ? FAVORITE_FILLED_WHITE : FAVORITE_FILLED_GREEN}
            style={{ width: 22, height: 22 }}
          />
        </Pressable>
      </Pressable>
    );
  };

  // ======== CARGA DE DATOS DE SUPABASE ========
  const loadBuildings = async () => {
    console.log("🔍 Consultando buildings en Supabase...");
    const { data, error } = await supabase
      .from("buildings")
      .select("id, name, subtitle, x, y, radius, images, floors");

    if (error) {
      console.log("❌ Error cargando buildings:", error);
      console.log("👀 buildings state:", buildings.length, buildings);
      return;
    }

    console.log("📌 DATA RAW:", data);

    const normalized = (data || []).map((b) => ({
      ...b,
      images: b.images || [],
      floors: b.floors || {},
    }));

    console.log("✅ Buildings NORMALIZED:", normalized);
    setBuildings(normalized);
  };

  // SOLO UNA VEZ: evitamos duplicado de useEffect
  useEffect(() => {
    loadBuildings();
  }, []);

  const loadFoodPlazas = async () => {
    try {
      console.log("🔍 Consultando food plazas en Supabase...");

      const { data, error } = await supabase.from("food_places").select("*");

      if (error) {
        console.error("❌ Error en Supabase food:", error);
        return [];
      }

      console.log("📌 FOOD PLAZA RAW:", JSON.stringify(data, null, 2));
      return data;
    } catch (err) {
      console.error("❌ Error cargando food plaza:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchFoodPlazas = async () => {
      const data = await loadFoodPlazas();
      setFoodPlaza(data || []);
    };
    fetchFoodPlazas();
  }, []);

  // ======== SCROLL / PAN / ZOOM ========
  const minScale =
    (Math.min(SCREEN_WIDTH / IMG_W, SCREEN_HEIGHT / IMG_H)) * 1;
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

    const initialOffsetX = -(IMG_W * initialScale - SCREEN_WIDTH) / 10000;
    const initialOffsetY = -(IMG_H * initialScale - SCREEN_HEIGHT) / 10;

    translateX.value = initialOffsetX;
    translateY.value = initialOffsetY;
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
    .onUpdate((event) => {
      if (scale.value <= minScale + 0.01) {
        translateX.value = 0;
        translateY.value = 0;
        return;
      }
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => clampToBounds());

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clamp(savedScale.value * event.scale, minScale, maxScale);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      clampToBounds();
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const animatedTap = {
    opacity: filtersPressed || favoritesPressed || legendPressed ? 0.5 : 1,
    transform: [
      {
        scale:
          filtersPressed || favoritesPressed || legendPressed ? 0.9 : 1,
      },
    ],
  };

  // SEARCH LOGIC (buildings + rooms)
  const searchItems = useMemo(() => {
    const items = [];

    buildings.forEach((b) => {
      items.push({
        id: `building-${b.id}`,
        type: "building",
        title: b.name,
        subtitle: b.subtitle || "Edificio",
        building: b,
        matchText: `${b.name} ${b.subtitle || ""}`.toLowerCase(),
      });

      if (b.floors) {
        Object.entries(b.floors).forEach(([floorName, rooms]) => {
          rooms.forEach((room) => {
            items.push({
              id: `room-${b.id}-${floorName}-${room.name}`,
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

    return items;
  }, [buildings]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return searchItems
      .filter((item) => item.matchText.includes(q))
      .slice(0, 8);
  }, [searchQuery, searchItems]);

  // cerrar search con botón atrás
  useEffect(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      if (searchFocused || showSearchResults) {
        setSearchFocused(false);
        setShowSearchResults(false);
        Keyboard.dismiss();
        return true;
      }
      return false;
    });

    return () => back.remove();
  }, [searchFocused, showSearchResults]);

  const handleSelectResult = (item) => {
    setSearchQuery(item.title);
    setSearchFocused(false);
    setShowSearchResults(false);
    Keyboard.dismiss();

    const b = item.building;
    const targetScale = minScale * 3;

    scale.value = withTiming(targetScale);

    const offsetX = (b.x - IMG_W / 2) * targetScale;
    const offsetY = (b.y - IMG_H / 2) * targetScale;

    translateX.value = withTiming(-offsetX);
    translateY.value = withTiming(-offsetY);
  };

  // ===== TARJETA TIPO FIGMA =====
  const RoomCard = ({
    name,
    capacity,
    description,
    ac = undefined,
    projector = undefined,
  }) => {
    const lower = name.toLowerCase();
    const finalDescription = description ?? getAutoDescription(name);

    const isClassroom = lower.includes("aula");
    const isLab = lower.includes("laboratorio") || lower.includes("lab");

    let mainIcon = { src: ICON_CHAIR, size: 35 };

    if (lower.includes("baño") || lower.includes("banos"))
      mainIcon = { src: ICON_BATHROOM, size: 35 };
    else if (isLab) mainIcon = { src: ICON_LAB, size: 35 };
    else if (lower.includes("auditorio"))
      mainIcon = { src: ICON_AUDITORIO, size: 28 };
    else if (lower.includes("cafe") || lower.includes("coffee"))
      mainIcon = { src: ICON_COFFEE, size: 30 };
    else if (lower.includes("cobro") || lower.includes("pago") || lower.includes("cajero"))
      mainIcon = { src: ICON_CREDIT, size: 30 };
    else if (lower.includes("veterinaria") || lower.includes("pet"))
      mainIcon = { src: ICON_DOG, size: 26 };
    else if (lower.includes("medico") || lower.includes("dispensario"))
      mainIcon = { src: ICON_ENFERMERIA2, size: 30 };
    else if (lower.includes("biblioteca"))
      mainIcon = { src: ICON_LIBRARY2, size: 30 };
    else if (lower.includes("vending"))
      mainIcon = { src: ICON_VENDING2, size: 36 };
    else if (lower.includes("estetica"))
      mainIcon = { src: ICON_COSMETOLOGY, size: 35 };
    else if (lower.includes("amadita"))
      mainIcon = { src: ICON_AMADITA, size: 35 };
    else if (
      lower.includes("direccion") ||
      lower.includes("academica") ||
      lower.includes("recepcion") ||
      lower.includes("recepción") ||
      lower.includes("administracion") ||
      lower.includes("reuniones") ||
      lower.includes("salon") ||
      lower.includes("secretaria")
    )
      mainIcon = { src: ICON_DESK, size: 35 };
    else if (lower.includes("papeleria"))
      mainIcon = { src: ICON_PAPELERIA, size: 35 };
    else if (lower.includes("grande") || lower.includes("pequeño"))
      mainIcon = { src: ICON_SOCCER, size: 35 };
    else if (lower.includes("tecnico") || lower.includes("soporte") || lower.includes("informatica"))
      mainIcon = { src: ICON_IT, size: 35 };
    else if (lower.includes("matemáticas") || lower.includes("math"))
      mainIcon = { src: ICON_MATH, size: 35 };
    else if (lower.includes("verde") || lower.includes("bosque"))
      mainIcon = { src: ICON_TREE, size: 35 };
    else if (
      lower.includes("campo principal") ||
      lower.includes("campo infantil") ||
      lower.includes("campo intermedio")
    )
      mainIcon = { src: ICON_BASEBALL, size: 35 };
    else if (lower.includes("turismo") || lower.includes("hoteleria"))
      mainIcon = { src: ICON_TOURISM, size: 35 };
    else if (
      lower.includes("derecho") ||
      lower.includes("politicas") ||
      lower.includes("juridicas")
    )
      mainIcon = { src: ICON_DERECHO, size: 35 };

    return (
      <View style={styles.card}>
        <View style={styles.cardIconWrapper}>
          <Image
            source={mainIcon.src}
            style={{ width: mainIcon.size, height: mainIcon.size }}
            contentFit="contain"
          />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardDescription}>{finalDescription}</Text>

          <View style={styles.cardFooter}>
            {(isClassroom || isLab || ac === true || ac === false) && (
              <View style={ac === false ? styles.badgeOff : styles.badge}>
                <Image
                  source={ac === false ? ICON_AC_FALSE : ICON_AIR}
                  style={styles.badgeIcon}
                />
                {ac === false ? (
                  <View style={styles.badgeOffOverlay}>
                    <Text style={styles.badgeOffX}>X</Text>
                  </View>
                ) : (
                  <Text style={styles.badgeText}>A/C</Text>
                )}
              </View>
            )}

            {(isClassroom || isLab || projector === true || projector === false) && (
              <View style={projector === false ? styles.badgeOff : styles.badge}>
                <Image
                  source={projector === false ? ICON_PROJECTOR_FALSE : ICON_PROJECTOR}
                  style={styles.badgeIcon}
                />
                {projector === false && (
                  <View style={styles.badgeOffOverlay}>
                    <Text style={styles.badgeOffX}>X</Text>
                  </View>
                )}
              </View>
            )}

            {(isClassroom || isLab) && capacity && (
              <View style={styles.badge}>
                <Image
                  source={ICON_STUDENTS}
                  style={[styles.badgeIcon, { width: 16, height: 16 }]}
                />
                <Text style={styles.badgeText}>{capacity}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // ======================================================
  // =============== IMAGE CAROUSEL =======================
  // ======================================================
  const ImageCarousel = ({ images, height = 200, noPadding = false }) => {
    const scrollViewRef = useRef(null);
    const [carouselWidth, setCarouselWidth] = useState(SCREEN_WIDTH - 60);

    const onLayout = (event) => {
      const w = event.nativeEvent.layout.width;
      setCarouselWidth(w);
    };

    return (
      <View
        onLayout={onLayout}
        style={{
          width: "100%",
          height,
          overflow: "hidden",
          borderRadius: noPadding ? 0 : 20,
          marginTop: noPadding ? 0 : 10,
          marginBottom: noPadding ? 0 : 10,
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ width: "100%", height }}
        >
          {images?.map((img, i) => {
            const src =
              typeof img.source === "string" ? { uri: img.source } : img.source;

            return (
              <View key={i} style={{ width: carouselWidth, height }}>
                <Image
                  source={src}
                  style={{ width: "100%", height: "100%" }}
                  contentFit={img.fit || "cover"}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const BuildingModal = ({ building, onClose }) => {
    if (!building) return null;

    const [activeFloor, setActiveFloor] = useState(
      Object.keys(building.floors)[0]
    );
    const floorScrollViewRef = useRef(null);

    useEffect(() => {
      floorScrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [activeFloor]);

    return (
      <Modal
        animationType="slide"
        transparent
        visible={!!building}
        onRequestClose={onClose}
      >
        <View style={styles.buildingModalOverlay}>
          <View style={styles.fullScreenModal}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTextWrapper}>
                <Text style={styles.modalHeaderTitle}>{building.name}</Text>
                <Text style={styles.modalHeaderSubtitle}>
                  {building.subtitle}
                </Text>
              </View>

              <Pressable
                onPress={() => toggleFavorite(building)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 300,
                  padding: 10,
                  zIndex: 20,
                }}
              >
                <Image
                  source={
                    favoritesList.some((b) => b.id === building.id)
                      ? FAVORITE_FILLED_WHITE
                      : FAVORITE_UNFILLED_WHITE
                  }
                  style={{ width: 26, height: 26 }}
                  contentFit="contain"
                />
              </Pressable>

              <Pressable style={styles.modalHeaderClose} onPress={onClose}>
                <Text style={styles.modalHeaderCloseText}>X</Text>
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <ImageCarousel
                images={building.images}
                height={200}
                noPadding
              />

              <View style={styles.modalTabsWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tabContainer}
                >
                  {Object.keys(building.floors).map((floor) => (
                    <Pressable
                      key={floor}
                      onPress={() => setActiveFloor(floor)}
                      style={[
                        styles.tab,
                        activeFloor === floor && {
                          backgroundColor: BUILDING_GREEN,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeFloor === floor && styles.activeTabText,
                        ]}
                      >
                        {floor}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.modalInner}>
                <ScrollView
                  ref={floorScrollViewRef}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingBottom: 5 }}
                >
                  {building.floors[activeFloor].map((item, index) => (
                    <RoomCard
                      key={index}
                      name={item.name}
                      capacity={item.capacity}
                      description={item.description}
                      ac={item.AC}
                      projector={item.projector}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const FoodPlazaModal = ({ plaza, onClose }) => {
    if (!plaza) return null;

    const vendorKeys = Object.keys(plaza.vendors || {});
    const firstVendor = vendorKeys.length > 0 ? vendorKeys[0] : null;

    const [activeVendor, setActiveVendor] = useState(firstVendor);

    const vendorDetails =
      (activeVendor && plaza.vendors?.[activeVendor]) || {
        schedule: "No disponible",
        images: [],
        menu: [],
      };

    const menuScrollViewRef = useRef(null);

    useEffect(() => {
      menuScrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [activeVendor]);

    return (
      <Modal
        animationType="slide"
        transparent
        visible={!!plaza}
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View style={styles.modalContainer}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={[styles.closeButtonText, { color: FOOD_ORANGE }]}>
              X
            </Text>
          </Pressable>

          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: FOOD_ORANGE }]}>
              {plaza.name}
            </Text>

            <ImageCarousel images={vendorDetails.images || []} />

            <View style={styles.tabScrollViewContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabContainer}
              >
                {vendorKeys.map((vendorName) => (
                  <Pressable
                    key={vendorName}
                    onPress={() => setActiveVendor(vendorName)}
                    style={[
                      styles.tab,
                      activeVendor === vendorName && {
                        backgroundColor: FOOD_ORANGE,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeVendor === vendorName && styles.activeTabText,
                      ]}
                    >
                      {vendorName}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <Text
              style={{
                textAlign: "center",
                marginTop: 4,
                marginBottom: 8,
                color: "#6B7280",
                fontSize: 14,
                fontStyle: "italic",
              }}
            >
              Horario: {vendorDetails.schedule}
            </Text>

            <ScrollView
              ref={menuScrollViewRef}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {(vendorDetails.menu || []).length === 0 ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    fontSize: 16,
                    color: "#6B7280",
                  }}
                >
                  No hay menú disponible.
                </Text>
              ) : (
                vendorDetails.menu.map((menuItem, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      paddingVertical: 10,
                      paddingHorizontal: 8,
                      justifyContent: "space-between",
                      borderBottomWidth: 1,
                      borderColor: "#E5E7EB",
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "#374151" }}>
                      {menuItem.item}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: FOOD_ORANGE,
                      }}
                    >
                      {menuItem.price}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // ======================================================
  // ======================= RENDER ========================
  // ======================================================
  return (
    <View style={styles.screen}>
      <Image
        source={BG_PATTERN}
        style={styles.backgroundPattern}
        contentFit="cover"
      />

      {/* ----- TOP BAR ----- */}
      <View style={styles.topBarWrapper} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Image
            source={require("../assets/uNPHU_LOGO.jpg")}
            style={styles.logoImage}
            contentFit="contain"
          />

          {/* ------ SEARCH BAR ------ */}
          <View style={styles.searchBarNew}>
            <Image
              source={require("../assets/lupa.png")}
              style={styles.searchIconNew}
              contentFit="contain"
            />

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

      {/* ------- SEARCH RESULTS ------- */}
      {showSearchResults && filteredResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredResults.map((item) => (
              <Pressable
                key={item.id}
                style={styles.searchResultItem}
                onPress={() => handleSelectResult(item)}
              >
                <Text style={styles.searchResultTitle}>{item.title}</Text>
                <Text style={styles.searchResultSubtitle}>
                  {item.subtitle}
                </Text>
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

      {/* ------ OVERLAY FILTROS ------ */}
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

      {/* ===================== MAPA ===================== */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View>
          <Animated.View
            style={[
              { width: IMG_W, height: IMG_H, position: "relative" },
              animatedStyle,
            ]}
          >
            <Image source={MAP} style={{ flex: 1 }} contentFit="cover" />

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

            {/* 🔵 ICONOS DE FILTROS */}
            {Object.keys(filters).map(
              (key) =>
                filters[key] &&
                filterPoints[key]?.map((p) => (
                  <Image
                    key={`${key}-${p.id}`}
                    source={FILTER_ICONS[key]}
                    style={{
                      position: "absolute",
                      left: p.x - 20,
                      top: p.y - 20,
                      width: 120,
                      height: 120,
                      zIndex: 9999,
                      elevation: 9999,
                    }}
                    contentFit="contain"
                  />
                ))
            )}

            {/* CIRCULOS DE EDIFICIOS */}
            {buildings.map((b) => (
              <Pressable
                key={b.id}
                style={[
                  styles.pressableArea,
                  {
                    left: b.x - b.radius,
                    top: b.y - b.radius,
                    width: b.radius * 2,
                    height: b.radius * 2,
                    borderRadius: b.radius,
                    backgroundColor: showBuildingCircles
                      ? "rgba(52,168,83,0.25)"
                      : "transparent",
                    borderWidth: 0,
                    borderColor: "transparent",
                    elevation: 0,
                  },
                ]}
                onPress={() => setSelectedBuilding(b)}
              />
            ))}

            {/* FOOD PLAZA */}
            {foodPlaza.map((f) => (
              <Pressable
                key={f.id}
                style={[
                  styles.pressableArea,
                  {
                    left: f.x - f.radius,
                    top: f.y - f.radius,
                    width: f.radius * 2,
                    height: f.radius * 2,
                    borderRadius: f.radius,
                    backgroundColor: showFoodCircles
                      ? "rgba(255,165,0,0.45)"
                      : "transparent",
                    borderWidth: 0,
                    borderColor: "transparent",
                    elevation: 0,
                  },
                ]}
                onPress={() => setSelectedFoodPlaza(f)}
              />
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* ===== RECENTER BUTTON ===== */}
      <Pressable
        style={styles.recenterCircle}
        onPress={() => {
          const initialScale = minScale * 1.5;

          scale.value = withTiming(initialScale, { duration: 300 });

          const initialOffsetX =
            -(IMG_W * initialScale - SCREEN_WIDTH) / 1000;
          const initialOffsetY =
            -(IMG_H * initialScale - SCREEN_HEIGHT) / 500;

          translateX.value = withTiming(initialOffsetX, { duration: 300 });
          translateY.value = withTiming(initialOffsetY, { duration: 300 });
        }}
      >
        <Image
          source={ICON_RECENTER}
          style={styles.recenterIcon}
          contentFit="contain"
        />
      </Pressable>

      {/* MODALES DE EDIFICIO / FOOD PLAZA */}
      <BuildingModal
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
      />
      <FoodPlazaModal
        plaza={selectedFoodPlaza}
        onClose={() => setSelectedFoodPlaza(null)}
      />

      {/* ===== BOTTOM MENU (SEPARADO) ===== */}
      <BottomMenu
        filtersPressed={filtersPressed}
        favoritesPressed={favoritesPressed}
        legendPressed={legendPressed}
        setFiltersPressed={setFiltersPressed}
        setFavoritesPressed={setFavoritesPressed}
        setLegendPressed={setLegendPressed}
        setFiltersVisible={setFiltersVisible}
        setFavoritesModalVisible={setFavoritesModalVisible}
        setLegendModalVisible={setLegendModalVisible}
      />

      {/* ===== MODAL FAVORITOS (SEPARADO) ===== */}
      <FavoritesModal
        visible={favoritesModalVisible}
        onClose={() => {
          setFavoritesModalVisible(false);
          setFavoritesPressed(false);
        }}
        favoritesList={favoritesList}
        handleUndo={handleUndo}
        renderFavoriteItem={renderFavoriteItem}
        UNDO_ICON={UNDO_ICON}
        CLOSE_ICON={CLOSE_ICON}
      />

      {/* ===== MODAL LEYENDA (SEPARADO) ===== */}
      <LegendModal
        visible={legendModalVisible}
        onClose={() => {
          setLegendModalVisible(false);
          setLegendPressed(false);
        }}
        bottomInset={insets.bottom}
      />

      {/* ==== TOAST NOTIFICATION ==== */}
      {toastVisible && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 120,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 999999,
            elevation: 999999,
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
            <Text style={{ color: "white", fontSize: 14 }}>
              {toastMessage}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MapScreen;

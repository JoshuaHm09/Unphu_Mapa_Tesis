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
import { buildings, foodPlaza } from "../src/buildings";
import { filterPoints } from "../src/components/filterPoints";
const ICON_AUDITORIO = require("../assets/Auditorio.png");
const ICON_COFFEE = require("../assets/Coffee.png");
const ICON_CREDIT = require("../assets/Credit_Card.png");
const ICON_DOG = require("../assets/Dog_Paw.png");
const ICON_ENFERMERIA2 = require("../assets/Enfermeria.png");
const ICON_LIBRARY2 = require("../assets/Library.png");
const ICON_VENDING2 = require("../assets/Vending_Machine.png");
const BG_PATTERN = require("../assets/bg_pattern.png");
const MAP = require("../assets/Unphu_Mapa_v3.png");
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
const ICON_RECENTER = require("../assets/center.png")

const IMG_W = 4096;
const IMG_H = 5120;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BUILDING_GREEN = "#34A853";
const FOOD_ORANGE = "#FFA500";




// ===== ICONOS COMO IMÁGENES =====
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
          {/* AC */}
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

          {/* PROJECTOR */}
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

          {/* CAPACIDAD */}
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

const ImageCarousel = ({ images }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    scrollViewRef.current?.scrollTo({ x: 0, animated: false });
  }, [images]);

  const goToIndex = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      goToIndex((currentIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex, images]);

  const onScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    setCurrentIndex(index);
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        style={{ width: SCREEN_WIDTH, height: 200 }}
      >
        {images.map((img, i) => (
          <View key={i} style={styles.carouselImage}>
            {img.fit === "contain" && (
              <Image
                source={img.source}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                blurRadius={10}
              />
            )}
            <Image
              source={img.source}
              style={StyleSheet.absoluteFill}
              contentFit={img.fit}
            />
          </View>
        ))}
      </ScrollView>

      {images.length > 1 && (
        <>
          <Pressable
            style={[styles.arrow, styles.arrowLeft]}
            onPress={() =>
              goToIndex((currentIndex - 1 + images.length) % images.length)
            }
          >
            <Text style={styles.arrowText}>‹</Text>
          </Pressable>
          <Pressable
            style={[styles.arrow, styles.arrowRight]}
            onPress={() => goToIndex((currentIndex + 1) % images.length)}
          >
            <Text style={styles.arrowText}>›</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

// --- MODAL DE EDIFICIOS ---
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
      transparent={true}
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

            <Pressable style={styles.modalHeaderClose} onPress={onClose}>
              <Text style={styles.modalHeaderCloseText}>X</Text>
            </Pressable>
          </View>

          <View style={styles.modalBody}>
            <ImageCarousel images={building.images} />

            <View style={styles.modalInner}>
              <View style={styles.tabScrollViewContainer}>
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

              <ScrollView
                ref={floorScrollViewRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 24 }}
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

  const [activeVendor, setActiveVendor] = useState(
    Object.keys(plaza.vendors)[0]
  );

  const vendorDetails = plaza.vendors[activeVendor];
  const menuScrollViewRef = useRef(null);

  useEffect(() => {
    menuScrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeVendor]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
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

          <ImageCarousel images={vendorDetails.images} />

          <View style={styles.tabScrollViewContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabContainer}
            >
              {Object.keys(plaza.vendors).map((vendorName) => (
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
            {vendorDetails.menu.map((menuItem, index) => (
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
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function MapScreen() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFoodPlaza, setSelectedFoodPlaza] = useState(null);

  const [filtersVisible, setFiltersVisible] = useState(false);

 const showBuildingCircles = false;   // pon en false para esconder
 const showFoodCircles = false;


  // ✅ Filtros (como antes)
  const [filters, setFilters] = useState({
    bathrooms: false,
    vending: false,
    parking: false,
    labs: false,
    greenAreas: false,
    studyAreas: false,
  });

  // ===== SEARCH STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  //======= ZOOM Y PAN =======
const minScale = (Math.min(SCREEN_WIDTH / IMG_W, SCREEN_HEIGHT / IMG_H)) * 1;
const maxScale = 1;

  const scale = useSharedValue(minScale * 1.5);
  const savedScale = useSharedValue(minScale);

  useEffect(() => {
    const initialScale = minScale * 3;
    scale.value = initialScale;

    const initialOffsetX = -(IMG_W * initialScale - SCREEN_WIDTH) / 10000;
    const initialOffsetY = -(IMG_H * initialScale - SCREEN_HEIGHT) / 10;

    translateX.value = initialOffsetX;
    translateY.value = initialOffsetY;
  }, []);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

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

  // =============================
  //  SEARCH ITEMS (buildings + rooms)
  // =============================
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
    });

    return items;
  }, []);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return searchItems
      .filter((item) => item.matchText.includes(q))
      .slice(0, 8);
  }, [searchQuery, searchItems]);

  // 🔥 BackHandler cierra search
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

  // =============================
  //  RENDER
  // =============================
  return (
    <View style={styles.screen}>
      {/* BG */}
      <Image
        source={BG_PATTERN}
        style={styles.backgroundPattern}
        contentFit="cover"
      />

      {/* HEADER */}
      <View style={styles.topBarWrapper} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Image
            source={require("../assets/uNPHU_LOGO.jpg")}
            style={styles.logoImage}
            contentFit="contain"
          />

          {/* BUSCADOR */}
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

          <Pressable
            style={styles.filterBtnNew}
            onPress={() => setFiltersVisible(true)}
          >
            <Text style={styles.filterIcon}>☰</Text>
          </Pressable>



        </View>
      </View>

      {/* SEARCH RESULTS */}
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
                <Text style={styles.searchResultSubtitle}>{item.subtitle}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* TAP GLOBAL PARA CERRAR SEARCH */}
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

      {/* OVERLAY FILTROS */}
      {filtersVisible && (
        <Pressable
          style={styles.filterOverlay}
          onPress={() => setFiltersVisible(false)}
        />
      )}

      {/* PANEL DE FILTROS */}
      <Filters
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {/* MAPA */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View>
          <Animated.View
            style={[
              { width: IMG_W, height: IMG_H, position: "relative" },
              animatedStyle,
            ]}
          >
            <Image source={MAP} style={{ flex: 1 }} contentFit="cover" />

            {/* 🔵 MARCADORES DE FILTROS */}
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

            {/* CÍRCULOS BUILDINGS */}


            {/* CÍRCULOS BUILDINGS */}
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

                    // 👇 si showBuildingCircles es false → invisible pero touchable
                    backgroundColor: showBuildingCircles
                      ? "rgba(52,168,83,0.25)"
                      : "transparent",

                       borderWidth: 0,
                              borderColor: "transparent",
                              shadowColor: "transparent",
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

                    // 👇 invisible pero sigue funcionando
                    backgroundColor: showFoodCircles
                      ? "rgba(255,165,0,0.45)"
                      : "transparent",
                       borderWidth: 0,
                              borderColor: "transparent",
                              shadowColor: "transparent",
                              elevation: 0,
                  },
                ]}
                onPress={() => setSelectedFoodPlaza(f)}
              />
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <Pressable
        style={styles.recenterCircle}
        onPress={() => {
          const initialScale = minScale * 1.5;

          scale.value = withTiming(initialScale, { duration: 300 });

          const initialOffsetX = -(IMG_W * initialScale - SCREEN_WIDTH) / 1000;
          const initialOffsetY = -(IMG_H * initialScale - SCREEN_HEIGHT) / 500;

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

      {/* MODALES */}
      <BuildingModal
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
      />
      <FoodPlazaModal
        plaza={selectedFoodPlaza}
        onClose={() => setSelectedFoodPlaza(null)}
      />
    </View>
  );
}
import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  View,
  Modal,
  Pressable,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";

const MAP = require("../assets/Unphu_Mapa-2.png");
const IMG_W = 4096;
const IMG_H = 5120;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const OLD_GREEN = '#34A853';
const OLD_GREEN_SEMI_TRANSPARENT = 'rgba(52, 168, 83, 0.5)';

// --- DATA FOR INTERACTIVE AREAS (Ahora con un array de imágenes) ---
const buildings = [
  {
    id: 1,
    name: "Edificio 10 - Veterinaria",
    x: 2620, 
    y: 4804, 
    radius: 80, 
    images: [
      require("../assets/Edificio-11.jpg"),
      require("../assets/Edificio-6.jpg"),
    ],
    floors: {
      "Piso 1": [ { id: "101", capacity: 30, available: true } ],
      "Piso 2": [ { id: "106", capacity: 30, available: false }, { id: "107", capacity: 35, available: true } ],
      "Piso 3": [ { id: "301", capacity: 25, available: true } ],
    }
  },
];

const clamp = (val, min, max) => {
  "worklet";
  return Math.min(Math.max(val, min), max);
};

// --- NUEVO: Componente de Carrusel de Imágenes ---
const ImageCarousel = ({ images }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    scrollViewRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
    setCurrentIndex(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    scrollViewRef.current?.scrollTo({ x: prevIndex * SCREEN_WIDTH, animated: true });
    setCurrentIndex(prevIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 4000); // Auto-desliza cada 4 segundos
    return () => clearInterval(timer); // Limpia el intervalo al desmontar
  }, [currentIndex]);

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={{ width: SCREEN_WIDTH - 40, height: 155 }} // ajustado al padding del modal
      >
        {images.map((img, index) => (
          <Image 
            key={index} 
            source={img} 
            style={{ width: SCREEN_WIDTH - 40, height: 155 }}
            contentFit="cover" 
          />
        ))}
      </ScrollView>
      <Pressable style={[styles.arrow, styles.arrowLeft]} onPress={goToPrev}>
        <Text style={styles.arrowText}>‹</Text>
      </Pressable>
      <Pressable style={[styles.arrow, styles.arrowRight]} onPress={goToNext}>
        <Text style={styles.arrowText}>›</Text>
      </Pressable>
    </View>
  );
};

// --- Building Modal Component ---
const BuildingModal = ({ building, onClose }) => {
  if (!building) return null;
  const [activeFloor, setActiveFloor] = useState(Object.keys(building.floors)[0]);

  return (
    <Modal animationType="slide" transparent={true} visible={!!building} onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.modalContainer}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </Pressable>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{building.name}</Text>
            
            <ImageCarousel images={building.images} />

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                {Object.keys(building.floors).map(floor => (
                    <Pressable key={floor} onPress={() => setActiveFloor(floor)} style={[styles.tab, activeFloor === floor && styles.activeTab]}>
                        <Text style={[styles.tabText, activeFloor === floor && styles.activeTabText]}>{floor}</Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView style={{flex: 1}}>
              {building.floors[activeFloor].map(room => (
                  <View key={room.id} style={styles.roomItemSimple}>
                      <Text style={styles.roomNumberSimple}>{room.id}</Text>
                      <View style={styles.roomDetailsSimple}>
                        <Text>Capacidad: {room.capacity}</Text>
                        <Text>Disponibilidad: {room.available ? 'Disponible' : 'No Disponible'}</Text>
                      </View>
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
  const minScale = Math.min(SCREEN_WIDTH / IMG_W, SCREEN_HEIGHT / IMG_H);
  const maxScale = 1.5;
  const scale = useSharedValue(minScale);
  const savedScale = useSharedValue(minScale);
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

  const panGesture = Gesture.Pan().onStart(() => { savedTranslateX.value = translateX.value; savedTranslateY.value = translateY.value; }).onUpdate((event) => { translateX.value = savedTranslateX.value + event.translationX; translateY.value = savedTranslateY.value + event.translationY; }).onEnd(() => { clampToBounds(); });
  const pinchGesture = Gesture.Pinch().onStart(() => { savedScale.value = scale.value; }).onUpdate((event) => { scale.value = clamp(savedScale.value * event.scale, minScale, maxScale); }).onEnd(() => { savedScale.value = scale.value; clampToBounds(); });
  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [ { translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value } ] }));

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View>
          <Animated.View style={[{ width: IMG_W, height: IMG_H }, animatedStyle]}>
            <Image source={MAP} style={{ flex: 1 }} contentFit="contain" />
            {buildings.map((building) => (
              <Pressable key={building.id} style={{ position: "absolute", left: building.x - building.radius, top: building.y - building.radius, width: building.radius * 2, height: building.radius * 2, backgroundColor: OLD_GREEN_SEMI_TRANSPARENT, borderRadius: building.radius, borderWidth: 2, borderColor: 'white' }} onPress={() => setSelectedBuilding(building)} />
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <BuildingModal building={selectedBuilding} onClose={() => setSelectedBuilding(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { position: "absolute", bottom: 0, width: "100%", height: "78%", backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalContent: { flex: 1 },
  modalTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: OLD_GREEN },
  closeButton: { position: 'absolute', top: 15, right: 20, zIndex: 1 },
  closeButtonText: { color: OLD_GREEN, fontWeight: 'bold', fontSize: 28 },
  tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#eee', marginHorizontal: 5 },
  activeTab: { backgroundColor: OLD_GREEN },
  tabText: { color: '#000' },
  activeTabText: { color: '#fff' },
  roomItemSimple: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  roomNumberSimple: { fontWeight: 'bold', fontSize: 18, marginRight: 20, color: OLD_GREEN },
  roomDetailsSimple: { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
  // --- ESTILOS PARA EL CARRUSEL ---
  carouselContainer: { height: 155, borderRadius: 15, overflow: 'hidden', marginVertical: 10 },
  arrow: { position: 'absolute', top: '50%', marginTop: -20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
  arrowLeft: { left: 10 },
  arrowRight: { right: 10 },
  // ¡AQUÍ ESTÁ EL CAMBIO!
  arrowText: { color: 'white', fontSize: 24, fontWeight: 'bold', lineHeight: 24, textAlign: 'center' },
});

import React, { useState, useRef, useEffect } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { styles } from "../mapStyles";

const BUILDING_GREEN = "#34A853";
const FAVORITE_UNFILLED_WHITE = require("../../assets/favorites_icon_white.png");
const FAVORITE_FILLED_WHITE = require("../../assets/favorites_pressed_white.png");


function DefaultRoomRow({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {!!item.description && (
          <Text style={styles.cardDescription}>{item.description}</Text>
        )}
        {item.capacity ? (
          <View style={styles.cardFooter}>
            <Text style={styles.badgeText}>Cap: {item.capacity}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function BuildingModalInner({
  building,
  onClose,
  favoritesList,
  toggleFavorite,
  RoomCard,
  ImageCarousel,
}) {
  const floors = Object.keys(building.floors || {});
  const [activeFloor, setActiveFloor] = useState(floors[0]);
  const floorScrollViewRef = useRef(null);

  useEffect(() => {
    // reset scroll al cambiar de piso
    floorScrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeFloor]);

  const heartScale = useSharedValue(1);
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const isFav = favoritesList?.some?.((b) => b.id === building.id);

  const onToggleFav = () => {
    // animación ligera; no cierra ni re-monta el modal
    heartScale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    toggleFavorite?.(building);
  };

  return (
    <View style={styles.fullScreenModal}>
      {/* HEADER */}
      <View style={styles.modalHeader}>
        <View style={styles.modalHeaderTextWrapper}>
          <Text style={styles.modalHeaderTitle}>{building.name}</Text>
          <Text style={styles.modalHeaderSubtitle}>{building.subtitle}</Text>
        </View>

        <Pressable
          onPress={onToggleFav}
          accessibilityLabel={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          style={{ position: "absolute", top: 20, right: 300, zIndex: 20, padding: 4 }}
        >
          <Animated.View style={heartAnimatedStyle}>
            <Image
              source={isFav ? FAVORITE_FILLED_WHITE : FAVORITE_UNFILLED_WHITE}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
          </Animated.View>
        </Pressable>

        <Pressable style={styles.modalHeaderClose} onPress={onClose} accessibilityLabel="Cerrar">
          <Text style={styles.modalHeaderCloseText}>X</Text>
        </Pressable>
      </View>

      {/* BODY */}
      <View style={styles.modalBody}>
        {ImageCarousel ? (
          <ImageCarousel images={building.images || []} height={200} noPadding />
        ) : null}

        {/* TABS DE PISOS */}
        <View style={styles.modalTabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContainer}
          >
            {floors.map((floor) => (
              <Pressable
                key={floor}
                onPress={() => setActiveFloor(floor)}
                style={[
                  styles.tab,
                  activeFloor === floor && { backgroundColor: BUILDING_GREEN },
                ]}
              >
                <Text
                  style={[styles.tabText, activeFloor === floor && styles.activeTabText]}
                >
                  {floor}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ROOMS */}
        <View style={styles.modalInner}>
          <ScrollView
            ref={floorScrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {(building.floors?.[activeFloor] || []).map((item, index) =>
              RoomCard ? (
                <RoomCard
                  key={index}
                  name={item.name}
                  capacity={item.capacity}
                  description={item.description}
                  ac={item.AC}
                  projector={item.projector}
                />
              ) : (
                <DefaultRoomRow key={index} item={item} />
              )
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

function BuildingModal({
  building,
  onClose,
  favoritesList,
  toggleFavorite,
  RoomCard,       // opcional (reutiliza tu RoomCard del MapScreen)
  ImageCarousel,  // opcional (reutiliza tu carrusel)
}) {
  if (!building) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible
      onRequestClose={onClose}
    >
      <View style={styles.buildingModalOverlay}>
        <BuildingModalInner
          building={building}
          onClose={onClose}
          favoritesList={favoritesList}
          toggleFavorite={toggleFavorite}
          RoomCard={RoomCard}
          ImageCarousel={ImageCarousel}
        />
      </View>
    </Modal>
  );
}

export default React.memo(BuildingModal);

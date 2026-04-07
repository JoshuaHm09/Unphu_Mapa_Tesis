import React, { useState, useRef, useEffect, useMemo } from "react";
import { Modal, View, Text, Pressable, ScrollView, Linking } from "react-native";
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

function formatEventDate(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatEventTime(timeString) {
  if (!timeString) return "";

  const date = new Date(`2026-01-01T${timeString}:00`);
  if (Number.isNaN(date.getTime())) return timeString;

  return date.toLocaleTimeString("es-DO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getEventStatus(event) {
  if (!event?.date) return "Abierto";

  const now = new Date();

  const start = event?.startTime
    ? new Date(`${event.date}T${event.startTime}:00`)
    : null;

  const end = event?.endTime
    ? new Date(`${event.date}T${event.endTime}:00`)
    : null;

  if (start && end) {
    if (now > end) return "Cerrado";
    return "Abierto";
  }

  if (start) {
    return now > start ? "Cerrado" : "Abierto";
  }

  return "Abierto";
}

function EventCard({ event, buildingName }) {
  const status = getEventStatus(event);

  const handleOpenLink = async () => {
    if (!event?.link) return;

    const supported = await Linking.canOpenURL(event.link);
    if (supported) {
      await Linking.openURL(event.link);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#E8F5E9",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 999,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: BUILDING_GREEN, fontWeight: "700", fontSize: 12 }}>
          Eventos
        </Text>
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "800",
          color: "#1f1f1f",
          marginBottom: 4,
        }}
      >
        {event.name}
      </Text>

      {!!event.subtitle && (
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: "#5f6368",
            marginBottom: 6,
          }}
        >
          {event.subtitle}
        </Text>
      )}

      {!!event.description && (
        <Text
          style={{
            fontSize: 13,
            lineHeight: 19,
            color: BUILDING_GREEN,
            marginBottom: 12,
          }}
        >
          {event.description}
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: event.link ? 12 : 0,
        }}
      >
        {(!!event.startTime || !!event.endTime) && (
          <View
            style={{
              backgroundColor: "#F1F3F4",
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: "#444" }}>
              {formatEventTime(event.startTime) || "--:--"} -{" "}
              {formatEventTime(event.endTime) || "--:--"}
            </Text>
          </View>
        )}

        {!!event.date && (
          <View
            style={{
              backgroundColor: "#F1F3F4",
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: "#444" }}>
              {formatEventDate(event.date)}
            </Text>
          </View>
        )}

        {!!buildingName && (
          <View
            style={{
              backgroundColor: "#F1F3F4",
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: "#444" }}>{buildingName}</Text>
          </View>
        )}

        {event.cocurricularHours !== "" &&
          event.cocurricularHours != null && (
            <View
              style={{
                backgroundColor: "#F1F3F4",
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 6,
              }}
            >
              <Text style={{ fontSize: 12, color: "#444" }}>
                Horas Cocurriculares: {event.cocurricularHours}
              </Text>
            </View>
          )}

        {!!event.modality && (
          <View
            style={{
              backgroundColor: "#F1F3F4",
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: "#444" }}>{event.modality}</Text>
          </View>
        )}

        <View
          style={{
            backgroundColor: status === "Abierto" ? "#E8F5E9" : "#FDECEC",
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: status === "Abierto" ? BUILDING_GREEN : "#D93025",
            }}
          >
            {status}
          </Text>
        </View>
      </View>

      {!!event.link && (
        <Pressable
          onPress={handleOpenLink}
          style={{
            backgroundColor: BUILDING_GREEN,
            paddingVertical: 10,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Ir al evento</Text>
        </Pressable>
      )}
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
  const hasEvents = Array.isArray(building.events) && building.events.length > 0;

  const tabs = useMemo(() => {
    return hasEvents ? [...floors, "Eventos"] : floors;
  }, [floors, hasEvents]);

  const [activeFloor, setActiveFloor] = useState(tabs[0]);
  const floorScrollViewRef = useRef(null);

  useEffect(() => {
    setActiveFloor(tabs[0]);
  }, [building?.id]);

  useEffect(() => {
    floorScrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeFloor]);

  const heartScale = useSharedValue(1);
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const isFav = favoritesList?.some?.((b) => b.id === building.id);

  const onToggleFav = () => {
    heartScale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    toggleFavorite?.(building);
  };

  return (
    <View style={styles.fullScreenModal}>
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

        <Pressable
          style={styles.modalHeaderClose}
          onPress={onClose}
          accessibilityLabel="Cerrar"
        >
          <Text style={styles.modalHeaderCloseText}>X</Text>
        </Pressable>
      </View>

      <View style={styles.modalBody}>
        {ImageCarousel ? (
          <ImageCarousel images={building.images || []} height={200} noPadding />
        ) : null}

        {tabs.length > 0 && (
          <View style={styles.modalTabsWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabContainer}
            >
              {tabs.map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveFloor(tab)}
                  style={[
                    styles.tab,
                    activeFloor === tab && { backgroundColor: BUILDING_GREEN },
                  ]}
                >
                  <Text
                    style={[styles.tabText, activeFloor === tab && styles.activeTabText]}
                  >
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.modalInner}>
          <ScrollView
            ref={floorScrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {activeFloor === "Eventos" ? (
              (building.events || []).map((event, index) => (
                <EventCard
                  key={event.id || index}
                  event={event}
                  buildingName={building.name}
                />
              ))
            ) : (
              (building.floors?.[activeFloor] || []).map((item, index) =>
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
  RoomCard,
  ImageCarousel,
}) {
  if (!building) return null;

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
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
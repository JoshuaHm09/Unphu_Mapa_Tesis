import React from "react";
import {
  View,
  Modal,
  Pressable,
  Text,
  ScrollView,
  Animated
} from "react-native";
import { Image } from "expo-image";

const FavoritesModal = ({
  visible,
  onClose,
  favoritesList,
  handleUndo,
  UNDO_ICON,
  CLOSE_ICON,
  BUILDING_ICON_GREEN,
  FAVORITE_FILLED_GREEN,
  onSelectBuilding,
  toggleFavorite,
}) => {

  // ==========================
  // ANIMACIÓN DEL UNDO
  // ==========================
  const undoScale = React.useRef(new Animated.Value(1)).current;

  const animateUndo = () => {
    Animated.sequence([
      Animated.timing(undoScale, {
        toValue: 1.18,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(undoScale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    handleUndo(); // ejecuta tu lógica de undo
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >

      {/* OVERLAY */}
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#00000070",
        }}
      />

      {/* CONTENEDOR CENTRAL */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        {/* CARD PRINCIPAL (VERDE CLARO) */}
        <View
          style={{
            width: "88%",
            backgroundColor: "#F7F9F7",
            borderRadius: 25,
            paddingTop: 55,
            paddingBottom: 22,
            paddingHorizontal: 0,
            overflow: "hidden",

            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 7,
            elevation: 10,
          }}
        >
          {/* BOTÓN UNDO CON ANIMACIÓN */}
          <Animated.View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale: undoScale }],
            }}
          >
            <Pressable onPress={animateUndo} hitSlop={20}>
              <Image
                source={UNDO_ICON}
                style={{ width: 35, height: 35, tintColor: "#34A853" }}
                contentFit="contain"
              />
            </Pressable>
          </Animated.View>

          {/* BOTÓN CERRAR */}
          <Pressable
            onPress={onClose}
            hitSlop={20}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={CLOSE_ICON}
              style={{ width: 35, height: 35 }}
              contentFit="contain"
            />
          </Pressable>

          {/* TÍTULO */}
          <Text
            style={{
              textAlign: "center",
              fontSize: 35,
              bottom: 18,
              fontWeight: "800",
              color: "#34A853",
              marginBottom: 20,
            }}
          >
            Favoritos
          </Text>

          {/* CARD BLANCO INTERNO */}
          <View
            style={{
              backgroundColor: "white",
              marginHorizontal: 20,
              borderRadius: 20,
              paddingVertical: 6,
              overflow: "hidden",

              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 6,
            }}
          >
            <ScrollView style={{ maxHeight: 350 }}>
              {favoritesList.length === 0 ? (
                <Text
                  style={{
                    textAlign: "center",
                    paddingVertical: 20,
                    opacity: 0.5,
                    fontSize: 16,
                  }}
                >
                  No tienes favoritos.
                </Text>
              ) : (
                favoritesList.map((b, index) => (
                  <View key={b.id}>
                    {/* ITEM */}
                    <Pressable
                      onPress={() => onSelectBuilding(b)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 16,
                        paddingHorizontal: 18,
                      }}
                    >
                      {/* ICONO */}
                      <Image
                        source={BUILDING_ICON_GREEN}
                        style={{ width: 26, height: 26, marginRight: 14 }}
                        contentFit="contain"
                      />

                      {/* NOMBRE */}
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 17,
                          fontWeight: "600",
                          color: "#222",
                        }}
                      >
                        {b.name}
                      </Text>

                      {/* CORAZÓN */}
                      <Pressable onPress={() => toggleFavorite(b)} hitSlop={10}>
                        <Image
                          source={FAVORITE_FILLED_GREEN}
                          style={{ width: 26, height: 26 }}
                          contentFit="contain"
                        />
                      </Pressable>
                    </Pressable>

                    {/* DIVISOR */}
                    {index < favoritesList.length - 1 && (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: "#E5E5E5",
                        }}
                      />
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FavoritesModal;

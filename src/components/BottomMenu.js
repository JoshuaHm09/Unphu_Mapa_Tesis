import React from "react";
import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import { styles } from "../mapStyles";

// ICONOS EXISTENTES
const ICON_FAVORITES_PRESSED = require("../../assets/favorites_pressed.png");
const ICON_LEGEND_PRESSED = require("../../assets/maps_pressed.png");
const ICON_FAVORITES = require("../../assets/favoritess.png");
const ICON_LEGEND = require("../../assets/map_s.png");

// NUEVO ICONO DIRECTORIO
const ICON_DIRECTORY = require("../../assets/directorio_1.svg");

const BottomMenu = ({
  favoritesPressed,
  legendPressed,
  setFavoritesPressed,
  setLegendPressed,
  setFavoritesModalVisible,
  setLegendModalVisible,
  onPressDirectory,
}) => {
  return (
    <View style={styles.bottomMenuContainer}>

      {/*  BOTÓN DIRECTORIO */}
      <Pressable
        onPress={onPressDirectory}
        style={({ pressed }) => [
          styles.bottomMenuButton,
          pressed && { transform: [{ scale: 0.92 }], opacity: 0.7 },
        ]}
      >
        <Image
          source={ICON_DIRECTORY}
          style={{ width: 25, height: 25 }}
          contentFit="contain"
        />
      </Pressable>

      {/* FAVORITOS */}
      <Pressable
        onPress={() => {
          setFavoritesPressed(true);
          setFavoritesModalVisible(true);
        }}
        style={({ pressed }) => [
          styles.bottomMenuButton,
          pressed && { transform: [{ scale: 0.92 }], opacity: 0.7 },
        ]}
      >
        <Image
          source={favoritesPressed ? ICON_FAVORITES_PRESSED : ICON_FAVORITES}
          style={{ width: 25, height: 23 }}
          contentFit="contain"
        />
      </Pressable>

      {/*  LEYENDA */}
      <Pressable
        onPress={() => {
          setLegendPressed(true);
          setLegendModalVisible(true);
        }}
        style={({ pressed }) => [
          styles.bottomMenuButton,
          pressed && { transform: [{ scale: 0.92 }], opacity: 0.7 },
        ]}
      >
        <Image
          source={legendPressed ? ICON_LEGEND_PRESSED : ICON_LEGEND}
          style={{ width: 25, height: 25 }}
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
};

export default BottomMenu;
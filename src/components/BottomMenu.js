import React from "react";
import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import { styles } from "../mapStyles";

const ICON_FAVORITES_PRESSED = require("../../assets/favorites_pressed.png");
const ICON_LEGEND_PRESSED = require("../../assets/maps_pressed.png");
const ICON_FILTERS_PRESSED = require("../../assets/filters_pressed.png");
const ICON_FAVORITES = require("../../assets/favoritess.png");
const ICON_LEGEND = require("../../assets/map_s.png");
const ICON_FILTERS_BTN = require("../../assets/filters_icon_2.png");

const BottomMenu = ({
  filtersPressed,
  favoritesPressed,
  legendPressed,
  setFiltersPressed,
  setFavoritesPressed,
  setLegendPressed,
  setFiltersVisible,
  setFavoritesModalVisible,
  setLegendModalVisible,
}) => {
  return (
    <View style={styles.bottomMenuContainer}>
      {/* Botón Filtros */}
      <Pressable
        onPress={() => {
          setFiltersPressed(true);
          setTimeout(() => setFiltersPressed(false), 120);
          setFiltersVisible(true);
        }}
        style={({ pressed }) => [
          styles.bottomMenuButton,
          pressed && { transform: [{ scale: 0.92 }], opacity: 0.7 },
        ]}
      >
        <Image
          source={filtersPressed ? ICON_FILTERS_PRESSED : ICON_FILTERS_BTN}
          style={{ width: 25, height: 19 }}
          contentFit="contain"
        />
      </Pressable>

      {/* Favoritos */}
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

      {/* Leyenda */}
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

import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Image } from "expo-image";
import FilterPill from "./FilterPills";

// ICONO CHECK
const CHECK_ICON = require("../../assets/check_green.png");

// ICONOS ORIGINALES
export const FILTER_ICONS = {
  bathrooms: require("../../assets/bathroom_filter.png"),
  vending: require("../../assets/ending_Machine_Filter_Arreglado.png"),
  parking: require("../../assets/Parqueo_Filter.png"),
  labs: require("../../assets/Laboratorio_Filter.png"),
  greenAreas: require("../../assets/Area_Verde_Filter.png"),
  studyAreas: require("../../assets/Study_filter.png"),
};

export default function Filters({ filters, setFilters, visible, onClose }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  // Fade + Scale animation
  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 180 });
      scale.value = withTiming(0.85, { duration: 180 });
    }
  }, [visible]);

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const filterItems = [
    { key: "parking", label: "Parqueos" },
    { key: "labs", label: "Laboratorios" },
    { key: "bathrooms", label: "Baños" },
    { key: "vending", label: "Máquina Expendedora" },
    { key: "studyAreas", label: "Salas de Estudio" },
    { key: "greenAreas", label: "Áreas Verdes" },
  ];

  const resetFilters = () => {
    const reset = {};
    filterItems.forEach((f) => (reset[f.key] = false));
    setFilters(reset);
  };

  // No renderizar si está oculto → evita errores y optimiza
  if (!visible) return null;

  return (
    <Animated.View
      style={[
        modalStyle,
        {
          position: "absolute",
          top: 120,
          right: 10,
          width: 365,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 18,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 12,
          zIndex: 2000,
        },
      ]}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <View>
          <Text style={{ fontSize: 22, fontWeight: "900" }}>Filtros</Text>
          <Text style={{ fontSize: 13, color: "#6B7280" }}>
            Sección de filtros
          </Text>
        </View>

        <Pressable onPress={resetFilters}>
          <Text style={{ color: "#34A853", fontWeight: "600" }}>
            Reiniciar
          </Text>
        </Pressable>
      </View>

      {/* PILLS */}
      <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}>
        {filterItems.map((f) => (
          <FilterPill
            key={f.key}
            label={f.label}
            icon={FILTER_ICONS[f.key]}
            checkIcon={CHECK_ICON}
            isOn={filters[f.key]}
            onToggle={() =>
              setFilters({ ...filters, [f.key]: !filters[f.key] })
            }
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

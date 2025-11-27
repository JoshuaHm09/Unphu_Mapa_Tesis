import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { styles } from "../mapStyles";

export const FILTER_ICONS = {
  bathrooms: require("../../assets/bathroom_filter.png"),
  vending: require("../../assets/ending_Machine_Filter_Arreglado.png"),
  parking: require("../../assets/Parqueo_Filter.png"),
  labs: require("../../assets/Laboratorio_Filter.png"),
  greenAreas: require("../../assets/Area_Verde_Filter.png"),
  studyAreas: require("../../assets/Study_filter.png"),
};

export default function Filters({ filters, setFilters, visible, onClose }) {
  // Panel ahora viene desde la DERECHA, no la izquierda
  const offsetX = useSharedValue(300);

  React.useEffect(() => {
    offsetX.value = withTiming(visible ? 0 : 300, { duration: 300 });
  }, [visible]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }],
  }));

  const filterItems = [
    { key: "bathrooms", label: "Baños" },
    { key: "vending", label: "Máquinas Expendedoras" },
    { key: "parking", label: "Parqueos" },
    { key: "labs", label: "Laboratorios" },
    { key: "greenAreas", label: "Áreas Verdes" },
    { key: "studyAreas", label: "Salas de Estudio" },
  ];

  return (
    <Animated.View
      style={[
        panelStyle,
        {
          position: "absolute",
          right: 1,
          top: 115,                       // <-- debajo del top bar
          width: 260,
          backgroundColor: "white",
          borderRadius: 5,
          paddingVertical: 12,
          paddingHorizontal: 12,
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 1000,
          maxHeight: 600,                 // panel compacto
        },
      ]}
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "900", color: "#34A853" }}>
          Filtros
        </Text>
        <Pressable onPress={onClose}>
          <Text style={{ fontSize: 35, color: "#34A853", fontWeight: "bold" }}>
            ×
          </Text>
        </Pressable>
      </View>

      {/* FILTER ITEMS */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filterItems.map((f) => (
          <View
            key={f.key}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 4,
            }}
          >
            {/* Icono */}
            <View style={styles.filterIconWrapper}>
              <Image
                source={FILTER_ICONS[f.key]}
                style={styles.filterIconImage}
                contentFit="contain"
              />
            </View>

            {/* Label */}
            <Text style={styles.filterLabel}>{f.label}</Text>

            {/* Switch */}
            <View style={styles.switchWrapper}>
              <Switch
                value={filters[f.key]}
                onValueChange={(v) =>
                  setFilters({ ...filters, [f.key]: v })
                }
                thumbColor={filters[f.key] ? "#34A853" : "#E5E7EB"}
                trackColor={{
                  true: "rgba(52,168,83,0.35)",
                  false: "#D1D5DB",
                }}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

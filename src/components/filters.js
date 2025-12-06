// File: src/components/filters.js
import React from "react";
import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import FilterPill from "./FilterPills";

// CHECK
const CHECK_ICON = require("../../assets/check_green.png");

// ÍCONOS *locator* que pediste para las pills
export const FILTER_ICONS = {
  bathrooms:  require("../../assets/icons/bathroom_locator.png"),
  vending:    require("../../assets/icons/vending_machine_locator.png"),
  parking:    require("../../assets/icons/parqueos_locator.png"),
  labs:       require("../../assets/icons/lab_black_locator.png"),
  greenAreas: require("../../assets/icons/arbol_locator.png"),
  studyAreas: require("../../assets/icons/study_locator.png"),
};

function FiltersInner({ filters, setFilters, visible, onClose }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.92, { duration: 150 });
    }
  }, [visible]);

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const filterItems = React.useMemo(
    () => [
      { key: "parking", label: "Parqueos" },
      { key: "labs", label: "Laboratorios" },
      { key: "bathrooms", label: "Baños" },
      { key: "vending", label: "Máquina Expendedora" },
      { key: "studyAreas", label: "Salas de Estudio" },
      { key: "greenAreas", label: "Áreas Verdes" },
    ],
    []
  );

  if (!visible) return null;

  const resetFilters = () => {
    const reset = {};
    filterItems.forEach((f) => (reset[f.key] = false));
    setFilters(reset);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      hardwareAccelerated
      onRequestClose={onClose}
    >
      {/* Backdrop táctil */}
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.15)",
        }}
      />

      {/* Card */}
      <Animated.View
        style={[
          modalStyle,
          {
            position: "absolute",
            top: 220,
            alignSelf: "center",
            width: 330,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 18,
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 10,
          },
        ]}
      >
        {/* HEADER */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "900" }}>Filtros</Text>
            <Text style={{ fontSize: 13, color: "#6B7280" }}>Sección de filtros</Text>
          </View>
          <Pressable onPress={resetFilters}>
            <Text style={{ color: "#34A853", fontWeight: "600" }}>Reiniciar</Text>
          </Pressable>
        </View>

        {/* PILLS */}
        <ScrollView
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews
        >
          {filterItems.map((f) => (
            <FilterPill
              key={f.key}
              label={f.label}
              icon={FILTER_ICONS[f.key]}
              checkIcon={CHECK_ICON}
              isOn={!!filters[f.key]}
              onToggle={() => setFilters({ ...filters, [f.key]: !filters[f.key] })}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

export default React.memo(FiltersInner);
